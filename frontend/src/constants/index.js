export const THEMES = [
  {
    id: "obsidian",
    label: "Obsidian",
    mode: "Dark",
    blurb: "Deep slate with a violet edge",
  },
  {
    id: "midnight",
    label: "Midnight",
    mode: "Dark",
    blurb: "Cold blue, quiet and deep",
  },
  {
    id: "aurora",
    label: "Aurora",
    mode: "Dark",
    blurb: "Teal glow over deep water",
  },
  {
    id: "neon",
    label: "Neon",
    mode: "Dark",
    blurb: "Magenta and chrome",
  },
  {
    id: "vampire",
    label: "Vampire",
    mode: "Dark",
    blurb: "Soft purple, high contrast",
  },
  {
    id: "dusk",
    label: "Dusk",
    mode: "Dark",
    blurb: "Warm amber over evening",
  },
  {
    id: "gilded",
    label: "Gilded",
    mode: "Dark",
    blurb: "Black glass and gold leaf",
  },
  {
    id: "daylight",
    label: "Daylight",
    mode: "Light",
    blurb: "Clean white with indigo",
  },
  {
    id: "glacier",
    label: "Glacier",
    mode: "Light",
    blurb: "Pale ice and cool teal",
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);

export const DEFAULT_THEME = "obsidian";

/** Themes were renamed when the glass palettes landed; keep old prefs working. */
export const LEGACY_THEME_MAP = {
  dark: "obsidian",
  light: "daylight",
  night: "midnight",
  synthwave: "neon",
  dracula: "vampire",
  luxury: "gilded",
  sunset: "dusk",
  coffee: "obsidian",
};

export const NOTIFICATION_SOUNDS = [
  { id: "default", label: "Chime" },
  { id: "pop", label: "Pop" },
  { id: "bell", label: "Bell" },
];
