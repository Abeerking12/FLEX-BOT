module.exports = async ({ sock, from, msg, config, body, send }) => {

  try {

    // Get numbers from command
    const args = body.split(" ").slice(1);

    // Check if numbers provided
    if (args.length < 2) {
      return await send({
        text: `
⚠️ *Missing Values!*

Please provide valid numbers.

Usage: \`.multiply [number1] [number2]\`

Example: \`.multiply 5 4\`
`.trim()
      });
    }

    const num1 = parseFloat(args[0]);
    const num2 = parseFloat(args[1]);

    // Validate numbers
    if (isNaN(num1) || isNaN(num2)) {
      return await send({
        text: "❌ *Invalid Input:* Please provide numbers only."
      });
    }

    // Multiply numbers
    const result = num1 * num2;

    const text = `
✖️ *PROFESSOR CALCULATOR*
────────────

🔢 *Value A:* ${num1}
🔢 *Value B:* ${num2}

📊 *Total Result:* ${result}

────────────
${config.footer}
`.trim();

    await sock.sendMessage(
      from,
      {
        text,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          },

          externalAdReply: {
            title: "PROFESSOR CALCULATOR",
            body: `Calculation: ${num1} × ${num2} = ${result}`,
            thumbnailUrl: config.imageUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
          }
        }

      },
      { quoted: msg }
    );

  } catch (error) {

    console.error("Multiply Command Error:", error);

    await send({
      text: "❌ Error performing multiplication."
    });

  }

};