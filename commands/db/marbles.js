const async = require('async');
const access = require('../../utils/access.js');

module.exports = {
  rewardMarbles: function(msg, con) {
    let data = msg.split(" ");
    let user = data[1];
    let add = Number(data[2]);

    let sql = 'SELECT * FROM member WHERE name = "' + user + '"';

    con.query(sql, (err, rows) => {
      let total = rows[0].marbles + add;
      sql = 'UPDATE member SET marbles = ' + total + ' WHERE name = "' + user + '"';
      con.query(sql);
    });
  },

  buy: function(msg, con) {
    let buyerID = msg.author.id;
    let item = msg.content.split("buy ")[1];

    let sql = 'SELECT * FROM item WHERE name = "' + item + '"';
    let res = '';

    con.query(sql, (err, items) => {
      if (err) throw err;
      else if (items.length == 0) msg.channel.send('That item is not in the shop!');
      else {
        let price = items[0].cost;

        access.member(buyerID, con, function(buyer) {
          let num = buyer[0].marbles;
          if (price > num) {
            // not enough marbles
            res = "You do not have enough marbles.";
          }
          else {
            let newTotal = num - price;
            let updateMarbles = 'UPDATE member SET marbles = ' + newTotal + ' WHERE memberID = "' + buyerID + '"';
            con.query(updateMarbles);

            let alreadyHave = 'SELECT * FROM owns WHERE memberID = "' + buyerID + '" AND itemID = ' + items[0].itemID;

            con.query(alreadyHave, (err2, owns) => {
              if (err2) throw err2;
              else if (owns.length == 1) {
                let newItem = owns[0].quantity + 1;
                let updateItem = 'UPDATE owns SET quantity = ' + newItem + ' WHERE memberID = "' + buyerID + '" AND itemID = ' + items[0].itemID;
                con.query(updateItem);
              }
              else {
                let newEntry = 'INSERT INTO owns VALUES("' + buyerID + '", ' + items[0].itemID + ', ' + 1 + ')';
                con.query(newEntry);
              }
            });
            res = "Item bought."
          }
          msg.channel.send(res);
        });
      }
    });
  },

  shopList: function(msg, ds, con) {
    var name = '';
    var cost = '';
    access.shop(con, function(items) {
      for (let i = 0; i < items.length; i++) {
        name += items[i].name + '\n';
        cost += items[i].cost + '\n';
      }
      const embed = new ds.RichEmbed()
        .setTitle('Marble Shop')
        .setFooter('To purchase an item, type !buy [item] without brackets.')
        .setColor('AQUA')
        .addField('Name', name, Boolean(true))
        .addField('Price', cost, Boolean(true))

      msg.channel.send(embed);
    })
  }
}
