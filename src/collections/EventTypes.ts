import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * The types of event Full Circle produces. Drives the scrolling marquee on the
 * home page and the pill buttons on the contact form.
 */
export const EventTypes: CollectionConfig = {
  slug: 'event-types',
  labels: { singular: 'Event type', plural: 'Event types' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order'],
    group: 'Content',
    description: 'Event types — the home page marquee and the contact form buttons.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'order',
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
