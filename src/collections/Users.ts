import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { isAdmin } from '../access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  auth: true,
  access: {
    read: authenticated,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        description:
          'Admins can manage users and delete content. Editors can add and edit content.',
      },
    },
  ],
  versions: false,
}
