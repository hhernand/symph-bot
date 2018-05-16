const Discord = require('discord.js');
const bot = new Discord.Client();
const mysql = require('mysql');

const db = require('require-dir-all')('./commands/db');

var con;
if(process.env.JAWSDB_URL) {
    con = mysql.createConnection(process.env.JAWSDB_URL);
};

let res = '';

bot.on('message', (message) => {
  // registry and member commands

  if (message.content.startsWith('!add') && message.channel.id == '446074832837410826') {
    db.member.addMember(message, con);
  }

  if (message.content == '!myInfo') {
    db.member.myInfo(message, Discord, con);
  }

  if (message.content.startsWith('!giveItem ')) {
    db.items.giveItem(message, con);
  }

  if (message.content.startsWith('!giveMarbles ')) {
    db.marbles.giveMarbles(message, con);
  }

  // shop

  if (message.channel.id == '446075264791740432') {
    if (message.content == '!shop') {
      db.marbles.shopList(message, Discord, con);
    }

    if (message.content.startsWith('!buy ')) {
      db.marbles.buy(message, con);
    }
  }

  // mod commands

  if (message.member.roles.has('445676592979509258')) {
    if (message.content.startsWith('!rewardMarbles ')) {
      db.marbles.rewardMarbles(message, con);
    }
  }
});

bot.login(process.env.BOT_TOKEN);
