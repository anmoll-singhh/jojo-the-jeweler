import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off'
let lenis: Lenis | null = null
export const getLenis = () => lenis

/** Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced() || matchMedia('(max-width:767px)').matches) return
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null }
  }, [])
}

/**
 * Per-route motion. The previous build hid content with CSS until an observer fired, which
 * left new routes blank. Here nothing is hidden by CSS: GSAP sets the start state itself,
 * inside a context that is reverted on route change, and ScrollTrigger is refreshed after
 * the new page and its images have laid out. Elements already in view animate at once.
 */
export function useRouteMotion() {
  const { pathname } = useLocation()
  // Every new page (link, back or forward) opens at the top. Done before paint and with an
  // instant jump: html has scroll-behavior:smooth, which otherwise animates this scroll and the
  // animation is cut short when the new page mounts, leaving phones halfway down the page.
  useLayoutEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  useEffect(() => {
    if (reduced()) return
    let ctx: gsap.Context | undefined
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('main .ln > span').forEach((el) =>
          gsap.fromTo(el, { yPercent: 110 }, { yPercent: 0, overwrite: 'auto', clearProps: 'transform', duration: 0.8, ease: 'power4.out', delay: Number(el.parentElement?.dataset.d || 0), scrollTrigger: { trigger: el.parentElement!, start: 'top 96%', once: true } }))
        gsap.utils.toArray<HTMLElement>('main .rv').forEach((el) =>
          gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, overwrite: 'auto', clearProps: 'transform,opacity,visibility', duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 96%', once: true } }))
        gsap.utils.toArray<HTMLElement>('main .clip').forEach((el) =>
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 98%', once: true } }))
        // fromTo with explicit end values: a plain from() started twice on one element records the
        // half-way position as its end, which left cards stuck 10-20px out of line.
        ScrollTrigger.batch('main .grid > *, main .rail__track > *', { start: 'top 98%', once: true, onEnter: (b) => gsap.fromTo(b, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, overwrite: 'auto', clearProps: 'transform,opacity,visibility', stagger: 0.05, duration: 0.55, ease: 'power3.out' }) })
        const track = document.querySelector<HTMLElement>('main .look__track')
        if (track && matchMedia('(min-width: 861px)').matches) {
          const dist = () => track.scrollWidth - innerWidth + 80
          gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.look__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } })
        }
      })
      ScrollTrigger.refresh()
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)
    const onLoad = () => ScrollTrigger.refresh()
    addEventListener('load', onLoad)
    return () => { cancelAnimationFrame(raf); clearTimeout(t); removeEventListener('load', onLoad); ctx?.revert() }
  }, [pathname])
}

/** Subtle magnetic pull on buttons, hover devices only. */
export function useMagnetic() {
  useEffect(() => {
    if (!matchMedia('(hover:hover)').matches) return
    const move = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest?.('.btn') as HTMLElement | null
      if (!b || reduced()) return
      const r = b.getBoundingClientRect()
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.1, y: (e.clientY - r.top - r.height / 2) * 0.14, duration: 0.4, ease: 'power3.out' })
    }
    const out = (e: PointerEvent) => { const b = (e.target as HTMLElement).closest?.('.btn'); if (b && !b.contains(e.relatedTarget as Node)) gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' }) }
    addEventListener('pointermove', move); addEventListener('pointerout', out)
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerout', out) }
  }, [])
}

/** Skeletons: image containers shimmer until their <img> has decoded. */
export function useImageSkeletons() {
  useEffect(() => {
    const mark = (img: HTMLImageElement) => img.classList.add('ld')
    const onLoad = (e: Event) => { const t = e.target as HTMLElement; if (t.tagName === 'IMG') mark(t as HTMLImageElement) }
    document.addEventListener('load', onLoad, true)
    const mo = new MutationObserver(() => document.querySelectorAll<HTMLImageElement>('img:not(.ld)').forEach((i) => i.complete && i.naturalWidth && mark(i)))
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { document.removeEventListener('load', onLoad, true); mo.disconnect() }
  }, [])
}
