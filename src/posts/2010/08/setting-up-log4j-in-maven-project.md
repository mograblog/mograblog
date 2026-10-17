---
title: Setting up log4j in a maven project
published: 2010-08-21T12:23:00.000-07:00
description: easily setup log4js in a maven project
keywords: log4js
layout: post.pug
cover: /style/images/memes/nothing-is-possible.jpg
coverTitle: Design Flaws - Nothing is Possible
---

I always forget how to quickly set up log4j in my maven project, even though it is really easy.  

I keep getting  

```
log4j:WARN No appenders could be found for logger (mogi.code.reflection.Utils).
log4j:WARN Please initialize the log4j system properly.  
```

So if you get this too, and all you want is to get things printed to your console, all you need to do is add a log4j.properties file under src/main/resources folder and populate it with the following text  

```
log4j.rootLogger=DEBUG, A1
log4j.appender.A1=org.apache.log4j.ConsoleAppender  
log4j.appender.A1.layout=org.apache.log4j.PatternLayout  

# Print the date in ISO 8601 format  
log4j.appender.A1.layout.ConversionPattern=%d [%t] %-5p %c - %m%n  

# Print only messages of level WARN or above in the package com.foo.  
log4j.logger.com.foo=WARN  
```

after that you should start seeing your log on console.  
[read more about log4j](http://logging.apache.org/log4j/1.2/manual.html)