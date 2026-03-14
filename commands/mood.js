module.exports = async ({ sock, from, msg, config, send }) => {

  // Helper for global boolean values
  const status = (value) => value ? "✅ ON" : "❌ OFF";

  // Helper for group-based settings
  const groupStatus = (object, jid) =>
    object && object[jid] ? "✅ ON" : "❌ OFF";

  const caption = `
────────────
🛰️ SYSTEM STATUS
────────────

      FLEXZONE-THELEVEL8 MOOD
────────────

• Mode: *${global.mode.toUpperCase()}*

│ • Reacts: ${status(global.autoReact)}
│ • Seen: ${status(global.autoSeen)}

│ • Antilink: ${status(global.antilink)}
│ • Antiforward: ${status(global.antiforward)}

│ • Anticall: ${groupStatus(global.anticall, from)}

└────────────

${config.footer}
`.trim();

  await send({
    image: { url: config.imageUrl },
    caption
  });

};