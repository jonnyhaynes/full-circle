import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

/** The four filters on the Backstage (gallery) page. */
export const GALLERY_CATEGORIES = [
  { label: 'Awards & corporate', value: 'awards' },
  { label: 'Live & festivals', value: 'live' },
  { label: 'Community', value: 'community' },
  { label: 'Behind the scenes', value: 'crew' },
] as const

/**
 * Aspect ratios used by the masonry grid. Kept as a fixed list so the tiles
 * line up with the approved design; the value is used directly as a CSS
 * `aspect-ratio`.
 */
export const GALLERY_RATIOS = [
  '16 / 9',
  '3 / 2',
  '4 / 3',
  '1 / 1',
  '472 / 636',
  '742 / 832',
  '400 / 554',
  '588 / 425',
  '742 / 831',
] as const

export const GalleryItems: CollectionConfig = {
  slug: 'galleryItems',
  labels: { singular: 'Gallery item', plural: 'Gallery items' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'category', 'order'],
    group: 'Content',
    description: 'Photographs shown on the Backstage page.',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      required: true,
      admin: { description: 'Shown on the tile and in the lightbox, e.g. “Business Awards 2024”.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...GALLERY_CATEGORIES],
      admin: { description: 'Which filter this photo lives under.' },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      required: true,
      defaultValue: '3 / 2',
      options: GALLERY_RATIOS.map((value) => ({ label: value, value })),
      admin: {
        position: 'sidebar',
        description: 'The shape of the tile in the grid. Match the photograph where you can.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
