module.exports = async ({ sock, from, msg, config, send, body }) => {

  try {

    // Only work in groups
    if (!from.endsWith("@g.us")) return;

    // Get group metadata
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    // Get message text
    const text = body.slice(8).trim();

    if (!text) {
      return await send({
        text: "❌ Please provide a message.\nExample: `.hidetag Hello everyone`"
      });
    }

    // Mention everyone
    const mentions = participants.map(user => user.id);

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },

        caption:
`📢 *FLEX HIDETAG ANNOUNCEMENT!*

${text}

${config.footer}`,

        mentions,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Important Announcement",
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl: "https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l"
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

    console.error(err);

    await send({
      text: "❌ *Error:* Hidetag failed."
    });

  }

};