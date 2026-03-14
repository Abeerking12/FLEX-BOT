const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason,
downloadMediaMessage,
Browsers
} = require("@whiskeysockets/baileys")

const fs = require("fs")
const path = require("path")
const P = require("pino")

const config = require("./config")

global.public = true
global.autoSeen = true
global.autoReact = false
global.tempOwner = null

const commandsDir = "./commands"

async function startBot(){

const {state, saveCreds} = await useMultiFileAuthState("auth")
const {version} = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: P({ level:"silent" }),
browser: Browsers.ubuntu("FLEX-ZONE BOT")
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update",(update)=>{
const {connection,lastDisconnect}=update

if(connection==="open"){
console.log("✅ BOT CONNECTED")
}

if(connection==="close"){
const reason = lastDisconnect?.error?.output?.statusCode

if(reason !== DisconnectReason.loggedOut){
startBot()
}
}
})

sock.ev.on("messages.upsert", async ({messages})=>{

const msg = messages[0]
if(!msg.message) return

const from = msg.key.remoteJid
const sender = msg.key.participant || from

let text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
msg.message.imageMessage?.caption ||
msg.message.videoMessage?.caption ||
""

if(global.autoSeen){
await sock.readMessages([msg.key])
}

if(global.autoReact){
const emojis=["🔥","💯","😎","⚡","📌"]
await sock.sendMessage(from,{
react:{
text:emojis[Math.floor(Math.random()*emojis.length)],
key:msg.key
}
})
}

const prefix="."

if(!text.startsWith(prefix)) return

const args=text.slice(1).trim().split(/ +/)
const command=args.shift().toLowerCase()

const cmdPath = path.join(commandsDir, command+".js")

if(fs.existsSync(cmdPath)){

const handler = require(cmdPath)

await handler({
sock,
from,
msg,
config,
body:text,
args,
send: async(content)=>{
return sock.sendMessage(from,{
...content,
contextInfo:{
isForwarded:true,
forwardingScore:999,
forwardedNewsletterMessageInfo:{
newsletterJid:config.channelJid,
newsletterName:config.botName
}
}
},{quoted:msg})
}
})

}

})

}

startBot()