const embedify = require('./index');

const url = [
  'https://www.youtube.com/embed/sdfsdf',
  'https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt',
  'https://play.spotify.com/track/sdfgerh',
];

const oEmbed = embedify.create({ parse: false, failSoft: true });

oEmbed.get(url)
  .then(res => console.log(res))
  .catch(err => console.error(err));
