---
title: Intellij - "J" is shown instead of "C"
published: 2011-05-31T02:24:00.000-07:00
description: what do these icons in intellij mean? lets find out
keywords: intellij
layout: post.pug
cover: /style/images/memes/gymnast-parking-symbol.jpg
coverTitle: You Had One Job - Confusing Symbols
---


As I was looking at my blog's search keys that got people here, I noticed a weird one

```
intellij class file icon show j instead of c
```

It seems I am the first result in google for this query. But amazingly, it is for an ["axis" related post.](/2010/12/getting-really-annoyed-with-axis-2.html)

I decided I should dedicate a small post for this specific problem just in case someone else runs into it. Just so you'd know, I didn't find the result in [intellij's icons reference](http://www.jetbrains.com/idea/webhelp/file-types-recognized-by-intellij-idea.html) page.  

There are 3 icons related to Java you should be aware about  

# Not in Source

[![](http://4.bp.blogspot.com/-2DG2ZQ_rJYs/TeSxVzrvldI/AAAAAAAAA14/Iu0cEWsAwMk/s1600/java_file_not_under_source_folder.png)](http://4.bp.blogspot.com/-2DG2ZQ_rJYs/TeSxVzrvldI/AAAAAAAAA14/Iu0cEWsAwMk/s1600/java_file_not_under_source_folder.png)


This icon means that the file is not under a source root.  
To add a source root in intellij, you should:  

*   click "Project Structure"(ctrl+alt+shift+S)
*   Choose "modules"
*   Choose the folder you want on the right
*   Click "sources" icon

[![](http://1.bp.blogspot.com/-qkXumH07FKU/TeSyIl99G9I/AAAAAAAAA18/2DbYk6oP4s8/s320/intellij_add_folder_as_source.jpg)](http://1.bp.blogspot.com/-qkXumH07FKU/TeSyIl99G9I/AAAAAAAAA18/2DbYk6oP4s8/s1600/intellij_add_folder_as_source.jpg)

Once you did that - you will see a different icon.  

# Java (not a class) Icon

[![](http://4.bp.blogspot.com/--BtfLFiP3q4/TeSyUAPc4xI/AAAAAAAAA2A/EPZbYGshU9Q/s1600/java_source_but_no_class.png)](http://4.bp.blogspot.com/--BtfLFiP3q4/TeSyUAPc4xI/AAAAAAAAA2A/EPZbYGshU9Q/s1600/java_source_but_no_class.png)

This icon means the file has a "java" extension. However - it is not a class!  
You are probably wondering if there are such files. Yes there are. For example [pacakge-info.java](http://download.oracle.com/javase/6/docs/technotes/tools/solaris/javadoc.html#sourcefiles)  

In order to make this a class, all you have to do is enter the word "class" and the beginning of the class' name.  
For example  

```
class G{}
```

Would suffice.  

Then you will see the third icon, which is well known :  

[![](http://4.bp.blogspot.com/-kw0DM4wqjE8/TeSzae99dXI/AAAAAAAAA2I/1CopZX6fIWU/s1600/intellij_class_icon.png)](http://4.bp.blogspot.com/-kw0DM4wqjE8/TeSzae99dXI/AAAAAAAAA2I/1CopZX6fIWU/s1600/intellij_class_icon.png)

### Great Comments

Thanks for all the comments on this post.  
Someone posted that the "J" icon also happens when your java file is too big.  
You can fix this by editing the "idea.max.intellisense.filesize" property in your "idea.properties" file.  
Here is how you do this if you are in windows vista or higher  

*   Open your notepad as Administrator
*   Open "idea.properties". The path is something like "C:\Program Files (x86)\JetBrains\IntelliJ IDEA 10.5.4\bin"
*   Now you can edit the property as you see fit

The property's documentation is

```
#---------------------------------------------------------------------  
# Maximum file size (kilobytes) IDEA should provide code assistance for.  
# The larger file is the slower its editor works and higher overall system memory requirements are  
# if code assistance is enabled. Remove this property or set to very large number if you need  
# code assistance for any files available regardless their size.  
# Please note this option doesn't operate with Java files. Regardless of the option value code assistance will anyway stay there.  
#---------------------------------------------------------------------  
idea.max.intellisense.filesize=2500  
```

The documentation says this property does not relate to Java files, but as comments suggest, it does. Thank you all for all the comments. This is exactly why I started the blog.  
