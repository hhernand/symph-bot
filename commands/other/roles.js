module.exports = {
    assign: function (msg) {
        let type = msg.content.split(' ')[1];
        if (type == 'streams') {
            msg.member.addRole('494544240789946388');
            msg.channel.send(msg.author + ' You now have the streams role!');
        }
        else if (type == 'vampires') {
            msg.member.addRole('496024106790289418');
            msg.channel.send(msg.author + ' You joined team vampires!');
        }
        else if (type == 'werewolves') {
            msg.member.addRole('496024187505475629');
            msg.channel.send(msg.author + ' You joined team werewolves!');
        }
        else if (type == 'zombies') {
            msg.member.addRole('496024360390230048');
            msg.channel.send(msg.author + ' You joined team zombies!');
        }
        else {
            msg.channel.send(msg.author + ' That role doesn\'t exist or you can\'t give yourself that role!');
        }
    }
}
