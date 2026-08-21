import { ptPT } from '@clerk/localizations'
import uiStrings from '../locales/ui-strings.json' with { type: 'json' }
import { deepMerge } from './deep-merge.mjs'

/**
 * Clerk localization: pt-PT base + overrides from src/locales/ui-strings.md → clerk.
 * Edit that .md (source of truth) and run `npm run strings` to regenerate the .json;
 * do not edit ui-strings.json directly, it's a build artifact.
 *
 * Strip unused-feature namespaces (orgs, waitlist, web3, billing, API keys,
 * impersonation) — app only uses sign-in/sign-up/UserButton/UserProfile.
 * Cuts the shipped localization payload; Clerk falls back to its internal
 * defaults for anything missing here.
 */
const {
  organizationProfile,
  organizationList,
  organizationSwitcher,
  taskChooseOrganization,
  createOrganization,
  waitlist,
  web3SolanaWalletButtons,
  billing,
  apiKeys,
  impersonationFab,
  ...trimmedPtPT
} = ptPT

const base = { ...trimmedPtPT, locale: 'kea' }

export const clerkLocalization = deepMerge(base, uiStrings.clerk)
