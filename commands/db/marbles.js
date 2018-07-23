const async = require('async');
const access = require('../../utils/access.js');

module.exports = {
  rewardMarbles: function(msg, con) {
    let data = msg.content.split(" ");
    let user = data[1];
    let add = Number(data[2]);

    let sql = 'SELECT * FROM member WHERE name = "' + user + '"';

    con.query(sql, (err, rows) => {
      let total = rows[0].marbles + add;
      sql = 'UPDATE member SET marbles = ' + total + ' WHERE name = "' + user + '"';
      con.query(sql);
      msg.channel.send(user + ' has been rewarded ' + add + ' marbles.');
    });
  },

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

  grantMarbles: function(id, num, con) {
    let sql = 'SELECT * FROM member WHERE memberID = "' + id + '"';

    con.query(sql, (err, rows) => {
      let total = rows[0].marbles + num;
      sql = 'UPDATE member SET marbles = ' + total + ' WHERE memberID = "' + id + '"';
      con.query(sql);
    });
  },

  buy: function(msg, con) {
    let buyerID = msg.author.id;
    let want = Number(msg.content.split(' ')[1]);
    if (!isNaN(want) && want > 0) {
      let item = msg.content.split('\"')[1];

      let sql = 'SELECT * FROM item WHERE name = "' + item + '"';
      let res = '';

      con.query(sql, (err, items) => {
        if (err) throw err;
        else if (items.length == 0) msg.channel.send('That item is not in the shop!');
        else {
          let price = items[0].cost;
          if (price != 0) {
            access.memberByID(buyerID, con, function(buyer) {
              let num = buyer[0].marbles;
              if ((price*want) > num) {
                // not enough marbles
                res = "Nice try, but you don't have enough marbles!";
              }
              else {
                let newTotal = num - (price*want);
                let updateMarbles = 'UPDATE member SET marbles = ' + newTotal + ' WHERE memberID = "' + buyerID + '"';
                con.query(updateMarbles);

                let alreadyHave = 'SELECT * FROM owns WHERE memberID = "' + buyerID + '" AND itemID = ' + items[0].itemID;

                con.query(alreadyHave, (err2, owns) => {
                  if (err2) throw err2;
                  else if (owns.length == 1) {
                    let newItem = owns[0].quantity + want;
                    let updateItem = 'UPDATE owns SET quantity = ' + newItem + ' WHERE memberID = "' + buyerID + '" AND itemID = ' + items[0].itemID;
                    con.query(updateItem);
                  }
                  else {
                    let newEntry = 'INSERT INTO owns VALUES("' + buyerID + '", ' + items[0].itemID + ', ' + want + ')';
                    con.query(newEntry);
                  }
                });
                res = "Purchased! Be sure to use !myInfo to check if you got your items."
              }
              msg.channel.send(res);
            });
          }
        }
      });
    }
  },

  shopList: function(msg, ds, con) {
    var common = '';
    var uncommon = '';
    var rare = '';
    var mutation = '';
    var salts = '';
    var soaps = '';
    var trash = '';
    let iName = '';
    let iPrice = 0;
    access.shop(con, function(items) {
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
        .setFooter('To purchase an item, type !buy 1 "item". You can set the quantity.')
        .setColor('AQUA')
        .addField('Common - 10', common, true)
        .addField('Uncommon - 30', uncommon, true)
        .addField('Rare - 50', rare, true)
        .addField('Radioactive - 150', mutation, true)
        .addField('Salts', salts, true)
        .addField('Soaps', soaps, true)
        .addField('"Trash"', trash, true)

      msg.channel.send(embed);
    })
  }
}
