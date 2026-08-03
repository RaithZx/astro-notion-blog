import { ptPT } from '@clerk/localizations'
import uiStrings from '../locales/ui-strings.json' with { type: 'json' }
import { deepMerge } from './deep-merge.mjs'

/**
 * Clerk localization: pt-PT base + overrides from src/locales/ui-strings.md → clerk.
 * Edit that .md (source of truth) and run `npm run strings` to regenerate the .json;
 * do not edit ui-strings.json directly, it's a build artifact.
 */
const base = { ...ptPT, locale: 'kea' }

export const clerkLocalization = deepMerge(base, uiStrings.clerk)
