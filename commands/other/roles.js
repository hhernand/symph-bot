module.exports = {
  assign: function(msg){
    let type = msg.content.split(' ')[1];
    if (type == 'streams') {
      msg.member.addRole('494544240789946388');
      msg.channel.send(msg.author + ' You now have the streams role!');
    }
    else {
      msg.channel.send(msg.author + ' That role doesn\'t exist or you can\'t give yourself that role!');
    }
  }
}
