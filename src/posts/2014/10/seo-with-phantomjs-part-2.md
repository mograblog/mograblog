---
title: seo with phantomjs part 2
published: 2014-10-15T02:12:00.000-07:00
description: make your angular website be seo friendly.
keywords: angular, seo, phantomjs, javascript
layout: post.pug
cover: /style/images/memes/car-elevator-crushed-ceiling.jpg
coverTitle: Design Flaws - Ceiling Clearance Collision
shortcodes: true
---



[#alert-info]this article is part of a series of articles explaining about [seo and single page applications.](/2014/10/seo-with-phantomjs.html)
the stack i use contains node, angular, nginx etc.  
in this part we are focusing on crawlers and single page applications  
[#/alert-info]

# identifying a crawler and providing the prerender version

so now that we know how to generate a prerendered version of a page using phantomjs  
all we need to is to identify a crawler and redirect them to the prerendered version.  
turns out this is the tricky part..  

### url fragments

turns out a lot of people don't know this part so i decided to take a minute and explain..  
urls have a general structure of `http://domain:port/path/?query#fragment`  
the part we are interested in this post is the fragment.  
if you are dealing with angularjs, you know that part very well.  
a lot of developers do not know that fragments are client side only and will not reach the backend.  
so you cannot write code in the backend to check if there is a fragment..  

another important thing with fragment you should know is that when you change it in javascript, it does not cause a refresh to the entire page.  
if you change any other part in the url, you will see the entire page refreshes.  
but fragments will not do that..  
and so - single page applications, like the ones that use angularjs, rely heavily on fragments.  
this method allows them to keep a state on the url without reloading the page.  
saving the state is important - it allows you to copy paste the url and send it to someone else - and not refreshing the page gives you a nice user experience  

it is important to also note that recently, since html5, browsers now support changing the url without refreshing the entire page..  
and so no need for fragments anymore..  
in angularjs application you can simply define: `$locationProvider.html5Mode(true)`

personally, i am still not confident enough to use the html5mode, so i keep using fragments. more on this soon  
however - you should consider using html5 mode as some crawlers support only that method.

and so the single page applications live happily ever after.. until seo comes to the picture..  

### how do crawlers handle single page applications ?

by the name you can understand that crawling a single page application is very easy - as there is only a single page.. but is misleading.  
in fact there are a lot of pages in single page applications, but all the pages are loaded lazily in the background while one does not - the single page.  
this actually causes a lot of issues to crawlers as they do not have that "lazy background" feature as it requires running javascript and invoking ajax calls.  

so when a crawler comes to a single page application it should somehow create a request to a prerendered version of the page.  

### google's solution to the problem

along came google and declared a new standard.

if the url contains '#!' (hash-bang), this hash bang will be replaced with `_escaped_fragment_`  
and so if your url looks like so `http://domain:port/path/?query#!fragment` (note the `!` that was not there before) it will be crawled as  
`http://domain:port/path/?query∧_escaped_fragment_=escaped_fragment` where escaped fragment is essentially the fragment without special characters that has other meaning when they are not after a hash tag.  

### html 5 mode

another, more modern option today is to use html 5 mode.  
this essentially tells angularjs to stop using this format `http://domain:port/path/?query#fragment` and to start using `http://domain:port/fragment`.  
browsers can now support changing the url without refreshing, the backend recieves the entire path, and everyone are happy..  
i chose not to use this method as it is relatively new and there is still some trust i need to have in this before i use it.  

but not all crawlers following google's standard.  
if you'll try to share your page on linkedin you will have problems unless you use html5.  
you can still expose specific urls for sharing, but it would be nicer to have it right out of the box.  
i encourage you to try using html5 mode.  

### adding the hash-bang

now comes the sad part of adding a '!' too all your urls..  
define the following to angular : `$locationProvider.html5Mode(false).hashPrefix('!');` and go over all the links you wrote and change them.

for backward compatibility, you should also add a script to your header to redirect from `#` to `#!`:

```
<script>
  try {
        if ( window.location.hash.indexOf('#/') === 0 ){
           window.location.hash = '#!/' + window.location.hash.substring(2);
        }
  }catch(e){
      try{
          console.log('unable to redirect to new url',e);
      }catch(e){}}
</script>
```

## Next time

the next article will help you [set up a sitemap and serve prerendered version of your pages](/2014/10/seo-with-phantomjs-part-3.html)
it bascially applies everything we learned until now.  
that will be the last article in this serie.

</div>