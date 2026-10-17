---
title: Add pageviews and news feed to static website with firebase
published: 2016-08-14T22:30:00.001-07:00
layout: post.pug
cover: /style/images/memes/do-not-enter-enter-only.jpg
coverTitle: You Had One Job - Do Not Enter / Enter Only
keywords: firebase, pageviews, static website, javascript
description: Now that you have a static website, lets add pageviews counter and dynamic news feed to it using firebase 
---

# Introduction 

Previously I wrote about [how to setup a static website with metalsmith](/2016/07/move-your-blog-from-blogger-to-metalsmith-today.html).   
Today, I will describe how you can add dynamic and persistent content to your static website using firebase

# Why firebase?

There are plenty of ways to add persistency and dynamicity to static websites today.     
[Heroku](https://www.heroku.com/), for example, is one of them.   
In fact, every online hosting combines with DB as a service could fit.    
Firesbase is just one of those services. So why choose it? 

 - I haven't used it yet and this is a good chance.
 - Firebase dispatches events on every data change - which is exactly what I need. 
 - Firebase offers safely writing data directly to the DB with no backend and with validity rules. 
 
Which makes it perfect for the task at hand. 

### Initialize the client 

My goal is to get the blog post readable as soon as possible, and so I want to load the firebase client asynchronously. 
So I used jquery's `getScript` method.

And afterwards I initialized the firebase client by copy-pasting from their website. The process is painless. 
 
 
```javascript

$.getScript('https://www.gstatic.com/firebasejs/3.2.1/firebase.js', function () {

/**
 * initialize
 * @type \{{apiKey: string, authDomain: string, databaseURL: string, storageBucket: string}\}
 */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBPkaNJa7n7yb670VB07t-6SO5nGSJ_3R0",
  authDomain: "mograblog.firebaseapp.com",
  databaseURL: "https://mograblog.firebaseio.com",
  storageBucket: ""
};
firebase.initializeApp(config);
var rootRef = firebase.database().ref();
  
```
 
The `apiKey` looks like secret information, but in my case it is not.     
If you keep communication with firebase in the backend, then you shouldn't worry.    
But in my case communication is from frontend, so I need to be careful.   
For this purpose, firebase invented a `rules` mechanism. 
 
### The features I want and their Data-Structure

I wanted 2 features

 - **pageviews counter** - each page counts how many times it is visited. (not uniquely). 
 - **a 'see what others are reading'** news feed on the side of the page
 
The data structure I decided on is 

```
 + root
     + pageviews:Map<String,Integer> - a map from page url to views 
     + currentlyReading:Array<Item>
        + Item 
            - timestamp:long
            - title:String
            - url:String
```

And now, I have to make writing to firebase safe by validating the information

### The Rules

The source below describes the following rules: 

 - pagesviews page value should be an integer and is only writable if it increments previous value by 1, or previous value does not exist. 
 - currentlyReading array is no longer than 10 items
 - every 'currentlyReading' item contains a title and a url which are strings
 
Hopefully these validation are enough to make me sleep good at night.    
Here is how it looks like in the firebase console


```json
{
  "rules": {
    ".read" : "true",
    ".write" : "true",
    "pageviews" : {
      "$page" : {
        ".validate" :  "newData.isNumber() && ( !data.exists() || newData.val() == data.val() + 1)"
      }
    },
    "currentlyReading" : {
      ".validate" : "!newData.hasChild('11')",
      "$index" : {
        ".validate" : "newData.child('title').isString() && newData.child('url').isString()"
      }
    }
  }
}
```

Lets walk through the rules 

 - The first `rules` key is the root for the rules document. 
 - followed by `.read` and `.write` which allow general read and write to the document
 - `pageviews`, followed by a random `$page`
 - writing to `pageviews->$page` is allowed only if the new data is a number (number of views) and the old data either not does exists or will be incremented by the new value
 - `currentlyReading` is valid only if it doesn't have child `11`. (note: children keys are always strings)
 - every item in the array, noted by `$index`, must have a child named `title` which is a string, and a child `url` which is also a string

# And now to the client code

### Update pageviews

```
var pageViewsRef = rootRef.child('pageviews');
if (window && window.location && window.location.pathname) {

  /****
   *
   * update page views
   *
   ****/
  var pathkey = slug(window.location.pathname);
  pageRef = pageViewsRef.child(pathkey);
  var counted = false;

  pageRef.on('value', function (pageviews) {
    var pageviewsCount = pageviews.val();
    var $pageviews = $('.pageviews');
    $pageviews.attr('title', pageviewsCount + ' people saw this post');
    $pageviews.text(pageviewsCount);
    $pageviews.addClass('initialized');
    if (!counted) {
      counted = true;
      pageRef.transaction(function (views) {
        return views + 1;
      })
    }
  });
}
```

First I slugify pathname. (slugging makes the pathname legal json key and keeps it readable).    
Then I register to `value` event. On each value change I update the DOM.   
If this is the first event, I also update the value. 

You might be wondering why I first register to the value event, update the dom and only then update the value in firebase.   
This causes the `value` event to fire twice on each page load.   

The reason I did it is that the event is fired twice anyway - no matter the order in which I write the code.   
However, if I first update the value, the first `value` event will show `1`, and with a delay it will retrieve the updated value.   
 
At least this way I don't show anything until we have the most updated value to that point. 

How cool is it that this code will update the counter LIVE! 

### Update the 'currently reading' section

The code below takes the same approach of 'first read the value then update it' so to display a very updated value first.    


```javascript
 /******
  *
  * update currently reading
  *
  *******/
var currentReadingRef = rootRef.child('currentlyReading');
var currentlyReading = false;
currentReadingRef.on('value', function (currentlyReadingValue) {

  /*****
   *
   * construct the twitter-feed like display
   *
   *****/
  var $currentlyReading = $('.currently-reading');
  $currentlyReading.empty();
  currentlyReadingValue.val().forEach(function (value) {
    $currentlyReading.append(
      $('<a>', {text: value.title, href: value.url, 'class': 'currently-reading-link mograblog-link'})
    );

    var agoText = 'earlier..';
    if (value.timestamp) {
      var hoursAgo = Math.floor(( Date.now() - value.timestamp ) / ( 1000 * 60 * 60 ));
      agoText = hoursAgo < 2 ? 'right now..' : hoursAgo + ' hours ago';
    }

    $currentlyReading.append(
      $('<div>', {text: agoText, 'class': 'currently-reading-ago'})
    )
  });
  $('.currently-reading-wrapper').addClass('initialized');

  /**
   *
   * update the value
   *
   */
  if (!currentlyReading) { // modify only once
    currentlyReading = true;
    currentReadingRef.transaction(function (currentlyReadingArray) {
      var postTitle = $('.post-title').text();
      try {
        if (currentlyReadingArray && currentlyReadingArray.length > 0 && currentlyReadingArray[0].title == postTitle) { // don't modify if already registered this post
          return;
        }
      } catch (e) {
      }
      return [{ // add this post and append with all the rest
        title: postTitle,
        url: document.location.pathname,
        timestamp: Date.now()
      }].concat(currentlyReadingArray.slice(0, currentlyReadingArray.length - 1))
    })
  }
})
```

