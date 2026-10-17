---
title: json parse is insane
published: 2014-10-29T02:39:00.000-07:00
description: 3 reasons why I think JSON.parse is insane!
keywords: javascript
layout: post.pug
cover: /style/images/memes/drowning-lol-sign.jpg
coverTitle: Design Flaws - Drowning in JSON.parse
---

every project i've been in so far had the same stupid bug with `JSON.parse`.
at the beginning someone got a string instead of an object and they used `JSON.parse` to convert it to an object.  
then after a while, someone fixed it upstream, and now `JSON.parse` is getting an object and fails with a very cryptic error message.  

i always make sure my code is safe and i write it as such:

```javascript
item = result.data;
if ( typeof(item) === 'string' ) {   
   item = JSON.parse(item);  
}  
```

however, each time i write this piece of code, it seems to me like it is a bug in javascript.

seems to me like 1 of 2 things should happen:

*   javaScript should throw an error `you cannot parse an object`
*   javaScript should simply return the object as there's nothing to parse.


i think the latter is better and more aligned with the rest of JavaScript behavior.
but what happens now is simply insane - JavaScript implicitly converts the object `toString` and tries to parse that.  
which is insane because nowhere in the world of JavaScript is `toString` meant to return a JSON.  
this is why you have `JSON.stringify` to begin with.  
so if anything at all `JSON.parse` should use `JSON.stringify` instead of `toString`  
- but what would be the point of that? simply return the object you got.

another reason why this is insane is that `toString` returns `[object Object]`
which ironically enough starts like an array (which is a valid input for `JSON.parse`) and so the error developers get is `invalid token o`.  
and last reason for insanity is that this has been the situation for quite a while now.  

i tried to see what other libraries are doing with this insanity :
turns out that JQuery doesn't try to fix this issue. `$.JSONparse` is just as insane.  
lodash does not offer anything in this matter.  
i know that `angular` behaves nicely - like i expected - but for projects that don't use angular, it would be an overkill to use angular just for this.  
other than that, I could not find any references to this problem anywhere.  
this problem seems to me a lot like the `console.log` problem - that it does not exist in some browsers - and should have a similar fix.  

my current recommendation to fix this issue by replacing `JSON.parse` method with something like

```javascript
JSON.parseString = JSON.parse  
JSON.parse = function ( o ) {  
    if ( typeof(o)  === 'string' ){   
       return JSON.parseString.apply(arguments);  
    } else {   
        return o;   
    }    
}  
```


but i keep getting strong objections on such a solution as it is intrusive. **what do you think? leave comments below.**
