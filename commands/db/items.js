const access = require('../../utils/access.js');

module.exports = {
  giveItem: function(msg, con) {
    let giverID = msg.author.id;
    access.memberByID(giverID, con, function(g) {
      if (g.length == 0) {
        msg.channel.send('You\'re not a member yet! You can\'t give anything!');
      } else {
        let receiver = msg.content.split(" ")[1];
        access.memberByName(receiver, con, function(r) {
          if (r.length == 0) {
            msg.channel.send('That member does not exist!');
          } else {
            let item = msg.content.split("\"")[1];
            console.log(item);
            access.itemByName(item, con, function(i) {
              if (i.length == 0) {
                msg.channel.send('That doesn\'t exist silly!');
              } else {
                let itemID = i[0].itemID;
                access.ownsSpecific(giverID, itemID, con, function(hasItem) {
                  if (hasItem.length == 0) {
                    msg.channel.send('You don\'t have that item!');
                  } else {
                    let q = hasItem[0].quantity;
                    let sql = '';
                    if (q == 1) {
                      sql = 'DELETE FROM owns WHERE memberID = "' + giverID + '" and itemID = ' + itemID;
                    } else {
                      sql = 'UPDATE owns SET quantity = ' + (q-1) + ' WHERE memberID = "' + giverID + '" and itemID = ' + itemID;
                    }
                    con.query(sql);
                    access.ownsSpecific(r[0].memberID, itemID, con, function(hasItem2) {
                      let sql2 = '';
                      if (hasItem2.length == 0) {
                        sql2 = 'INSERT INTO owns VALUES ("' + r[0].memberID + '", ' + itemID + ', 1)';
                      } else {
                        q = hasItem2[0].quantity;
                        sql2 = 'UPDATE owns SET quantity = ' + (q+1) + ' WHERE memberID = "' + r[0].memberID + '" AND itemID = ' + itemID;
                      }
                      console.log(sql2);
                      con.query(sql2);
                      msg.channel.send('You gave ' + item + ' to ' + receiver + '!');
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}
