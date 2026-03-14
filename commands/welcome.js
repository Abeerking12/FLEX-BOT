module.exports = async ({ sock, from, participants, action, config }) => {

  try {

    // only groups
    if (!from.endsWith("@g.us")) return

    const metadata = await sock.groupMetadata(from)
    const groupName = metadata.subject
    const memberCount = metadata.participants.length

    // new member joined
    if (action === "add") {

      for (const user of participants) {

        const username = user.split("@")[0]

        const welcomeText = `
╭───〔 👋 WELCOME 〕───╮

👤 *User:* @${username}

🏷️ *Group:* ${groupName}

📊 *Members:* ${memberCount}

📜 Please read the group rules
and respect all members.

Enjoy your stay ✨

╰───────────────╯

${config.footer}
`.trim()

        await sock.sendMessage(
          from,
          {
            image: { url: config.imageUrl },
            caption: welcomeText,
            mentions: [user],
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.channelJid,
                newsletterName: config.botName
              },
              externalAdReply: {
                title: config.botName,
                body: `Welcome ${username} to ${groupName}`,
                thumbnailUrl: config.imageUrl,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }
        )

      }

    }

  } catch (error) {

    console.error("Welcome Handler Error:", error)

  }

}