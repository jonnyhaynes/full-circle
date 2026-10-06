import { getPayload } from 'payload'

import config from '@/payload.config'
import '@/payload-types'

export const getPayloadClient = async () => getPayload({ config })
