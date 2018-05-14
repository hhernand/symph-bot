const async = require('async');
const access = require('../../utils/access.js');

module.exports = {
  addMember: function(msg, con) {
    let user = msg.content.split(" ")[1];
    let id = msg.author.id;

    let sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 0)';

    con.query(sql);
    
    sql = 'INSERT INTO owns VALUES ("' + id + '", 0, 1)';

    con.query(sql);

    msg.member.addRole('445705538471198743');

    let res = 'Added to database. Welcome to the group ' + user + '!';

    return res;
  },

  myInfo: function(msg, ds, con) {
    let id = msg.author.id;

    access.member(id, con, function(member) {
      let user = member[0].name;
      let num = member[0].marbles;

      //var res = 'Username: ' + user + '\nMarbles: ' + num + '\nItems:\n';
      var res = '';
      var q = '';

      access.owns(id, con, function(owned) {
        async.eachSeries(owned, function(el, callback) {
          if (el.quantity > 1) q = ' x ' + String(el.quantity);

          access.item(el.itemID, con, function(entry) {
            res += entry[0].name + q + '\n';
            callback();
          });
          
          q = '';
        },
        function(err, owned) {
          const embed = new ds.RichEmbed()
            .setTitle('My Info')
            .setColor('BLUE')
            .setThumbnail(msg.author.avatarURL)
            .addField('Username', user, Boolean(true))
            .addField('Marbles', num, Boolean(true))
            .addField('Items', res);

          msg.channel.send(embed);
        });
      });
    });
  }
};
