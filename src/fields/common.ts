import type { Field } from 'payload'

/** A labelled link — used for the button pairs on the closing CTA panels. */
export const linkField = (
  name: string,
  label: string,
  defaults: { label: string; href: string },
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: defaults.label,
    },
    {
      name: 'href',
      type: 'text',
      required: true,
      defaultValue: defaults.href,
      admin: {
        description: 'Where the button goes, e.g. /contact-us or /gallery.',
      },
    },
  ],
})

/** The image call-to-action panel that closes most pages. */
export const ctaPanelField = (): Field => ({
  name: 'cta',
  type: 'group',
  label: 'Closing call to action',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'The white part of the big headline.' },
    },
    {
      name: 'accent',
      type: 'text',
      admin: { description: 'The words at the end of the headline shown in green.' },
    },
    {
      name: 'newLineBeforeAccent',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Start the green words on a new line.' },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Full-bleed background photo for the panel.' },
    },
    linkField('primary', 'Primary button', { label: 'Get a quote', href: '/contact-us' }),
    linkField('secondary', 'Secondary link', { label: 'Come backstage', href: '/gallery' }),
  ],
})

/** Short facts shown under an inner-page hero, each preceded by a green ring. */
export const factsField = (): Field => ({
  name: 'facts',
  type: 'array',
  labels: { singular: 'Fact', plural: 'Facts' },
  fields: [{ name: 'text', type: 'text', required: true }],
  admin: {
    description: 'Short items separated by green rings, e.g. phone · email · postcode.',
  },
})

/** The decorative radar list of towns on the About and Contact pages. */
export const townsField = (): Field => ({
  name: 'towns',
  type: 'array',
  labels: { singular: 'Town', plural: 'Towns' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'latitude',
      type: 'number',
      required: true,
      admin: { description: 'Real latitude, e.g. 53.3811 for Sheffield.' },
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
      admin: { description: 'Real longitude, e.g. -1.4701 for Sheffield.' },
    },
    {
      name: 'delay',
      type: 'text',
      defaultValue: '0s',
      admin: { description: 'Blink delay, e.g. .5s.' },
    },
  ],
  admin: {
    description:
      'Placed on the map from their real coordinates, so the directions and relative distances are correct.',
  },
})

/** A pair of stats (big value + caption) used beside the About history copy. */
export const statsField = (): Field => ({
  name: 'stats',
  type: 'array',
  labels: { singular: 'Stat', plural: 'Stats' },
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
  ],
  admin: { description: 'Large numbers with a caption underneath.' },
})

/**
 * What search engines and social previews show for a page. The site name is
 * added to the title automatically, so this is just the page's own name.
 */
export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'Search engines',
  admin: {
    description: 'What Google and social previews show. Leave blank to use the page copy.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Just the page name, e.g. “About Us” — the site name is added after it.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'One sentence, roughly 150 characters, describing the page. Shown under the title in search results.',
      },
    },
  ],
})
