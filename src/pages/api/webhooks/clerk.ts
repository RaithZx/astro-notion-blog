import type { APIRoute } from 'astro'
import { Webhook } from 'svix'
import { Resend } from 'resend'
import {
  CLERK_WEBHOOK_SECRET,
  RESEND_API_KEY,
  RESEND_AUDIENCE_ID,
} from '../../../server-constants'

interface ClerkEmailAddress {
  email_address: string
  id: string
}

interface ClerkUserCreatedEvent {
  type: 'user.created'
  data: {
    id: string
    first_name: string | null
    last_name: string | null
    email_addresses: ClerkEmailAddress[]
    primary_email_address_id: string
  }
}

interface ClerkUserDeletedEvent {
  type: 'user.deleted'
  data: {
    id: string
    deleted: true
  }
}

type ClerkWebhookEvent = ClerkUserCreatedEvent | ClerkUserDeletedEvent

export const POST: APIRoute = async ({ request }) => {
  if (!CLERK_WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await request.text()
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let event: ClerkWebhookEvent
  try {
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent
  } catch {
    return new Response('Invalid webhook signature', { status: 400 })
  }

  const resend = new Resend(RESEND_API_KEY)

  if (event.type === 'user.created') {
    const { first_name, last_name, email_addresses, primary_email_address_id } =
      event.data
    const primary = email_addresses.find(
      (e) => e.id === primary_email_address_id
    )
    if (!primary) {
      return new Response('No primary email', { status: 400 })
    }

    await resend.contacts.create({
      audienceId: RESEND_AUDIENCE_ID,
      email: primary.email_address,
      firstName: first_name ?? undefined,
      lastName: last_name ?? undefined,
      unsubscribed: false,
    })
  }

  // user.deleted: Clerk does not include the email in the deletion payload.
  // To auto-remove from Resend, store clerkId→email at creation time.
  // For now, acknowledge and handle removal manually in the Resend dashboard.

  return new Response(null, { status: 200 })
}
