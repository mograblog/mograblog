---
title: grunt-aws CERT_UNTRUSTED quick fix
published: 2014-12-20T00:00:00.000-08:00
description: quickly resolve CERT_UNTRUSTED in grunt-aws plugin
keywords: grunt, grunt-aws
layout: post.pug
cover: /style/images/memes/mirror-ceiling-bathroom-fail.jpg
coverTitle: Design Flaws - Mirror Ceiling Exposure
---

If there's anything I hate in the programming world, is when something that worked well suddenly breaks.
Unfortunately, today it happens a lot since everything is a "service" that is upgraded under your feet.  
My build process broke so many times, I lost count.  
Even if you keep it simple like

*   Register to cloudbees
*   Run script on machine

There could be many things going wrong. Here are just some examples  

*   Cloudbees changed fedora images? or a jenkins plugin? (see images below)
*   script is using [npm](http://stackoverflow.com/questions/9626990/receiving-error-error-ssl-error-self-signed-cert-in-chain-while-using-npm) or [github](https://help.github.com/articles/error-ssl-certificate-problem-verify-that-the-ca-cert-is-ok/) or [s3](http://shlomoswidler.com/2009/08/amazon-s3-gotcha-using-virtual-host.html) or [dropbox](http://forums.technicpack.net/topic/61977-dropbox-changes-break-technic-platform-links/)? perhaps there is a certificate issue?
*   There's always [the unexplained error](http://stackoverflow.com/questions/26945290/how-to-resolve-the-difference-between-these-2-similar-npm-install-logs)... :(

[![](http://4.bp.blogspot.com/-i4h6Bfd3llQ/VJUanZv8qeI/AAAAAAAApj8/Op_Kcm19OaI/s320/cloudbees_error_1.png)](http://4.bp.blogspot.com/-i4h6Bfd3llQ/VJUanZv8qeI/AAAAAAAApj8/Op_Kcm19OaI/s1600/cloudbees_error_1.png)[![](http://4.bp.blogspot.com/-A9tqtWx4lds/VJUanbzxTOI/AAAAAAAApj4/-nNlJyeDwI8/s320/cloudbees_error_2.png)](http://4.bp.blogspot.com/-A9tqtWx4lds/VJUanbzxTOI/AAAAAAAApj4/-nNlJyeDwI8/s1600/cloudbees_error_2.png)

And then perhaps, you decide to go on for a **sure thing..** as if there is such a thing.  
You decide to use vagrant(!) to run your builds. Since vagrant means the build runs the same each and every time right? **wrong!**

*   [not supported?](https://cloudbees.zendesk.com/hc/en-us/requests/23164)
*   [vagrant plugins issue?](http://stackoverflow.com/questions/26945985/which-centos-image-can-i-use-on-aws-with-vagrant)
*   [Some more vagrant plugin issues?](http://stackoverflow.com/questions/26972837/how-to-fix-vagrant-install-plugins-which-suddenly-started-to-fail-due-to-fog-ver)

**What happened to [Just Programming..](http://programming-motherfucker.com/)?**  
Why do I spend my time in forums, support and such?  


## And to the problem...

So I started getting **CERT UNTRUSTED** when I was using [grunt-aws](https://github.com/jpillora/grunt-aws) after [this plugin was no longer maintained..](https://github.com/pifantastic/grunt-s3)

I was able to resolve my problem by switching of `cacheTTL` and `sslEnabled`

```javascript
 s3:{  
    uploadCoverage: {  
        options: {  
            accessKeyId: s3Config.accessKey,  
            secretAccessKey: s3Config.secretAccessKey,  
            bucket: s3Config.bucket,  
            cacheTTL: 0,  
            sslEnabled: false,  
            enableWeb:true,  
            gzip:true  
        },  
        cwd: 'coverage/',  
        src: '**',  
        dest: 'ui-coverage/'  

    }  
},  
```

I haven't tried any other combination. Perhaps only one is needed (probably the TTL one) but since I don't require either, I switched them both off. perhaps you do need them, so please try using only one according to your needs.</div>
