import dotenv from 'dotenv'

dotenv.config()

export const NOTION_API_SECRET =
  import.meta.env.NOTION_API_SECRET || process.env.NOTION_API_SECRET || ''
export const DATABASE_ID =
  import.meta.env.DATABASE_ID || process.env.DATABASE_ID || ''

export const CUSTOM_DOMAIN =
  import.meta.env.CUSTOM_DOMAIN || process.env.CUSTOM_DOMAIN || '' // <- Set your costom domain if you have. e.g. alpacat.com
export const BASE_PATH =
  import.meta.env.BASE_PATH || process.env.BASE_PATH || '' // <- Set sub directory path if you want. e.g. /docs/

export const PUBLIC_GA_TRACKING_ID = import.meta.env.PUBLIC_GA_TRACKING_ID
export const NUMBER_OF_POSTS_PER_PAGE = 10
export const REQUEST_TIMEOUT_MS = parseInt(
  import.meta.env.REQUEST_TIMEOUT_MS || '10000',
  10
)
export const ENABLE_LIGHTBOX = import.meta.env.ENABLE_LIGHTBOX
export const COMING_SOON = import.meta.env.COMING_SOON || process.env.COMING_SOON || 'false'
export const PUBLIC_ADSENSE_PUBLISHER_ID =
  import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID ?? process.env.PUBLIC_ADSENSE_PUBLISHER_ID ?? ''

export const RESEND_API_KEY =
  import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || ''
export const RESEND_AUDIENCE_ID =
  import.meta.env.RESEND_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID || ''
export const RESEND_FROM_EMAIL =
  import.meta.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || ''
export const CLERK_WEBHOOK_SECRET =
  import.meta.env.CLERK_WEBHOOK_SECRET || process.env.CLERK_WEBHOOK_SECRET || ''
