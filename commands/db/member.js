module.exports = {
  addMember: function(msg, con) {
    let user = msg.content.split(" ")[1];
    let id = msg.author.id;

    let sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 0)';

    con.query(sql);

    let role = msg.guild.roles.find("name", "test");
    msg.author.addRole(role);

    let res = 'Added to database. Welcome to the group ' + user + '!';

    return res;
  }
};
