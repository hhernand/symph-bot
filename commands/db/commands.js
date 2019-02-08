const access = require('../../utils/access.js');
module.exports = {
	cList: function (msg, ds, con) {
		var member = '';
		var shop = '';
		var other = '';
		var cName = '';
		var cType = '';
		access.commands(con, function (commands) {
			for (let i = 0; i < commands.length; i++) {
				cName = commands[i].name;
				cType = commands[i].type;
				if (cType == "member") {
					member += cName + '\n';
				}
				else if (cType == "shop") {
					shop += cName + '\n';
				}
				else if (cType == "other") {
					other += cName + '\n';
				}
			}
			const embed = new ds.RichEmbed()
				.setTitle('List of Commands')
				.setFooter('To get information on a specific command, type !commandInfo [name] without brackets.')
				.setColor('AQUA')
				.addField('Member Commands', member)
				.addField('Shop Commands', shop)
				.addField('Other Commands', other)

			msg.author.send(embed);
		})
	},
	cInfo: function (msg, ds, con) {
		let command = msg.content.split(' ')[1];
		access.commandSpecific(command, con, function (res) {
			if (res.length > 0) {
				const embed = new ds.RichEmbed()
					.setTitle(command)
					.setColor('AQUA')
					.addField('Description', res[0].description)
					.addField('Example', res[0].format)

				msg.author.send(embed);
			}
		})
	}
}
