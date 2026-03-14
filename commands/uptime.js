const os = require("os");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    const start = Date.now();

    // uptime
    const uptime = process.uptime();

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // system info
    const platform = os.platform();
    const cpu = os.cpus()[0].model;
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);

    const nodeVersion = process.version;

    const ping = Date.now() - start;

    const caption = `
🛰️ *${config.botName}*

╭───〔 *BOT STATUS* 〕───
│ ⏱ *Uptime*
│ ${days}d ${hours}h ${minutes}m ${seconds}s
│
│ ⚡ *Ping:* ${ping} ms
│
│ 🧠 *CPU*
│ ${cpu}
│
│ 💾 *RAM Usage*
│ ${usedMem}GB / ${totalMem}GB
│
│ 🖥 *Platform*
│ ${platform}
│
│ 🟢 *NodeJS*
│ ${nodeVersion}
╰──────────────

${config.footer}
`.trim();

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Uptime Error:", err);

    await send({
      text: "❌ Failed to fetch bot uptime."
    });

  }

};