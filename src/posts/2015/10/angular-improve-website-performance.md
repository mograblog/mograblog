---
title: Angular - 5 lines of code to prevent memory leaks
published: 2015-10-11T22:30:00.001-07:00
layout: post.pug
cover: /style/images/memes/striped-stair-carpet-optical-illusion.jpg
coverTitle: Design Flaws - Optical Illusion Hazard
keywords: angular, javascript
description: 5 lines of code in angular written once can affect your entire project by auto releasing resources and cancel delayed action after navigating away from the page. in this post i will explore and explain the problem and its solutions.
---

5 lines of code in angular written once can affect your entire project by auto releasing resources and cancel delayed action after navigating away from the page.
in this post i will explore and explain the problem and its solutions.

# The problem

Programmers usually miss it, but if you use `$timeout` or `$interval`, or even `$http` - the promise lives beyond the scope.
So if you navigate back and forth between pages, you get a leak of unreleased resources or some other unwanted behavior.


and then upsetting things can happen. imagine a simple redirect after an ajax request success:  

```js
$http.get( .. ) .then( function(){ $location.path(.. ) }  
```

or polling every second?

```js
$interval( func, 1000);  
```

what most people don't know is that you have to cancel them with scope destruction..  
Here is first result in google: [Ben Nadel's - Don't Forget To Destroy Events](http://www.bennadel.com/blog/2548-don-t-forget-to-cancel-timeout-timers-in-your-destroy-events-in-angularjs.htm) You probably missed that, or missed something somewhere and there are leaking pollings and stuff in your code that you are unaware of. That's a shame because with probably 5 lines of code you can improve the behavior and performance of your code.

## How to destroy events the ugly way?

simply(?) do `$scope.$on('$destroy', .. )`.  
Some people will do `$onLocationChange` or something nasty, just so they won't have to work hard..
but that's uuuuuglly...
don't you agree? just for a single scenario..
not a complete solution

## How to destroy events the pretty way?

since I want events to exist only with scope, wouldn't that be most intuitive to have `$scope.$interval` for example? or even `$scope.$http` so that if the scope is destroyed, the event is cancelled. Well, here is how you do that

```js
angular.module('mograblog', [])  
    .run(function($rootScope, $interval) {  
        // add the register task to the rootScope. This will allow for autoUnregister when the  
        // scope is destroyed to prevent tasks from leaking.  

        var ScopeProt = Object.getPrototypeOf($rootScope);  
        ScopeProt.$interval = function(func, time){  
             var timer = $interval(func,time);  
             this.on('$destroy', function(){ $timeout.cancel(timer); });  
             return timer;  
        };  
    });
```

this solution uses the fact that scopes has a prototypical inheritance and adds a function to all scopes (including isolated). This function will simply cancel the interval. Same thing can be done for the rest. and that's it!