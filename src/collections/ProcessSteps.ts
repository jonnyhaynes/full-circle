import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

/** The four steps of the "How we work" timeline on the home page. */
export const ProcessSteps: CollectionConfig = {
  slug: 'process-steps',
  labels: { singular: 'Process step', plural: 'Process steps' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'order'],
    group: 'Content',
    description: 'The steps in the “Every event comes full circle” timeline on the home page.',
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
      name: 'number',
      type: 'text',
      required: true,
      admin: { description: 'The step number shown above the title, e.g. 01.' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
