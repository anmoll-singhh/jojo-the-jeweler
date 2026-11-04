#!/usr/bin/env node
/**
 * Fetch @jojothejeweler_ Instagram content via Bright Data and archive it in the repo.
 *
 * WHY THIS EXISTS: so the site's social content lives in git. Switching platform, agent or
 * scraper later never means fetching from Instagram again — everything is in
 * content/instagram/manifest.json plus public/media/ig/.
 *
 * Runs in GitHub Actions (.github/workflows/fetch-instagram.yml). Needs BRIGHTDATA_API_KEY.
 * Uses only node builtins + global fetch; ffmpeg does the media conversion.
 *
 * Output
 *   content/instagram/raw/*.json          untouched Bright Data responses (full metadata)
 *   content/instagram/manifest.json       normalized list the site reads
 *   content/instagram/fetch-log.json      what ran, how many records (= Bright Data billing units)
 *   content/instagram/originals/          full-quality files for the hand-picked hero reels only
 *   public/media/ig/reels/<code>.mp4      web copies (H.264, max 1080 tall, faststart)
 *   public/media/ig/reels/<code>.jpg|.webp first frame, the placeholder until a reel plays
 *   public/media/ig/reels/<code>.webm     VP9 copies of the hero reels
 *   public/media/ig/posts/<code>[-n].webp web copies of photos / carousel slides
 *   public/media/ig/highlights/*          highlight covers + stories when the API returns them
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'

const KEY = process.env.BRIGHTDATA_API_KEY
if (!KEY) { console.error('BRIGHTDATA_API_KEY is not set'); process.exit(1) }

const PROFILE = 'https://www.instagram.com/jojothejeweler_/'
const NUM_REELS = Number(process.env.IG_NUM_REELS || 24)
const NUM_POSTS = Number(process.env.IG_NUM_POSTS || 36)
// Reels the client team picked for the homepage hero. Kept at full quality as well.
const HERO_REELS = (process.env.IG_HERO_REELS || '').split(/[\s,]+/).filter(Boolean)

const DS = {
  profiles: 'gd_l1vikfch901nx3by4',
  posts: 'gd_lk5ns7kz21pck8jpis',
  reels: 'gd_lyclm20il4r5helnj',
}
const API = 'https://api.brightdata.com/datasets/v3'
const C = 'content/instagram'
const M = 'public/media/ig'
for (const d of [`${C}/raw`, `${C}/originals`, `${M}/reels`, `${M}/posts`, `${M}/highlights`]) mkdirSync(d, { recursive: true })

const log = { started: new Date().toISOString(), profile: PROFILE, jobs: [], downloads: { ok: 0, failed: [] }, records_billed: 0 }
const saveLog = () => writeFileSync(`${C}/fetch-log.json`, JSON.stringify(log, null, 2) + '\n')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

/** Trigger a collection, wait for it, return the records. */
async function collect(name, dataset, input, extra = '') {
  const job = { name, dataset, inputs: input.length, status: 'started' }
  log.jobs.push(job); saveLog()
  const url = `${API}/trigger?dataset_id=${dataset}&include_errors=true${extra}`
  const res = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify({ input }) })
  const body = await res.text()
  if (!res.ok) { job.status = `trigger failed ${res.status}`; job.error = body.slice(0, 500); saveLog(); return [] }
  const { snapshot_id } = JSON.parse(body)
  job.snapshot_id = snapshot_id
  const deadline = Date.now() + 25 * 60 * 1000
  while (Date.now() < deadline) {
    await sleep(10000)
    const p = await fetch(`${API}/progress/${snapshot_id}`, { headers: H }).then((r) => r.json()).catch(() => ({}))
    if (p.status === 'ready') break
    if (p.status === 'failed') { job.status = 'failed'; job.error = JSON.stringify(p).slice(0, 500); saveLog(); return [] }
  }
  // The snapshot can briefly 202 after "ready" while it is being built.
  for (let i = 0; i < 30; i++) {
    const r = await fetch(`${API}/snapshot/${snapshot_id}?format=json`, { headers: H })
    if (r.status === 200) {
      const data = await r.json()
      const rows = Array.isArray(data) ? data : [data]
      const good = rows.filter((x) => !x.error && !x.error_code)
      job.status = 'ok'; job.records = rows.length; job.errors = rows.length - good.length
      log.records_billed += rows.length
      writeFileSync(`${C}/raw/${name}.json`, JSON.stringify(rows, null, 2) + '\n')
      saveLog(); return good
    }
    await sleep(10000)
  }
  job.status = 'timed out'; saveLog(); return []
}

async function download(url, dest) {
  if (!url) return false
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    writeFileSync(dest, Buffer.from(await r.arrayBuffer()))
    log.downloads.ok++; return true
  } catch (e) {
    log.downloads.failed.push({ url: String(url).slice(0, 120), error: String(e.message || e) }); return false
  }
}

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args])
const tmp = (n) => join('/tmp', n)
const shortcode = (x) => x.shortcode || (x.url || '').match(/\/(?:reel|p|tv)\/([^/?#]+)/)?.[1] || x.post_id
const size = (f) => (existsSync(f) ? statSync(f).size : 0)

/**
 * Web copy of a video + first-frame posters. Returns {w,h,dur} from ffprobe.
 * hq: keep Instagram's native resolution (720×1280) at high quality and add a WebM — for the
 * reels that play large on the site. Archive copies stay smaller.
 */
function processVideo(src, code, hq = false) {
  const out = `${M}/reels/${code}.mp4`
  if (hq) ff(['-i', src, '-vf', "scale='if(gt(ih,1920),-2,iw)':'min(ih,1920)'", '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out])
  else ff(['-i', src, '-vf', "scale='if(gt(ih,1080),-2,iw)':'min(ih,1080)'", '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', out])
  // First frame as the placeholder shown until playback starts: WebP, with JPG as the fallback.
  ff(['-i', src, '-frames:v', '1', '-q:v', '2', `${M}/reels/${code}.jpg`])
  ff(['-i', src, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '86', `${M}/reels/${code}.webp`])
  // Large-playing reels also get a VP9 WebM; the page lists it before the MP4 for browsers that can play it.
  if (hq || HERO_REELS.includes(code)) ff(['-i', src, '-c:v', 'libvpx-vp9', '-crf', hq ? '30' : '36', '-b:v', '0', '-deadline', 'good', '-cpu-used', hq ? '2' : '4', '-row-mt', '1',
    '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '64k', `${M}/reels/${code}.webm`])
  const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration',
    '-of', 'json', out]).toString()
  const j = JSON.parse(probe)
  return { w: j.streams?.[0]?.width, h: j.streams?.[0]?.height, dur: Math.round(Number(j.format?.duration || 0) * 10) / 10 }
}

function processImage(src, dest) {
  ff(['-i', src, '-vf', "scale='min(1440,iw)':-2", '-c:v', 'libwebp', '-quality', '82', dest])
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', dest]).toString())
  return { w: j.streams?.[0]?.width, h: j.streams?.[0]?.height }
}

const pick = (o, ks) => Object.fromEntries(ks.filter((k) => o[k] !== undefined && o[k] !== null).map((k) => [k, o[k]]))

/**
 * Targeted runs. content/instagram/REFETCH can name specific reels and files instead of a full
 * refresh, which bills only one Bright Data record per reel:
 *   reels: DdBB--kqLxK Dcu1IFHKOr2        → fetch these at full quality, merge into the manifest
 *   asset: https://… -> public/media/x.webp → plain download of a file (logos etc.)
 */
function readPlan() {
  const t = existsSync(`${C}/REFETCH`) ? readFileSync(`${C}/REFETCH`, 'utf8') : ''
  const reels = (t.match(/^reels:(.*)$/m)?.[1] ?? '').trim().split(/[\s,]+/).filter(Boolean)
  const assets = [...t.matchAll(/^asset:\s*(\S+)\s*->\s*(\S+)\s*$/gm)].map((m) => [m[1], m[2]])
  return { reels, assets }
}

async function targeted({ reels, assets }) {
  log.mode = 'targeted'
  for (const [url, dest] of assets) {
    if (!dest.startsWith('public/') || dest.includes('..')) { log.downloads.failed.push({ url, error: 'destination must be inside public/' }); continue }
    mkdirSync(dirname(dest), { recursive: true })
    await download(url, dest)
  }
  if (reels.length) {
    const rows = await collect('selected-reels', DS.reels, reels.map((c) => ({ url: `https://www.instagram.com/reel/${c}/` })))
    const man = JSON.parse(readFileSync(`${C}/manifest.json`, 'utf8'))
    for (const r of rows) {
      const code = shortcode(r)
      if (!code || !r.video_url) continue
      const raw = tmp(`${code}.mp4`)
      if (!(await download(r.video_url, raw))) continue
      try {
        const meta = processVideo(raw, code, true)
        const entry = {
          code, hero: HERO_REELS.includes(code), hq: true, webm: true, url: `https://www.instagram.com/reel/${code}/`,
          src: `/media/ig/reels/${code}.mp4`, poster: `/media/ig/reels/${code}.jpg`, ...meta, bytes: size(`${M}/reels/${code}.mp4`),
          ...pick(r, ['description', 'hashtags', 'date_posted', 'likes', 'views', 'video_play_count', 'num_comments', 'length']),
        }
        const k = man.reels.findIndex((x) => x.code === code)
        if (k >= 0) man.reels[k] = { ...man.reels[k], ...entry }; else man.reels.push(entry)
      } catch (e) { log.downloads.failed.push({ code, error: 'ffmpeg: ' + String(e.message).slice(0, 200) }) }
      rmSync(raw, { force: true })
    }
    man.updated = new Date().toISOString()
    writeFileSync(`${C}/manifest.json`, JSON.stringify(man, null, 2) + '\n')
  }
  log.finished = new Date().toISOString()
  log.summary = { reels_requested: reels, assets: assets.map(([, d]) => d) }
  saveLog()
  console.log(JSON.stringify(log.summary), '\nBright Data records billed:', log.records_billed)
}

async function main() {
  const plan = readPlan()
  if (plan.reels.length || plan.assets.length) return targeted(plan)

  // Profile, the hero reels by URL, then discovery of recent reels and posts — all in parallel.
  const [profiles, heroReels, reels, posts] = await Promise.all([
    collect('profile', DS.profiles, [{ url: PROFILE }]),
    HERO_REELS.length ? collect('hero-reels', DS.reels, HERO_REELS.map((c) => ({ url: `https://www.instagram.com/reel/${c}/` }))) : Promise.resolve([]),
    collect('reels', DS.reels, [{ url: PROFILE, num_of_posts: NUM_REELS }], '&type=discover_new&discover_by=url_all_reels'),
    collect('posts', DS.posts, [{ url: PROFILE, num_of_posts: NUM_POSTS }], '&type=discover_new&discover_by=url'),
  ])

  const manifest = { source: PROFILE, fetched: new Date().toISOString(), profile: null, hero: HERO_REELS, reels: [], posts: [], highlights: [] }

  const p = profiles[0]
  if (p) {
    manifest.profile = pick(p, ['account', 'full_name', 'biography', 'followers', 'following', 'posts_count', 'external_url', 'category_name', 'is_verified'])
    if (p.profile_image_link && (await download(p.profile_image_link, tmp('avatar')))) {
      processImage(tmp('avatar'), `${M}/avatar.webp`); manifest.profile.avatar = '/media/ig/avatar.webp'
    }
    // Highlights: shape varies; keep whatever cover/media URLs come back.
    const hl = Array.isArray(p.highlights) ? p.highlights : []
    let i = 0
    for (const h of hl) {
      i++
      const entry = { title: h.title || h.highlight_title || `Highlight ${i}`, raw_id: h.id || h.highlight_id, cover: null, items: [] }
      const cover = h.image || h.cover_image || h.highlight_cover || h.thumbnail
      if (cover && (await download(cover, tmp(`hl${i}`)))) { processImage(tmp(`hl${i}`), `${M}/highlights/h${i}-cover.webp`); entry.cover = `/media/ig/highlights/h${i}-cover.webp` }
      manifest.highlights.push(entry)
    }
  }

  // Reels — hero reels first, de-duplicated by shortcode.
  const seen = new Set()
  for (const r of [...heroReels, ...reels]) {
    const code = shortcode(r)
    if (!code || seen.has(code) || !r.video_url) continue
    seen.add(code)
    const raw = tmp(`${code}.mp4`)
    if (!(await download(r.video_url, raw))) continue
    const hero = HERO_REELS.includes(code)
    if (hero) execFileSync('cp', [raw, `${C}/originals/${code}.mp4`])
    try {
      const meta = processVideo(raw, code)
      manifest.reels.push({
        code, hero, url: `https://www.instagram.com/reel/${code}/`,
        src: `/media/ig/reels/${code}.mp4`, poster: `/media/ig/reels/${code}.jpg`, ...meta,
        bytes: size(`${M}/reels/${code}.mp4`),
        ...pick(r, ['description', 'hashtags', 'date_posted', 'likes', 'views', 'video_play_count', 'num_comments', 'length']),
      })
    } catch (e) { log.downloads.failed.push({ code, error: 'ffmpeg: ' + String(e.message).slice(0, 200) }) }
    rmSync(raw, { force: true })
  }

  // Posts — photos and carousels. Video posts already arrive through the reels pass.
  for (const x of posts) {
    const code = shortcode(x)
    if (!code || seen.has(code)) continue
    seen.add(code)
    const imgs = (Array.isArray(x.photos) && x.photos.length ? x.photos : [x.thumbnail || x.display_url || x.image_url]).filter(Boolean)
    const files = []
    for (let i = 0; i < imgs.length && i < 10; i++) {
      const name = imgs.length > 1 ? `${code}-${i + 1}.webp` : `${code}.webp`
      if (!(await download(imgs[i], tmp(name + '.src')))) continue
      try { files.push({ src: `/media/ig/posts/${name}`, ...processImage(tmp(name + '.src'), `${M}/posts/${name}`) }) } catch (e) { log.downloads.failed.push({ code, file: name, error: 'ffmpeg: ' + String(e.message).slice(0, 200) }) }
      rmSync(tmp(name + '.src'), { force: true })
    }
    if (!files.length) continue
    manifest.posts.push({
      code, url: `https://www.instagram.com/p/${code}/`, type: x.content_type || (files.length > 1 ? 'carousel' : 'photo'), images: files,
      ...pick(x, ['description', 'hashtags', 'date_posted', 'likes', 'num_comments']),
    })
  }

  manifest.reels.sort((a, b) => (b.hero - a.hero) || String(b.date_posted).localeCompare(String(a.date_posted)))
  manifest.posts.sort((a, b) => String(b.date_posted).localeCompare(String(a.date_posted)))
  writeFileSync(`${C}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n')

  log.finished = new Date().toISOString()
  log.summary = { reels: manifest.reels.length, posts: manifest.posts.length, highlights: manifest.highlights.length, hero_found: manifest.reels.filter((r) => r.hero).map((r) => r.code) }
  saveLog()
  console.log(JSON.stringify(log.summary, null, 2), '\nBright Data records billed:', log.records_billed)
}

main().catch((e) => { log.fatal = String(e.stack || e); saveLog(); console.error(e); process.exit(1) })
