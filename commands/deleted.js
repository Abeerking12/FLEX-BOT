const fs = require("fs")
const path = require("path")

module.exports = async ({ sock, from, send, config, msg }) => {

  const filePath = "./database/deleted_messages/deleted_log.json"

  try {

    if (!fs.existsSync(filePath)) {
      return send({
        text: "📭 No deleted message log found."
      })
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    if (!data.length) {
      return send({
        text: "📭 No new deleted messages to show."
      })
    }

    await send({
      text: `🚀 *Recovering deleted messages...*`
    })

    for (const item of data) {

      const sender =
        item.sender.includes("@") ? item.sender : item.sender + "@s.whatsapp.net"

      const caption = `
👤 *NAME:* @${sender.split("@")[0]}
📩 *CONTENT:* ${item.text || "Media File"}

${config.footer}
`.trim()

      try {

        if (item.mediaPath && fs.existsSync(item.mediaPath)) {

          const isVideo = item.mediaPath.endsWith(".mp4")

          await sock.sendMessage(
            from,
            {
              [isVideo ? "video" : "image"]: fs.readFileSync(item.mediaPath),
              caption,
              mentions: [sender]
            },
            { quoted: msg }
          )

        } else {

          await sock.sendMessage(
            from,
            {
              image: { url: config.imageUrl },
              caption,
              mentions: [sender]
            },
            { quoted: msg }
          )

        }

      } catch (err) {
        console.error("Error sending message:", err)
      }

      await new Promise(r => setTimeout(r, 1000))

    }

    fs.writeFileSync(filePath, JSON.stringify([], null, 2))

  } catch (error) {

    console.error(error)

    await send({
      text: "❌ Failed to recover deleted messages."
    })

  }

}