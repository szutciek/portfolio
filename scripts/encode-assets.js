import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs/promises'

const IMAGES = await glob('public/**/*.png')
const VIDEOS = await glob('public/**/*.webm')

// ─── Images ────────────────────────────────────────────────────────────────

async function encodeImage(src) {
  const dir = path.dirname(src)
  const name = path.basename(src, '.png')

  // Default (compressed, max 1280px wide)
  await sharp(src)
    .resize({ width: 1280, withoutEnlargement: true })
    .avif({ quality: 60 })
    .toFile(`${dir}/${name}.avif`)

  // Fullscreen variant (max 2560px wide, higher quality)
  await sharp(src)
    .resize({ width: 2560, withoutEnlargement: true })
    .avif({ quality: 75 })
    .toFile(`${dir}/${name}-full.avif`)

  console.log(`✔ image  ${src}`)
}

// ─── Videos ────────────────────────────────────────────────────────────────

function encodeVideo(src) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(src)
    const name = path.basename(src, '.webm')

    // Default – 720p, aggressive compression
    ffmpeg(src)
      .videoCodec('libvpx-vp9')
      .size('1280x?') // scale width, keep aspect
      .outputOptions(['-crf 40', '-b:v 0', '-an'])
      .save(`${dir}/${name}-compressed.webm`)
      .on('end', () => {
        // Fullscreen – 1080p, lighter compression
        ffmpeg(src)
          .videoCodec('libvpx-vp9')
          .size('1920x?')
          .outputOptions(['-crf 30', '-b:v 0', '-an'])
          .save(`${dir}/${name}-full.webm`)
          .on('end', () => {
            console.log(`✔ video  ${src}`)
            resolve()
          })
          .on('error', reject)
      })
      .on('error', reject)
  })
}

// ─── Run ───────────────────────────────────────────────────────────────────

await Promise.all(IMAGES.map(encodeImage))
for (const v of VIDEOS) await encodeVideo(v) // ffmpeg is CPU-bound, run serially

console.log('✅ All assets encoded.')
