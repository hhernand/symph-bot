const access = require('../utils/access.js');

module.exports = {
  extractItem: function(msg) {
    let first = msg.split(' ')[0];
    let second = msg.split(' ')[1];
    let phrase = first + ' ' + second + ' ';
    let item = msg.split(phrase)[1];
    return item;
  },

  loseItem: function(id, item, con) {
    access.ownsSpecific(id, item, con, function(res) {
      if (res.length == 1) {
        let newCount = res[0].quantity - 1;
        if (newCount == 0) {
          let sql = 'DELETE FROM owns WHERE memberID = "' + id + '" AND itemID = ' + item;
          con.query(sql);
        }
        else {
          let sql = 'UPDATE owns SET quantity = ' + newCount + ' WHERE memberID = "' + id + '" AND itemID = ' + item;
          con.query(sql);
        }
      }
    })
  },

  grantItem: function(id, item, num, con) {
    access.ownsSpecific(id, item, con, function(owns) {
      if (owns.length == 1) {
        let newItem = owns[0].quantity + num;
        let updateItem = 'UPDATE owns SET quantity = ' + newItem + ' WHERE memberID = "' + id + '" AND itemID = ' + item;
        con.query(updateItem);
      }
      else {
        let newEntry = 'INSERT INTO owns VALUES("' + id + '", ' + item + ', ' + num + ')';
        con.query(newEntry);
      }
    });
  },

  grantMarbles: function(id, num, con) {
    access.memberByID(id, con, function(rows) {
      let total = rows[0].marbles + num;
      sql = 'UPDATE member SET marbles = ' + total + ' WHERE memberID = "' + id + '"';
      con.query(sql);
    });
  },

  grantCandies: function(id, num, con) {
    access.memberByID(id, con, function(rows) {
      let total = rows[0].candies + num;
      sql = 'UPDATE member SET candies = ' + total + ' WHERE memberID = "' + id + '"';
      con.query(sql);
    });
  },

  makeShop: function(type, ds, con, callback) {
    const shop = new ds.RichEmbed();
    let types = require('./types.json');
    let forsale = {
      c: {
        title: 'Common - 10',
        items: ''
      },
      uc: {
        title: 'Uncommon - 30',
        items: ''
      },
      r: {
        title: 'Rare - 50',
        items: ''
      },
      m: {
        title: 'Radioactive - 150',
        items: ''
      },
      salts: {
        title: 'Salts',
        items: ''
      },
      soaps: {
        title: 'Soaps',
        items: ''
      },
      other: {
        title: 'Other',
        items: ''
      }
    };

    let today = new Date();

    let monthAfter = types[type].month + 1;
    if ( monthAfter == 12 ) {
      monthAfter = 0;
    }

    let stillOpen = today.getMonth() == monthAfter && today.getDate() <= 5;

    if (!Object.keys(types).includes(type)) {
      callback(`Sorry! The ${type} shop doesn't exist!`);
    } else if (type != 'general' && today.getMonth() != types[type].month && stillOpen == false ) {
      callback(`Sorry! The ${type} shop is currently closed!`);
    } else {
      shop.setTitle(types[type].name);
      if (types[type].description != '') {
        shop.setDescription(types[type].description);
      }
      shop.setFooter(types[type].footer);
      shop.setColor(types[type].colour);

      access.shop(type, con, function(items) {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];

          if (item.name.includes('Bath Bomb')) {
            if (item.cost == 10) {
              forsale.c.items += `${item.name}\n`;
            }
            else if (item.cost == 30) {
              forsale.uc.items += `${item.name}\n`;
            }
            else if (item.cost == 150) {
              forsale.m.items += `${item.name}\n`;
            }
            else {
              forsale.r.items += `${item.name}\n`;
            }
          }
          else if (item.name.includes('Salts')) {
            forsale.salts.items += `${item.name} - ${item.cost}\n`;
          }
          else if (item.name.includes('Soap')) {
            forsale.soaps.items += `${item.name} - ${item.cost}\n`
          }
          else {
            forsale.other.items += `${item.name} - ${item.cost}\n`;
          }
        }

        for (let key in forsale) {
          if (forsale[key].items != '') {
            shop.addField(forsale[key].title, forsale[key].items, true);
          }
        }
        forsale = {};
        callback(shop);
      })
    }
  }
}
