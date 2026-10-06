import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { statsField } from '../fields/common'

/**
 * Single source of truth for the business details. The phone number, address and
 * social links are read from here everywhere on the site, so they only ever need
 * changing in one place.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Business details',
  admin: {
    group: 'Settings',
    description: 'Contact details and stats used across the whole site.',
  },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
      defaultValue: 'Full Circle Event Production',
    },
    {
      name: 'legalName',
      type: 'text',
      defaultValue: 'Full Circle Event Production Ltd',
      admin: { description: 'Used in the footer copyright line.' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Shown in the footer and meta tags.' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'town', type: 'text' },
        { name: 'county', type: 'text' },
        { name: 'postcode', type: 'text' },
      ],
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Google Maps link',
      admin: { description: 'Where “Get directions” points to.' },
    },
    {
      name: 'latitude',
      type: 'number',
      admin: {
        description:
          'Latitude of the workshop, used to plot the location map. e.g. 53.4129 for Sheffield S9.',
      },
    },
    {
      name: 'longitude',
      type: 'number',
      admin: {
        description: 'Longitude of the workshop, e.g. -1.4037 for Sheffield S9.',
      },
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    statsField(),
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social sharing image',
      admin: { description: '1200 × 630 image shown when a page is shared on social.' },
    },
  ],
}
