module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Check if command used in group
    if (!from.endsWith("@g.us")) {
      return await send({
        text: "❌ *This command can only be used in groups.*"
      });
    }

    const sender = msg.key.participant || from;

    // Get group metadata
    const groupData = await sock.groupMetadata(from);

    // Check if sender is admin
    const isAdmin = groupData.participants
      .find(user => user.id === sender)?.admin || null;

    // Check if bot is admin
    const isBotAdmin = sender.includes(config.pairingNumber);

    if (!isAdmin || !isBotAdmin) {
      return await send({
        text: "❌ *Permission Denied: Only Admins can mute the group.*"
      });
    }

    // Mute group
    await sock.groupSettingUpdate(from, "announcement");

    // Send confirmation message
    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },

        caption: `
🔇 *GROUP MUTED*

Status: Closed 🔒

Now only Admins can send messages in this group.

${config.footer}
`.trim(),

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Group Privacy Update",
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

  } catch (error) {

    console.error("Mute Command Error:", error);

    await send({
      text: "❌ *Error: Failed to mute the group.*"
    });

  }

};