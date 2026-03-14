module.exports = async ({ sock, from, msg, config, send }) => {

  // sirf group ke liye
  if (!from.endsWith("@g.us")) {
    return await send({
      text: "❌ This command is for groups only."
    });
  }

  // global antiforward storage
  global.antiforward = global.antiforward || {};

  // toggle system
  global.antiforward[from] = !global.antiforward[from];

  const status = global.antiforward[from]
    ? "Enabled ✅"
    : "Disabled ❌";

  await send({
    image: { url: config.imageUrl },
    caption: `
*ANTI-FORWARD SYSTEM*

Status: ${status}

Action: Auto-Delete Forwarded Media/Text

${config.footer}
`.trim(),
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999
    }
  });

};