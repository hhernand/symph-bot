const async = require('async');
const access = require('../../utils/access.js');
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
          let sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 20)';

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

        access.owns(id, con, function(owned) {
          if (owned.length == 0) {
            const embed = new ds.RichEmbed()
              .setTitle(msg.author.username)
              .setColor('BLUE')
              .setThumbnail(msg.author.avatarURL)
              .addField('DA Username', user, true)
              .addField('Marbles', num, true);

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
                .addField('Items', res);

              msg.channel.send(embed);
            });
          }
        });
      }
    });
  },

  checkMember: function(msg, ds, con) {
    let user = msg.content.split(" ")[1];

    access.memberByName(user, con, function(member) {
      if (member.length == 1) {
        let id = member[0].memberID;
        let num = member[0].marbles;

        access.owns(id, con, function(owned) {
          if (owned.length == 0) {
            const embed = new ds.RichEmbed()
              .setTitle('Member Information')
              .setColor('BLUE')
              .addField('DA Username', user, true)
              .addField('Marbles', num, true);

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
                .addField('Items', res);

              msg.channel.send(embed);
            });
          }
        });
      }
    });
  },

  claim:  function(msg, con) {
    let id = msg.author.id;
    let num = Number(msg.content.split(' ')[1]);

    access.memberByID(id, con, function(member) {
      if (!isNaN(num) && member.length == 1) {
        let claim = 'SELECT * FROM claimed WHERE memberID = "' + id + '" AND claim = ' + num;
        let res = '';

        con.query(claim, (err, rows) => {
          if (rows.length == 1) {
            msg.channel.send("You've already claimed the rewards for that!");
          }
          else {
            if (num == 67) {
              marble.grantMarbles(id, 5, con);
              item.grantItem(id, 1, con);
              let entry = 'INSERT INTO claimed VALUES ("' + id + '", ' + num + ')';
              con.query(entry);

              res = msg.author + ' You claimed 5 marbles and a Wings Bath Bomb!';
            }
            else if (num == 11) {
              marble.grantMarbles(id, 5, con);
              let entry = 'INSERT INTO claimed VALUES ("' + id + '", ' + num + ')';
              con.query(entry);

              res = msg.author + ' You claimed 5 marbles!';
            }
            else if (num == 15) {
              item.grantItem(id, 13, con);
              let entry = 'INSERT INTO claimed VALUES ("' + id + '", ' + num + ')';
              con.query(entry);

              res = msg.author + ' You claimed a Nonsolid Bath Bomb!';
            }
            else {
              res = msg.author + ' That\'s not a valid claim! Maybe you got the wrong number?';
            }
            msg.channel.send(res);
          }
        });
      }
    });
  }
};
