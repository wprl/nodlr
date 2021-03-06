// Dependencies
// ------------
var express = require('express');
var request = require('request');
var consolidate = require('consolidate');

// Private Members
// ---------------

// A regex that matches <tags>
var tagMatcher = /[<][^>]*[>]/g;

// This function cleans up blog article titles for use in human-readable URLs
function safeTitle () {
  return this.title.replace(/[ ]/g, '+').replace(/[?]/g, '');
}

// This function truncates body HTML and removes tags
function preview () {
  var output = this.body.replace(tagMatcher, '');
  return output.substring(0, 256) + '&#8230;'; // elipsis
}

// This function pulls data from Tumblr
function pullTumblr (options, querystring, callback) {
  querystring.api_key = options.api_key;

  request(
    {
      uri: 'http://api.tumblr.com/v2/blog/' + options.blogName + '/posts/text',
      qs: querystring
    },
    function (error, response, body) {
      if (error) return callback(error);

      var renderOptions = {
        safeTitle: safeTitle,
        preview: preview,
        baseUrl: options.baseUrl,
        twitterUsername: options.twitterUsername,
        disqusShortname: options.disqusShortname
      };

      callback(null, JSON.parse(body), renderOptions);
    }
  );
}

// A function that returns Express middleware for handling the article list pages
function handleBlog (options) {
  var f = function (request, response, next) {
    var pageNumber = parseInt(request.params.pageNumber) || 0;
    var offset     = pageNumber * options.pageLimit;

    var querystring = {
      limit: options.pageLimit,
      offset: offset
    };

    pullTumblr(options, querystring, function (error, body, renderOptions) {
      if (error) return next(new Error(error));

      renderOptions.posts = body.response.posts;
      renderOptions.lastPage = body.response.total_posts <= (offset + options.pageLimit);
      renderOptions.firstPage = pageNumber === 0;

      response.render('blog.html', renderOptions);
    });
  };

  return f;
}

// A function that returns middleware for serving individual blog articles
function handleBlogArticle (options) {
  var f = function (request, response, next) {
    var querystring = {
      limit: 1,
      singleArticle: true,
      id: request.params.id
    };

    pullTumblr(options, querystring, function (error, body, renderOptions) {
      if (error) return next(new Error(error));

      renderOptions.posts = body.response.posts;
      renderOptions.singleArticle = true;

      response.render('blog.html', renderOptions);
    });
  };

  return f;
};

// A function the returns middleware that generates an RSS feed
function handleBlogRss (options) {
  var f = function (request, response, next) {
    var querystring = { limit: options.maxRssCount };

    pullTumblr(options, querystring, function (error, body, renderOptions) {
      if (error) return next(new Error(error));

      renderOptions.posts = body.response.posts;
      renderOptions.layout = false;

      response.setHeader('Content-Type', 'application/rss+xml');
      response.render('blog.rss', renderOptions);
    });
  };

  return f;
};

// Module Definition
// -----------------
var nodlr = module.exports = function (options) {
  if (!options.api_key) throw new Error('Please supply a Tumblr API key');

  var app = express();

  app.engine('html', consolidate.mustache);
  app.engine('rss', consolidate.mustache);

  app.set('view engine', 'html');
  app.set('views', __dirname + '/templates');

  app.get('/rss', handleBlogRss(options));
  app.get('/', handleBlog(options));
  app.get('/p:pageNumber', handleBlog(options));
  app.get('/:id/:title?', handleBlogArticle(options));

  return app;
};
