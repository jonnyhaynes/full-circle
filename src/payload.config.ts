import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Disciplines } from './collections/Disciplines'
import { ProcessSteps } from './collections/ProcessSteps'
import { EventTypes } from './collections/EventTypes'
import { Testimonials } from './collections/Testimonials'
import { Clients } from './collections/Clients'
import { GalleryItems } from './collections/GalleryItems'
import { FormSubmissions } from './collections/FormSubmissions'
import './payload-types'

import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { ServicesPage } from './globals/ServicesPage'
import { BackstagePage } from './globals/BackstagePage'
import { ContactPage } from './globals/ContactPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// With no SMTP host configured, the adapter falls back to ethereal.email and logs
// a preview link to the console — so development never sends real mail.
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'info@fullcircleevents.co.uk',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'Full Circle Event Production',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- nodemailerAdapter type omits auth
      } as any,
    })
  : nodemailerAdapter()

const storagePlugins = process.env.R2_BUCKET
  ? [
      s3Storage({
        bucket: process.env.R2_BUCKET,
        clientUploads: true,
        collections: {
          media: {
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) => {
              const key = prefix ? `${prefix}/${filename}` : filename
              return `${process.env.R2_PUBLIC_URL}/${key}`
            },
          },
        },
        config: {
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          },
          endpoint: process.env.R2_ENDPOINT,
          forcePathStyle: true,
          region: 'auto',
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Full Circle Event Production',
    },
  },
  collections: [
    // Admin
    Users,
    // Content
    Services,
    Disciplines,
    ProcessSteps,
    EventTypes,
    Testimonials,
    Clients,
    GalleryItems,
    // Lead capture
    FormSubmissions,
    // Media
    Media,
  ],
  globals: [
    SiteSettings,
    Navigation,
    HomePage,
    AboutPage,
    ServicesPage,
    BackstagePage,
    ContactPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email,
  sharp,
  upload: {
    limits: {
      fileSize: 40 * 1024 * 1024,
    },
    requestSizeLimit: 100 * 1024 * 1024,
  },
  plugins: [...storagePlugins],
})
