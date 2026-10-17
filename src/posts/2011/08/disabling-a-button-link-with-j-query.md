---
title: Disabling a button/link with JQuery
published: 2011-08-08T06:44:00.000-07:00
description: easily disable a button/link with jquery
keywords: jquery
layout: post.pug
cover: /style/images/memes/handrail-blocking-door.jpg
coverTitle: You Had One Job - Handrail Blocking Door
shortcodes: true
---

[#alert-info]
This post is old. nowadays you can disable buttons/links with [some css code](http://stackoverflow.com/questions/2091168/disable-a-link-using-css).
[#/alert-info]

As you probably know, if you want to make a sexy button, you need to implement it with a link.

Here is [a simple search I did with Google](http://www.google.com/search?sourceid=chrome&ie=UTF-8&q=how+to+make+a+sexy+button), and [an example for it I found right away](http://www.whoishostingthis.com/resources/sliding-door-buttons/)  

Note - that the post does not explain how to disable/enable the button... And who wants a button that cannot be disabled?  

Disabling a button can be very useful if you want to make sure the form is filled properly. Simply enable it once all the details are ok.  

However, disabling a link is impossible.  
Instead - you need to implement "onclick" with "return false".  

At first, I thought about using [blockUI](http://jquery.malsup.com/block/) - a cool JQuery plugin I recently discovered.  
But it seems it does not block anchors - I could still click the anchors.  

# Solution Step #1

A really good solution would be to change the opacity to 0.4 and add "onclick" as required.  
This works great.  

And at first I used this technique in a Utils function... cool ain't it?  

However, soon enough, I had to have it as a JQuery prototype function (method).  

# Solution step #2

Adding this solution to JQuery was easier than it looks  

```
/** Adding "disable" on expand button**/
$.fn.extend({  

    disableButton:function(){  
            $(this).fadeTo(1,0.3);  
            $(this).click(function(event){event.preventDefault()});  
    },  

    enableButton:function(){  
            $(this).fadeTo(1,1);  
            $(this).attr('onclick','').unbind('click');  
    }  
});  
```

As you can probably see, it's quite easy to add "isButtonDisabled" method to the deal.  

# Troubleshooting

What I really wanted was to modify only the Anchor tags.  
So I tried to do something like  

```
$.fn.extend(AnchorHTMLElement.prototype, { ... } )
```

But it didn't work. If anyone has any idea why, please let me know.  
This is also the reason why I have such specific names for the methods, and not just "enable"/"disable"