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

    let sql = 'SELECT * FROM member WHERE memberID = "' + id + '"';

    con.query(sql, (err, rows) => {
      let user = rows[0].name;
      let num = rows[0].marbles;

      msg.channel.send('Username: ' + user + '\nMarbles: ' + num);
    })
  }
};
