---
title: Contribute a micro library to java with JitPack today! 
published: 2016-07-23T22:30:00.001-07:00
layout: post.pug
cover: /style/images/memes/blueprint-stairs-collision.jpg
coverTitle: Design Flaws - Blueprint vs Reality
keywords: java jit
description: Contributing open source in java is suprt easy with jit.  
---

Java is moving towards the micro lib world.  
For some unknown reason it is called `micro-frameworks`.   
I guess it is because Java can only have frameworks and no libraries..   
The web is full with info about blogs about it and new micro libraries (frameworks!): 

 - http://blog.takipi.com/java-micro-frameworks-the-new-trend-you-cant-ignore/
 - http://sparkjava.com/
 - http://www.javaworld.com/article/2995526/development-tools/jump-into-java-micro-frameworks-part-1.html
 - http://jodd.org/
 - http://www.gajotres.net/best-available-java-restful-micro-frameworks/

<br/> <br/> <br/> 

> There are no small libraries.. only small programmers..

<br/><br/><br/>

 
 

# But! How to publish one?
 
In node/npm it is fairly easy because: 

 - is supports source repositories like github out of the box. 
 - it does not require any module building beforehand
 - it does not have any hard requirements to comply to
 - [libraries exist](https://github.com/sindresorhus/np) that make this process a painless single-command without any code change.  

 
but in maven? How to you easily publish a micro library (framework!).
 
 - Maven central has a bunch of requirements for you to comply to
 - Maintaining your own maven repository is.. well.. no thank you. 
 - The process is pretty manual unless I work hard on the pom. 
  
# In comes JitPack

So I ran into this cool service called JitPack. JitPack is a maven repository that integrates with Github.    
To publish your code all you need is to keep your code on github and use the following groupId and artifactId

```
<groupId>com.github.User</groupId>
<artifactId>Repo</artifactId>
<version>Tag</version>
```

So you need to 
 - make you groupId be : `com.github.__github_username__`
 - make your artifactId be the repository name
 - create a take for your version. 
 - make `mvn install` create the artifact
 
 
# How to use it
 
In order to depend on this new library people will only have to add the JitPack repository like so

```
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>
```

and then add the dependency with the details mentioned above. 


# How to troubleshoot?

Well, lets say `mvn install` crashed. How can you debug the problem?   
You have a build log available at: 

```
https://jitpack.io/com/github/__username__/__repo_name__/__tag__/build.log
```

# Few reason to write a micro lib

Micro libs are awesome because: 

 - They are usually well documented due to the fact there's not much to document. 
 - If needed, you can read and debug their code easily. 
 - The last point means you can also easily contribute. 
 - They are easy to write. Everyone has something to contribute and github makes it even easier with the markdown rendering.
 - All of the above is what makes an active community, which in itself is awesome and brings diversity and ingenuity. 
 
# Conclusion 
 
I really hope Java will be able to create a healthy, micro lib based community.    
JitPack certainly makes this dream possible. I can't see this community starting with it.   

There is just one more problem I thing should be resolved before people will feel safe to go micro.   
And that's the classpath hell problem...
npm/nodejs resolve this problem by not using a global `require`. Importing in nodejs is always relative to the requiring file.  


So I will address this problematic issue next.   
At the meantime, you can follow and contribute to [my stackoverflow question](http://stackoverflow.com/questions/38477570/how-can-i-have-multiple-and-separated-classpaths-in-java). 
 
 

