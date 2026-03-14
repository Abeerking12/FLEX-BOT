module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Toggle auto seen
    global.autoSeen = !global.autoSeen;

    const status = global.autoSeen
      ? "Enabled ✅"
      : "Disabled ❌";

    const caption = `
👁️ *AUTOMATIC SEEN SYSTEM*

╭━━━〔 *BOT SETTINGS* 〕━━━⬣
┃ ⚙️ *Feature:* Auto Seen
┃ 📩 *Target:* Messages & Status
┃ 📊 *Status:* ${status}
╰━━━━━━━━━━━━━━━━⬣

🤖 *System:* ${config.botName}
${config.footer}
`;

    await send({
      image: { url: config.imageUrl },
      caption,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999
      }
    });

  } catch (error) {

    console.error("AutoSeen Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to toggle Auto Seen system.

Please try again later.
`
    });

  }

};