Nodlr v0.0.0
============

Nodlr is Express middleware for embedding your Tumblr blog into an Express app.

Example:

    var nodlr = require('nodlr');
 
    var app = express();

    app.use('/blog', nodlr({
      blogName: 'wprl.tumblr.com',
      baseUrl: 'http://kun.io/blog',
      twitterUsername: 'wprl',
      disqusShortname: 'kunio',
      pageLimit: 10,
      maxRssCount: 10,
      api_key: 'todo-your-tumblr-api-key-goes-here'
    }));

*** WORK IN PROGRESS ***

Contact Info

 * http://kun.io/
 * @wprl

&copy; 2013 William P. Riley-Land
