---
title: Quickly Solving NGNIX's "The system cannot find the path specified" in Windows
published: 2010-10-21T03:07:00.000-07:00
keywords: nginx
description: why does nginx cannot seem to find my files? read to know the answer.
layout: post.pug
cover: /style/images/memes/slow-drively.jpg
coverTitle: You Had One Job - Please Slow Drively
---

I just downloaded nginx for a bug/feature to simulate the production environment, and I immediately got :  

```
[alert]: could not open error log file: CreateFile() "logs/error.log" failed (3: The system cannot find the path specified)
2010/10/21 11:39:49 [emerg] 4236#1936: CreateFile() "C:\dev_env\Projects_SVN/conf/nginx.conf" failed (3: The system cannot find the path specified)  
```

The solution to the problem is to open the cmd console with the command  

```
cmd /D
```

But let me explain what is going on  

# Why is this happening?

As you can see, nginx on my computer refers to  

```
C:\dev_env\Projects_SVN
```

as my root directory.  

I am a developer, and it is natural for me to access my projects' root directory more than any other. So I created an AutoRun described at my [Settings AutoRun for CMD and Java Runtime collision problem](http://mograblog.blogspot.com/2010/07/few-days-ago-i-wanted-to-change-folder.html)  

actually - the same solution applies in that post too.. So reading one of these should explain what is going on.  

When nginx runs, it probably opens new cmd console, or something of that sort and tries to navigate to it directory.. but due to my AutoRun command, nginx is confused and not looking at the correct root directory on startup.  

Adding "/D" - prevents running the AutoRun script, hence eliminates the problem immediately.  

problem solved.