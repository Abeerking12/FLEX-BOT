const axios = require("axios")

module.exports = async ({ sock, from, msg, config, body, send }) => {

  const args = body.split(" ").slice(1)
  let number = args[0]

  if (!number) {
    return send({
      text: `
🚨 *SIM DATABASE ERROR*

Usage:
.database 03001234567
.database 3510112345671

Example:
.database 03001234567
`
    })
  }

  await sock.sendMessage(
    from,
    {
      text: `
💉 > *ACCESSING SECURE SIM DATABASE*

Searching for:
*${number}*

⏳ Please wait...
`
    },
    { quoted: msg }
  )

  try {

    const apiUrl = `https://api.nexoracle.com/details/pak-sim-database-free?apikey=free_key&is&q=${number}`

    const response = await axios.get(apiUrl)
    const result = response.data

    if (!result || !result.result) {
      return send({
        text: "❌ *NO RECORDS FOUND*"
      })
    }

    const records = Array.isArray(result.result) ? result.result : [result.result]

    for (let i = 0; i < records.length; i++) {

      const data = records[i]

      const caption = `
┏━━━━━━━⬣ *SIM DATA RECORD* ⬣━━━━━━━┓
┃
┃ 👤 *Identity:* ${data.name || "N/A"}
┃ 📞 *Number:* ${data.number || "N/A"}
┃ 🆔 *CNIC:* ${data.cnic || "N/A"}
┃ 🏠 *Location:* ${data.address || "N/A"}
┃ 📡 *Operator:* ${data.operator || "N/A"}
┃
┃ 📂 *Record:* ${i + 1} of ${records.length}
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

⚡ *POWERED BY THELEVEL8*
🤖 *BOT CREDIT:* FLEX ZONE OFFICIAL
${config.footer}
`.trim()

      await sock.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/d0zRsfTk/1766952170010.jpg"
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
              title: "SIM DATABASE",
              body: "Powered by Thelevel8",
              thumbnailUrl: "https://i.ibb.co/d0zRsfTk/1766952170010.jpg",
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
🚨 *MAINFRAME OFFLINE*

Database API request failed.
Please try again later.
`
    })

  }

}