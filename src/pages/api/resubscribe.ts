import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from '../../server-constants'

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url)
  const email = url.searchParams.get('email')

  if (!email || !email.includes('@')) {
    return new Response('Invalid email', { status: 400 })
  }

  const resend = new Resend(RESEND_API_KEY)

  // contacts.create upserts — sets unsubscribed: false on existing contact
  await resend.contacts.create({
    audienceId: RESEND_AUDIENCE_ID,
    email,
    unsubscribed: false,
  })

  return redirect('/?resubscribed=1')
}
