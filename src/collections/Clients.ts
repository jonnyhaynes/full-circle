import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'Content',
    description: 'Client or partner logos shown in the ticker on the home page.',
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Optional link for the logo.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
