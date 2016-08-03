# Embedify
Simple and robust oEmbed library. Fetches oEmbed information for Soundcloud, Spotify, Vimeo and Youtube links. The library is highly modular and new providers can be added easily (contributions welcome). 

[![Teamcity](https://teamcity.moooji.com/app/rest/builds/buildType:(id:Embedify_Main)/statusIcon?guest=1)](https://teamcity.moooji.com/app/rest/builds/buildType:(id:Embedify_Main)/statusIcon?guest=1)

## Installing
`npm install embedify`

## Usage
````
const embedify = require('embedify');

const options = { parse: true };
const oEmbed = embedify.create(options);

const urls = [
  'https://www.youtube.com/embed/iOf7CsxmFCs',
  'https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt',
];

oEmbed.get(urls)
  .then(res => console.log(res));

````

### Result
````
[{ 
  type: 'video',
  version: '1.0',
  title: '☼ Min sommer road trip | Del 1 ☼',
  html: '<iframe width="480" height="270" src="https://www.youtube.com/embed/iOf7CsxmFCs?feature=oembed" frameborder="0" allowfullscreen></iframe>',
  author: { 
    name: 'Amanda MIDK',
    url: 'https://www.youtube.com/user/AmandaS4G'
  },
  provider: { 
    name: 'YouTube', 
    url: 'https://www.youtube.com/' 
  },
  image: { 
    url: 'https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg',
    width: 480,
    height: 360 
  },
  width: 480,
  height: 270
},
{  
  type: 'rich',
  version: '1.0',
  title: 'Avicii - The Days',
  html: '<iframe src="https://embed.spotify.com/?uri=spotify:track:4th1RQAelzqgY7wL53UGQt" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>',
  author: {},
  provider: { 
    name: 'Spotify', 
    url: 'https://www.spotify.com' 
  },
  image: { 
    url: 'https://d3rt1990lpmkn.cloudfront.net/cover/f8717f432506ab213c4de0c66d6ac24cd07ecf72',
    width: 300,
    height: 300 
  },
  width: 300,
  height: 380
}]
````

## API
### embedify.create([options])
Creates new Embedify instance.

#### options
##### parse
Type: `boolean`
Default: `true`

By default, the provider's response will be parsed and the following schema is ensured:

````
[{ 
  type: string,
  version: string,
  title: string,
  html: string,
  author: {
    name: string,
    url: string,
  },
  provider: {
    name: string,
    url: string,
  },
  image: {
    url: string,
    width: number,
    height: number,
  },
  width: number,
  height: number,
}]
````

If `parse` is set to `false` the raw response will be returned instead, like for example:

````
[{
  provider_url: 'https://www.spotify.com',
  version: '1.0',
  thumbnail_width: 300,
  height: 380,
  thumbnail_height: 300,
  title: ' - ',
  width: 300,
  thumbnail_url: 'https://d3rt1990lpmkn.cloudfront.net/cover/',
  provider_name: 'Spotify',
  type: 'rich',
  html: '<iframe src="https://embed.spotify.com/?uri=spotify:track:sdfgerh" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
}]
````

##### failSoft
Type: `boolean`
Default: `false`

By default, `404` responses from provider APIs (when for example a video has been removed from Youtube etc.) will make Embedify reject the Promise with a `ProviderRequestError`. In cases where an empty result is preferred, `failSoft` can be set to `true` and Embedify will resolve normally with no/empty result for that particular URL.

##### concurrency
Type: `number`
Default: `10`

Sets the maximum number of concurrent HTTP requests to provider APIs. 

### oEmbed.get(urls)
Returns a Promise and resolves to oEmbed information for all URLs that matched a provider.

##### urls
Type: `string` or `array<string>`

URL or list of URLs to get oEmbed information for.