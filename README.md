Nodlr v0.0.0
============

Nodlr is Express middleware for embedding your Tumblr blog into an Express app.

Example:

    app.use('/blog', nodlr({
      blogName: 'wprl.tumblr.com',
      baseUrl: 'http://kun.io/blog',
      twitterUsername: 'wprl',
      disqusShortname: 'kunio',
      pageLimit: 10,
      maxRssCount: 10,
      api_key: 'todo-your-api-key-goes-here'
    }));
 
MIT License (non-commercial use only)

*** WORK IN PROGRESS ***

Contact Info

 * http://kun.io/
 * @wprl

&copy; 2012 William P. Riley-Land
