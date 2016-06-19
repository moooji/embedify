const embedify = require('./index');

const url = [
  'https://www.youtube.com/embed/iOf7CsxmFCs',
  'https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt',
];

const oEmbed = embedify.create({ parse: true });

oEmbed.get(url)
  .then(res => console.log(res))
  .catch(err => console.error(err));
