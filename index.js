const Discord = require('discord.js');
const bot = new Discord.Client();
const mysql = require('mysql');

const db = require('require-dir-all')('./commands/db');
const other = require('require-dir-all')('./commands/other');

var con;
if(process.env.JAWSDB_URL) {
    con = mysql.createConnection(process.env.JAWSDB_URL);
};

bot.on('message', (message) => {
  let msg = message.content.toLowerCase();

  // registry and member commands

  if (msg.startsWith('!add') && message.channel.id == '446074832837410826') {
    db.member.addMember(message, con);
  }

  if (msg == '!myinfo') {
    db.member.myInfo(message, Discord, con);
  }

  if (msg.startsWith('!giveitem ')) {
    db.items.giveItem(message, con);
  }

  if (msg.startsWith('!givemarbles ')) {
    db.marbles.giveMarbles(message, con);
  }

  if (msg == '!commands') {
    db.commands.cList(message, Discord, con);
  }

  if (msg.startsWith('!commandinfo ')) {
    db.commands.cInfo(message, Discord, con);
  }

  if (msg.startsWith('!roll ')) {
    other.rng.roll(message);
  }

  if (msg.startsWith('!rng ')) {
    other.rng.rng(message);
  }

  if (msg.startsWith('!claim ')) {
    db.member.claim(message, con);
  }

  // shop

  if (message.channel.id == '446075264791740432') {
    if (msg == '!shop') {
      db.marbles.shopList(message, Discord, con);
    }

    if (msg.startsWith('!buy ')) {
      db.marbles.buy(message, con);
    }
  }

  // mod commands

  if (message.channel.id == '445676833917108224') {
    if (msg.startsWith('!rewardmarbles ')) {
      db.marbles.rewardMarbles(message, con);
    }

    if (msg.startsWith('!rewarditem ')) {
      db.member.rewardItem(message, con);
    }

    if (msg.startsWith('!check ')) {
      db.member.checkMember(message, Discord, con);
    }

    if (msg.startsWith('!take ')) {
      db.items.takeItem(message, con);
    }
  }
});

bot.login(process.env.BOT_TOKEN);
