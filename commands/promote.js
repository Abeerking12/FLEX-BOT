module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Command only for groups
    if (!from.endsWith("@g.us")) {
      return send({
        text: "❌ This command works only in groups."
      });
    }

    // Sender
    const sender =
      msg.message?.extendedTextMessage?.contextInfo?.participant || from;

    // Get group metadata
    const group = await sock.groupMetadata(from);

    // Check admin
    const isAdmin =
      group.participants.find(p => p.id === sender)?.admin || null;

    const isOwner = sender.includes(config.pairingNumber);

    if (!isAdmin && !isOwner) {
      return send({
        text: "❌ Permission Denied. Only admins can use this command."
      });
    }

    // Target user
    let target;

    const mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (mentioned && mentioned[0]) {
      target = mentioned[0];
    } else if (
      msg.message?.extendedTextMessage?.contextInfo?.participant
    ) {
      target =
        msg.message.extendedTextMessage.contextInfo.participant;
    }

    if (!target) {
      return send({
        text: "❌ Please reply to a user or mention someone to promote."
      });
    }

    // Promote user
    await sock.groupParticipantsUpdate(
      from,
      [target],
      "promote"
    );

    // Success message
    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },

        caption: `
✅ *USER PROMOTED*

🎯 Target: @${target.split("@")[0]}

📌 Status: Now Group Admin

${config.footer}
`,

        mentions: [target],

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Group Admin Promotion",
            thumbnailUrl: config.imageUrl,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
            mediaType: 1
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

    console.error("Promote Error:", err);

    await send({
      text: "❌ Error: Promotion failed. Ensure the bot is admin."
    });

  }

};