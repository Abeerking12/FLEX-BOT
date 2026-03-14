module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Toggle Auto React
    global.autoReact = !global.autoReact;

    const status = global.autoReact ? "Enabled ✅" : "Disabled ❌";

    const caption = `
⚡ *AUTOMATIC REACTION SYSTEM*

╭━━━〔 *AUTO REACT CONTROL* 〕━━━⬣
┃ 🤖 *Bot:* ${config.botName}
┃ ⚙️ *Feature:* Auto Message Reactions
┃ 📊 *Status:* ${status}
╰━━━━━━━━━━━━━━━━⬣

😊 Bot will now react automatically to messages.

🎭 *Emoji Pool:*
😂 ❤️ 👍 🔥 😎 🎉 💯 👻 ⚡ 🇵🇰

${config.footer}
`;

    await send({
      image: { url: config.imageUrl },
      caption,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,

        externalAdReply: {
          title: config.botName,
          body: "Automatic Reaction System",
          thumbnailUrl: config.imageUrl,
          sourceUrl:
            "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
          mediaType: 1,
          renderLargerThumbnail: true
        },

        forwardedNewsletterMessageInfo: {
          newsletterJid: config.channelJid,
          newsletterName: config.botName
        }
      }

    });

  } catch (error) {

    console.error("Auto React Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to toggle auto reactions.

Please try again later.

🤖 *System:* ${config.botName}
`
    });

  }

};