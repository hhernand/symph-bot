module.exports = {
    assign: function (msg) {
        let type = msg.content.split(' ')[1];
        let roles = {
            streams: {
                id: '494544240789946388',
                message: 'You now have the streams role! You\'ll get pinged when anyone\'s hosting a stream.'
            },
            arpgnews: {
                id: '546412364904398848',
                message: 'You\'ve signed up to be pinged for any ARPG news we post!'
            },
            gamecorner: {
                id: '546412451638411284',
                message: 'You\'ll now be alerted when we host games in the server!'
            }
        }
        if (type in roles ) {
            msg.member.addRole(roles[type].id);
            msg.channel.send( `${msg.author} ${roles[type].message}`);
        } else {
            msg.channel.send(msg.author + ' That role doesn\'t exist or you can\'t give yourself that role!');
        }
    }
}
