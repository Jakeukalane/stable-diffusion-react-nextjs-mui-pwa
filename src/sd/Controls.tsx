import React, { useMemo } from "react";
import { t, Trans, Plural } from "@lingui/macro";
import { useGongoUserId, useGongoOne } from "gongo-client-react";

import type { ModelState } from "./useModelState";
import { isDev, REQUIRE_REGISTRATION } from "../lib/client-env";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { Clear, Height, Help, HelpOutline, Scale } from "@mui/icons-material";

import InputSlider from "../InputSlider";
import defaults, { MAX_SEED_VALUE } from "../sd/defaults";

function EmojiIcon({ children, ...props }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        mt: -2,
        width: 25.5,
        height: 25.5,
        textAlign: "center",
        fontSize: "150%",
        verticalAlign: "top",
        ...props,
      }}
    >
      {children}
    </Box>
  );
}

function Prompt({
  value,
  setValue,
  placeholder,
}: {
  value: ModelState["prompt"]["value"];
  setValue: ModelState["prompt"]["setValue"];
  placeholder?: string;
}) {
  return useMemo(() => {
    function promptKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      // Submit on "enter" but allow newline creation on shift-enter.
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        // @ts-expect-error: TODO
        event.target.form.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }

    return (
      <TextField
        dir="ltr"
        lang="en"
        label="Prompt"
        fullWidth
        multiline
        onKeyDown={promptKeyDown}
        value={value}
        placeholder={placeholder}
        InputLabelProps={{ shrink: true }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setValue("")}>
                <Clear />
              </IconButton>
              <Tooltip
                title={
                  <Box>
                    <Trans>
                      Description / caption of your desired image. May include
                      art styles like &apos;impressionist&apos;, &apos;digital
                      art&apos;, photographic styles and lenses, and other
                      hints.
                    </Trans>{" "}
                    <Trans>
                      <a href="https://docs.google.com/document/d/17VPu3U2qXthOpt2zWczFvf-AH6z37hxUbvEe1rJTsEc">
                        Learn more
                      </a>
                    </Trans>
                  </Box>
                }
                enterDelay={0}
                enterTouchDelay={0}
                leaveDelay={0}
                leaveTouchDelay={4000}
              >
                <Help />
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    );
  }, [value, setValue, placeholder]);
}

function Strength_Grid_Slider({
  value,
  setValue,
  defaultValue,
}: {
  value: ModelState["strength"]["value"];
  setValue: ModelState["strength"]["setValue"];
  defaultValue: typeof defaults.strength;
}) {
  return useMemo(
    () => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        {/*
          tooltip={
            <Box>
              <Trans>
                How closely to follow the prompt. Lower values = more creative,
                more variety. Higher values = more exact, may cause artifacts.
                Values of 5 - 15 tend to work best.
              </Trans>{" "}
              <Trans>
                <a href="https://benanne.github.io/2022/05/26/guidance.html">
                  Learn more
                </a>
              </Trans>
            </Box>
          }
          */}
        <InputSlider
          label={t`(Denoising) Strength`}
          value={value}
          setValue={setValue}
          defaultValue={defaultValue}
          icon={<EmojiIcon>💪</EmojiIcon>}
          min={0}
          max={1}
          step={0.05}
        />
      </Grid>
    ),
    [value, setValue, defaultValue]
  );
}

function CFS_Grid_Slider({
  value,
  setValue,
  defaultValue,
}: {
  value: ModelState["guidance_scale"]["value"];
  setValue: ModelState["guidance_scale"]["setValue"];
  defaultValue: typeof defaults.guidance_scale;
}) {
  return useMemo(
    () => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputSlider
          label={t`Classifier-Free Guidance (Scale)`}
          value={value}
          setValue={setValue}
          defaultValue={defaultValue}
          tooltip={
            <Box>
              <Trans>
                How closely to follow the prompt. Lower values = more creative,
                more variety. Higher values = more exact, may cause artifacts.
                Values of 5 - 15 tend to work best.
              </Trans>{" "}
              <Trans>
                <a href="https://benanne.github.io/2022/05/26/guidance.html">
                  Learn more
                </a>
              </Trans>
            </Box>
          }
          icon={<Scale />}
          min={1}
          max={50}
          step={0.1}
        />
      </Grid>
    ),
    [value, setValue, defaultValue]
  );
}

function Steps_Grid_Slider({
  value,
  setValue,
  defaultValue,
}: {
  value: ModelState["guidance_scale"]["value"];
  setValue: ModelState["guidance_scale"]["setValue"];
  defaultValue: typeof defaults.guidance_scale;
}) {
  return useMemo(
    () => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputSlider
          label={t`Number of Inference Steps`}
          value={value}
          setValue={setValue}
          defaultValue={defaultValue}
          icon={<EmojiIcon>👣</EmojiIcon>}
          tooltip={
            <Box>
              <Trans>
                Number of denoising steps (how many times to iterate over and
                improve the image). Larger numbers take longer to render but may
                produce higher quality results.
              </Trans>{" "}
              <Trans>
                <a href="https://huggingface.co/blog/stable_diffusion">
                  Learn more
                </a>
              </Trans>
            </Box>
          }
        />
      </Grid>
    ),
    [value, setValue, defaultValue]
  );
}

function Width_Grid_Slider({
  value,
  setValue,
  defaultValue,
}: {
  value: ModelState["guidance_scale"]["value"];
  setValue: ModelState["guidance_scale"]["setValue"];
  defaultValue: typeof defaults.guidance_scale;
}) {
  return useMemo(
    () => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        {" "}
        <InputSlider
          label={t`Width`}
          value={value}
          setValue={setValue}
          defaultValue={defaultValue}
          icon={<EmojiIcon>⭤</EmojiIcon>}
          step={64}
          min={64}
          max={1024}
          marks={true}
          tooltip={
            <Box>
              <Trans>Width of output image.</Trans>{" "}
              <Trans>
                Must be a multiple of 64. Maximum image size is 1024x768 or
                768x1024 because of memory limits.
              </Trans>
            </Box>
          }
        />
      </Grid>
    ),
    [value, setValue, defaultValue]
  );
}

function Height_Grid_Slider({
  value,
  setValue,
  defaultValue,
}: {
  value: ModelState["guidance_scale"]["value"];
  setValue: ModelState["guidance_scale"]["setValue"];
  defaultValue: typeof defaults.guidance_scale;
}) {
  return useMemo(
    () => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputSlider
          label={t`Height`}
          value={value}
          setValue={setValue}
          defaultValue={defaultValue}
          icon={<Height />}
          step={64}
          min={64}
          max={1024}
          marks={true}
          tooltip={
            <Box>
              <Trans>Width of output image.</Trans>{" "}
              <Trans>
                Maximum size is 1024x768 or 768x1024 because of memory limits.
              </Trans>
            </Box>
          }
        />
      </Grid>
    ),
    [value, setValue, defaultValue]
  );
}

function Seed({
  value,
  setValue,
  _defaultValue,
  randomizeSeedValue,
}: {
  value: ModelState["seed"]["value"];
  setValue: ModelState["seed"]["setValue"];
  _defaultValue: typeof defaults.seed;
  randomizeSeedValue: boolean;
}) {
  return useMemo(() => {
    const error = !(value || randomizeSeedValue);

    return (
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <TextField
          label={t`Seed`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          size="small"
          fullWidth
          error={error}
          type="number"
          disabled={randomizeSeedValue}
          helperText={
            error && (
              <Trans>
                Please enter a valid seed or turn &quot;Randomize&quot; back on.
              </Trans>
            )
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={
                    <Box>
                      <Trans>
                        Using an identical seed with identical options (prompt,
                        guidance scale, etc) will always produce the same image.
                        This can be useful to tweak prior creations, to
                        understand how the other options affect the process (by
                        removing the &quot;random&quot; element), or when
                        sharing your work. A number between {0} and{" "}
                        {MAX_SEED_VALUE}.
                      </Trans>
                    </Box>
                  }
                  enterDelay={0}
                  enterTouchDelay={0}
                  leaveDelay={0}
                  leaveTouchDelay={5000}
                >
                  <HelpOutline
                    sx={{ verticalAlign: "bottom", opacity: 0.5, ml: 1 }}
                  />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    );
  }, [value, setValue, randomizeSeedValue]);
}

function RandomizeSeed({
  value,
  setValue,
  _defaultValue,
  setSeed,
  defaultSeed,
}: {
  value: ModelState["randomizeSeed"]["value"];
  setValue: ModelState["randomizeSeed"]["setValue"];
  _defaultValue: boolean;
  setSeed: ModelState["seed"]["setValue"];
  defaultSeed: typeof defaults.seed;
}) {
  return useMemo(() => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.checked);
      if (event.target.checked) setSeed(defaultSeed());
    };

    return (
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Stack
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <FormGroup sx={{ alignItems: "center" }}>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={<Switch checked={value} onChange={onChange} />}
              label={
                <Box>
                  <Trans>Randomize</Trans>
                </Box>
              }
            />
          </FormGroup>
          <Tooltip
            title={
              <Box>
                <Trans>
                  Randomize Seed on every request. This means each new image
                  will be completely different. If you want to, instead,
                  &quot;tweak&quot; your last creation, turn this off.
                </Trans>
              </Box>
            }
            enterDelay={0}
            enterTouchDelay={0}
            leaveDelay={0}
            leaveTouchDelay={3000}
          >
            <HelpOutline
              sx={{ verticalAlign: "bottom", opacity: 0.5, ml: 1 }}
            />
          </Tooltip>
        </Stack>
      </Grid>
    );
  }, [value, setValue, setSeed, defaultSeed]);
}

function ShareInputs({
  value,
  setValue,
  _defaultValue,
  cfg,
  steps,
  seed,
}: {
  value: ModelState["shareInputs"]["value"];
  setValue: ModelState["shareInputs"]["setValue"];
  _defaultValue: boolean;
  cfg: string | number;
  steps: string | number;
  seed: string | number;
}) {
  return React.useMemo(() => {
    const sharedInputs = `CFG: ${cfg}, Steps: ${steps}, Seed: ${
      seed || Math.floor(Math.random() * MAX_SEED_VALUE)
    }`;

    return (
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Stack
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <FormGroup sx={{ alignItems: "center" }}>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Switch
                  checked={value}
                  onChange={(event) => setValue(event.target.checked)}
                />
              }
              label={
                <Box>
                  <Trans>Share Inputs</Trans>
                </Box>
              }
            />
          </FormGroup>
          <Tooltip
            title={
              <Box>
                <Trans>
                  &quot;Share&quot; button / filename will include &quot;
                  {sharedInputs}&quot; after the prompt.
                </Trans>
              </Box>
            }
            enterDelay={0}
            enterTouchDelay={0}
            leaveDelay={0}
            leaveTouchDelay={3000}
          >
            <HelpOutline
              sx={{ verticalAlign: "bottom", opacity: 0.5, ml: 1 }}
            />
          </Tooltip>
        </Stack>
      </Grid>
    );
  }, [value, setValue, cfg, seed, steps]);
}

function SafetyChecker({
  value,
  setValue,
  _defaultValue,
}: {
  value: ModelState["safety_checker"]["value"];
  setValue: ModelState["safety_checker"]["setValue"];
  _defaultValue: boolean;
}) {
  return React.useMemo(() => {
    return (
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <Stack
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <FormGroup sx={{ alignItems: "center" }}>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Switch
                  checked={value}
                  onChange={(event) => setValue(event.target.checked)}
                />
              }
              label={
                <Box>
                  <Trans>NSFW Filter</Trans>
                </Box>
              }
            />
          </FormGroup>
          <Tooltip
            title={
              <Box>
                <Trans>
                  Filter out images that may be NSFW (&quot;Not Safe for
                  Work&quot;) and inappropriate for under 18s.
                </Trans>{" "}
                <Trans>A black image will be shown instead.</Trans>
              </Box>
            }
            enterDelay={0}
            enterTouchDelay={0}
            leaveDelay={0}
            leaveTouchDelay={3000}
          >
            <HelpOutline
              sx={{ verticalAlign: "bottom", opacity: 0.5, ml: 1 }}
            />
          </Tooltip>
        </Stack>
      </Grid>
    );
  }, [value, setValue]);
}

function ModelMenuItem({ value, desc }: { value: string; desc: string }) {
  return (
    <Box sx={{ textAlign: "center", width: "100%" }}>
      <div style={{ fontWeight: "bold" }}>{value}</div>
      <div>{desc}</div>
    </Box>
  );
}

function ModelSelect({
  value,
  setValue,
  defaultValue,
}: {
  value: ModelState["MODEL_ID"]["value"];
  setValue: ModelState["MODEL_ID"]["setValue"];
  defaultValue: typeof defaults.MODEL_ID;
}) {
  return useMemo(
    () => (
      <FormControl fullWidth>
        <InputLabel id="model-select-label">
          <Trans>Model</Trans>
        </InputLabel>
        <Select
          id="model-select"
          label={t`Model`}
          labelId="model-select-label"
          value={value}
          defaultValue={defaultValue}
          onChange={(event) => setValue(event.target.value)}
          size="small"
        >
          {/* Unfortunately <Select /> relies on having direct <MenuItem /> children */}
          <MenuItem
            value="CompVis/stable-diffusion-v1-4"
            sx={{ textAlign: "center", width: "100%" }}
          >
            <ModelMenuItem
              value="CompVis/stable-diffusion-v1-4"
              desc={t`Original model, best for most cases.`}
            />
          </MenuItem>

          <MenuItem
            value="hakurei/waifu-diffusion"
            sx={{ textAlign: "center", width: "100%" }}
          >
            <ModelMenuItem
              value="hakurei/waifu-diffusion"
              desc={t`Best for Anime characters`}
            />
          </MenuItem>

          <MenuItem
            value="rinna/japanese-stable-diffusion"
            sx={{ textAlign: "center", width: "100%" }}
          >
            <ModelMenuItem
              value="rinna/japanese-stable-diffusion"
              desc={t`Japanese / Japanglish prompt input, style`}
            />
          </MenuItem>
        </Select>
      </FormControl>
    ),
    [value, setValue, defaultValue]
  );
}

export function randomizeSeedIfChecked(inputs: ModelState) {
  if (inputs.randomizeSeed.value) {
    const seed = Math.floor(Math.random() * MAX_SEED_VALUE);
    inputs.seed.setValue(seed);
    return seed;
  } else {
    return inputs.seed.value;
  }
}

export default function SDControls({
  inputs,
  go,
  randomPrompt,
  uiState,
  requestStartTime,
  requestEndTime,
}: {
  inputs: ModelState;
  go: (event: React.SyntheticEvent) => void;
  randomPrompt?: string;
  uiState: {
    dest: { value: string; set: React.Dispatch<React.SetStateAction<string>> };
  };
  requestStartTime: number | null;
  requestEndTime: number | null;
}) {
  const userId = useGongoUserId();
  const user = useGongoOne((db) =>
    db.collection("users").find({ _id: userId })
  );

  function setWidthHeight(
    width: number | string,
    height: number | string,
    which: string
  ) {
    if (width > height) {
      if (height > 768) height = 768;
    } else {
      if (width > 768) width = 768;
    }

    if (width !== inputs.width.value) inputs.width.setValue(width);
    if (height !== inputs.height.value) inputs.height.setValue(height);

    return which === "width" ? width : height;
  }
  const setWidth = (width: number | string) =>
    setWidthHeight(width, inputs.height.value, "width");
  const setHeight = (height: number | string) =>
    setWidthHeight(inputs.width.value, height, "height");

  React.useEffect(() => {
    if (!inputs.width) return;
    const timeout = setTimeout(() => {
      const width = inputs.width.value;
      if (width !== "" && Number(width) % 64 !== 0)
        inputs.width.setValue(64 * Math.round(Number(width) / 64));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [inputs.width]);

  React.useEffect(() => {
    if (!inputs.height) return;
    const timeout = setTimeout(() => {
      const height = inputs.height.value;
      if (height !== "" && Number(height) % 64 !== 0)
        inputs.height.setValue(64 * Math.round(Number(height) / 64));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [inputs.height]);

  const credits = user?.credits?.free + user?.credits?.paid;

  return (
    <Box sx={{ my: 2 }}>
      <form onSubmit={go}>
        <Prompt
          value={inputs.prompt.value}
          setValue={inputs.prompt.setValue}
          placeholder={randomPrompt}
        />

        <Grid container sx={{ my: 1 }}>
          <Grid
            item
            xs={isDev ? 7 : 12}
            sm={isDev ? 8 : 12}
            md={isDev ? 9 : 12}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{ my: 1 }}
              type="submit"
              disabled={!!(requestStartTime && !requestEndTime)}
            >
              {(function () {
                if (!REQUIRE_REGISTRATION) return <Trans>Go</Trans>;
                if (!user) return <Trans>Login</Trans>;
                if (!credits) return <Trans>Get More Credits</Trans>;
                return <Plural value={1} one="# Credit" other="# Credits" />;
              })()}
            </Button>
            {REQUIRE_REGISTRATION && user && (
              <Box
                sx={{
                  fontSize: "70%",
                  color: "#aaa",
                  textAlign: "center",
                  mt: -0.5,
                  mb: 1,
                }}
              >
                <Plural
                  value={credits}
                  one="# credit remaining"
                  other="# credits remaining"
                />
              </Box>
            )}
          </Grid>
          {isDev && (
            <Grid item xs={5} sm={4} md={3} sx={{ pl: 1, pt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="dest-select-label">Dest</InputLabel>
                <Select
                  labelId="dest-select-label"
                  id="dest-select"
                  value={uiState.dest.value}
                  label="Dest"
                  onChange={(e) => uiState.dest.set(e.target.value as string)}
                >
                  <MenuItem value="exec">exec (local)</MenuItem>
                  <MenuItem value="banana-local">banana (local)</MenuItem>
                  <MenuItem value="banana-remote">banana (remote)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <ModelSelect
          value={inputs.MODEL_ID.value}
          setValue={inputs.MODEL_ID.setValue}
          defaultValue={defaults.MODEL_ID}
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {inputs.strength && (
            <Strength_Grid_Slider
              value={inputs.strength.value}
              setValue={inputs.strength.setValue}
              defaultValue={defaults.strength}
            />
          )}
          <CFS_Grid_Slider
            value={inputs.guidance_scale.value}
            setValue={inputs.guidance_scale.setValue}
            defaultValue={defaults.guidance_scale}
          />
          <Steps_Grid_Slider
            value={inputs.num_inference_steps.value}
            setValue={inputs.num_inference_steps.setValue}
            defaultValue={defaults.num_inference_steps}
          />
          {inputs.width && (
            <Width_Grid_Slider
              value={inputs.width.value}
              // @ts-expect-error: TODO
              setValue={setWidth}
              defaultValue={defaults.width}
            />
          )}
          {inputs.height && (
            <Height_Grid_Slider
              value={inputs.height.value}
              // @ts-expect-error: TODO
              setValue={setHeight}
              defaultValue={defaults.height}
            />
          )}
          <Seed
            value={inputs.seed.value}
            setValue={inputs.seed.setValue}
            randomizeSeedValue={inputs.randomizeSeed.value}
            _defaultValue={defaults.seed}
          />
          <RandomizeSeed
            value={inputs.randomizeSeed.value}
            setValue={inputs.randomizeSeed.setValue}
            _defaultValue={defaults.randomizeSeed}
            setSeed={inputs.seed.setValue}
            defaultSeed={defaults.seed}
          />
          <ShareInputs
            value={inputs.shareInputs.value}
            setValue={inputs.shareInputs.setValue}
            _defaultValue={defaults.shareInputs}
            cfg={inputs.guidance_scale.value}
            steps={inputs.num_inference_steps.value}
            seed={inputs.seed.value}
          />
          <SafetyChecker
            value={inputs.safety_checker.value}
            setValue={inputs.safety_checker.setValue}
            _defaultValue={defaults.safety_checker}
          />
        </Grid>
      </form>
    </Box>
  );
}
