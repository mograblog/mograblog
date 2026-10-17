---
title: SVN + Apache (Continue) - Permissions
published: 2010-04-27T13:38:00.000-07:00
description: setting up permissions for your SVN with Apache
keywords: svn, apache, security, permissions
layout: post.pug
cover: /style/images/memes/door-handle-over-lock.jpg
coverTitle: You Had One Job - Door Handle Over Lock
---



[Last time](http://mograblog.blogspot.com/2010/04/svn-apache-easy-lets-make-it-work.html) I explained how I got my Apache to forward calls to the SVN.  
It was pretty hard due to lack of documentation.  

This time I wanted to configure some basic permissions. It was pretty easy - and I also found great documentation. One catch though... as always.  

[![](http://1.bp.blogspot.com/_J3A8WqpdCX0/S7mA62ZCkHI/AAAAAAAAAbY/TFOnWXhtrr0/s200/rails-flash.jpg)](http://1.bp.blogspot.com/_J3A8WqpdCX0/S7mA62ZCkHI/AAAAAAAAAbY/TFOnWXhtrr0/s1600/rails-flash.jpg)

# Goal Definition

If you read any of my articles so far, you might have noticed that when I deal with something new, I try to keep my goals to a minimum.  

The minimum I could think of in this case is :  

*   Allow me to write into the SVN
*   Allow anyone to read - Anonymous read accesss

# Wrong documentation

When I started the search, I looked for configuring permissions in SVN. I found [this](http://draft.blogger.com/post-edit.g?blogID=7135654868651822449&postID=7278552956630803975) documentation.  

However - this is the wrong documentation since I am looking for Apache+SVN. Whereas this documentation is for SVN Server. This is a small nuance you should note when reading documentations.  

[This](http://svn.spears.at/) is the documentation I used to achieve my goal.  

# Configuration

The entire configuration for Apache+SVN is done in Apache.  

### Adding user/password

If file does not exist, create the file  

```
d:\dev_env\svn_repository\svn-auth-file guy
```

run command  

```
htpasswd -cm d:\dev_env\svn_repository\svn-auth-file guy
```

replace "guy" with your username.  

Technically - the "-c" flag is supposed to create the file if it does not exist. However it didn't work for me, but creating it manually solved the problem.  

Afterwards you will be prompted for a password.  

```
New password: *********
Re-type new password: *********  
Adding password for user guy  
```

Now we need to match between username and permission.  

### Match between username and permission

Next to the "svn-auth-file" , create a new file named "svn-acl"  
ACL - stands for "Access control list".  

```
[/]
* = r  
guy = rw  
```

the path "[/]" means the parent directory - which lists all projects.  
following that you can see "* = r" - this means, I grant everyone read permission  
Last we have "guy = rw" which means I grant myself read/write permission.  

These will apply to all my projects. They can also be define per project.  
You can also define users into groups, and give permission by groups. (see links in references).  

The last step is to point apache to these files.  

### Configuring Apache

The final configuration will look something like this  

```
<Location ~ "/svn/" >
    DAV svn
 SVNListParentPath on
        SVNParentPath d:/dev_env/svn_repository/projects

         <!-- PERMISSIONS -->
 AuthType Basic
 AuthName "Subversion Repository Authentication"
 AuthUserFile D:/dev_env/svn_repository/svn-auth-file

 Satisfy Any
 Require valid-user

 AuthzSVNAccessFile D:/dev_env/svn_repository/svn-acl

</Location>
```

We already saw the first 3 lines in the previous post.  
Afterward, we tell Apache to prompt a basic authentication with "AuthType Basic". AuthName simply gives a name to the authentication popup.  
Then we point to the auth file we defined in the first step.  

The "Satisfy Any" is the catch, and took me some time to find. This means - prompt for password only if action requires... Since I am giving read permission to everyone, you won't be prompted for a password for a read operation. (for example, clicking [http://svn.mograbi.co.il/svn/](http://svn.mograbi.co.il/svn/).  

Later we say that for any other option - we require a valid user.  
The final line points to the access file - telling Apache who can read and who can write.  

# Result

Everything went smoothly for me, so there's no troubleshooting this time.  

If you try to read from your repository but see a password prompt, you did something wrong.  

In order to see that it works you should  

*   Check that you can read without password prompt
*   See that when you try to "commit" (write) you are requested for a password - see section below

# Supplying a password

When you test the configuration you should do something like this (assuming you already have a working copy of the project. If not - you should checkout first. "svn co URL folderName")  

```
echo aa > aa
svn status
(see that you have the line : "?       aa" - which means this file is not monitored.)
svn add aa
svn commit aa -m "adding test for auth"
Authentication realm:  Subversion Repository Authentication
Password for 'User': ***
Authentication realm:  Subversion Repository Authentication
Username: svn: Commit failed (details follow):
svn: MKACTIVITY of '/svn/project_manager/!svn/act/96456c34-fea7-aa4b-a25d-000e43429ecf': authorization failed: Could not authenticate to server: r
```

This shows that I couldn't commit with a bad authentication.  

But how to I define the new credentials ?  
I simply do the following  

```
svn commit aa -m "show good credentials" --username guy
```

And supply the password when prompted.  

Q: Will I need to specify username in every commit ?  
A: No, SVN caches the credentials. Don't like it? [Clean it](http://svn.haxx.se/users/archive-2009-03/0740.shtml) or [Prevent it](http://svnbook.red-bean.com/en/1.1/ch07.html#svn-ch-7-sect-1.3.2)  

# Conclusion

So far, I have to admit, I like SVN. However, I assume this is mainly because I am the sole user :) .  
The authorization configuration was a piece of cake, and the entire thing (including this post) didn't take more than 2 hours.  

Now that I fill good enough with SVN, I am going to make a transition to GIT (finally).  

# References

*   [BEST REFERENCE I FOUND SO FAR - A KEEPER](http://wiki.wsmoak.net/cgi-bin/wiki.pl?Subversion/Configuration)