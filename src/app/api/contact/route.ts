import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

type EnquiryBody = {
  name?: string
  email?: string
  phone?: string
  eventDate?: string
  eventType?: string
  message?: string
  consent?: boolean
  honeypot?: string
}

export async function POST(request: NextRequest) {
  let body: EnquiryBody
  try {
    body = (await request.json()) as EnquiryBody
  } catch {
    return NextResponse.json({ ok: false, error: 'bad-request' }, { status: 400 })
  }

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const eventType = String(body.eventType || '').trim()
  const eventDate = body.eventDate ? String(body.eventDate) : ''
  const message = String(body.message || '').trim()
  const consent = Boolean(body.consent)
  const honeypot = String(body.honeypot || '').trim()

  // Honeypot: real visitors never see this field. Pretend it worked so bots
  // don't learn anything from the response.
  if (honeypot) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: 'missing' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'formSubmissions',
      data: {
        name,
        email,
        phone: phone || undefined,
        eventType: eventType || undefined,
        eventDate: eventDate || undefined,
        message,
        consent,
        sourcePage: request.headers.get('referer') || '',
        userAgent: request.headers.get('user-agent') || undefined,
      },
      overrideAccess: true,
    })

    // A mail failure must not lose the enquiry — it is already stored above.
    try {
      await payload.sendEmail({
        to: process.env.ENQUIRY_NOTIFICATION_EMAIL || 'info@fullcircleevents.co.uk',
        replyTo: email,
        subject: `Website enquiry — ${name}`,
        html: `
          <h2>New enquiry from the website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${eventType ? `<p><strong>Event type:</strong> ${eventType}</p>` : ''}
          ${eventDate ? `<p><strong>Event date:</strong> ${eventDate}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      })
    } catch (error) {
      console.error('Enquiry notification email failed', error)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }
}
