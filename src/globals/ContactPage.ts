import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { factsField, seoField, townsField } from '../fields/common'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact page',
  admin: { group: 'Pages', description: 'Content for the Contact page.' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        { name: 'headline1', type: 'text', required: true, defaultValue: 'Let’s' },
        { name: 'headline2', type: 'text', required: true, defaultValue: 'Talk' },
        { name: 'script', type: 'text', required: true, defaultValue: 'We’re ready' },
        { name: 'intro', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        factsField(),
      ],
    },
    {
      name: 'form',
      type: 'group',
      label: 'Enquiry form',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Tell us about your event' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'We’re ready, let’s talk.' },
        {
          name: 'replyNote',
          type: 'text',
          required: true,
          defaultValue: 'We usually reply within one working day.',
        },
        {
          name: 'consentLabel',
          type: 'text',
          required: true,
          defaultValue: 'I agree to receive emails from Full Circle Event Production Ltd.',
        },
        {
          name: 'errorMessage',
          type: 'text',
          required: true,
          defaultValue:
            'Please add your name, a valid email and a message so we can get back to you.',
        },
      ],
    },
    {
      name: 'info',
      type: 'group',
      label: 'Info column',
      fields: [
        {
          name: 'ticketLine',
          type: 'text',
          required: true,
          defaultValue: 'Free site visit & tailored quote',
        },
        {
          name: 'ticketHeading',
          type: 'text',
          required: true,
          defaultValue: 'Your access starts here',
        },
        { name: 'socialsLabel', type: 'text', required: true, defaultValue: 'Follow the crew' },
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location strip',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Junction 34 · M1' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Covering Yorkshire & beyond' },
        { name: 'body', type: 'textarea', required: true },
        townsField(),
      ],
    },
    seoField(),
  ],
}
