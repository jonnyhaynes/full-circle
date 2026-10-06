import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { ctaPanelField, factsField, seoField } from '../fields/common'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services page',
  admin: { group: 'Pages', description: 'Content for the Services page.' },
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
        { name: 'headline1', type: 'text', required: true, defaultValue: 'Our' },
        { name: 'headline2', type: 'text', required: true, defaultValue: 'Services' },
        { name: 'script', type: 'text', required: true, defaultValue: 'Unique offerings' },
        { name: 'intro', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        factsField(),
      ],
    },
    {
      name: 'disciplines',
      type: 'group',
      label: 'Disciplines heading',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'What we deliver' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'One team. Every element.' },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'events',
      type: 'group',
      label: 'Event types heading',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Events we produce' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Whatever you’re planning' },
      ],
    },
    ctaPanelField(),
    seoField(),
  ],
}
