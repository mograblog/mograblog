---
title: What to do when Apache shows your PHP as plain text
published: 2011-02-21T13:16:00.000-08:00
keywords: apache, plaintext
description: this is how you can resolve apache showing plaintext instead of html
layout: post.pug
cover: /style/images/memes/misaligned-billboard.jpg
coverTitle: You Had One Job - Misaligned Billboard
---

I enabled my apache with SSL recently.. Had to change many files.  
And once I managed to get SSL working, I noticed my PHP configuration was messed up..  

I had no idea what to do.  
My PHP files were shown as Plain text.  

I searched and searched on the web, when suddenly I figured out the problem without finding it online.. which is exactly why I maintain this blog.  

The solution is SO SIMPLE it's simply annoying..  

Check your conf/mime.types file and make sure you see the lines  

```
application/x-httpd-php php
application/x-httpd-php-source phps  
```

That solved the problem to me..  
Please comment me if it didn't help you - I would love to solve your problems as well.  
Enjoy.