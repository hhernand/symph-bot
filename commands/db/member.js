module.exports = {
  addMember: function (msg, con) {
    let data = msg.content.split(" ");
    let user = data[1];

    let id = msg.author.id;
    sql = "INSERT INTO member VALUES (" + id + '", "' + user + '", 0)';

    con.query(sql);

    let res = 'Added to database. Welcome to the group ' + user + '!';

    return res;
  }
