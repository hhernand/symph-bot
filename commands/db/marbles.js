const access = require('../../utils/access.js');
const helper = require('../../utils/helper.js');
const types = require('../../utils/types.json');

module.exports = {
	giveCurrency: function (msg, con) {
		let data = msg.content.split(" ");
		let type = data[0].split('!give')[1].toLowerCase();

		let giverID = msg.author.id;
		access.memberByID(giverID, con, function (g) {
			if (g.length == 0) {
				msg.channel.send('You\'re not a member yet! You can\'t give anything!');
			} else {
				let receiver = msg.content.split(" ")[1];
				access.memberByName(receiver, con, function (r) {
					if (r.length == 0) {
						msg.channel.send('That member does not exist!');
					} else {
						if (!isNaN(msg.content.split(" ")[2])) {
							let amount = Number(msg.content.split(" ")[2]);

							if (type == 'marbles') {
								if (g[0].marbles < amount) {
									msg.channel.send('You don\'t have enough marbles to give!');
								}
								else {
									helper.grantMarbles(giverID, (amount * -1), con);
									helper.grantMarbles(r[0].memberID, amount, con);
									msg.channel.send('You gave ' + amount + ' marbles to ' + receiver + '!');
								}
							}
							else if (type == 'sweethearts') {
								if (g[0].candies < amount) {
									msg.channel.send('You don\'t have enough sweethearts to give!');
								}
								else {
									helper.grantCandies(giverID, (amount * -1), con);
									helper.grantCandies(r[0].memberID, amount, con);
									msg.channel.send('You gave ' + amount + ' sweethearts to ' + receiver + '!');
								}
							}
							else {
								msg.channel.send('Please redo the command.');
							}
						}
					}
				});
			}
		});
	},

	buy: function (msg, con) {
		let buyerID = msg.author.id;
		let want = Number(msg.content.split(' ')[1]);
		if (!isNaN(want) && want > 0) {
			let item = helper.extractItem(msg.content);

			access.itemByName(item, con, function (items) {
				if (items.length == 0 || items[0].cost == 0) msg.channel.send('That item is not in the shop!');
				else {
					let today = new Date();

					let monthAfter = types[items[0].type].month + 1;
					if (monthAfter == 12) {
						monthAfter = 0;
					}

					let stillOpen = today.getMonth() == monthAfter && today.getDate() <= 5;

					if (items[0].type != 'general' && today.getMonth() != types[items[0].type].month && stillOpen == false) {
						let type = items[0].type[0].toUpperCase() + items[0].type.substr(1);
						msg.channel.send(`Sorry! ${type} items cannot be bought at this time!`);
					}
					else {
						let price = items[0].cost;
						access.memberByID(buyerID, con, function (buyer) {
							let num = 0;
							let curr = '';

							if (items[0].type != 'general') {
								num = buyer[0].candies;
								curr = types[items[0].type].currency;
							}
							else {
								num = buyer[0].marbles;
								curr = 'marbles'
							}

							let res = '';

							if ((price * want) <= num && ( items[0].stock == -1 || items[0].stock >= want ) ) {
								if (curr == 'marbles') helper.grantMarbles(buyerID, (price * want * -1), con);
								else helper.grantCandies(buyerID, (price * want * -1), con);

								helper.grantItem(buyerID, items[0].itemID, want, con);

								if ( items[0].stock != -1 ) {
									helper.updateStock(items[0].itemID, -(want), con);
								}

								res = `You bought ${want} ${item} for ${(price * want)} ${curr}! Be sure to use !myinfo to check if you got your items.`;
							}
							else if ( items[0].stock == 0 ) {
								// item out of stock
								res = `Sorry, ${items[0].name} is out of stock!`;
							} else if ( items[0].stock < want ) {
								res = `There's not enough ${items[0].name} for you to buy!`;
							} else {
								// not enough marbles
								if (res == '') res = `Nice try, but you don't have enough ${curr}!`;
							}
							msg.channel.send(res);
						});
					}
				}
			});
		}
	},

	sell: function (msg, con) {
		let num = Number(msg.content.split(' ')[1]);
		if (!isNaN(num) && num > 0) {
			let memID = msg.author.id;
			access.memberByID(memID, con, function (member) {
				if (member.length == 1) {
					let current = member[0].marbles;
					let item = helper.extractItem(msg.content);
					access.itemByName(item, con, function (res) {
						if (res.length == 1) {
							let iID = res[0].itemID;
							let gain = Math.ceil(res[0].cost / 3);
							access.ownsSpecific(memID, iID, con, function (res2) {
								if (res2.length == 1) {
									helper.loseItem(memID, iID, con);
									let sql = 'UPDATE member SET marbles = ' + (current + gain) + ' WHERE memberID = "' + memID + '"';
									con.query(sql);
									let end = 'You sold ' + num + ' ' + item + ' for ' + gain + ' marbles!';
									msg.channel.send(end);
								}
								else {
									msg.channel.send('You do not have that item!');
								}
							});
						}
						else {
							msg.channel.send(`${item} doesn't exist!`);
						}
					});
				}
			});
		}
	},

	shopList: function (msg, ds, con) {
		if (msg.content.split(' ').length == 2) {
			helper.makeShop(msg.content.split(' ')[1].toLowerCase(), ds, con, function (shop) {
				msg.channel.send(shop);
			});
		}
		else {
			helper.makeShop('general', ds, con, function (shop) {
				msg.channel.send(shop);
			});
		}
	}
}
