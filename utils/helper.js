const access = require('../utils/access.js');

module.exports = {
  extractItem: function(msg) {
    let first = msg.split(' ')[0];
    let second = msg.split(' ')[1];
    let phrase = first + ' ' + second + ' ';
    let item = msg.split(phrase)[1];
    return item;
  },

  loseItem: function(id, item, con) {
    access.ownsSpecific(id, item, con, function(res) {
      if (res.length == 1) {
        let newCount = res[0].quantity - 1;
        if (newCount == 0) {
          let sql = 'DELETE FROM owns WHERE memberID = "' + id + '" AND itemID = ' + item;
          con.query(sql);
        }
        else {
          let sql = 'UPDATE owns SET quantity = ' + newCount + ' WHERE memberID = "' + id + '" AND itemID = ' + item;
          con.query(sql);
        }
      }
    })
  }
}
