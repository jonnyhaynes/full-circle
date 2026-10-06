'use client'

import { useState } from 'react'

import { ArrowRightIcon } from './Icons'

type Labels = {
  eyebrow: string
  heading: string
  replyNote: string
  consentLabel: string
  errorMessage: string
}

/** The enquiry form: inline validation, a real submission, and a drawn-ring success state. */
export function ContactForm({ eventTypes, labels }: { eventTypes: string[]; labels: Labels }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const nameOk = name.trim().length > 0
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const messageOk = message.trim().length > 0
  const showError = tried && !(nameOk && emailOk && messageOk)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!(nameOk && emailOk && messageOk)) {
      setTried(true)
      return
    }

    setTried(false)
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          eventDate: date || undefined,
          eventType: type || undefined,
          message,
          consent,
        }),
      })
      const json = (await response.json()) as { ok?: boolean }
      if (json.ok) setStatus('sent')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  function reset() {
    setName('')
    setEmail('')
    setPhone('')
    setDate('')
    setType('')
    setMessage('')
    setConsent(false)
    setTried(false)
    setStatus('idle')
  }

  if (status === 'sent') {
    const firstName = name.trim().split(/\s+/)[0] || 'you'
    return (
      <div
        role="status"
        className="flex min-h-[520px] flex-col items-center justify-center text-center"
        style={{ animation: 'fc-fade .6s ease both' }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          aria-hidden="true"
          className="-rotate-90"
          style={{ overflow: 'visible' }}
        >
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="377"
            style={{
              animation: 'fc-ringdraw 1.4s cubic-bezier(.65,0,.35,1) both',
              filter: 'drop-shadow(0 0 14px var(--color-accent-35))',
            }}
          />
        </svg>
        <h2 className="mt-7">
          Thanks, <span className="text-accent">{firstName}</span>
        </h2>
        <p className="mt-3.5 max-w-[440px] text-lg font-light leading-relaxed text-white/80">
          Your enquiry is with the team. We’ll be in touch shortly to talk through your event.
        </p>
        <button
          type="button"
          onClick={reset}
          className="fc-link mt-[26px] !border-0 border-b-2 border-accent bg-transparent text-white"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="fc-eyebrow">{labels.eyebrow}</div>
      <h2 className="mt-3">{labels.heading}</h2>

      <form onSubmit={onSubmit} noValidate className="mt-[34px] grid gap-[18px] sm:grid-cols-2">
        <label className="fc-field" data-invalid={tried && !nameOk}>
          <span>
            Name <span className="text-accent">*</span>
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={tried && !nameOk}
          />
        </label>

        <label className="fc-field" data-invalid={tried && !emailOk}>
          <span>
            Email <span className="text-accent">*</span>
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={tried && !emailOk}
          />
        </label>

        <label className="fc-field">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>

        <label className="fc-field">
          <span>Event date</span>
          <input type="date" name="eventDate" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <fieldset className="fc-field sm:col-span-2 !border-0 !p-0">
          <legend className="mb-2.5 !p-0">Type of event</legend>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((entry) => (
              <button
                key={entry}
                type="button"
                aria-pressed={type === entry}
                onClick={() => setType((current) => (current === entry ? '' : entry))}
                className="fc-pill"
              >
                {entry}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="fc-field sm:col-span-2" data-invalid={tried && !messageOk}>
          <span>
            Message <span className="text-accent">*</span>
          </span>
          <textarea
            name="message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-invalid={tried && !messageOk}
            placeholder="Venue, guest numbers, what you need from us…"
          />
        </label>

        <label className="flex items-start gap-3 text-sm leading-normal text-white/75 sm:col-span-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-5 w-5 flex-none"
            style={{ accentColor: 'var(--color-accent)' }}
          />
          {labels.consentLabel}
        </label>

        {showError ? (
          <p role="alert" className="m-0 text-[15px] text-error sm:col-span-2">
            {labels.errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-5 pt-1.5 sm:col-span-2">
          <button type="submit" className="fc-btn" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            <ArrowRightIcon />
          </button>
          <span className="text-sm text-white/55">{labels.replyNote}</span>
        </div>
      </form>
    </div>
  )
}
