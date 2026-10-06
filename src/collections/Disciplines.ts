import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * The three things Full Circle delivers: Audio, Visual, Infrastructure. Used as
 * the cards on the Services page (with their looping micro-animation) and as the
 * three service cards on the home page (with a photograph).
 */
export const Disciplines: CollectionConfig = {
  slug: 'disciplines',
  labels: { singular: 'Discipline', plural: 'Disciplines' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'animation', 'order'],
    group: 'Content',
    description: 'Audio, Visual and Infrastructure — the cards on the home and services pages.',
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
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'The paragraph under the title.' },
    },
    {
      name: 'points',
      type: 'array',
      labels: { singular: 'Point', plural: 'Points' },
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: { description: 'The dot-list under the summary.', position: 'sidebar' },
    },
    {
      name: 'animation',
      type: 'select',
      required: true,
      defaultValue: 'audio',
      options: [
        { label: 'Audio — bouncing equaliser', value: 'audio' },
        { label: 'Visual — pulsing stage lights', value: 'visual' },
        { label: 'Infrastructure — floating truss', value: 'infrastructure' },
      ],
      admin: { description: 'The looping animation shown above the title on the Services page.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Home card image',
      admin: {
        description: 'The photograph shown on this discipline’s card on the home page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
