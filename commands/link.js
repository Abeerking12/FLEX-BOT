module.exports = async ({ sock, from, msg, config }) => {

  try {

    // Only for groups
    if (!from.endsWith("@g.us")) return;

    const metadata = await sock.groupMetadata(from);

    // Your channel link
    const channelLink = "https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l";

    const caption = `
╭━━━〔 🔗 OFFICIAL CHANNEL LINK 〕━━━╮

🏷️ *Group:* ${metadata.subject}

📢 *Channel:* 
${channelLink}

━━━━━━━━━━━━━━
🤖 *Bot:* ${config.botName}
${config.footer}
`.trim();

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Join Official Channel",
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl: channelLink
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

    console.error("Link Command Error:", err);

    await sock.sendMessage(from, {
      text: "❌ Error: Failed to send channel link."
    }, { quoted: msg });

  }

};