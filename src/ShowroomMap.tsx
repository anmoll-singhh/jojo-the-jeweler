/**
 * Showroom map for the Contact page.
 *
 * MapLibre GL (open source) drawing OpenFreeMap tiles: free, no API key, no registration, no view
 * limits, commercial use allowed (openfreemap.org). Style "positron" is near-monochrome and is
 * greyed fully to match the brand; the dark theme ("noir" in the design controller) uses "dark".
 * OpenStreetMap attribution is added by the style and must stay visible.
 *
 * A black pin with the Double M & Co logo marks the showroom, with an address card on top.
 * Loaded on demand so the rest of the site doesn't carry the map library.
 */
import { useEffect, useRef, useState } from 'react'
import { BRAND } from './data/site'
import { useDesign } from './store'
import 'maplibre-gl/dist/maplibre-gl.css'

/** Unit 19, 362 Charles Street, North Perth WA 6006 — [lng, lat] as MapLibre expects. */
const SHOWROOM: [number, number] = [115.85268, -31.92679]
const STYLE = (dark: boolean) => `https://tiles.openfreemap.org/styles/${dark ? 'dark' : 'positron'}`

export default function ShowroomMap() {
  const box = useRef<HTMLDivElement>(null)
  const [d] = useDesign()
  const [failed, setFailed] = useState(false)
  const dark = d.theme === 'noir'

  useEffect(() => {
    let map: import('maplibre-gl').Map | undefined
    let alive = true
    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (!alive || !box.current) return
      try {
        map = new maplibregl.Map({
          container: box.current, style: STYLE(dark), center: SHOWROOM, zoom: 15.6,
          scrollZoom: false, dragRotate: false, pitchWithRotate: false, touchPitch: false,
          attributionControl: { compact: false },
        })
      } catch { setFailed(true); return } // no WebGL
      map.touchZoomRotate.disableRotation()
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      map.on('error', (e) => { if (/style|source|tile/i.test(String(e?.error?.message ?? ''))) setFailed(true) })
      const pin = document.createElement('div')
      pin.className = 'smap__pin'
      pin.innerHTML = '<span><img src="/media/brand/logo-white.png" alt="" /></span>'
      new maplibregl.Marker({ element: pin, anchor: 'bottom' }).setLngLat(SHOWROOM).addTo(map)
    })
    return () => { alive = false; map?.remove() }
  }, [dark])

  return (
    <div className={'smap' + (dark ? ' smap--dark' : '')} data-lenis-prevent>
      <div ref={box} className="smap__map" role="img" aria-label={'Map showing the Double M & Co showroom at ' + BRAND.address.join(', ')} />
      <div className="smap__card">
        <b>Double M &amp; Co showroom</b>
        <span>{BRAND.address[0]}<br />{BRAND.address[1]}</span>
        <a className="btn" href={BRAND.maps} target="_blank" rel="noreferrer">Get directions</a>
      </div>
      {failed && <a className="smap__fallback" href={BRAND.maps} target="_blank" rel="noreferrer">Open the map in Google Maps</a>}
    </div>
  )
}
