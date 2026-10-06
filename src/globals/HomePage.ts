import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { ctaPanelField, linkField, seoField } from '../fields/common'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: {
    group: 'Pages',
    description: 'The home page hero, sticky ticket and section headings.',
  },
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
        { name: 'headline1', type: 'text', required: true, defaultValue: 'From concept' },
        { name: 'headline2', type: 'text', required: true, defaultValue: 'to completion' },
        {
          name: 'script',
          type: 'text',
          required: true,
          defaultValue: 'Bring it full circle',
          admin: { description: 'The green handwritten line, kept to a few words.' },
        },
        { name: 'intro', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        linkField('primary', 'Primary button', { label: 'Enquire here', href: '/contact-us' }),
        linkField('secondary', 'Secondary link', { label: 'Come backstage', href: '/gallery' }),
      ],
    },
    {
      name: 'stickyTicket',
      type: 'group',
      label: 'All Access ticket',
      admin: {
        description:
          'The green card fixed to the bottom-right of the home page. It can be dismissed, and starts minimised on phones.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, defaultValue: 'Full Circle All Access' },
        {
          name: 'strap',
          type: 'text',
          required: true,
          defaultValue: 'Audio · Visual · Infrastructure',
        },
        { name: 'line', type: 'text', required: true, defaultValue: 'Site visit & tailored quote' },
        {
          name: 'cta',
          type: 'group',
          label: 'Link',
          fields: [
            { name: 'label', type: 'text', required: true, defaultValue: 'Get in touch' },
            { name: 'href', type: 'text', required: true, defaultValue: '/contact-us' },
          ],
        },
      ],
    },
    {
      name: 'howWeWork',
      type: 'group',
      label: 'How we work',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'How we work' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Every event comes full circle' },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'services',
      type: 'group',
      label: 'Services section',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Our services' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Unique offerings' },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'aboutTeaser',
      type: 'group',
      label: 'About teaser',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'About us' },
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Experts in live events & AV solutions',
        },
        { name: 'body', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'linkLabel',
          type: 'text',
          required: true,
          defaultValue: 'Read more',
          admin: { description: 'Links to the About page.' },
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'group',
      label: 'Testimonials heading',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Testimonials' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'What our clients say' },
      ],
    },
    {
      name: 'clients',
      type: 'group',
      label: 'Trusted by',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Trusted by' },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    ctaPanelField(),
    seoField(),
  ],
}
