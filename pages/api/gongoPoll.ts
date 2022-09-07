import gs, { CreditCode, User } from "../../src/api-lib/db";

// gs.db.Users.ensureAdmin("dragon@wastelands.net", "initialPassword");

gs.publish("accounts", (db) => db.collection("accounts").find());

gs.publish("orders", async (db, {}, { auth }) => {
  const userId = await auth.userId();
  if (!userId) return [];
  return db.collection("orders").find({ userId });
});

/*
gs.publish("order", async (db, { orderId }, { auth, updatedAt }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const order = await db
    .collection("orders")
    .findOne({ _id: new ObjectId(orderId) });

  if (!order || order.__updatedAt === updatedAt.orders) return [];

  if (!order.userId.equals(userId)) {
    console.error(
      `Non-matching order userId ${order.userId} user userId ${userId}`
    );
    return [];
  }

  return [
    {
      coll: "orders",
      entries: [order],
    },
  ];
});
*/

gs.publish("user", async (db, _opts, { auth, updatedAt }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const fullUser = await db.collection("users").findOne({ _id: userId });
  if (!fullUser || fullUser.__updatedAt === updatedAt.users) return [];

  const user = { ...fullUser };
  delete user.services;
  delete user.password;

  return [
    {
      coll: "users",
      entries: [user],
    },
  ];
});

gs.publish("allCreditCodes", async (db, _opts, { auth /*, updatedAt */ }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const user = await db.collection("users").findOne({ _id: userId });
  if (!user || !user.admin) return [];

  return db.collection("creditCodes").find();
});

gs.method("redeemCreditCode", async (db, { creditCode }, { auth }) => {
  const userId = await auth.userId();
  if (!userId) throw new Error("User not logged in");

  // TODO, projection
  const user = (await db
    .collection("users")
    .findOne({ _id: userId })) as unknown as User;

  if (user.redeemedCreditCodes && user.redeemedCreditCodes.includes(creditCode))
    return { $error: "ALREADY_REDEEMED" };

  // TODO, make atomic.  but honestly, who cares.
  const code = (await db
    .collection("creditCodes")
    .findOne({ name: creditCode })) as CreditCode | null;

  if (!code) return { $error: "NO_SUCH_CODE" };

  if (code.used >= code.total) return { $error: "MAXIMUM_REACHED" };

  await db.collection("users").updateOne(
    { _id: userId },
    {
      $inc: { "credits.free": code.credits },
      $push: { redeemedCreditCodes: creditCode },
    }
  );

  await db
    .collection("creditCodes")
    .updateOne({ _id: code._id }, { $inc: { used: 1 } });

  return { $success: true, credits: code.credits };
});

gs.publish("usersAndCredits", async (db, _opts, { auth, updatedAt }) => {
  const userId = await auth.userId();
  if (!userId) return [];

  const user = await db.collection("users").findOne({ _id: userId });
  if (!user || !user.admin) return [];

  const realUsers = await db.collection("users").getReal();
  const users = await realUsers
    .find(
      { _id: { $ne: userId }, __updatedAt: { $gt: updatedAt } },
      {
        projection: {
          _id: true,
          emails: true,
          displayName: true,
          credits: true,
          admin: true,
        },
      }
    )
    .toArray();

  return users.length
    ? [
        {
          coll: "users",
          entries: users,
        },
      ]
    : [];
});

if (gs.dba) {
  /*
  gs.dba.collection("users").on("preInsertMany", async (props, args) => {
    return;
    /*
    const userId = props.auth.userId;
    const user = await props.dba.collection("users").findOne(userId);
    */
  /*
  });
  */
}

module.exports = gs.expressPost();