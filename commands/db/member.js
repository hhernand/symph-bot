const async = require('async');
const access = require('../../utils/access.js');

module.exports = {
  addMember: function(msg, con) {
    let user = msg.content.split(" ")[1];
    let id = msg.author.id;

    access.memberByID(id, con, function(member) {
      if (member.length == 1) {
        let res = 'You\'re already a member!';
        msg.channel.send(res);
      } else {
        let sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 0)';

        con.query(sql);

        msg.member.addRole('445705538471198743');

        let res = 'Added to database. Welcome to the group ' + user + '!';
        msg.channel.send(res);
      }
    });
  },

  myInfo: function(msg, ds, con) {
    let id = msg.author.id;

    access.memberByID(id, con, function(member) {
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
    });
  }
};
