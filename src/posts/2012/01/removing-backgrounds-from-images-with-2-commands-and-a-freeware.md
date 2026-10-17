---
title: removing backgrounds from images with 2 commands and a freeware
published: 2012-01-11T13:56:00.000-08:00
description: using imagemagick to remove background
keywords: imagemagick
layout: post.pug
shortcodes: true
---

> [!NOTE]
> **Update:** This 2012 post is preserved for nostalgia! For modern background removal using neural networks (`rembg`, WebGPU, and macOS Quick Actions), check out the new guide: **[Removing Backgrounds from Images: From ImageMagick Hacks to Modern AI](/2026/09/removing-backgrounds-from-images-imagemagick-to-modern-ai)** (or the [2013 ImageMagick follow-up](/2013/04/removing-background-from-image-with-imagemagick-revisited)).

I had a problem.. I bought an image from [istackphoto.com](http://www.istockphoto.com/) and I had to use it.
Seems the image was in [EPS](http://en.wikipedia.org/wiki/Encapsulated_PostScript) format and had 17MB !!  

So I had an enormous EPS file that I needed to convert to a transparent PNG.  
Oh, and I must use freewares.  

GIMP was no help at all. Neither was Inkscape and a bunch of other applications I downloaded.  

A strange thing kept appearing - I got the image opened at some point.. but it had a black background instead of white and the colors were weird.  
I later discovered this was the "negation" of the image - or more correctly, I had to negate the image with white background in order to set the colors right again.  

My computer got stuck like a million times due to the size of the file.  
I read about 30 blogs/forums and so on until I ran into a nifty tool call [imagemagick](http://www.imagemagick.org/script/index.php).  

This tool provides some pretty useful commands you can run on your computer. (supports windows too).  
For example

```
convert guy.png -negate guy.png
```

which pretty much sorted the colors right away.. :)  

In order to remove the background I used the following command

```
convert guy.eps -resize 256x256 -alpha copy -negate guy.png  
```

The "negate" flag came to me after a while.  
I had to read a bunch of articles : [mask 1](http://www.imagemagick.org/Usage/compose/#mask_trans)[mask 2](http://www.digitalphotoguides.com/remove-photo-background.html)[mask 3](http://www.imagemagick.org/discourse-server/viewtopic.php?f=10&t=8711) Now that's it! I have the image in transparent background. I still have some work to do on it since some places where there should be white, it is now transparent. But that's kids play for me.  

I hope I saved you some pretty nasty frustrations.</div>