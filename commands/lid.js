module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Detect user ID
    const userId =
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      msg.message?.extendedTextMessage?.contextInfo?.remoteJid ||
      from;

    // Check if LID
    const isLid = userId.endsWith("@lid");

    // Message text
    const caption = `
╭━━━〔 🆔 IDENTITY DETECTOR 〕━━━╮

🆔 *ID:* ${userId}

🏷️ *Type:* ${isLid ? "LID (Linked Identity)" : "Standard JID"}

━━━━━━━━━━━━━━
🔗 *Official Channel*
https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l

🤖 *Bot:* ${config.botName}
${config.footer}
`.trim();

    await sock.sendMessage(
      from,
      {
        image: {
          url: "https://i.ibb.co/d0zRsfTk/identity.jpg"
        },
        caption,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          },

          externalAdReply: {
            title: "IDENTITY DETECTOR SYSTEM",
            body: "Check WhatsApp LID / JID",
            mediaType: 1,
            thumbnailUrl: "https://i.ibb.co/d0zRsfTk/identity.jpg",
            sourceUrl: "https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l",
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error(err);

    await send({
      text: "❌ Error: Could not fetch LID details."
    });

  }

};