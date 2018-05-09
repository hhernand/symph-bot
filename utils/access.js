module.exports = {
  member: function(id, con, callback) {
    let sql = 'SELECT * FROM member WHERE memberID = "' + id + '"';
    con.query(sql, (err, member) => {
      if (err) callback(err);
      callback(member);
    });
  },

  item: function(id, con, callback) {
    let sql = 'SELECT * FROM item WHERE itemID = ' + id;
    con.query(sql, (err, item) => {
      if (err) callback(err);
      callback(item);
    });
  },

  owns: function(id, con, callback) {
    let sql = 'SELECT * FROM owns WHERE memberID = "' + id + '"';
    con.query(sql, (err, owns) => {
      if (err) callback(err);
      callback(owns);
    });
  },

  shop: function(con, callback) {
    let sql = 'SELECT * FROM item';
    con.query(sql, (err, items) => {
      if (err) callback(err);
      callback(items);
    })
  }
}
