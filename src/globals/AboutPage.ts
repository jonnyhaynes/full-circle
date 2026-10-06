import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { ctaPanelField, factsField, seoField, statsField, townsField } from '../fields/common'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages', description: 'Content for the About Us page.' },
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
        { name: 'headline1', type: 'text', required: true, defaultValue: 'About' },
        { name: 'headline2', type: 'text', required: true, defaultValue: 'Full Circle' },
        { name: 'script', type: 'text', required: true, defaultValue: 'Expertise & passion' },
        { name: 'intro', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        factsField(),
      ],
    },
    {
      name: 'whatWeDo',
      type: 'group',
      label: 'What we do',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          required: true,
          defaultValue: 'About Full Circle Event Production',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Whatever the event, we bring it to life',
        },
        { name: 'intro', type: 'textarea', required: true },
        {
          name: 'capabilities',
          type: 'array',
          labels: { singular: 'Capability', plural: 'Capabilities' },
          fields: [{ name: 'text', type: 'text', required: true }],
          admin: { description: 'The two-column list with ring bullets.' },
        },
        {
          name: 'eventTypes',
          type: 'array',
          label: 'Event types list',
          labels: { singular: 'Event type', plural: 'Event types' },
          fields: [{ name: 'label', type: 'text', required: true }],
          admin: { description: 'The big numbered list down the right-hand side (01–07).' },
        },
      ],
    },
    {
      name: 'history',
      type: 'group',
      label: 'Our history',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Our history & expertise' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Two companies. One full circle.' },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'companyOne',
          type: 'text',
          required: true,
          defaultValue: 'Company One',
          admin: { description: 'Label shown under the left ring in the merge animation.' },
        },
        {
          name: 'companyTwo',
          type: 'text',
          required: true,
          defaultValue: 'Company Two',
          admin: { description: 'Label shown under the right ring in the merge animation.' },
        },
        {
          name: 'paragraphs',
          type: 'array',
          labels: { singular: 'Paragraph', plural: 'Paragraphs' },
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        statsField(),
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Strategic location & accessibility' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Junction 34 of the M1' },
        { name: 'body', type: 'textarea', required: true },
        { name: 'address', type: 'text' },
        townsField(),
      ],
    },
    {
      name: 'commitment',
      type: 'group',
      label: 'Commitment',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Our commitment to excellence' },
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Flawless productions, executed with precision',
        },
        { name: 'body', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'pillars',
          type: 'array',
          labels: { singular: 'Pillar', plural: 'Pillars' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    ctaPanelField(),
    seoField(),
  ],
}
