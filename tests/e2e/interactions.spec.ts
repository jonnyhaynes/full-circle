import { expect, test } from '@playwright/test'

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: 'Skip to content' })
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('the home hero headline stays on two lines at every width', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    const measured = await page.evaluate(() => {
      const h1 = document.querySelector('h1') as HTMLElement
      const column = h1.parentElement as HTMLElement
      const lineHeight = Number.parseFloat(getComputedStyle(h1).lineHeight)
      const spans = Array.from(h1.querySelectorAll('span'))
      return {
        column: column.clientWidth,
        lines: spans.map((span) =>
          Math.round((span as HTMLElement).getBoundingClientRect().height / lineHeight)
        ),
        widths: spans.map((span) => {
          const range = document.createRange()
          range.selectNodeContents(span)
          return Math.round(range.getBoundingClientRect().width)
        }),
      }
    })

    expect(measured.lines, `line count at ${width}px`).toEqual([1, 1])
    for (const textWidth of measured.widths) {
      expect(textWidth, `no overflow at ${width}px`).toBeLessThanOrEqual(measured.column)
    }
  }
})

test('services filter narrows the grid', async ({ page }) => {
  await page.goto('/services')

  const cards = page.locator('article.fc-svc')
  await expect(cards.first()).toBeVisible()
  const allCount = await cards.count()
  expect(allCount).toBeGreaterThan(4)

  await page.getByRole('tab', { name: /^Corporate/ }).click()
  await expect.poll(async () => cards.count()).toBeLessThan(allCount)
})

test('gallery filters, opens the lightbox, steps and returns focus', async ({ page }) => {
  await page.goto('/gallery')

  const tiles = page.getByRole('button', { name: /^View photo:/ })
  const allCount = await tiles.count()
  expect(allCount).toBeGreaterThan(0)

  await page.getByRole('tab', { name: /^Live & Festivals/ }).click()
  await expect.poll(async () => tiles.count()).toBeLessThan(allCount)

  const first = tiles.first()
  await first.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('1 /')

  await page.keyboard.press('ArrowRight')
  await expect(dialog).toContainText('2 /')

  await page.keyboard.press('ArrowLeft')
  await expect(dialog).toContainText('1 /')

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(first).toBeFocused()
})

test('the how-we-work section pins and the line draws with scroll', async ({ page }) => {
  const viewport = 800
  await page.setViewportSize({ width: 1280, height: viewport })
  await page.goto('/')

  const fill = page.locator('[data-timeline-fill]')
  const timeline = page.locator('.fc-timeline')
  const sticky = page.locator('.fc-timeline-sticky')
  await expect(timeline).toBeAttached()

  const box = await timeline.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return { top: rect.top + window.scrollY, height: rect.height }
  })
  const travel = box.height - viewport
  // The wrapper is taller than the viewport, which is what makes it pin.
  expect(travel).toBeGreaterThan(100)

  const scaleAt = async (scrollY: number) => {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY)
    await page.waitForTimeout(150)
    return fill.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)
  }
  const stickyTopAt = async (scrollY: number) => {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY)
    await page.waitForTimeout(150)
    return sticky.evaluate((element) => Math.round(element.getBoundingClientRect().top))
  }

  const before = await scaleAt(Math.max(0, box.top - 200))
  const mid = await scaleAt(box.top + travel * 0.45)
  const after = await scaleAt(box.top + travel + 100)

  // Empty before the pin, drawing through it, and complete once released.
  expect(before).toBeLessThan(0.05)
  expect(mid).toBeGreaterThan(0.1)
  expect(after).toBeGreaterThan(0.95)

  // The section stays fixed to the top of the viewport while it is pinned.
  const pinnedStart = await stickyTopAt(box.top + 100)
  const pinnedEnd = await stickyTopAt(box.top + travel - 100)
  expect(Math.abs(pinnedStart)).toBeLessThanOrEqual(1)
  expect(Math.abs(pinnedEnd)).toBeLessThanOrEqual(1)
})

test('the footer shows the contact details and the credit', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')

  await expect(footer.getByRole('link', { name: 'info@fullcircleevents.co.uk' })).toBeVisible()
  await expect(footer.getByRole('link', { name: '0114 3499273' })).toBeVisible()
  await expect(
    footer.getByText(/Meadowhall Road Industrial Estate, Amos Road\s+Sheffield\s+S9 1BX/)
  ).toBeVisible()
  await expect(footer.getByText(/All rights reserved/)).toBeVisible()

  const credit = footer.getByRole('link', { name: 'Colouring Code' })
  await expect(credit).toBeVisible()
  await expect(credit).toHaveAttribute('href', 'https://www.colouringcode.com')

  // The White Rose of Yorkshire sits on the credit line.
  await expect(
    footer.locator('p', { hasText: 'Forged in Yorkshire' }).locator('svg')
  ).toHaveCount(1)
})

test('the testimonial slider advances without auto-playing', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('tablist', { name: 'Choose testimonial' })).toBeVisible()
  await expect(page.getByText('Cllr Ian Jones')).toBeVisible()

  await page.getByRole('button', { name: 'Next testimonial' }).click()
  await expect(page.getByText('Amanda Hobson')).toBeVisible()

  await page.getByRole('button', { name: 'Previous testimonial' }).click()
  await expect(page.getByText('Cllr Ian Jones')).toBeVisible()
})

test('the contact form validates and then confirms', async ({ page }) => {
  await page.goto('/contact-us')

  await page.getByRole('button', { name: /Send enquiry/i }).click()
  await expect(page.getByText(/Please add your name/)).toBeVisible()

  await page.locator('input[name="name"]').fill('Jo Bloggs')
  await page.locator('input[name="email"]').fill('jo@example.com')
  await page.locator('textarea[name="message"]').fill('We need AV for 200 guests in July.')

  await page.getByRole('button', { name: /Send enquiry/i }).click()
  await expect(page.getByRole('heading', { name: /Thanks, Jo/ })).toBeVisible({ timeout: 15_000 })
})

/** The prototype notice bar is fixed to the bottom, over the ticket. */
async function dismissNotice(page: import('@playwright/test').Page) {
  const dismiss = page.getByRole('button', { name: 'Dismiss' })
  // It mounts after hydration, so give it a moment to appear before deciding —
  // otherwise it can pop in after this check and intercept the next click.
  await dismiss.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click()
    await expect(dismiss).toBeHidden()
  }
}

test('sticky ticket opens on desktop and dismisses permanently', async ({ page }) => {
  await page.goto('/')
  await dismissNotice(page)

  const region = page.getByRole('region', { name: 'Get a quote' })
  await expect(region).toBeVisible()

  await page.getByRole('button', { name: /Close and don/ }).click()
  await expect(region).toHaveCount(0)

  await page.reload()
  await expect(page.getByRole('region', { name: 'Get a quote' })).toHaveCount(0)
})

test('sticky ticket starts minimised on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await dismissNotice(page)

  const mini = page.getByRole('button', { name: 'Open All Access: get a quote' })
  await expect(mini).toBeVisible()

  await mini.click()
  await expect(page.getByRole('region', { name: 'Get a quote' })).toBeVisible()
})

test('cards and list items rise in as they scroll into view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })

  // Home: the three "Unique offerings" cards bounce in.
  await page.goto('/')
  const card = page.locator('.fc-scroll-in[data-variant="bounce"]').first()
  await card.scrollIntoViewIfNeeded()
  await expect(card).toHaveAttribute('data-shown', 'true')
  expect(await card.evaluate((el) => getComputedStyle(el).animationName)).toContain('fc-card-pop')

  // About: the numbered event-type list rises in.
  await page.goto('/about-us')
  const item = page.locator('.fc-scroll-in[data-variant="rise"]').first()
  await item.scrollIntoViewIfNeeded()
  await expect(item).toHaveAttribute('data-shown', 'true')
  expect(await item.evaluate((el) => getComputedStyle(el).animationName)).toContain('fc-rise-in')

  // Services: the service cards rise in.
  await page.goto('/services')
  const serviceCard = page.locator('.fc-scroll-in[data-variant="rise"]').first()
  await serviceCard.scrollIntoViewIfNeeded()
  await expect(serviceCard).toHaveAttribute('data-shown', 'true')

  // Backstage: the gallery tiles rise in.
  await page.goto('/gallery')
  const tile = page.locator('.fc-scroll-in[data-variant="rise"]').first()
  await tile.scrollIntoViewIfNeeded()
  await expect(tile).toHaveAttribute('data-shown', 'true')
})

test('the framed images drift as the page scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })

  for (const route of ['/', '/about-us']) {
    await page.goto(route)

    const frames = page.locator('[data-parallax]')
    expect(await frames.count(), `${route} has framed images`).toBeGreaterThan(0)

    const frame = frames.first()
    await frame.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const before = await frame.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--fc-parallax').trim()
    )

    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(300)
    const after = await frame.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--fc-parallax').trim()
    )

    expect(after, `${route} parallax offset changes with scroll`).not.toBe(before)
  }
})

test('the closing call-to-action image drifts in a slow ken burns', async ({ page }) => {
  await page.goto('/')

  const image = page.locator('img.fc-kenburns').first()
  await expect(image).toBeAttached()

  const state = await image.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      name: style.animationName,
      iterations: style.animationIterationCount,
      transform: style.transform,
    }
  })

  expect(state.name).toContain('fc-kenburns')
  expect(state.iterations).toBe('infinite')
  expect(state.transform).not.toBe('none')
})

test('the hero photo drifts in a slow ken burns', async ({ page }) => {
  await page.goto('/')

  const animation = await page
    .locator('section.fc-hero img')
    .first()
    .evaluate((el) => getComputedStyle(el).animationName)

  // The entrance zoom first, then the drift.
  expect(animation).toContain('fc-bannerzoom')
  expect(animation).toContain('fc-kenburns')
})

test('the hero script line is written on, left to right', async ({ page }) => {
  await page.goto('/')

  const strokes = page.locator('.fc-script-path')
  await expect(strokes.first()).toBeAttached()
  expect(await strokes.count()).toBeGreaterThan(10)

  // Each pen stroke draws in its own slot, in order — that staggering is what
  // makes the line write across instead of appearing all at once.
  const timing = await strokes.evaluateAll((nodes) =>
    nodes.slice(0, 6).map((node) => {
      const style = getComputedStyle(node)
      return {
        delay: Number.parseFloat(style.animationDelay),
        duration: Number.parseFloat(style.animationDuration),
      }
    })
  )
  for (let i = 1; i < timing.length; i += 1) {
    expect(timing[i].delay).toBeGreaterThan(timing[i - 1].delay)
  }
  expect(timing[0].duration).toBeGreaterThan(0)

  // And the strokes are ordered left to right across the line.
  const lefts = await strokes.evaluateAll((nodes) =>
    nodes.slice(0, 8).map((node) => node.getBoundingClientRect().left)
  )
  for (let i = 1; i < lefts.length; i += 1) {
    expect(lefts[i]).toBeGreaterThanOrEqual(lefts[i - 1] - 1)
  }
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the hero photo shows and the ambient loops are stopped', async ({ page }) => {
    await page.goto('/')

    const hero = page.locator('section.fc-hero')
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(hero.locator('img').first()).toBeVisible()

    const duration = await page
      .locator('.fc-ring-dash')
      .evaluate((element) => getComputedStyle(element).animationDuration)

    expect(Number.parseFloat(duration)).toBeLessThan(0.05)
  })

  test('the script line is shown fully written, with no draw-on', async ({ page }) => {
    await page.goto('/')

    const stroke = page.locator('.fc-script-path').first()
    await expect(stroke).toBeVisible()
    expect(await stroke.evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  })

  test('the how-we-work timeline is shown complete and is not pinned', async ({ page }) => {
    await page.goto('/')

    const state = await page.locator('.fc-timeline').evaluate((element) => {
      const fill = element.querySelector('[data-timeline-fill]') as HTMLElement
      const sticky = element.querySelector('.fc-timeline-sticky') as HTMLElement
      return {
        scale: new DOMMatrixReadOnly(getComputedStyle(fill).transform).a,
        position: getComputedStyle(sticky).position,
        height: Math.round(element.getBoundingClientRect().height),
        viewport: window.innerHeight,
      }
    })

    // Drawn finished, no sticky wrapper, so nothing pins and no scroll is hijacked.
    expect(state.scale).toBeGreaterThan(0.95)
    expect(state.position).toBe('static')
    expect(state.height).toBeLessThanOrEqual(state.viewport)
  })
})

test('no page scrolls horizontally', async ({ page }) => {
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/about-us', '/services', '/gallery', '/contact-us']) {
      await page.goto(route)
      // `overflow-x: clip` on the body should swallow any stray overflow (the
      // ring glow, the rotated script line) without creating a scroll container.
      const scrollX = await page.evaluate(() => {
        window.scrollTo(9999, 0)
        return window.scrollX
      })
      expect(scrollX, `${route} at ${width}px`).toBe(0)
    }
  }
})
