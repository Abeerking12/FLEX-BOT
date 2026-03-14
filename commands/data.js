const axios = require("axios")

module.exports = async ({ sock, from, msg, config, body, send }) => {

  const args = body.split(" ").slice(1)
  const query = args[0]

  if (!query) {
    return send({
      text: `
🚨 *CYBER TERMINAL ERROR*

Input required.

Example:
.data 03001234567
.data 35101xxxxxxxxx
`
    })
  }

  await sock.sendMessage(
    from,
    {
      text: `
📡 > *CYBER TERMINAL*

🔍 Scanning database for:
*${query}*

⏳ Establishing secure connection...
`
    },
    { quoted: msg }
  )

  try {

    const api = await axios.get(
      `https://simon.f-a-k.workers.dev/?q=${encodeURIComponent(query)}`
    )

    const result = api.data

    if (!result.success || !result.data.length) {
      return send({
        text: "❌ No records found in Cyber Database."
      })
    }

    for (let i = 0; i < result.data.length; i++) {

      const data = result.data[i]

      const caption = `
╔═══════════════════╗
   🧬 *FLEX ZONE OFFICIAL*
╚═══════════════════╝

👤 *NAME:* ${data.name || "UNKNOWN"}
📞 *NUMBER:* ${data.number || "N/A"}
🆔 *CNIC:* ${data.cnic || "N/A"}
🏠 *ADDRESS:* ${data.address || "N/A"}

🛡️ *STATUS:* RECORD FOUND
📡 *SOURCE:* THELEVEL8

══════════════════
🤖 SYSTEM: FLEX ZONE
${config.footer}
`.trim()

      await sock.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/dwvYSqbK/1000472110.jpg"
          },
          caption,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: config.channelJid,
              newsletterName: config.botName
            },
            externalAdReply: {
              title: "PRO DATABASE TERMINAL",
              body: "Powered by Thelevel8",
              thumbnailUrl: "https://i.ibb.co/dwvYSqbK/1000472110.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: msg }
      )

    }

  } catch (err) {

    console.error(err)

    await send({
      text: `
❌ *CYBER DATABASE ERROR*

Connection to mainframe failed.
Please try again later.
`
    })

  }

}