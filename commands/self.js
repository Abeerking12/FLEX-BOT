module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Toggle self mode
    global.selfMode = !global.selfMode;

    const status = global.selfMode ? "Enabled ✅" : "Disabled ❌";

    const caption = `
🛡️ *SELF MODE CONTROL PANEL*

╭━━━〔 *BOT SECURITY* 〕━━━⬣
┃ 🔐 *Mode:* Self Mode
┃ ⚡ *Status:* ${status}
┃ 👑 *Access:* Owner Only
╰━━━━━━━━━━━━━━━━⬣

📌 *Description*
When enabled, the bot will respond only to the owner.

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

    console.error("Self Mode Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to toggle Self Mode.

Please try again later.
`
    });

  }

};