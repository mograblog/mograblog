---
title: Python Hands on - The Pickle Problem
published: 2011-05-30T03:47:00.000-07:00
description: using pickle in python
keywords: python, pickle
layout: post.pug
cover: /style/images/memes/toilet-lid-backwards.jpg
coverTitle: Design Flaws - Backwards Implementation
---

I recently learned how to write to a file in Python, and among it how to use Object Serialization library called "pickle".  

According to [Documentation](http://docs.python.org/tutorial/inputoutput.html#the-pickle-module) it should be quite easy  

```
pickle.dump(x, f)
x = pickle.load(f)  
```

What the documentation does not tell you is that you need to open the file with a "binary" flag.  
So some of you might get  

```
write() argument 1 must be str, not bytes
```

All you need to do is add  

```
f = open("myFile","wb")
```

The "b" character, tells python to open the file in a binary mode.  
Same for reading! So if you are getting  

```
read() from the underlying stream did notreturn bytes
```

make sure you did  

```
f = open("myFile","rb")
```

If some of you are getting  

```
TypeError: file must have a 'write' attribute
```

This means you sent the argument in a wrong order. Note the signature of "dump"  

```
def dump(obj, file, protocol=None, *, fix_imports=True):
```

Make sure that you first send the object, then the file.