module.exports = async ({ sock, from, msg, config, body, send }) => {

  try {

    // Split command arguments
    const args = body.split(" ").slice(1);

    // Check if numbers provided
    if (args.length < 2) {
      return await send({
        text: `⚠️ *Missing Values!*

Usage: \`.minus [number1] [number2]\`

Example:
.minus 10 5`
      });
    }

    // Convert to numbers
    const num1 = parseFloat(args[0]);
    const num2 = parseFloat(args[1]);

    // Validate numbers
    if (isNaN(num1) || isNaN(num2)) {
      return await send({
        text: `❌ *Invalid numbers only.*
Please provide valid numbers.`
      });
    }

    // Perform subtraction
    const result = num1 - num2;

    // Message output
    const caption = `
────────────
FLEX CALCULATOR
────────────

📊 *Calculation*

🔢 *Value A:* ${num1}
🔢 *Value B:* ${num2}

➖ *Result:* ${num1} - ${num2} = ${result}

────────────
${config.footer}
`.trim();

    // Send message
    await sock.sendMessage(
      from,
      {
        text: caption,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          },

          externalAdReply: {
            title: "PROFESSOR MATHEMATICS",
            body: `Calculation: ${num1} - ${num2} = ${result}`,
            thumbnailUrl: config.imageUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Minus Command Error:", err);

  }

};