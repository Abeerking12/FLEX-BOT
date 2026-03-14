const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")
const { writeExifVid } = require("../lib/exif")

module.exports = async ({ sock, from, msg, config, body, send }) => {

  const text = body.split(" ").slice(1).join(" ")

  if (!text) {
    return send({
      text: `⚠️ Input Missing!

Usage:
.cute Your Text

Example:
.cute Hello`
    })
  }

  await send({ text: "✨ Creating your cute sticker..." })

  try {

    const videoBuffer = await renderVideo(text)

    const stickerPath = await writeExifVid(videoBuffer, {
      packname: "Thelevel8",
      author: "Cute Sticker"
    })

    const sticker = fs.readFileSync(stickerPath)
    fs.unlinkSync(stickerPath)

    await sock.sendMessage(
      from,
      { sticker },
      { quoted: msg }
    )

  } catch (err) {

    console.error(err)

    await send({
      text: "❌ Failed to create sticker. Ensure FFmpeg is installed."
    })

  }

}

function renderVideo(text) {

  return new Promise((resolve, reject) => {

    const font =
      process.platform === "win32"
        ? "C:/Windows/Fonts/arialbd.ttf"
        : "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

    const draw = `drawtext=fontfile='${font}':text='${text}':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2`

    const args = [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=black:s=512x512:d=2",
      "-vf",
      draw,
      "-pix_fmt",
      "yuva420p",
      "-f",
      "webp",
      "pipe:1"
    ]

    const ff = spawn("ffmpeg", args)

    const buffers = []
    const errors = []

    ff.stdout.on("data", d => buffers.push(d))
    ff.stderr.on("data", d => errors.push(d))

    ff.on("close", code => {

      if (code !== 0) {
        return reject(new Error(Buffer.concat(errors).toString()))
      }

      resolve(Buffer.concat(buffers))
    })

  })

}