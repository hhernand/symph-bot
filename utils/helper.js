module.exports = {
  extractItem: function(msg) {
    let first = msg.split(' ')[0];
    let second = msg.split(' ')[1];
    let phrase = first + ' ' + second + ' ';
    let item = msg.split(phrase)[1];
    return item;
  }
}
