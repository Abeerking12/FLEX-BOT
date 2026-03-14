module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Extract message info
    const context =
      msg.message?.extendedTextMessage?.contextInfo || {};

    const quoted = context.quotedMessage;
    const mentioned = context.mentionedJid || [];

    // Detect target user
    let targetUser =
      mentioned[0] ||
      context.participant ||
      msg.key.participant ||
      msg.key.remoteJid;

    if (!targetUser) {
      return send({
        text: "❌ Unable to detect user."
      });
    }

    let profilePic;

    try {

      // Fetch profile picture
      profilePic = await sock.profilePictureUrl(targetUser, "image");

    } catch {

      return send({
        text: "❌ This user has no profile picture."
      });

    }

    const caption = `
╭━━━〔 *PROFILE PICTURE CAPTURED* 〕━━━⬣
┃ 👤 *User:* @${targetUser.split("@")[0]}
┃ 🤖 *Bot:* ${config.botName}
╰━━━━━━━━━━━━━━━━⬣

${config.footer}
`.trim();

    await send({
      image: { url: profilePic },
      caption,
      mentions: [targetUser],

      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,

        externalAdReply: {
          title: config.botName,
          body: "WhatsApp Profile Picture Viewer",
          thumbnailUrl: profilePic,
          sourceUrl:
            "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
          mediaType: 1
        },

        forwardedNewsletterMessageInfo: {
          newsletterJid: config.channelJid,
          newsletterName: config.botName
        }
      }

    });

  } catch (error) {

    console.error("PP Command Error:", error);

    await send({
      text: "❌ Failed to fetch profile picture."
    });

  }

};