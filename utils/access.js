module.exports = {
	members: function (con, callback) {
		let sql = 'SELECT * FROM member';
		con.query(sql, (err, member) => {
			if (err) throw err;
			else callback(member);
		})
	},

	memberByID: function (id, con, callback) {
		let sql = 'SELECT * FROM member WHERE memberID = "' + id + '"';
		con.query(sql, (err, member) => {
			if (err) throw err;
			else callback(member);
		});
	},

	memberByName: function (name, con, callback) {
		let sql = 'SELECT * FROM member WHERE name = "' + name + '"';
		con.query(sql, (err, member) => {
			if (err) throw err;
			else callback(member);
		});
	},

	itemByID: function (id, con, callback) {
		let sql = 'SELECT * FROM item WHERE itemID = ' + id;
		con.query(sql, (err, item) => {
			if (err) throw err;
			else callback(item);
		});
	},

	itemByName: function (name, con, callback) {
		let sql = 'SELECT * FROM item WHERE name = "' + name + '"';
		con.query(sql, (err, item) => {
			if (err) throw err;
			else callback(item);
		});
	},

	owns: function (id, con, callback) {
		let sql = 'SELECT i.name, o.quantity FROM owns o JOIN item i ON o.itemID = i.itemID WHERE o.memberID = "' + id + '" AND o.quantity > 0 ORDER BY i.name';
		con.query(sql, (err, owns) => {
			if (err) throw err;
			else callback(owns);
		});
	},

	ownsSpecific: function (memberID, itemID, con, callback) {
		let sql = 'SELECT * FROM owns WHERE memberID = "' + memberID + '" and itemID = ' + itemID;
		con.query(sql, (err, owns) => {
			if (err) throw err;
			else callback(owns);
		});
	},

	shop: function (type, con, callback, category = 'cosmetic') {
		let sql = '';
		if ( type != '' ) {
			sql = `SELECT * FROM item WHERE type = "${type}" AND cost > 0 AND category = "${category}" ORDER BY cost`;
		} else {
			sql = `SELECT * FROM item WHERE cost > 0 AND (category = "${category}" OR category = "other") ORDER BY cost`;
		}
		con.query(sql, (err, items) => {
			if (err) throw err;
			else callback(items);
		})
	},

	stock: function (con, callback) {
		let sql = `SELECT * FROM item WHERE stock > -1`;
		con.query(sql, (err, items) => {
			if (err) throw err;
			else callback(items);
		})
	},

	commands: function (con, callback) {
		let sql = 'SELECT * FROM command WHERE type not like "mod"';
		con.query(sql, (err, commands) => {
			if (err) throw err;
			else callback(commands);
		})
	},

	commandSpecific: function (specific, con, callback) {
		let sql = 'SELECT * FROM command WHERE name = "' + specific + '"';
		con.query(sql, (err, command) => {
			if (err) throw err;
			else callback(command);
		})
	},

	tagByName: function (name, con, callback) {
		let sql = 'SELECT * FROM tag WHERE name = "' + name + '"';
		con.query(sql, (err, tag) => {
			if (err) throw err;
			else callback(tag);
		});
	},

	claimByWord: function (word, con, callback) {
		let sql = 'SELECT * FROM claim WHERE word = "' + word + '"';
		con.query(sql, (err, claim) => {
			if (err) throw err;
			else callback(claim);
		});
	},

	claimed: function (id, claimID, con, callback) {
		let sql = 'SELECT * FROM claimed WHERE memberID = "' + id + '" AND claimID = ' + claimID;
		con.query(sql, (err, claimed) => {
			if (err) throw err;
			else callback(claimed);
		});
	},

	path: function(short, con, callback) {
		let sql = `SELECT * FROM exploration WHERE short = "${short}"`;
		con.query(sql, (err, path) => {
			if (err) throw err;
			else callback(path);
		})
	},

	ingredientsByPath: function(pathID, con, callback) {
		let select = 'SELECT i.name FROM loot l';
		let join = 'JOIN item i ON l.itemID = i.itemID';
		let where = `WHERE i.category = "crafting" AND l.pathID = ${pathID}`;
		let sql = `${select} ${join} ${where}`;
		
		con.query( sql, (err, items) => {
			if (err) throw err;
			else callback(items);
		})
	},

	petsByPath: function(pathID, con, callback) {
		let select = 'SELECT i.name FROM loot l';
		let join = 'JOIN item i ON l.itemID = i.itemID';
		let where = `WHERE i.category = "pet" AND l.pathID = ${pathID}`;
		let sql = `${select} ${join} ${where}`;
		
		con.query( sql, (err, pets) => {
			if (err) throw err;
			else callback(pets);
		})
	}
}
