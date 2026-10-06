import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

/**
 * Contact and quote enquiries. Public forms post to a route handler which writes
 * with overrideAccess so there is no public endpoint that can create rows.
 */
export const FormSubmissions: CollectionConfig = {
  slug: 'formSubmissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'eventType', 'createdAt'],
    group: 'Lead capture',
    description: 'Enquiries from the contact form.',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'eventType',
      type: 'text',
      admin: {
        description: 'Type of event, e.g. "Festival" or "Award ceremony".',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        description: 'Proposed event date, if given.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      admin: {
        description: 'The visitor agreed to be contacted.',
      },
    },
    {
      name: 'sourcePage',
      type: 'text',
      admin: {
        description: 'URL of the page the form was submitted from.',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
  ],
}
