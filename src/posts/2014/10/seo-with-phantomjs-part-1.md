---
title: seo with phantomjs part 1
published: 2014-10-08T02:08:00.000-07:00
description: make your angular website be seo friendly.
keywords: angular, seo, phantomjs, javascript
layout: post.pug
cover: /style/images/memes/decorative-apple-gate-hole.jpg
coverTitle: Design Flaws - The Apple Gate Security Hole
shortcodes: true
---



[#alert-info]
this article is part of a series of articles explaining about [seo and single page applications.](/2014/10/seo-with-phantomjs.html)
the stack i use contains node, angular, nginx etc.  
in this part we are focusing on phantomjs and how to use it to prerender a page with javascript.  
[#/alert-info]

# phantomjs to the rescue


phantomjs is a browser that runs in the memory (no graphics required).  
you install it by running `npm -g install phantomjs` and then verify it is available by running `phantomjs --version`.  
since it is a browser, it can do whatever a browser can such as render css, execute javascript and so on  

first thing i did was write a small snippet of code testing out phantomjs.  
[here is a great snippet](http://phantomjs.org/api/webpage/property/content.html "PhantomJS get HTML") you find when searching `phantomjs get html` from phantomjs official site

```
var webPage = require('webpage');  
var page = webPage.create();  

page.open('http://phantomjs.org', function (status) {  
  var content = page.content;  
  console.log('Content: ' + content);  
  phantom.exit();  
});  
```

so i wrote a file call `phantom_example.js` and obviously did the same mistake like everyone else  
and i ran `node phantom_example.js`.  
and i got the following error

```
module.js:340  
    throw err;  
          ^  
Error: Cannot find module 'phantom'  
    at Function.Module._resolveFilename (module.js:338:15)  
    at Function.Module._load (module.js:280:25)  
    at Module.require (module.js:364:17)  
    at require (module.js:380:17)  
    at Object. <anonymous>(/full/path/scripts/phantom_example.js:2:19)  
    at Module._compile (module.js:456:26)  
    at Object.Module._extensions..js (module.js:474:10)  
    at Module.load (module.js:356:32)  
    at Function.Module._load (module.js:312:12)  
    at Function.Module.runMain (module.js:497:10)</anonymous> </pre>

```

after digging around i found the obvious solution.
phantomjs is a command line, and not a library i include.  
so running the command `phantomjs phantom_example.js` resolved it for me and i got the html.

# running this from within my server

so this script required me to run phantomjs while i wanted to get the same result without leaving the server.
this was even simpler.  
turns out there are a lot of libraries that do just that  
my personal favorite is [phantom](https://www.npmjs.org/package/phantom).  
these libraries essentially run the `phantomjs` commandline for you.  
so when you invoke them, you will see a phantomjs process running in the background  
and so some of them might require you to pre-install phantomjs.  
phantom is a library that requires it to be installed.  
here is a script with phantom that does the same thing. running `node phantom_example.js` will produce the right result.  

```
var phantom = require('phantom');  
var url = 'http://phantomjs.org';  
phantom.create(function (ph) {  
    return ph.createPage(function (page) {  
        page.open(url, function ( status ) {  
            if ( status === 'fail'){  
                console.log('unable to open url', status);  
                ph.exit();  
            }else {  
                page.evaluate(function () {  
                    return document.documentElement.innerHTML;  
                }, function (result) {  
                    console.log( result);  
                    ph.exit();  
                });  
            }  

        });  
    });  
});      
```


## Next part

the next article will talk about [crawlers and single page application](/2014/10/seo-with-phantomjs-part-2.html) where we will understand the problem and 2 solutions introduced by google and html5.
