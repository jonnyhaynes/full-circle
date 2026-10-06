import type { Navigation, SiteSetting } from '@/payload-types'

import { getPayloadClient } from './payload'

export type NavItem = { label: string; href: string }

/** The business details and menus every page needs for its header and footer. */
export async function getSiteChrome() {
  const payload = await getPayloadClient()
  const [settings, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.findGlobal({ slug: 'navigation' }),
  ])

  return {
    settings: settings as unknown as SiteSetting,
    navigation: navigation as unknown as Navigation,
  }
}

export function itemsFrom(navigation: Navigation, key: 'header' | 'footer'): NavItem[] {
  const list = navigation?.[key]
  if (!Array.isArray(list)) return []
  return list
    .filter((item: { label?: string | null; href?: string | null }) =>
      Boolean(item?.label && item?.href)
    )
    .map((item: { label?: string | null; href?: string | null }) => ({
      label: item.label as string,
      href: item.href as string,
    }))
}
