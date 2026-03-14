module.exports = async ({ sock, from, msg, config, send }) => {

const user =
msg.message?.extendedTextMessage?.contextInfo?.participant ||
msg.key.remoteJid;

const now = new Date();

const time = now.toLocaleString("en-US",{
timeZone:"Asia/Karachi",
hour:"2-digit",
minute:"2-digit",
hour12:true
});

const day = now.toLocaleString("en-US",{
weekday:"long",
timeZone:"Asia/Karachi"
});

const caption = `
╔════════════════
      FLEX-ZONE V1
╚════════════════

👤 User: @${user.split("@")[0]}
📅 Day: ${day}
⏰ Time: ${time}

━━━━━━━━━━━━━━━━
⚙️ SYSTEM
━━━━━━━━━━━━━━━━
• .ping
• .uptime
• .owner
• .jid
• .qr
• .status

━━━━━━━━━━━━━━━━
🧮 MATH TOOLS
━━━━━━━━━━━━━━━━
• .plus
• .minus
• .multiply
• .divide
• .power

━━━━━━━━━━━━━━━━
👥 GROUP ADMIN
━━━━━━━━━━━━━━━━
• .add
• .kick
• .promote
• .demote
• .tagall
• .hidetag
• .adminlist
• .memberlist
• .setdesc
• .setdp
• .mute
• .unmute

━━━━━━━━━━━━━━━━
🛡 PROTECTION
━━━━━━━━━━━━━━━━
• .antilink
• .antiforward
• .anticall
• .warn
• .warnchack
• .punish
• .punishlist

━━━━━━━━━━━━━━━━
👤 USER TOOLS
━━━━━━━━━━━━━━━━
• .save
• .link
• .dp
• .vv
• .pp
• .person

━━━━━━━━━━━━━━━━
🌐 UTILITIES
━━━━━━━━━━━━━━━━
• .sim
• .ip
• .currency

━━━━━━━━━━━━━━━━
🎭 FUN
━━━━━━━━━━━━━━━━
• .love
• .kiss
• .cute
• .anger
• .good
• .slap
• .dear
• .attitude

━━━━━━━━━━━━━━━━
📂 MEDIA & DATA
━━━━━━━━━━━━━━━━
• .media
• .forward
• .repeat
• .reacts
• .shake
• .fake
• .creation
• .data
• .database

━━━━━━━━━━━━━━━━
👑 OWNER
━━━━━━━━━━━━━━━━
• .block
• .unblock
• .public
• .private
• .self
• .exself
• .release

━━━━━━━━━━━━━━━━
🧹 CLEANUP
━━━━━━━━━━━━━━━━
• .clear
• .deleted
• .nothing

━━━━━━━━━━━━━━━━
${config.footer}
`.trim();

await sock.sendMessage(
from,
{
image:{url:config.imageUrl},
caption,
mentions:[user],

contextInfo:{
isForwarded:true,
forwardingScore:999,

forwardedNewsletterMessageInfo:{
newsletterJid:config.channelJid,
newsletterName:config.botName
},

externalAdReply:{
title:"FLEX-ZONE V1",
body:"Official WhatsApp Channel",
thumbnailUrl:config.imageUrl,
mediaType:1,
renderLargerThumbnail:true,
sourceUrl:"https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l"
}
}
},
{quoted:msg}
);

};