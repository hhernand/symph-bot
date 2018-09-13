module.exports = {
  memberByID: function(id, con, callback) {
    let sql = 'SELECT * FROM member WHERE memberID = "' + id + '"';
    con.query(sql, (err, member) => {
      if (err) throw err;
      else callback(member);
    });
  },

  memberByName: function(name, con, callback) {
    let sql = 'SELECT * FROM member WHERE name = "' + name + '"';
    con.query(sql, (err, member) => {
      if (err) throw err;
      else callback(member);
    });
  },

  itemByID: function(id, con, callback) {
    let sql = 'SELECT * FROM item WHERE itemID = ' + id;
    con.query(sql, (err, item) => {
      if (err) throw err;
      else callback(item);
    });
  },

  itemByName: function(name, con, callback) {
    let sql = 'SELECT * FROM item WHERE name = "' + name + '"';
    con.query(sql, (err, item) => {
      if (err) throw err;
      else callback(item);
    });
  },

  owns: function(id, con, callback) {
    let sql = 'SELECT * FROM owns WHERE memberID = "' + id + '"';
    con.query(sql, (err, owns) => {
      if (err) throw err;
      else callback(owns);
    });
  },

  ownsSpecific: function(memberID, itemID, con, callback) {
    let sql = 'SELECT * FROM owns WHERE memberID = "' + memberID + '" and itemID = ' + itemID;
    con.query(sql, (err, owns) => {
      if (err) throw err;
      else callback(owns);
    });
  },

  shop: function(type, con, callback) {
    let sql = 'SELECT * FROM item WHERE type = "' + type + '" AND cost > 0';
    con.query(sql, (err, items) => {
      if (err) throw err;
      else callback(items);
    })
  },

  commands: function(con, callback) {
    let sql = 'SELECT * FROM command WHERE type not like "mod"';
    con.query(sql, (err, commands) => {
      if (err) throw err;
      else callback(commands);
    })
  },

  commandSpecific: function(specific, con, callback) {
    let sql = 'SELECT * FROM command WHERE name = "' + specific + '"';
    con.query(sql, (err, command) => {
      if (err) throw err;
      else callback(command);
    })
  },

  tagByName: function(name, con, callback) {
    let sql = 'SELECT * FROM tag WHERE name = "' + name + '"';
    con.query(sql, (err, tag) => {
      if (err) throw err;
      else callback(tag);
    });
  },
}
