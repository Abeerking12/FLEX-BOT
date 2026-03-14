module.exports = async ({ send, config }) => {

  const caption = `
╭━━━〔 👑 *OWNER INFORMATION* 〕━━━╮

┃ 👤 *Name:* FLEX ZONE
┃ 📱 *Contact:* wa.me/923400406435
┃ ⚡ *Role:* Bot Developer

┣━━━━━━━━━━━━━━━━━━

┃ 💬 *Discussion Group*
┃ https://t.me/+Q2NKYf3V7Fo2ZmE8

┃ 📢 *Official Channel*
┃ https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s

┣━━━━━━━━━━━━━━━━━━

┃ 🤖 *Bot:* ${config.botName}
┃ ⚙️ *System:* Professional Bot Engine

╰━━━━━━━━━━━━━━━━━━╯

${config.footer}
`.trim();

  await send({
    image: { url: config.imageUrl },
    caption
  });

};