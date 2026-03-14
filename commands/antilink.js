module.exports = async ({ sock, from, msg, config, send }) => {

  // sirf groups ke liye
  if (!from.endsWith("@g.us")) {
    return await send({
      text: "❌ This command is for groups only."
    });
  }

  // global storage
  global.antilink = global.antilink || {};

  // toggle system
  global.antilink[from] = !global.antilink[from];

  const status = global.antilink[from]
    ? "Enabled ✅"
    : "Disabled ❌";

  await send({
    image: { url: config.imageUrl },
    caption: `
*ANTI-LINK SYSTEM*

Status: ${status}

Action: Auto-Delete All Links

${config.footer}
`.trim(),
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999
    }
  });

};