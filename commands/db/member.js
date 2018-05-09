const async = require('async');
const access = require('../../utils/access.js');

module.exports = {
  addMember: function(msg, con) {
    let user = msg.content.split(" ")[1];
    let id = msg.author.id;

    let sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 0)';

    con.query(sql);

    msg.member.addRole('439557423389343744');

    let res = 'Added to database. Welcome to the group ' + user + '!';

    return res;
  },

  myInfo: function(msg, con) {
    let id = msg.author.id;

    access.member(id, con, function(member) {
      let user = member[0].name;
      let num = member[0].marbles;

      var res = 'Username: ' + user + '\nMarbles: ' + num + '\nItems:\n';

      var q = 0;

      access.owns(id, con, function(owned) {
        async.eachSeries(owned, function(el, callback) {
          q = el.quantity;

          access.item(el.itemID, con, function(entry) {
            res += entry[0].name + ' - ' + q + '\n';
            console.log(res);
            callback();
          });
        },
        function(err, owned) {
          msg.channel.send(res);
        });
      });
    });
  }
};
