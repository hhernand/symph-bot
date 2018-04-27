module.exports = {
  addMember: function (msg, id, con) {
    let data = msg.split(" ");
    let user = data[1];

    sql = 'INSERT INTO member VALUES ("' + id + '", "' + user + '", 0)';

    con.query(sql);

    let res = 'Added to database. Welcome to the group ' + user + '!';

    return res;
  }
