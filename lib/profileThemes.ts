/**
 * Editorial themes for the public creator profile page, driven by
 * creators.profile_theme ('ivory' | 'noir') and creators.theme_accent
 * (a token, not a hex — resolved here). The accent is for details only:
 * links, tags, active states, small flourishes. Never button fills.
 */

export type ProfileThemeName = 'ivory' | 'noir'

export interface ProfileTheme {
  name: ProfileThemeName
  page: string
  surface: string
  border: string
  text: string
  textSecondary: string
  buttonBg: string
  buttonText: string
  /** Resolved accent hex for this theme + token. */
  accent: string
}

export const IVORY_ACCENTS: Record<string, string> = {
  rose: '#9E5C68',
  sage: '#6E7E5C',
  slate: '#5C6E7E',
}

export const NOIR_ACCENTS: Record<string, string> = {
  champagne: '#C9A96A',
  mauve: '#A8888F',
  teal: '#6A8F8A',
}

const BASE: Record<ProfileThemeName, Omit<ProfileTheme, 'name' | 'accent'>> = {
  ivory: {
    page: '#F7F4EF',
    surface: '#FFFFFF',
    border: '#E5E0D6',
    text: '#1D1B18',
    textSecondary: '#8D877D',
    buttonBg: '#1D1B18',
    buttonText: '#F7F4EF',
  },
  noir: {
    page: '#0E0E12',
    surface: '#1A1A20',
    border: '#2A2A30',
    text: '#F4F1EA',
    textSecondary: '#8A8578',
    buttonBg: '#F4F1EA',
    buttonText: '#0E0E12',
  },
}

export function resolveProfileTheme(
  profileTheme?: string | null,
  themeAccent?: string | null,
): ProfileTheme {
  const name: ProfileThemeName = profileTheme === 'ivory' ? 'ivory' : 'noir'
  const accents = name === 'ivory' ? IVORY_ACCENTS : NOIR_ACCENTS
  const accent =
    (themeAccent && accents[themeAccent]) ||
    (name === 'ivory' ? IVORY_ACCENTS.rose : NOIR_ACCENTS.champagne)
  return { name, ...BASE[name], accent }
}

/** CSS custom properties consumed by the page and its client components. */
export function profileThemeVars(t: ProfileTheme): Record<string, string> {
  return {
    '--pt-page': t.page,
    '--pt-surface': t.surface,
    '--pt-border': t.border,
    '--pt-text': t.text,
    '--pt-text2': t.textSecondary,
    '--pt-btn-bg': t.buttonBg,
    '--pt-btn-text': t.buttonText,
    '--pt-accent': t.accent,
  }
}
