module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    const quoted = msg?.message?.extendedTextMessage?.contextInfo

    if (!quoted) {
      return send({
        text: `⚠️ Please reply to the message you want to delete.`
      })
    }

    const messageId = quoted.stanzaId
    const participant = quoted.participant
    const remoteJid = from

    await sock.sendMessage(from, {
      delete: {
        remoteJid: remoteJid,
        fromMe: participant === sock.user.id,
        id: messageId,
        participant: participant
      }
    })

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: `
🗑️ *MESSAGE DELETED*

Status: Successfully removed the message.

${config.footer}
`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: config.botName,
            body: "Message Cleanup Successful",
            thumbnailUrl: config.imageUrl,
            sourceUrl: "https://whatsapp.com/channel/0029VaFpx7u",
            mediaType: 1,
            renderLargerThumbnail: true
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    )

  } catch (error) {

    console.error(error)

    await send({
      text: `❌ Error: Failed to delete the message.`
    })

  }

}