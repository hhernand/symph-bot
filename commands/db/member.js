const async = require('async');
const access = require('../../utils/access.js');
const helper = require('../../utils/helper.js');
const marble = require('./marbles.js');
const item = require('./items.js');

module.exports = {
  addMember: function(msg, con) {
    let data = msg.content.split(" ");
    if (data.length == 2) {
      let user = data[1];
      let id = msg.author.id;

      access.memberByID(id, con, function(member) {
        if (member.length == 1) {
          let res = 'You\'re already a member!';
          msg.channel.send(res);
        } else {
          let sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 20, 0)';

          con.query(sql);

          msg.member.addRole('445705538471198743');

          let res = 'Added to database. Welcome to the group ' + user + '!';
          msg.channel.send(res);
        }
      });
    }
  },

  myInfo: function(msg, ds, con) {
    let id = msg.author.id;

    access.memberByID(id, con, function(member) {
      if (member.length == 1) {
        let user = member[0].name;
        let num = member[0].marbles;
        let c = member[0].candies;

        access.owns(id, con, function(owned) {
          if (owned.length == 0) {
            const embed = new ds.RichEmbed()
              .setTitle(msg.author.username)
              .setColor('BLUE')
              .setThumbnail(msg.author.avatarURL)
              .addField('DA Username', user, true)
              .addField('Marbles', num, true)
              .addField('Candies', c, true);

            msg.channel.send(embed);
          }
          else {
            var res = '';
            var q = '';

            async.eachSeries(owned, function(el, callback) {

              access.itemByID(el.itemID, con, function(entry) {
                if (el.quantity > 1) q = ' x ' + String(el.quantity);
                res += entry[0].name + q + '\n';
                callback();
              });

              q = '';
            },
            function(err, owned) {
              const embed = new ds.RichEmbed()
                .setTitle(msg.author.username)
                .setColor('BLUE')
                .setThumbnail(msg.author.avatarURL)
                .addField('DA Username', user, true)
                .addField('Marbles', num, true)
                .addField('Candies', c, true)
                .addField('Items', res);

              msg.channel.send(embed);
            });
          }
        });
      }
      else {
        msg.channel.send("You haven\'t been registered yet! Please go to #registration and use **!add dAname** first.");
      }
    });
  },

  checkMember: function(msg, ds, con) {
    let user = msg.content.split(" ")[1];

    access.memberByName(user, con, function(member) {
      if (member.length == 1) {
        let id = member[0].memberID;
        let num = member[0].marbles;
        let c = member[0].candies;

        access.owns(id, con, function(owned) {
          if (owned.length == 0) {
            const embed = new ds.RichEmbed()
              .setTitle('Member Information')
              .setColor('BLUE')
              .addField('DA Username', user, true)
              .addField('Marbles', num, true)
              .addField('Candies', c, true);

            msg.channel.send(embed);
          }
          else {
            var res = '';
            var q = '';

            async.eachSeries(owned, function(el, callback) {

              access.itemByID(el.itemID, con, function(entry) {
                if (el.quantity > 1) q = ' x ' + String(el.quantity);
                res += entry[0].name + q + '\n';
                callback();
              });

              q = '';
            },
            function(err, owned) {
              const embed = new ds.RichEmbed()
                .setTitle('Member Information')
                .setColor('BLUE')
                .addField('DA Username', user, true)
                .addField('Marbles', num, true)
                .addField('Candies', c, true)
                .addField('Items', res);

              msg.channel.send(embed);
            });
          }
        });
      }
      else {
        msg.channel.send("That member doesn\'t exist.");
      }
    });
  },

  reward: function(msg, con) {
    let data = msg.content.split(" ");
    let user = data[1];
    let type = data[0].split('!reward')[1].toLowerCase();

    access.memberByName(user, con, function(member) {
      if (member.length == 1) {
        let mID = member[0].memberID;
        if (type == 'item') {
          let item = helper.extractItem(msg.content);
          access.itemByName(item, con, function(items){
            if (items.length == 1) {
              let iID = items[0].itemID;
              helper.grantItem(mID, iID, 1, con);
              msg.channel.send(user + ' has been rewarded ' + item);
            }
          })
        }
        else {
          let add = Number(data[2]);
          if (!isNaN(add) && add > 0) {
            if (type == 'candies') {
              helper.grantCandies(mID, add, con);
              msg.channel.send(user + ' has been rewarded ' + add + ' candies.');
            }
            else if (type == 'marbles') {
              helper.grantMarbles(mID, add, con);
              msg.channel.send(user + ' has been rewarded ' + add + ' marbles.');
            }
            else msg.channel.send('Please redo that command!');
          }
        }
      }
      else msg.channel.send('That member doesn\'t exist!');
    });
  },

  claim:  function(msg, con) {
    let id = msg.author.id;
    let claim = msg.content.split(' ')[1];

    access.memberByID(id, con, function(member) {
      if (member.length == 1) {
        let toclaim = 'SELECT * FROM claimed WHERE memberID = "' + id + '" AND claim = "' + claim + '"';
        let res = '';

        con.query(toclaim, (err, rows) => {
          if (rows.length == 1) {
            msg.channel.send("You've already claimed the rewards for that!");
          }
          else {
            if (claim == 'botgoodies') {
              helper.grantMarbles(id, 20, con);
              helper.grantItem(id, 8, 1, con);
              let entry = 'INSERT INTO claimed VALUES ("' + id + '", "' + claim + '")';
              con.query(entry);

              res = msg.author + ' You claimed 20 marbles and a Texture Change Bath Bomb!';
            }
            else if (claim == 'spoopy') {
              helper.grantCandies(id, 10, con);
              let entry = 'INSERT INTO claimed VALUES ("' + id + '", "' + claim + '")';
              con.query(entry);

              res = msg.author + ' You claimed 10 candies!';
            }
            else if (claim == 'candycorn') {
              helper.grantItem(id, 46, 1, con);
              let entry = 'INSERT INTO claimed VALUES ("' + id + '", "' + claim + '")';
              con.query(entry);

              res = msg.author + ' You claimed a Floating Limbs Bath Bomb!';
            }
            else {
              res = msg.author + ' That\'s not a valid claim! Maybe you typed the wrong thing?';
            }
            msg.channel.send(res);
          }
        });
      }
      else {
        msg.channel.send("You haven\'t been registered yet so you can\'t claim anything! Please go to #registration and use **!add dAname** first.");
      }
    });
  }
};
