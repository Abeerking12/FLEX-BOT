module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Check if command used in group
    if (!from.endsWith("@g.us")) {
      return await send({
        text: "❌ This command is only for groups."
      });
    }

    // Get group metadata
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    // Build caption
    let caption = `
👥 *${metadata.subject} MEMBER LIST*

📊 *Total Members:* ${participants.length}

`;

    let mentions = [];

    participants.forEach((user, index) => {
      const number = user.id.split("@")[0];

      caption += `${index + 1}. @${number}\n`;

      mentions.push(user.id);
    });

    caption += `\n${config.footer}`;

    // Send message
    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: caption,
        mentions: mentions,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: `Member directory of ${metadata.subject}`,
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl: "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
          },

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Member List Error:", err);

    await send({
      text: "❌ Error: Failed to fetch member list."
    });

  }

};