import { ptPT } from '@clerk/localizations'
import uiStrings from '../locales/ui-strings.json' with { type: 'json' }
import { deepMerge } from './deep-merge.mjs'

/**
 * Clerk localization: pt-PT base + overrides from src/locales/ui-strings.json → clerk.
 * Edit that JSON for translator handoff; do not duplicate strings here.
 */
const base = { ...ptPT, locale: 'kea' }

export const clerkLocalization = deepMerge(base, uiStrings.clerk)
