#!/usr/bin/env node
/**
 * Collect JoJo The Jeweler client assets into the repo so the frontend never depends on a
 * live third-party host. Runs in GitHub Actions (.github/workflows/collect-assets.yml).
 *
 * 1. Existing Shopify store (password protected) → content/shopify/{products,collections}.json
 *    plus product/collection images in public/media/shopify/.
 * 2. Google Drive client folder → public/media/drive/ (photos as WebP, videos as web MP4
 *    capped at 1080p/~12s hero loops, poster frames) + content/drive/manifest.json.
 *
 * Needs: ffmpeg, python3 + gdown (pip). Env: STORE_DOMAIN, STORE_PASSWORD, DRIVE_FOLDER.
 * No secrets are written to the repo; the password is only used for a session cookie.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readdirSync, statSync, existsSync, rmSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

const STORE = process.env.STORE_DOMAIN || 'jojoxwaves.myshopify.com'
const PASSWORD = process.env.STORE_PASSWORD || ''
const DRIVE = process.env.DRIVE_FOLDER || ''
const C = 'content', M = 'public/media'
for (const d of [`${C}/shopify`, `${C}/drive`, `${M}/shopify`, `${M}/drive`]) mkdirSync(d, { recursive: true })
const log = { started: new Date().toISOString(), shopify: {}, drive: {}, failed: [] }
const save = () => writeFileSync(`${C}/collect-log.json`, JSON.stringify(log, null, 2) + '\n')
const ff = (a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' })
const probe = (f) => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', f]).toString())
const slug = (s) => s.toLowerCase().replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/* ── 1. Shopify ─────────────────────────────────────────────────────────── */
async function shopify() {
  const base = `https://${STORE}`
  const jar = []
  const headers = () => ({ 'User-Agent': 'Mozilla/5.0', Cookie: jar.join('; ') })
  const take = (r) => { for (const [k, v] of r.headers) if (k.toLowerCase() === 'set-cookie') jar.push(v.split(';')[0]) }
  // Storefront password → session cookie
  const pw = await fetch(`${base}/password`, { method: 'POST', redirect: 'manual', headers: { ...headers(), 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ form_type: 'storefront_password', utf8: '✓', password: PASSWORD }) })
  take(pw)
  const get = async (p) => { const r = await fetch(base + p, { headers: headers(), redirect: 'manual' }); take(r); if (r.status !== 200) throw new Error(`${p} → ${r.status}`); return r.json() }
  const products = []
  for (let page = 1; page < 20; page++) {
    const { products: ps } = await get(`/products.json?limit=250&page=${page}`)
    if (!ps?.length) break
    products.push(...ps)
  }
  const { collections = [] } = await get('/collections.json?limit=250').catch(() => ({ collections: [] }))
  for (const c of collections) {
    try { c.products = (await get(`/collections/${c.handle}/products.json?limit=250`)).products.map((p) => p.handle) } catch { c.products = [] }
  }
  // Images → WebP copies next to the data (keeps rollbacks self-contained)
  let n = 0
  for (const p of products) {
    for (const [i, img] of (p.images || []).entries()) {
      const file = `${M}/shopify/${p.handle}-${i + 1}.webp`
      if (existsSync(file)) { img.local = `/media/shopify/${basename(file)}`; continue }
      try {
        const r = await fetch(img.src, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        if (!r.ok) throw new Error('HTTP ' + r.status)
        writeFileSync('/tmp/img', Buffer.from(await r.arrayBuffer()))
        ff(['-i', '/tmp/img', '-vf', "scale='min(1600,iw)':-2", '-c:v', 'libwebp', '-quality', '84', file])
        img.local = `/media/shopify/${basename(file)}`; n++
      } catch (e) { log.failed.push({ src: img.src, error: String(e.message) }) }
    }
  }
  writeFileSync(`${C}/shopify/products.json`, JSON.stringify(products, null, 2) + '\n')
  writeFileSync(`${C}/shopify/collections.json`, JSON.stringify(collections, null, 2) + '\n')
  log.shopify = { products: products.length, collections: collections.length, images: n }
  save()
}

/* ── 2. Google Drive ────────────────────────────────────────────────────── */
function drive() {
  if (!DRIVE) return
  const raw = '/tmp/drive-raw'
  rmSync(raw, { recursive: true, force: true }); mkdirSync(raw, { recursive: true })
  execFileSync('gdown', ['--folder', '--remaining-ok', '-O', raw, DRIVE], { stdio: 'inherit' })
  const files = []
  const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p) })
  walk(raw)
  const manifest = []
  for (const f of files) {
    const ext = extname(f).toLowerCase(), name = slug(basename(f)) || 'asset'
    try {
      if (['.jpg', '.jpeg', '.png', '.heic', '.webp'].includes(ext)) {
        const out = `${M}/drive/${name}.webp`
        ff(['-i', f, '-vf', "scale='min(2000,iw)':-2", '-c:v', 'libwebp', '-quality', '84', out])
        ff(['-i', f, '-vf', "scale='min(640,iw)':-2", '-c:v', 'libwebp', '-quality', '70', `${M}/drive/${name}-sm.webp`])
        const j = probe(out)
        manifest.push({ kind: 'image', name: basename(f), src: `/media/drive/${name}.webp`, thumb: `/media/drive/${name}-sm.webp`, w: j.streams?.[0]?.width, h: j.streams?.[0]?.height, bytes: statSync(out).size })
      } else if (['.mov', '.mp4', '.m4v'].includes(ext)) {
        const out = `${M}/drive/${name}.mp4`
        const d = Number(probe(f).format?.duration || 0)
        // Web hero loop: first 14s, 1080 tall max, muted, faststart. Originals stay in Drive.
        ff(['-i', f, '-t', '14', '-vf', "scale='if(gt(ih,1080),-2,iw)':'min(ih,1080)',fps=30", '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out])
        ff(['-i', out, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-deadline', 'good', '-cpu-used', '3', '-row-mt', '1', '-an', `${M}/drive/${name}.webm`])
        ff(['-i', out, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', `${M}/drive/${name}.webp`])
        const j = probe(out)
        manifest.push({ kind: 'video', name: basename(f), src: `/media/drive/${name}.mp4`, webm: `/media/drive/${name}.webm`, poster: `/media/drive/${name}.webp`, w: j.streams?.[0]?.width, h: j.streams?.[0]?.height, originalSeconds: Math.round(d), bytes: statSync(out).size })
      }
    } catch (e) { log.failed.push({ file: basename(f), error: String(e.message).slice(0, 200) }) }
  }
  writeFileSync(`${C}/drive/manifest.json`, JSON.stringify({ folder: DRIVE, fetched: new Date().toISOString(), files: manifest }, null, 2) + '\n')
  log.drive = { files: manifest.length }
  save()
}

async function main() {
  try { await shopify() } catch (e) { log.shopify.error = String(e.message); log.failed.push({ step: 'shopify', error: String(e.stack).slice(0, 400) }) }
  try { drive() } catch (e) { log.drive.error = String(e.message); log.failed.push({ step: 'drive', error: String(e.stack).slice(0, 400) }) }
  log.finished = new Date().toISOString(); save()
  console.log(JSON.stringify(log, null, 2))
}
main()
