import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { fallbackOf } from './formats'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off'
let lenis: Lenis | null = null
export const getLenis = () => lenis

/** Lenis smooth scroll driven by GSAP's ticker (desktop, pointer devices, motion allowed). */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced() || !matchMedia('(hover:hover) and (min-width:768px)').matches) return
    lenis = new Lenis({ lerp: 0.12, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null }
  }, [])
}

/**
 * Per-route motion. Nothing is hidden by CSS: GSAP sets start states inside a context that is
 * reverted on route change, so the reduced-motion page and the no-JS page are the finished page.
 *
 * Hooks (class names on elements):
 *   .ln > span   line rises from behind a mask (heading lines)
 *   .rv          rises 24px + fades, once, at 88% viewport
 *   .clip        unmasks from the bottom (pictures)
 *   .rv-group    children stagger 70ms in DOM order
 *   .look__pin / .look__track   pinned horizontal scroll (desktop only)
 *   .drift       slow scroll-linked travel (≤8% of the element), pictures held at 108% in their frames
 */
export function useRouteMotion() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  useEffect(() => {
    if (reduced()) return
    let ctx: gsap.Context | undefined
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const once = (el: Element, start = 'top 88%') => ({ trigger: el, start, once: true })
        gsap.utils.toArray<HTMLElement>('main .ln > span').forEach((el) =>
          gsap.fromTo(el, { yPercent: 110 }, { yPercent: 0, overwrite: 'auto', clearProps: 'transform', duration: 0.9, ease: 'expo.out', delay: Number(el.parentElement?.dataset.d || 0), scrollTrigger: once(el.parentElement!, 'top 94%') }))
        gsap.utils.toArray<HTMLElement>('main .rv').forEach((el) =>
          gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, overwrite: 'auto', clearProps: 'transform,opacity,visibility', duration: 0.8, ease: 'expo.out', delay: Number(el.dataset.d || 0), scrollTrigger: once(el) }))
        gsap.utils.toArray<HTMLElement>('main .clip').forEach((el) =>
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: once(el, 'top 92%') }))
        gsap.utils.toArray<HTMLElement>('main .rv-group').forEach((g) =>
          gsap.fromTo(g.children, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, overwrite: 'auto', clearProps: 'transform,opacity,visibility', stagger: 0.07, duration: 0.7, ease: 'expo.out', scrollTrigger: once(g) }))
        ScrollTrigger.batch('main .grid > .card, main .rail__track > .card, main .tiles > a', { start: 'top 94%', once: true, onEnter: (b) => gsap.fromTo(b, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, overwrite: 'auto', clearProps: 'transform,opacity,visibility', stagger: 0.06, duration: 0.6, ease: 'expo.out' }) })
        gsap.utils.toArray<HTMLElement>('main .drift').forEach((el) =>
          gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }))
        const track = document.querySelector<HTMLElement>('main .look__track')
        if (track && matchMedia('(min-width: 900px)').matches) {
          // distance = how far the track's content overflows its own box (the box may sit beside a pinned intro)
          const dist = () => Math.max(0, track.scrollWidth - track.clientWidth)
          gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.look__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1 } })
        }
      })
      ScrollTrigger.refresh()
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 700)
    const onLoad = () => ScrollTrigger.refresh()
    addEventListener('load', onLoad)
    return () => { cancelAnimationFrame(raf); clearTimeout(t); removeEventListener('load', onLoad); ctx?.revert() }
  }, [pathname])
}

/** Subtle magnetic pull on primary buttons, hover devices only. */
export function useMagnetic() {
  useEffect(() => {
    if (!matchMedia('(hover:hover)').matches) return
    const move = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest?.('.btn') as HTMLElement | null
      if (!b || reduced()) return
      const r = b.getBoundingClientRect()
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.08, y: (e.clientY - r.top - r.height / 2) * 0.12, duration: 0.4, ease: 'power3.out' })
    }
    const out = (e: PointerEvent) => { const b = (e.target as HTMLElement).closest?.('.btn'); if (b && !b.contains(e.relatedTarget as Node)) gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' }) }
    addEventListener('pointermove', move); addEventListener('pointerout', out)
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerout', out) }
  }, [])
}

/**
 * Image stages shimmer until their <img> has decoded. A failed load (a dropped request on a mobile
 * connection) is retried once after a short wait, without the srcset so the browser takes the plain
 * file; a second failure hides the broken-image icon and leaves the dark stage in place.
 */
export function useImageSkeletons() {
  useEffect(() => {
    const mark = (img: HTMLImageElement) => img.classList.add('ld')
    const onLoad = (e: Event) => { const t = e.target as HTMLElement; if (t.tagName === 'IMG') mark(t as HTMLImageElement) }
    const onError = (e: Event) => fail(e.target as HTMLImageElement)
    const fail = (img: HTMLImageElement) => {
      if (img.tagName !== 'IMG' || img.classList.contains('img-failed')) return
      if (!img.dataset.retried) {
        img.dataset.retried = '1'; img.dataset.retriedAt = String(Date.now() + 600)
        const base = img.getAttribute('src') || ''
        // a WebP that won't decode goes straight to its JPG/PNG copy; anything else is retried once
        setTimeout(() => { img.removeAttribute('srcset'); img.src = /\.webp(\?|$)/.test(base) && /no-webp/.test(document.documentElement.className) ? fallbackOf(base) : base + (base.includes('?') ? '&' : '?') + 'r=' + Date.now() }, 600)
      } else { img.classList.add('img-failed'); img.closest('.stage')?.classList.add('ready') }
    }
    document.addEventListener('load', onLoad, true)
    document.addEventListener('error', onError, true)
    const mo = new MutationObserver(() => document.querySelectorAll<HTMLImageElement>('img:not(.ld)').forEach((i) => i.complete && i.naturalWidth && mark(i)))
    mo.observe(document.body, { childList: true, subtree: true })
    // Safari doesn't always fire "error" for a failed srcset candidate, so also sweep for images that finished without pixels
    const sweep = setInterval(() => document.querySelectorAll<HTMLImageElement>('img:not(.ld):not(.img-failed)').forEach((i) => {
      if (!i.complete || i.naturalWidth || !i.getAttribute('src')) return
      const r = i.getBoundingClientRect(); if (r.bottom < -innerHeight || r.top > innerHeight * 2) return
      if (i.dataset.retried && Date.now() - Number(i.dataset.retriedAt || 0) < 1500) return
      fail(i)
    }), 1200)
    return () => { document.removeEventListener('load', onLoad, true); document.removeEventListener('error', onError, true); mo.disconnect(); clearInterval(sweep) }
  }, [])
}
