const access = require('../utils/access.js');

module.exports = {
	extractItem: function (msg) {
		let first = msg.split(' ')[0];
		let second = msg.split(' ')[1];
		let phrase = first + ' ' + second + ' ';
		let item = msg.split(phrase)[1];
		return item;
	},

	loseItem: function (id, item, con) {
		access.ownsSpecific(id, item, con, function (res) {
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
	},

	grantItem: function (id, item, num, con) {
		access.ownsSpecific(id, item, con, function (owns) {
			if (owns.length == 1) {
				let newItem = owns[0].quantity + num;
				let updateItem = 'UPDATE owns SET quantity = ' + newItem + ' WHERE memberID = "' + id + '" AND itemID = ' + item;
				con.query(updateItem);
			}
			else {
				let newEntry = 'INSERT INTO owns VALUES("' + id + '", ' + item + ', ' + num + ')';
				con.query(newEntry);
			}
		});
	},

	grantMarbles: function (id, num, con) {
		access.memberByID(id, con, function (rows) {
			let total = rows[0].marbles + num;
			sql = 'UPDATE member SET marbles = ' + total + ' WHERE memberID = "' + id + '"';
			con.query(sql);
		});
	},

	grantCandies: function (id, num, con) {
		access.memberByID(id, con, function (rows) {
			let total = rows[0].candies + num;
			sql = 'UPDATE member SET candies = ' + total + ' WHERE memberID = "' + id + '"';
			con.query(sql);
		});
	},

	updateStock: function (id, num, con) {
		access.itemByID( id, con, function (item) {
			let total = item[0].stock + num;
			let sql = `UPDATE item SET stock = ${total} WHERE itemID = ${id}`;
			con.query(sql);
		})
	},

	makeShop: function (type, ds, con, callback) {
		const shop = new ds.RichEmbed();
		let types = require('./types.json');
		let forsale = {
			10: {
				title: 'Common - 10',
				items: ''
			},
			30: {
				title: 'Uncommon - 30',
				items: ''
			},
			50: {
				title: 'Rare - 50',
				items: ''
			},
			150: {
				title: 'Radioactive - 150',
				items: ''
			},
			other: {
				title: 'Other',
				items: ''
			}
		};

		let today = new Date();

		let monthAfter = types[type].month + 1;
		if (monthAfter == 12) {
			monthAfter = 0;
		}

		let stillOpen = today.getMonth() == monthAfter && today.getDate() <= 5;

		if (!Object.keys(types).includes(type)) {
			callback(`Sorry! The ${type} shop doesn't exist!`);
		} else if (type != 'general' && today.getMonth() != types[type].month && stillOpen == false) {
			callback(`Sorry! The ${type} shop is currently closed!`);
		} else {
			shop.setTitle(types[type].name);
			if (types[type].description != '') {
				shop.setDescription(types[type].description);
			}
			shop.setFooter(types[type].footer);
			shop.setColor(types[type].colour);

			access.shop(type, con, function (items) {
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
					let text = item.name;

					if ( ! ( item.cost in forsale ) || item.name.includes( 'Soap' ) ) {
						text += ` - ${item.cost}`;
					}

					if ( item.stock > -1 ) {
						text += ` - ${item.stock} in stock`;
					}

					text += '\n';

					if ( item.cost in forsale && ! item.name.includes( 'Soap' ) ) {
						forsale[item.cost].items += text;
					} else {
						forsale.other.items += text; 
					}
				}

				for (let key in forsale) {
					if (forsale[key].items != '') {
						shop.addField(forsale[key].title, forsale[key].items, true);
					}
				}
				forsale = {};
				callback(shop);
			})
		}
	},

	makePetShop: function ( ds, con, callback ) {
		let types = require('./types.json');
		const shop = new ds.RichEmbed()
			.setTitle('Roach\'s Pet Shop')
			.setDescription('Oy kiddie! Y\'wanna take care of one of a lil\' one I\'m got here? Sure! These lil\' chunksters are definitely lookin\' for sum lovin\' home, all we ask is for a teensy fee to pay fer them!')
			.setThumbnail('https://i.imgur.com/u5aK1p6.png')
			.setColor('#a2e8f0');
		access.shop( '', con, function (items) {
			if ( items.length != 0 ) {
				let event = '';
				let regular = '';
				for ( let item of items ) {
					if ( item.type != 'general' && item.type in types ) {
						let today = new Date();
						if ( today.getMonth() == types[item.type].month ) {
							console.log( item.name );
							event += `${item.name} - ${item.cost} ${types[item.type].currency}`;
							if ( item.stock != -1 ) {
								event += ` - ${item.stock} in stock`;
							}
							event += '\n';
						}
					} else {
						regular += `${item.name} - ${item.cost} marbles`;
						if ( item.stock != -1 ) {
							regular += ` - ${item.stock} in stock`;
						}
						regular += '\n';
					}
				}

				shop.addField( 'Regular Pets', regular );
				if ( event != '' ) {
					shop.addField( 'Event Pets', event );
				}

				callback( shop );
			}
		}, 'pet');
	}
}
