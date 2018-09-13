const async = require('async');
const access = require('../../utils/access.js');
const helper = require('../../utils/helper.js');

module.exports = {
  giveMarbles: function(msg, con) {
    let giverID = msg.author.id;
    access.memberByID(giverID, con, function(g) {
      if (g.length == 0) {
        msg.channel.send('You\'re not a member yet! You can\'t give anything!');
      } else {
        let receiver = msg.content.split(" ")[1];
        access.memberByName(receiver, con, function(r) {
          if (r.length == 0) {
            msg.channel.send('That member does not exist!');
          } else {
            if (!isNaN(msg.content.split(" ")[2])) {
              let amount = Number(msg.content.split(" ")[2]);
              if (g[0].marbles < amount) {
                msg.channel.send('You don\'t have enough marbles to give!');
              } else {
                let sql = 'UPDATE member SET marbles = ' + (g[0].marbles - amount) + ' WHERE memberID = "' + giverID + '"';
                let sql2 = 'UPDATE member SET marbles = ' + (r[0].marbles + amount) + ' WHERE memberID = "' + r[0].memberID + '"';
                con.query(sql);
                con.query(sql2);
                msg.channel.send('You gave ' + amount + ' marbles to ' + receiver + '!');
              }
            }
          }
        });
      }
    });
  },

  buy: function(msg, con) {
    let buyerID = msg.author.id;
    let want = Number(msg.content.split(' ')[1]);
    if (!isNaN(want) && want > 0) {
      let item = helper.extractItem(msg.content);

      access.itemByName(item, con, function(items) {
        if (items.length == 0) msg.channel.send('That item is not in the shop!');
        else {
          let price = items[0].cost;
          if (price != 0) {
            access.memberByID(buyerID, con, function(buyer) {
              let num = 0;
              let curr = '';

              if (items[0].type == 'halloween') {
                num = buyer[0].candies;
                curr = 'candies!';
              }
              else {
                num = buyer[0].marbles;
                curr = 'marbles!'
              }

              if ((price*want) > num) {
                // not enough marbles
                res = "Nice try, but you don't have enough " + curr;
              }
              else {
                if (curr = 'candies!') helper.grantCandies(buyerID, -Math.abs(price*want), con);
                else helper.grantMarbles(buyerID, -Math.abs(price*want), con);

                helper.grantItem(buyerID, items[0].itemID, want, con);

                res = "You bought " + want + " " + item + " for " + (price*want) + " marbles! Be sure to use !myInfo to check if you got your items."
              }
              msg.channel.send(res);
            });
          }
        }
      });
    }
  },

  sell: function(msg, con) {
    let num = Number(msg.content.split(' ')[1]);
    if (!isNaN(num) && num > 0) {
      let memID = msg.author.id;
      access.memberByID(memID, con, function(member) {
        if (member.length == 1) {
          let current = member[0].marbles;
          let item = helper.extractItem(msg.content);
          access.itemByName(item, con, function(res) {
            if (res.length == 1) {
              let iID = res[0].itemID;
              let gain = Math.ceil(res[0].cost / 3);
              access.ownsSpecific(memID, iID, con, function(res2) {
                if (res2.length == 1) {
                  helper.loseItem(memID, iID, con);
                  let sql = 'UPDATE member SET marbles = ' + (current + gain) + ' WHERE memberID = "' + memID + '"';
                  con.query(sql);
                  let end = 'You sold ' + num + ' ' + item + ' for ' + gain + ' marbles!';
                  msg.channel.send(end);
                }
              });
            }
          });
        }
      });
    }
  },

  shopList: function(msg, ds, con) {
    if (msg.content.split(' ')[1] == 'halloween') {
      msg.channel.send('spooks');
    }
    else {
      var common = '';
      var uncommon = '';
      var rare = '';
      var mutation = '';
      var salts = '';
      var soaps = '';
      var trash = '';
      let iName = '';
      let iPrice = 0;
      access.shop('general' , con, function(items) {
        for (let i = 0; i < items.length; i++) {
          iName = items[i].name;
          iPrice = items[i].cost;
          if (iName.includes("Bath Bomb")) {
            if (iPrice == 10) {
              common += iName + '\n';
            }
            else if (iPrice == 30) {
              uncommon += iName + '\n';
            }
            else if (iPrice == 150) {
              mutation += iName + '\n';
            }
            else {
              rare += iName + '\n';
            }
          }
          else if (iName.includes("Salts")) {
            salts += iName + ' - ' + iPrice + '\n';
          }
          else if (iName.includes("Soap")) {
            soaps += iName + ' - ' + iPrice + '\n';
          }
          else {
            trash += iName + ' - ' + iPrice + '\n';
          }
        }
        const embed = new ds.RichEmbed()
          .setTitle('The Bath House')
          .setFooter('To purchase an item, type !buy 1 item. Items can also be sold back to Izzie for 1/3 its original price using !sell 1 item. You can set the quantity.')
          .setColor('AQUA')
          .addField('Common - 10', common, true)
          .addField('Uncommon - 30', uncommon, true)
          .addField('Rare - 50', rare, true)
          .addField('Radioactive - 150', mutation, true)
          .addField('Salts', salts, true)
          .addField('Soaps', soaps, true)
          .addField('MYOs', trash, true)

        msg.channel.send(embed);
      })
    }
  }
}
