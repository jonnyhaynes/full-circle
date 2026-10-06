import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

/** Client quotes shown in the slider on the home page. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'Content',
    description: 'Client quotes shown in the slider on the home page.',
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
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name or organisation',
      admin: { description: 'Shown in green under the quote, e.g. “Cllr Ian Jones”.' },
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
