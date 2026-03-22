import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs/promises'

// ─── Glob ──────────────────────────────────────────────────────────────────

const ALL_IMAGES = await glob('public/**/*.{png,jpg,jpeg,webp}')
const ALL_VIDEOS = await glob('public/**/*.{webm,mp4}')

// Skip anything already produced by this script
const IMAGES = ALL_IMAGES.filter((f) => !/([-_](compressed|full))\.(avif)$/.test(f))
const VIDEOS = ALL_VIDEOS.filter((f) => !/([-_](compressed|full))\.(webm|mp4)$/.test(f))

// ─── Images ────────────────────────────────────────────────────────────────

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function encodeImage(src) {
  const dir = path.dirname(src)
  const ext = path.extname(src) // .png / .jpg / …
  const name = path.basename(src, ext) // strip original extension

  const outDefault = path.join(dir, `${name}.avif`)
  const outFull = path.join(dir, `${name}-full.avif`)

  const needsDefault = !(await exists(outDefault))
  const needsFull = !(await exists(outFull))

  if (!needsDefault && !needsFull) {
    console.log(`⏭  skip   ${src}`)
    return
  }

  if (needsDefault) {
    await sharp(src)
      .resize({ width: 1280, withoutEnlargement: true })
      .avif({ quality: 60 })
      .toFile(outDefault)
  }

  if (needsFull) {
    await sharp(src)
      .resize({ width: 2560, withoutEnlargement: true })
      .avif({ quality: 75 })
      .toFile(outFull)
  }

  console.log(`✔ image  ${src}`)
}

// ─── Videos ────────────────────────────────────────────────────────────────

function encodeVideoVariant(src, { size, crf, output }) {
  return new Promise((resolve, reject) => {
    ffmpeg(src)
      .videoCodec('libvpx-vp9')
      .size(size)
      .outputOptions([`-crf ${crf}`, '-b:v 0', '-an'])
      .save(output)
      .on('end', resolve)
      .on('error', reject)
  })
}

async function encodeVideo(src) {
  const dir = path.dirname(src)
  const ext = path.extname(src) // .webm or .mp4
  const name = path.basename(src, ext)

  // Always output .webm regardless of input format
  const outCompressed = path.join(dir, `${name}-compressed.webm`)
  const outFull = path.join(dir, `${name}-full.webm`)

  const needsCompressed = !(await exists(outCompressed))
  const needsFull = !(await exists(outFull))

  if (!needsCompressed && !needsFull) {
    console.log(`⏭  skip   ${src}`)
    return
  }

  if (needsCompressed) {
    await encodeVideoVariant(src, {
      size: '1280x?',
      crf: 40,
      output: outCompressed,
    })
  }

  if (needsFull) {
    await encodeVideoVariant(src, {
      size: '1920x?',
      crf: 30,
      output: outFull,
    })
  }

  console.log(`✔ video  ${src}`)
}

// ─── Run ───────────────────────────────────────────────────────────────────

await Promise.all(IMAGES.map(encodeImage))
for (const v of VIDEOS) await encodeVideo(v) // ffmpeg is CPU-bound, run serially

console.log('✅ All assets encoded.')
