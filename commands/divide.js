module.exports = async ({ sock, from, msg, config, body, send }) => {

  const args = body.split(" ").slice(1)

  // check arguments
  if (args.length < 2) {
    return send({
      text: `
⚠️ *Missing Values!*

Usage:
.divide [number1] [number2]

Example:
.divide 10 2
`
    })
  }

  const num1 = parseFloat(args[0])
  const num2 = parseFloat(args[1])

  // check numbers
  if (isNaN(num1) || isNaN(num2)) {
    return send({
      text: "❌ *Invalid Input!* Please provide valid numbers."
    })
  }

  // divide by zero check
  if (num2 === 0) {
    return send({
      text: "🚫 *Math Error:* Division by zero is undefined."
    })
  }

  const result = (num1 / num2).toFixed(2)

  const message = `
────────────
➗ *PROFESSOR MATHEMATICS CALCULATOR*
────────────

🔢 *Value A:* ${num1}
🔢 *Value B:* ${num2}

📊 *Total Result:*
${num1} ÷ ${num2} = *${result}*

────────────
${config.footer}
`.trim()

  await sock.sendMessage(
    from,
    {
      text: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.channelJid,
          newsletterName: config.botName
        },
        externalAdReply: {
          title: "PROFESSOR CALCULATOR",
          body: `${num1} ÷ ${num2} = ${result}`,
          thumbnailUrl: config.imageUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: "https://whatsapp.com/channel/0029VaFpx7u"
        }
      }
    },
    { quoted: msg }
  )

}