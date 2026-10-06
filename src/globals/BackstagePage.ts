import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { ctaPanelField, factsField, seoField } from '../fields/common'

export const BackstagePage: GlobalConfig = {
  slug: 'backstage-page',
  label: 'Backstage page',
  admin: { group: 'Pages', description: 'Content for the Backstage (gallery) page.' },
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
        { name: 'headline1', type: 'text', required: true, defaultValue: 'Come' },
        { name: 'headline2', type: 'text', required: true, defaultValue: 'Backstage' },
        { name: 'script', type: 'text', required: true, defaultValue: 'Our work in action' },
        { name: 'intro', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        factsField(),
      ],
    },
    {
      name: 'gallery',
      type: 'group',
      label: 'Gallery heading',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Our gallery' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Bringing events to life' },
      ],
    },
    ctaPanelField(),
    seoField(),
  ],
}
