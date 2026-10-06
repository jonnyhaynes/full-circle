import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      labels: {
        singular: 'Item',
        plural: 'Header items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'footer',
      type: 'array',
      labels: {
        singular: 'Item',
        plural: 'Footer items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
