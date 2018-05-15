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
  if (message.content == 'Hello!') {
    message.channel.send('Hi ' + message.author.username + '!');
  }

  if (message.content.startsWith('!add')) {
    res = db.member.addMember(message, con);
    message.channel.send(res);
  }

  if (message.content.startsWith('!rewardMarbles')) {
    db.marbles.rewardMarbles(message, con);
  }

  if (message.content == '!myInfo') {
    db.member.myInfo(message, Discord, con);
  }

  if (message.content == '!shop') {
    db.marbles.shopList(message, Discord, con);
  }

  if (message.content.startsWith('!buy')) {
    db.marbles.buy(message, con);
  }

  if (message.content.startsWith('!giveItem')) {
    db.items.giveItem(message, con);
  }

  if (message.content.startsWith('!giveMarbles')) {
    db.marbles.giveMarbles(message, con);
  }
});

bot.login(process.env.BOT_TOKEN);
