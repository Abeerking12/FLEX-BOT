const os = require("os");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // group check
    if (!from.endsWith("@g.us")) {
      return send({
        text: "❌ This command works only inside groups."
      });
    }

    const metadata = await sock.groupMetadata(from);
    const sender = msg.key.participant || msg.key.remoteJid;

    // admin check
    const participant = metadata.participants.find(p => p.id === sender);
    const bot = metadata.participants.find(p => p.id === sock.user.id);

    const isAdmin = participant?.admin;
    const botAdmin = bot?.admin;

    if (!isAdmin) {
      return send({
        text: "❌ *Permission Denied*\nOnly group admins can use this command."
      });
    }

    if (!botAdmin) {
      return send({
        text: "⚠️ I need *admin rights* to manage group settings."
      });
    }

    // unmute group
    await sock.groupSettingUpdate(from, "not_announcement");

    const caption = `
🔊 *GROUP UNMUTED*

╭───〔 *GROUP STATUS* 〕───
│ 📢 Mode : Open Chat
│ 👥 Members : ${metadata.participants.length}
│ 🏷 Group : ${metadata.subject}
│
│ 💬 All members can now send messages.
╰──────────────

🤖 *Bot:* ${config.botName}
💻 *Platform:* ${os.platform()}

━━━━━━━━━━━━━━━━━━
📢 *OFFICIAL CHANNEL*

🔥 **JOIN FOR BOT UPDATES**

👉 https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s
━━━━━━━━━━━━━━━━━━

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
            title: "JOIN OUR OFFICIAL CHANNEL",
            body: "Latest WhatsApp Bot Updates",
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

    console.error("Unmute Command Error:", err);

    await send({
      text: "❌ Failed to update group settings."
    });

  }

};