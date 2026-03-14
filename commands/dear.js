const fs = require("fs")
const path = require("path")

module.exports = async ({ sock, from, msg, config }) => {

  try {

    const stickerPath = path.join(process.cwd(), "dear.webp")

    if (!fs.existsSync(stickerPath)) {
      return sock.sendMessage(
        from,
        { text: "❌ Sticker file not found." },
        { quoted: msg }
      )
    }

    const sticker = fs.readFileSync(stickerPath)

    await sock.sendMessage(
      from,
      {
        sticker: sticker,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    )

  } catch (error) {

    console.error("Sticker Error:", error)

    await sock.sendMessage(
      from,
      { text: "❌ Failed to send sticker." },
      { quoted: msg }
    )

  }

}