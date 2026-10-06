import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { seoField } from '../fields/common'
import { slugField } from '../fields/slugField'

/** The four filter groups on the Services page. Labels are used verbatim in the UI. */
export const SERVICE_GROUPS = [
  { label: 'Corporate', value: 'corporate' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Community', value: 'community' },
  { label: 'Technical', value: 'technical' },
] as const

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'group', 'order'],
    group: 'Content',
    description: 'The event types Full Circle produces — one card each, plus a detail page.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'group',
      type: 'select',
      required: true,
      options: [...SERVICE_GROUPS],
      admin: {
        description: 'Which filter the card appears under on the Services page.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two sentences shown on the card and at the top of the detail page.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Card image',
      admin: { description: 'Portrait image, roughly 4:5. Shown on the card and detail hero.' },
    },
    {
      name: 'body',
      type: 'richText',
      admin: { description: 'The main content of the service detail page.' },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    seoField(),
    slugField(),
  ],
}
