const access = require('../../utils/access.js');
const helper = require('../../utils/helper.js');
const marble = require('./marbles.js');
const item = require('./items.js');

module.exports = {
	giveItem: function (msg, con) {
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
						let item = helper.extractItem(msg.content);
						access.itemByName(item, con, function (i) {
							if (i.length == 0) {
								msg.channel.send('That doesn\'t exist silly!');
							} else {
								let itemID = i[0].itemID;
								access.ownsSpecific(giverID, itemID, con, function (hasItem) {
									if (hasItem.length == 0) {
										msg.channel.send('You don\'t have that item!');
									} else {
										let q = hasItem[0].quantity;
										let sql = '';
										if (q == 1) {
											sql = 'DELETE FROM owns WHERE memberID = "' + giverID + '" and itemID = ' + itemID;
										} else {
											sql = 'UPDATE owns SET quantity = ' + (q - 1) + ' WHERE memberID = "' + giverID + '" and itemID = ' + itemID;
										}
										con.query(sql);
										access.ownsSpecific(r[0].memberID, itemID, con, function (hasItem2) {
											let sql2 = '';
											if (hasItem2.length == 0) {
												sql2 = 'INSERT INTO owns VALUES ("' + r[0].memberID + '", ' + itemID + ', 1)';
											} else {
												let q2 = hasItem2[0].quantity;
												sql2 = 'UPDATE owns SET quantity = ' + (q2 + 1) + ' WHERE memberID = "' + r[0].memberID + '" AND itemID = ' + itemID;
											}
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
	},

	takeItem: function (msg, con) {
		let user = msg.content.split(" ")[1];
		let item = helper.extractItem(msg.content);
		access.memberByName(user, con, function (member) {
			let mID = member[0].memberID;
			access.itemByName(item, con, function (thing) {
				let iID = thing[0].itemID;
				access.ownsSpecific(mID, iID, con, function (owns) {
					let q = owns[0].quantity;
					let sql = '';
					if (q == 1) {
						sql = 'DELETE FROM owns WHERE memberID = "' + mID + '" AND itemID = ' + iID;
					} else {
						sql = 'UPDATE owns SET quantity = ' + (q - 1) + ' WHERE memberID = "' + mID + '" AND itemID = ' + iID;
					}
					con.query(sql);
					msg.channel.send('You took ' + item + ' from ' + user + '!');
				})
			});
		});
	},

	petShop: function ( msg, ds, con ) {
		helper.makePetShop( ds, con, function (shop) {
			msg.channel.send(shop);
		});
	},

	stock: function ( msg, ds, con ) {
		let embed = new ds.RichEmbed()
			.setTitle('Stock')
			.setDescription('List of all items that can be restocked with !restock # item.');
		access.stock( con, function( items ) {
			let res = '';
			for ( let item of items ) {
				res += `${item.name} - ${item.stock} in stock`;
			}

			embed.addField('Items', res);
			msg.channel.send( embed );
		})
	},

	restock: function ( msg, con ) {
		let add = Number(msg.content.split(" ")[1]);
		let name = helper.extractItem( msg.content );

		if ( isNaN(add) ) {
			msg.channel.send( `${add} is not a number` );
			return;
		}
		
		access.itemByName( name, con, function(item) {
			if ( item.length != 1 ) {
				msg.channel.send( `${name} doesn't exist!` );
				return;
			}
			if ( item[0].stock != -1 ) {
				helper.updateStock( item[0].itemID, add, con );
				msg.channel.send( `${add} added to ${item[0].name}!` );
			} else if ( item[0].stock + add < 0 ) {
				msg.channel.send( 'You\'re taking away more than what\'s there!' );
			} else {
				msg.channel.send( `You can't add to an infinite stock!` );
			}
		});
	}
}
