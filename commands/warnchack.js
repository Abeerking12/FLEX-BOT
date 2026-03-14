// Global warn database
global.warnDB = global.warnDB || {}

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // only groups
    if (!from.endsWith("@g.us")) {
      return send({ text: "❌ This command can only be used in groups." })
    }

    const metadata = await sock.groupMetadata(from)
    const sender = msg.key.participant || msg.key.remoteJid
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net"

    const isAdmin = metadata.participants.find(p => p.id === sender)?.admin
    const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin

    if (!isAdmin) {
      return send({ text: "❌ Only group admins can use this command." })
    }

    if (!isBotAdmin) {
      return send({ text: "❌ Bot must be admin to manage warnings." })
    }

    // target user
    const target =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      msg.message?.extendedTextMessage?.contextInfo?.participant

    if (!target) {
      return send({
        text: "⚠️ Please mention or reply to a user to warn."
      })
    }

    // warn database
    if (!global.warnDB[from]) global.warnDB[from] = {}

    let warns = global.warnDB[from][target] || 0
    warns++

    global.warnDB[from][target] = warns

    const warnLimit = 3

    const caption = `
╭───〔 ⚠️ WARNING SYSTEM 〕───╮

👤 *User:* @${target.split("@")[0]}
📊 *Warnings:* ${warns}/${warnLimit}

📜 Please follow group rules.

╰──────────────────╯

${config.footer}
`.trim()

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption,
        mentions: [target],
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

    // auto kick if limit reached
    if (warns >= warnLimit) {

      await sock.groupParticipantsUpdate(from, [target], "remove")

      delete global.warnDB[from][target]

      await sock.sendMessage(
        from,
        {
          text: `🚫 @${target.split("@")[0]} removed from the group (warning limit reached).`,
          mentions: [target]
        }
      )

    }

  } catch (error) {

    console.error("Warn Command Error:", error)

    await send({
      text: "❌ Failed to execute warn command."
    })

  }

}