module.exports = async ({ send, config, body }) => {

  const args = body.split(" ");
  const option = args[1]?.toLowerCase();

  // ANTICALL ON
  if (option === "on") {

    global.anticall = true;

    await send({
      image: { url: config.imageUrl },
      caption: `
༒༒ *ANTI-CALL ACTIVATED* ༒༒

❌ Calls will now be rejected automatically.

${config.footer}
`.trim()
    });

  }

  // ANTICALL OFF
  else if (option === "off") {

    global.anticall = false;

    await send({
      image: { url: config.imageUrl },
      caption: `
༒༒ *ANTI-CALL DEACTIVATED* ༒༒

✅ Calls received will be answered normally.

${config.footer}
`.trim()
    });

  }

  // agar user galat command use kare
  else {

    await send({
      text: "❗ Please use: *.anticall on* or *.anticall off*"
    });

  }

};