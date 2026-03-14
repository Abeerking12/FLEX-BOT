module.exports = async ({ sock, from, msg, config, body, send }) => {

  try {

    // Get numbers from command
    const args = body.split(" ").slice(1);

    // Check if numbers provided
    if (args.length < 2) {
      return send({
        text: `
⚠️ *Missing Values!*

Usage: \`.plus [number1] [number2]\`

Example: \`.plus 7 3\`
`
      });
    }

    // Parse numbers
    const num1 = parseFloat(args[0]);
    const num2 = parseFloat(args[1]);

    // Validate numbers
    if (isNaN(num1) || isNaN(num2)) {
      return send({
        text: "❌ *Invalid Input:* Please provide valid numbers only."
      });
    }

    // Calculate result
    const result = num1 + num2;

    // Message output
    const message = `
────────────
➕ *PROFESSOR CALCULATOR*
────────────

🔢 *Value A:* ${num1}
🔢 *Value B:* ${num2}

📊 *Total Result:* ${num1} + ${num2} = ${result}

────────────
${config.footer}
`.trim();

    // Send message
    await sock.sendMessage(
      from,
      {
        text: message,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          },

          externalAdReply: {
            title: "PROFESSOR MATHEMATICS CALCULATOR",
            body: `Calculation: ${num1} + ${num2} = ${result}`,
            thumbnailUrl: config.imageUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
          }
        }

      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Plus Command Error:", err);

    await send({
      text: "❌ Error: Calculation failed."
    });

  }

};