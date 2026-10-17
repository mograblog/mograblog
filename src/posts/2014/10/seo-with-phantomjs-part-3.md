---
title: seo with phantomjs part 3
published: 2014-10-22T02:15:00.000-07:00
description: make your angular website be seo friendly.
keywords: angular, seo, phantomjs, javascript
layout: post.pug
cover: /style/images/memes/green-truck-green-vehicles.jpg
coverTitle: Design Flaws - Literal Interpretation
shortcodes: true
---


[#alert-info]
this article is part of a series of articles explaining about [seo and single page applications.](/2014/10/seo-with-phantomjs.html)
the stack i use contains node, angular, nginx etc.  
in this part we are tying up all the loose ends.  
in this article you will have a single page application that supports seo.
[#/alert-info]

# writing the sitemap.xml and adding index.html to your paths

before we reach the final part of hooking it all together there are 2 seo things we should do.  
the first one is to add `index.html` to your path.  
it will make your life easier handling redirects and default index page etc..  
it is not a requirement, but i recommend it and i assume you applied this in the rest of the post.  
plus - developers are not usually aware of this, but not specifying index.html will cause problems when deadling with iframes.  
i am not going to dwell on this here, but only mention that i had 2 iframes in my application that did not work until i added `index.html` to the src attribute.

the other thing is adding a sitemap.  
adding a sitemap tells the crawlers which pages they should crawl.  
it improves the search results.  
i strongly recommend using a sitemap and not relying on the crawling behavior of following links.  

### index.html

adding index.html is done on your front-server and is quite easy.  
all you need to do is add a redirect rule from `/` to `/index.html`  
in nginx it looks like so :

```
rewrite ^/$ \$scheme://\$host/index.html break;
```

### sitemap

sitemaps are xml files that are returns when you approach `/sitemap.xml` path.  
you can also expose them on a different path, and then submit sitemaps to the search engines - this is usually what i do.  

you can maintain a file called `sitemap.xml`, but what is the fun in that?  
if you have public content generated at runtime you should use an auto-generated sitemap.  
simply use [sitemap](https://www.npmjs.org/package/sitemap) module from npm.  
it has a pretty straight forward api.  
even though you can omit the `index.html` from the path as crawlers will now be redirected automatically,  
i recommend you specify it anyway.  
your output should look like so :

```
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">  
 <url><loc>http://www.exmaple.org/index.html#!/public/item/53f0f7b250dab2f71901abf8/intro</loc> <lastmod>2014-09-03</lastmod> <changefreq>hourly</changefreq> <priority>0.5</priority></url>   
</urlset>
```

note that sitemaps has a size limit.  
it can contain upto 50K entries.  
when i helped implementing seo to a site, i prefered to publish the last 10K records that were updated.  
my reasons were:

*   i don't want the crawlers to crawl the entire site every time
*   i don't want to construct a huge sitemap. it will consume a lot of memory and might crush the system

i might be wrong about these 2 assumptions, but i prefered to take the safe road.  

# hooking it all up

to hook everything up, you need to tell your front server to redirect all requests with `_escaped_fragment_` to your backend.  
since we are dealing with a single page application these requests will actually be to an `index.html` file - as there is no other route  
in nginx you can add the following

```
location ~ /index.html {  
    if (\$args ~ "_escaped_fragment_") {  
         rewrite ^(.*)$ /backend/crawler;  
    }  
  }     
```

just change `/backend/crawler` to your path.  

in your express code map this url to the code that uses `phantom`.

```javascript
app.get('/backend/crawler', function(req, res){  
    var url = req.param('_escaped_fragment_');  
    url = req.absoluteUrl('/index.html#!' + decodeURIComponent(url) );  
    logger.info('prerendering url : ' + url ) ;  

    var phantom = require('phantom');  
    phantom.create(function (ph) {  

        setTimeout( function(){  
            try{  
                ph.exit();  
            }catch(e){  
                logger.debug('unable to close phantom',e);  
            }  
        }, 30000);  

        return ph.createPage(function (page) {  
            page.open(url, function ( status ) {  
                if ( status === 'fail'){  
                    res.send(500,'unable to open url');  
                    ph.exit();  
                }else {  
                    page.evaluate(function () {  
                        return document.documentElement.innerHTML;  
                    }, function (result) {  
                        res.send( result);  
                        ph.exit();  
                    });  
                }  

            });  
        });  
    });  
});    
```

there are 2 things in this script that might seem weird  
the first is the method `absoluteUrl`. i assign this method to the request in a middleware.  
this is the implementation  

```javascript
exports.origin = function origin( req, res, next){  
    var _origin = req.protocol + '://' +req.get('Host')  ;  
    req.origin = _origin;  

    // expects a URL from root "/some/page" which will result in "protocol://host:port/some/page"  
    req.absoluteUrl = function( relativeUrl ){  
        return _origin + relativeUrl;  
    };  
    next();  
};    
```

the other thing to note is the 30 seconds timeout that i have, in which i invoke `exit` on phantom.  
this is a safety valve..  
since this code spawns new phantomjs processes, i want to make sure these processes will die eventually.  
i had the unfortunate opportunity to see it go haywire and bringing the machine to 100% cpu.  

on the same note, i suggest you add `killall phantomjs` to your `start` commands so that every time you stop/start your application, it will make sure no orphan phantomjs processes are left.  

so now there is only 1 thing left.  
take a url from the sitemap, replace the `#!` with `_escaped_fragment_` and use `wget` or `curl` on it and see if you get the entire html  

if this worked, you can also go to facebook and try to share the url.  

## The end

thank you for reading this serie. i hope it helped you.
please feel free to comment and give feedback.