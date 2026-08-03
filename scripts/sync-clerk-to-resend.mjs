#!/usr/bin/env node
// One-time script: populate Resend Audience from all existing Clerk users.
// Run once after setting up Resend: node scripts/sync-clerk-to-resend.mjs

import 'dotenv/config'
import { createClerkClient } from '@clerk/backend'
import { Resend } from 'resend'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)
const audienceId = process.env.RESEND_AUDIENCE_ID

if (!process.env.CLERK_SECRET_KEY || !process.env.RESEND_API_KEY || !audienceId) {
  console.error('Missing CLERK_SECRET_KEY, RESEND_API_KEY, or RESEND_AUDIENCE_ID in .env')
  process.exit(1)
}

let offset = 0
const limit = 100
let total = 0
let synced = 0
let skipped = 0

console.log('Syncing Clerk users → Resend Audience...')

while (true) {
  const { data: users, totalCount } = await clerkClient.users.getUserList({ limit, offset })

  if (total === 0) total = totalCount
  if (users.length === 0) break

  for (const user of users) {
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )
    if (!primary) {
      skipped++
      continue
    }

    const { error } = await resend.contacts.create({
      audienceId,
      email: primary.emailAddress,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      unsubscribed: false,
    })

    if (error) {
      console.warn(`  ⚠ ${primary.emailAddress}: ${error.message}`)
      skipped++
    } else {
      console.log(`  ✓ ${primary.emailAddress}`)
      synced++
    }
  }

  offset += users.length
  if (offset >= total) break
}

console.log(`\nDone. ${synced} synced, ${skipped} skipped (of ${total} total).`)
