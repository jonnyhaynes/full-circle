import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '../access/isAdminOrEditor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Every image on the site lives here. Uploads generate five useful sizes plus a
 * focal point so crops keep the subject in frame on every device.
 *
 * `alt` is required — accessibility is not something an editor should be able to forget.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  admin: {
    group: 'Content',
    description: 'Images for services, gallery and pages. Upload at the largest size you have.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 480,
        position: 'centre',
      },
      {
        name: 'card',
        width: 900,
        height: 1200,
        position: 'centre',
      },
      {
        name: 'wide',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 2400,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and search engines.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional text shown beneath the image in galleries.',
      },
    },
  ],
}
