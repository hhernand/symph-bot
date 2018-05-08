module.exports = {
  rewardMarbles: function(msg, con) {
    let data = msg.split(" ");
    let user = data[1];
    let add = Number(data[2]);

    let sql = 'SELECT * FROM member WHERE name = "' + user + '"';

    con.query(sql, (err, rows) => {
      let total = rows[0].marbles + add;
      sql = 'UPDATE member SET marbles = ' + total + ' WHERE name = "' + user + '"';
      con.query(sql);
    });
  },

  buy: function(msg, con) {
    let buyerID = msg.author.id;
    let item = msg.content.split("buy ")[1];

    console.log(item);

    let sql = 'SELECT * FROM item WHERE name = "' + item + '"';
    let res = '';

    con.query(sql, (err, items) => {
      let price = items[0].cost;
      sql2 = 'SELECT * FROM member WHERE memberID = "' + buyerID + '"';

      con.query(sql2, (err, buyer) => {
        let num = buyer[0].marbles;
        if (price > num) {
          // not enough marbles
          res = "You do not have enough marbles.";
        }
        else {
          let newTotal = num - price;
          let updateMarbles = 'UPDATE member SET marbles = ' + newTotal + ' WHERE memberID = "' + buyerID + '"';
          con.query(updateMarbles);

          let alreadyHave = 'SELECT * FROM owns WHERE memberID = "' + buyerID + '" AND itemID = ' + items[0].itemID;

          con.query(alreadyHave, (err, owns) => {
            console.log(owns.length);
            if (owns.length == 1) {
              let newItem = owns[0].quantity + 1;
              console.log(newItem);
              let updateItem = 'UPDATE owns SET quantity = ' + newItem + ' WHERE memberID = "' + buyerID + '" AND itemID = ' + items[0].itemID;
              con.query(updateItem);
            }
            else {
              let newEntry = 'INSERT INTO owns VALUES("' + buyerID + '", ' + items[0].itemID + ', ' + 1 + ')';
              con.query(newEntry);
            }
          });
          res = "Item bought."
        }
        msg.channel.send(res);
      });
    });
  }
}
