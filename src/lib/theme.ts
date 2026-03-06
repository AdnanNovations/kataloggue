export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
}

export const THEME_PRESETS: Record<string, ThemeColors> = {
  default: { primary: '#16a34a', primaryDark: '#15803d', primaryLight: '#dcfce7' },
  blue:    { primary: '#2563eb', primaryDark: '#1d4ed8', primaryLight: '#dbeafe' },
  red:     { primary: '#dc2626', primaryDark: '#b91c1c', primaryLight: '#fee2e2' },
  purple:  { primary: '#9333ea', primaryDark: '#7e22ce', primaryLight: '#f3e8ff' },
  orange:  { primary: '#ea580c', primaryDark: '#c2410c', primaryLight: '#ffedd5' },
  pink:    { primary: '#db2777', primaryDark: '#be185d', primaryLight: '#fce7f3' },
  teal:    { primary: '#0d9488', primaryDark: '#0f766e', primaryLight: '#ccfbf1' },
  slate:   { primary: '#475569', primaryDark: '#334155', primaryLight: '#f1f5f9' },
};

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function expandHex(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return '#' + h;
}

function adjustBrightness(hex: string, percent: number): string {
  const h = expandHex(hex).replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

  const nr = clamp(r + (percent > 0 ? (255 - r) * percent : r * percent));
  const ng = clamp(g + (percent > 0 ? (255 - g) * percent : g * percent));
  const nb = clamp(b + (percent > 0 ? (255 - b) * percent : b * percent));

  return '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('');
}

export function resolveTheme(theme: string | null | undefined): ThemeColors {
  if (!theme) return THEME_PRESETS.default;
  if (THEME_PRESETS[theme]) return THEME_PRESETS[theme];
  if (HEX_RE.test(theme)) {
    const full = expandHex(theme);
    return {
      primary: full,
      primaryDark: adjustBrightness(full, -0.15),
      primaryLight: adjustBrightness(full, 0.80),
    };
  }
  return THEME_PRESETS.default;
}

export function isValidTheme(theme: string): boolean {
  return theme in THEME_PRESETS || HEX_RE.test(theme);
}

export function themeStyle(theme: string | null | undefined): string {
  const c = resolveTheme(theme);
  return `--store-primary:${c.primary};--store-primary-dark:${c.primaryDark};--store-primary-light:${c.primaryLight}`;
}
