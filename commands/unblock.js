module.exports = async ({ sock, from, msg, config, send, body }) => {

  try {

    const sender = msg.key.participant || msg.key.remoteJid;

    // owner check
    const isOwner =
      sender.includes(config.pairingNum) ||
      sender.includes(global.tempOwner);

    if (!isOwner) {
      return send({
        text: "❌ *Permission Denied*\nOnly the Bot Owner can use this command."
      });
    }

    let target;

    // reply detection
    const quoted = msg.message?.extendedTextMessage?.contextInfo;

    if (quoted?.mentionedJid?.[0]) {
      target = quoted.mentionedJid[0];
    }

    // number input
    else if (body.split(" ")[1]) {
      const number = body.split(" ")[1].replace(/[^0-9]/g, "");
      target = number + "@s.whatsapp.net";
    }

    // quoted participant
    else if (quoted?.participant) {
      target = quoted.participant;
    }

    if (!target) {
      return send({
        text: "❌ Please tag a user or provide a number."
      });
    }

    // unblock user
    await sock.updateBlockStatus(target, "unblock");

    const caption = `
✅ *USER UNBLOCKED*

🎯 Target: @${target.split("@")[0]}

The user has been successfully unblocked.

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
        mentions: [target],
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "JOIN OUR OFFICIAL CHANNEL",
            body: "Latest WhatsApp Bot Updates",
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
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

    console.error("Unblock Error:", err);

    await send({
      text: "❌ Failed to unblock user."
    });

  }

};