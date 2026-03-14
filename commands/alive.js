module.exports = async ({ send, config }) => {

  const caption = `
༒༒ *ALIVE STATUS* ༒

🤖 *${config.botName}* is Online
🟢 Status: Working Fine

📅 Date: ${new Date().toLocaleDateString()}
⏰ Time: ${new Date().toLocaleTimeString()}

${config.footer}
`;

  await send({
    image: {
      url: config.imageUrl
    },
    caption: caption.trim()
  });

};