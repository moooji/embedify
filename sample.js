const embedify = require('./index');

const url = ['https://www.youtube.com/embed/iOf7CsxmFCs'];

embedify(url)
  .then(res => console.log(res))
  .catch(err => console.error(err));
