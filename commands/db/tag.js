const access = require('../../utils/access.js');

module.exports = {
  createTag: function(msg, con) {
    let data = msg.content.split(' ');
    if (data.length == 3) {
      let name = data[1];
      let content = data[2];
      access.tagByName(name, con, function(res) {
        if (res.length == 1) {
          msg.channel.send(msg.author + ' Someone used that tag already! Please choose a different name for it.');
        }
        else {
          let sql = 'INSERT INTO tag VALUES ("' + msg.author.id + '", "' + name + '", "' + content + '")';
          con.query(sql);
          msg.channel.send(msg.author + ' Tag created!');
        }
      })
    }
  },
  updateTag: function(msg, con) {
    let data = msg.content.split(' ');
    if (data.length == 3) {
      let tname = data[1];
      let id = msg.author.id;
      let content = data[2];
      access.tagByName(tname, con, function(res) {
        if (res.length == 1) {
          if (res[0].memberID == id) {
            sql = 'UPDATE tag SET content = "' + content + '" WHERE name = "' + tname + '"';
            con.query(sql);
            msg.channel.send(msg.author + ' Tag updated!');
          }
          else {
            msg.channel.send(msg.author + ' That\'s not your tag to edit!');
          }
        }
        else {
          msg.channel.send(msg.author + ' That tag doesn\'t exist yet!');
        }
      });
    }
  },
  tagRes: function(msg, con) {
    let data = msg.content.split(' ');
    if (data.length == 2) {
      let tname = data[1];
      access.tagByName(tname, con, function(res) {
        if (res.length == 1) {
          let c = res[0].content;
          msg.channel.send(c);
        }
        else {
          msg.channel.send(msg.author + ' That tag hasn\'t been made yet!');
        }
      });
    }
  }
}
