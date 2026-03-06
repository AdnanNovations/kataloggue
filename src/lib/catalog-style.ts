import { resolveTheme } from './theme';

export interface CatalogStyle {
  pageBg: string;
  pageBgImage: string;
  pageBgOverlay: number;

  headerBg: string;
  headerBorder: string;
  headerText: string;
  headerSubtext: string;

  accentColor: string;
  accentDark: string;
  accentLight: string;

  cardBg: string;
  cardRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
  cardBorder: string;
  productNameColor: string;
  categoryLabelColor: string;
  priceColor: string;

  pillActiveBg: string;
  pillActiveText: string;
  pillBg: string;
  pillText: string;

  footerBg: string;
  footerText: string;
  footerBorder: string;
}

export const DEFAULT_CATALOG_STYLE: CatalogStyle = {
  pageBg: '#f9fafb',
  pageBgImage: '',
  pageBgOverlay: 0,

  headerBg: '#ffffff',
  headerBorder: '#e5e7eb',
  headerText: '#111827',
  headerSubtext: '#6b7280',

  accentColor: '#16a34a',
  accentDark: '#15803d',
  accentLight: '#dcfce7',

  cardBg: '#ffffff',
  cardRadius: 'lg',
  cardShadow: 'sm',
  cardBorder: 'transparent',
  productNameColor: '#111827',
  categoryLabelColor: '#6b7280',
  priceColor: '#16a34a',

  pillActiveBg: '#16a34a',
  pillActiveText: '#ffffff',
  pillBg: '#f3f4f6',
  pillText: '#374151',

  footerBg: '#f9fafb',
  footerText: '#9ca3af',
  footerBorder: '#e5e7eb',
};

export interface CatalogPreset {
  id: string;
  name: string;
  color: string; // preview swatch color
  style: CatalogStyle;
}

export const CATALOG_PRESETS: CatalogPreset[] = [
  {
    id: 'klasik-hijau',
    name: 'Klasik Hijau',
    color: '#16a34a',
    style: { ...DEFAULT_CATALOG_STYLE },
  },
  {
    id: 'samudra-biru',
    name: 'Samudra Biru',
    color: '#2563eb',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#eff6ff',
      accentColor: '#2563eb',
      accentDark: '#1d4ed8',
      accentLight: '#dbeafe',
      priceColor: '#2563eb',
      pillActiveBg: '#2563eb',
      headerBorder: '#bfdbfe',
      footerBorder: '#bfdbfe',
    },
  },
  {
    id: 'mode-gelap',
    name: 'Mode Gelap',
    color: '#111827',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#111827',
      headerBg: '#1f2937',
      headerBorder: '#374151',
      headerText: '#f9fafb',
      headerSubtext: '#9ca3af',
      accentColor: '#22c55e',
      accentDark: '#16a34a',
      accentLight: '#14532d',
      cardBg: '#1f2937',
      cardBorder: '#374151',
      productNameColor: '#f9fafb',
      categoryLabelColor: '#9ca3af',
      priceColor: '#22c55e',
      pillActiveBg: '#22c55e',
      pillActiveText: '#111827',
      pillBg: '#374151',
      pillText: '#d1d5db',
      footerBg: '#111827',
      footerText: '#6b7280',
      footerBorder: '#374151',
    },
  },
  {
    id: 'sunset-hangat',
    name: 'Sunset Hangat',
    color: '#ea580c',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#fff7ed',
      accentColor: '#ea580c',
      accentDark: '#c2410c',
      accentLight: '#ffedd5',
      priceColor: '#ea580c',
      pillActiveBg: '#ea580c',
      headerBorder: '#fed7aa',
      footerBorder: '#fed7aa',
    },
  },
  {
    id: 'elegan-ungu',
    name: 'Elegan Ungu',
    color: '#9333ea',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#faf5ff',
      accentColor: '#9333ea',
      accentDark: '#7e22ce',
      accentLight: '#f3e8ff',
      priceColor: '#9333ea',
      pillActiveBg: '#9333ea',
      headerBorder: '#e9d5ff',
      footerBorder: '#e9d5ff',
    },
  },
  {
    id: 'rose',
    name: 'Rosé',
    color: '#db2777',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#fdf2f8',
      accentColor: '#db2777',
      accentDark: '#be185d',
      accentLight: '#fce7f3',
      priceColor: '#db2777',
      pillActiveBg: '#db2777',
      headerBorder: '#fbcfe8',
      footerBorder: '#fbcfe8',
    },
  },
  {
    id: 'minimalis',
    name: 'Minimalis',
    color: '#475569',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#ffffff',
      accentColor: '#475569',
      accentDark: '#334155',
      accentLight: '#f1f5f9',
      cardShadow: 'none',
      cardBorder: '#e2e8f0',
      priceColor: '#475569',
      pillActiveBg: '#475569',
      headerBorder: '#e2e8f0',
      footerBorder: '#e2e8f0',
    },
  },
  {
    id: 'teal-segar',
    name: 'Teal Segar',
    color: '#0d9488',
    style: {
      ...DEFAULT_CATALOG_STYLE,
      pageBg: '#f0fdfa',
      accentColor: '#0d9488',
      accentDark: '#0f766e',
      accentLight: '#ccfbf1',
      priceColor: '#0d9488',
      pillActiveBg: '#0d9488',
      headerBorder: '#99f6e4',
      footerBorder: '#99f6e4',
    },
  },
];

const RADIUS_MAP: Record<CatalogStyle['cardRadius'], string> = {
  none: '0px',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
};

const SHADOW_MAP: Record<CatalogStyle['cardShadow'], string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

export function resolveCatalogStyle(
  catalogStyleJson: string | null | undefined,
  themeField?: string | null
): CatalogStyle {
  if (catalogStyleJson) {
    try {
      const parsed = JSON.parse(catalogStyleJson);
      return { ...DEFAULT_CATALOG_STYLE, ...parsed };
    } catch {
      // fall through
    }
  }

  // Backward compat: derive from old theme field
  if (themeField) {
    const t = resolveTheme(themeField);
    return {
      ...DEFAULT_CATALOG_STYLE,
      accentColor: t.primary,
      accentDark: t.primaryDark,
      accentLight: t.primaryLight,
      priceColor: t.primary,
      pillActiveBg: t.primary,
    };
  }

  return { ...DEFAULT_CATALOG_STYLE };
}

export function catalogStyleVars(style: CatalogStyle): string {
  const vars = [
    `--cs-page-bg:${style.pageBg}`,
    `--cs-header-bg:${style.headerBg}`,
    `--cs-header-border:${style.headerBorder}`,
    `--cs-header-text:${style.headerText}`,
    `--cs-header-subtext:${style.headerSubtext}`,
    `--cs-accent:${style.accentColor}`,
    `--cs-accent-dark:${style.accentDark}`,
    `--cs-accent-light:${style.accentLight}`,
    // Backward compat aliases
    `--store-primary:${style.accentColor}`,
    `--store-primary-dark:${style.accentDark}`,
    `--store-primary-light:${style.accentLight}`,
    `--cs-card-bg:${style.cardBg}`,
    `--cs-card-radius:${RADIUS_MAP[style.cardRadius] || RADIUS_MAP.lg}`,
    `--cs-card-shadow:${SHADOW_MAP[style.cardShadow] || SHADOW_MAP.sm}`,
    `--cs-card-border:${style.cardBorder}`,
    `--cs-product-name:${style.productNameColor}`,
    `--cs-category-label:${style.categoryLabelColor}`,
    `--cs-price:${style.priceColor}`,
    `--cs-pill-active-bg:${style.pillActiveBg}`,
    `--cs-pill-active-text:${style.pillActiveText}`,
    `--cs-pill-bg:${style.pillBg}`,
    `--cs-pill-text:${style.pillText}`,
    `--cs-footer-bg:${style.footerBg}`,
    `--cs-footer-text:${style.footerText}`,
    `--cs-footer-border:${style.footerBorder}`,
  ];
  return vars.join(';');
}

export function catalogStyleToJson(style: CatalogStyle): string {
  return JSON.stringify(style);
}

export { RADIUS_MAP, SHADOW_MAP };
