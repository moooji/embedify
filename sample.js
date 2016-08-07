const embedify = require('./index');

const url = [
  'https://www.youtube.com/embed/iOf7CsxmFCs',
  'https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt',
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/265653966&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true',
];

const oEmbed = embedify.create({ parse: true, failSoft: true });

oEmbed.get(url)
  .then(res => console.log(res))
  .catch(err => console.error(err));
