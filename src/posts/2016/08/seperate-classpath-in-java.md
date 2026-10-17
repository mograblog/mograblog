---
title: Java classpath hell solution
published: 2016-08-15T22:30:00.001-07:00
layout: post.pug
cover: /style/images/memes/confusing-traffic-signs.jpg
coverTitle: You Had One Job - Confusing Traffic Signs
keywords: java, classpath
description: Keep your classpath clean and sweet using this trick  
---

If there's one thing I really like in `nodejs` is how it loads dependencies.   
Each dependency is loaded relatively from the current file or from a known path (usually `node_modules`).   
Unfortunately in java things are much messier. Today I will show how you can create a folder named `java_modules` that acts similarly to `node_modules`.      
      
# The example

In today's post we will consider the following as the example at hand: 

```java
package guymograbi;

public class MyMessage {
    public String getMessage(){
        return "message from dep_1";
    }
}
```

The problem we are trying to solve is about multiple classes named `guymograbi.MyMessage` in the classpath.   
What is I have `module-a.jar` and `module-b.jar` (which can represent different versions of the same jar, right?), each containing `guymograbi.MyMessage`.    

What if we have `dependency-a` and `dependency-b` both relying on `module-a` and `module-b` respectively?   
Lets also assumes there's no backward compatibility.    
We need to find some way to let `dependency-a` load `module-a` , while letting `dependency-b` load `module-b` and avoid collisions. 

Turns out the solution is not that hard or crazy.. We might want to consider changing the way we pack our project in java.

# First solution - Use reflection
       
We will soon see that this solution is not so good. We are actually losing all of java's benefits.   
But this is how it would look like should we choose to use this method
       
       
```java
public String runGetMessageFromDep1() throws MalformedURLException, ClassNotFoundException, IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
    URL url = new File("java_modules/dep_1.jar").toURI().toURL();
    URLClassLoader urlClassLoader = new URLClassLoader(new URL[]{url});
    Object o = urlClassLoader.loadClass("guymograbi.MyMessage").newInstance();
    return (String) o.getClass().getMethod("getMessage").invoke(o);
}       
```
       
Ug-ly!
      
Do I even need to specify the reasons why not to use this method?       

 - does not benefit from java strong typing. 
 - will not produce nice stack traces
 - simply not the java way.. 

### Note! It would be better to find the jar by using `getResource` rather than `File`

This is a good point to bring up now, and this will be very useful below when we try to resolve problems to scale this solution.    

If we could assume that `java_modules` is in our classpath, all we need to do is

```java
return MyMain.class.getClassLoader().getResource("dep_1.jar").toURI().toURL();
```

This is even more similar to how `node_modules` behave in `nodejs`. Which for me looks like a good sign. 

# Second solution - ServiceLoader!

This solution assumes there's an API exposed in an external jar, which is quite reasonable nowadays. 
So ServiceLoader assumes each interface has a declared implementation. In our example it is : 

```
resource/META-INF/services
                    +---- guymograbi.IMyMessage
```                        
 
And the file's content is the implementation classname - `guymograbi.MyMessage`.   
This is similar to `package.json` `main` entry.   
Still this is a bit ugly.. can we avoid this?    
For now, this is how the code looks like: 


```java
// .. create class loader like before
ServiceLoader<IMyMessage> load = ServiceLoader.load(IMyMessage.class, urlClassLoader);
for (IMyMessage t : load) {
    return t;
}
throw new RuntimeException("could not find implementation to IMyMessage"); 
```    

# Using both worlds

Do we really need the `ServiceLoader`?   
Why not simply use: 

```
return (IMyMessage) urlClassLoader.loadClass("guymograbi.MyMessage").newInstance();
```

Now this is becoming more like `nodejs`. We are requiring classes relative to their classpath.    
Now there's no need to declare all interfaces and their implementations in `META-INF`.   

# Piece of cake

Do you use any factory? Spring, Guice?    
Then you can simply implement a factory that uses `ServiceLoader` and you will never know the difference :)   
You will get the same behavior but a cleaner classpath. 

# So what's stopping me from using it right now? 


## Better way to pack my project 

Before I use it, there is 1 more thing I am missing.. An easy way to pack the project.     
I would like to have the following structure

```
   - my-jar.jar
   + java_modules // a directory that contains all my dependencies but is not included in the classpath
       - dependency #1
       - etc.. 
       
```

While this problem exists, it is less interesting. 

## I need this solution to scale

If I use `ServiceLoader` in my module as described, I need a way to make my module reused.   
Basically this means I need the first problem to scale.    
 
This is a much more interesting problem to solve. 

If everyone were to use `ServiceLoader` tomorrow it would be easier, but that's not the case.    

So we need

 - a single jar solution for anyone not using `ServiceLoader`
 - a `java_modules` solution for anyone using `ServiceLoader`
 
# How to solve those problems
 
 - We can use `mvn dependencies:tree` plugin to construct the desired folder structure once we packaged 3rd-parties properly. 
 - We will need a way to allow dependencies to find their dependencies. There are 2 simple ways to do that:
   - rely on whoever invoked us that he defined the ClassLoader in a way that puts our `java_modules` in our classpath..  - This is my favorite solution as mentioned before. 
   - specify the relative path to the desired `jar` files for the `UrlClassLoader`. [This is an interesting suggestion](http://stackoverflow.com/a/5667601/1068746) to solve that problem.    
     While this is also nice, we still rely on whoever packed us.. so why bother?
   
 
