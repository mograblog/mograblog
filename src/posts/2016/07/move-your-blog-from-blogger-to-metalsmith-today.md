---
title: Move your blog from blogger to metalsmith today
published: 2016-07-13T22:30:00.001-07:00
layout: post.pug
cover: /style/images/memes/stair-handrail-cutoff.jpg
coverTitle: Design Flaws - Stair Handrail Cutoff
keywords: metalsmith, javascript
description: Moving your blog out of blogger and migrating to metalsmith is easy and worth your while. This is how you can do it. 
---

# Introduction 

Over the years I have maintained a technical blog on blogger.    
However, blogger's interface is not so friendly for technical writing.  

After a lot of thought, I decided to use metalsmith with markdowns, github, s3 and travis-ci to maintain my blog.   
Some of the benefits I got from it are:
 
  - This stack is more familiar to me due to my work
  - markdowns are much more friendly for technical writing.
  - I have nice revisions with git
  - I have full control over the bucket in s3

# Step 1 - Export your blogger blog in JSON format

Simply use `wget http://__blog_name__.blogspot.com/feeds/posts/default?alt=json`

# Step 2 - decide on folder structure and convert JSON to markdowns

I decided on 

```
src
  --- layouts
  --- partials
  --- posts
         ----- YEAR in 4 digits
                 ---- MONTH in 2 digits
                          ------------------- post title as slug
  --- scripts 
  --- styles (scss)
  --- index.md (main file)
         
```

and then I used a simple script that converts the JSON data to this folder structure. 
You can check out my script on my [mograblog github project](https://github.com/guymograbi/mograblog). 

# Step 3 - Write your metalsmith file

Metalsmith is so intuitive and powerful it's insane!

You basic metalsmith script looks like 

```

var Metalsmith = require('metalsmith');

var app = new Metalsmith(__dirname)
            .use(function(){ ..  do something .. })
            .use(function(){ ..  do something .. })
            .use(function(){ ..  do something .. })
            
               .... 
            .build(function(err){ console.log(err); })
               
```

so basically you compose a list of plugins to manipulate your files. 

You can check my metalsmith file at my [mograblog github project](https://github.com/guymograbi/mograblog).

Some obvious plugins that you will need are: 
 
 - markdown to html
 - some templating library (I used handlebars)

I am also using

 - sass to compile my styles
 - link checker
 - rss builder

# Step 4 - Upload with bucketful 

[Bucketful](https://github.com/jakobmattsson/bucketful) is a nifty library in nodejs that deploys static files to s3.
 
# Step 5 - Define your build 

Simply setup your `package.json` file like so


```
"scripts": {
    "start": "metalsmith-start",
    "build": "node metalsmith.js",
    "upload": "npm run build && echo 'starting upload' && bucketful --source build --bucket www.mograblog.com --key $S3_KEY --secret $S3_SECRET_KEY"
},
```

So now, all you have to do is run `npm run upload` to upload your blog.   
Note that environment variables must be defined


# Step 6 - Define your travis.yml

```yaml

language: node_js
script: npm run upload
branches:
  only:
  - master
env:
  secure: __some_long_string__

```

To get your secret S3 credentials you need to install travis command line and run the command

`travis S3_SECRET_KEY="$S3_SECRET_KEY" S3_KEY="$S3_KEY" --add env`

And that's it - now if you enable the repository in travis, it will upload the website. 


<div class="info">Checkout my next post on [static website and how to add pageviews counter](/2016/08/static-site-page-counter.html)</div>

