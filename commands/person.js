module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Get quoted user (if reply command used)
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // Target user
    const target =
      quoted?.participant || msg.key.remoteJid;

    // Username fallback
    const username = msg.pushName || "Unknown User";

    // Extract number
    const number = target.split("@")[0];

    let profilePic;

    try {
      // Fetch profile picture
      profilePic = await sock.profilePictureUrl(target, "image");
    } catch (err) {
      return await send({
        text: "❌ DP capture error."
      });
    }

    // Detect chat source
    const source = from.includes("@g.us")
      ? "Group Chat"
      : "Private Chat";

    // Caption message
    const caption = `
༒༒ *DP CAPTURED BY PROFESSOR* ༒༒
────────────
👤 *User:* @${number}
📱 *Number:* ${number}
✨ *Source:* ${source}

🤖 *Bot:* ${config.botName}
────────────
${config.footer}
`.trim();

    // Send DP to owner / pairing number
    await sock.sendMessage(
      config.pairingNumber + "@s.whatsapp.net",
      {
        image: { url: profilePic },
        caption,
        mentions: [target]
      }
    );

    // Confirm command success
    await send({
      text: "✅"
    });

  } catch (err) {

    console.error("Person Command Error:", err);

    await send({
      text: "❌ 𝗘𝗥𝗥𝗢𝗥: Person command failed."
    });

  }

};