---
title: The Many Ways Of Running Typescript 
published: 2016-07-29T22:30:00.001-07:00
layout: post.pug
cover: /style/images/memes/starbucks-van-sliding-door.jpg
coverTitle: Design Flaws - Sliding Door Surprise
keywords: typescript, javascript
description: Lets see how we can run typescript on node, browser and protractor  
---

Recently, everywhere I look, I see Typescript.   
The web is full of tutorials about the Typescript language and discussion around it.   

However those posts ignore the question of 'where and how to begin?'.   
So I came to put a stop to it.    
The following is a short and to the point technical walkthrough of how to execute typescript.
 
The methods I will find to run typescript will be measured by their support to different environments and features.

## Environments to support

 - nodejs
 - browser
 - others    
   I chose protractor for this post, but phantomjs, grunt, gulp mocha and the likes are good examples as well)
 
## Features to support

 - running in the same environment I use today.      
   meaning that if I use gulp, to stay with gulp, and if I don't use webpack, then no webpack. 
 - using existing JS code
 - debugging

The output of this post can be cloned from [Easy Typescript Setup](https://github.com/coder-on-deck/easy-typescript-setup) repository.    
So [you are one clone away from using Typescript](https://twitter.com/guymograbi/status/758738687970594818).
 

# One way to run it all 

There is one way that will work on everything.   
Since Typescript compiles to Javascript, you can always compile it and run the generated `js` files.  
 
To compile a `ts` file you simple need to first install the `typescript` package from npm and then run `tsc`.
 
 
```bash
npm install typescript
./node_modules/.bin/tsc index.ts
```

will generate `index.js`

## You will need to use browserify/webpack to complete the process

This technique will only work if you are not importing external dependencies. 
For example if I import `angular2` or `react`, it will not include it.  

Typescript will provide 2 ways to reference an external library out of the box when compiling to single file. 
 
  - amd 
  - system 
  
If you want to go the extra mile you can use `webpack` or `browserify` (and I am sure there are more tools) to compile everything to single file.   

In this post I don't cover using external libraries in the browser, but I will cover it when I write about `angular2` (and perhaps `react`).

## Why am I not using a global installation? 

Note that I use the relative method to `./node_modules/.bin` rather than installing the library globally.   

This is a personal recommendation of mine for 2 reasons:

 - In the relative method you can specify the dependency in `package.json` and so it is installed when running `npm install`   
   and no more actions are required to get going
 - The relative method is similar to the global when you use npm scripts. This is true because in `npm scripts` the location `./node_modules/.bin` is part of PATH and node knows to look for scripts there.   

```
"scripts" : { "compile" : "tsc index.ts"}
```

 Is the same as

```
"scripts" : { "./node_modules/.bin/compile" : "tsc index.ts"}
```

So you will see me repeating this method in other posts as well. 

## Fine tuning your compilation 

So sometimes you will need to customize Typescript compilation. For example: 

 - to remove comments
 - to create source maps (required for debugging)
 - support experimental decorators feature
 - exclude folders
 
You can easily do this by creating a file named `tsconfig.json`   
Read [this wiki page to discover all available options](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)      

This following `tsconfig.json` example is the one I am using
 
```json
{
  "compilerOptions": {
    "removeComments": false,
    "experimentalDecorators": true,
    "sourceMap": true
  },
  "exclude" : [
    "node_modules",
    "typings",
    "dist"
  ]
}
```

and the command line I use to run it is

```
tsc --p tsconfig.json --outDir dist
```

Which points to the configuration file and specifies the output dir. 

## So why not use this method all the time? 

Personally, I prefer not to use this method if possible.   
I might be spoilt about this but it kinda defeats the purpose in my eye that I write code in one file, and then I run another. 

Even in Java, I tell intellij `run this file` - but in fact we all  know intellij compiles it and runs the `class` file.   
 
So lets see alternative ways to run typescript. 


# Running in the backend with ts-node

[`ts-node`](https://github.com/TypeStrong/ts-node) is a library to run typescript on nodejs.   
Basically it compiles typescript at runtime.
 
So to run `index.ts` now all I need to do is run `./node_modules/.bin/ts-node index.ts`


## Running ts-node from intellij 

This is all nice from a command line, but in intellij you will need to run `node` none the less.. 

Please note that running `./node_modules/.bin/ts-node index.js` is the same as running `node ./node_modules/.bin/ts-node index.ts`
 
This is because tsc is simply a node script. The reason it is implicit when running tsc directly is thanks to the shebang line in `ts-node` file

```
#!/usr/bin/env node
```

Which tell the operating system that this script is run as a parameter to `node`

![Intellij ts-node setup](/style/images/2016/07/intellij-ts-node-setup.png)

However, for some reason, this does not support debugging.   
[This bug seems relevant](https://github.com/TypeStrong/ts-node/issues/46).    
And it just might be that I am doing something wrong..   
Please comment if you know what I am doing wrong. 

# Running on the browser with systemjs

In the browser I found it most easy to use systemjs.     
Use this and you're good to go.. 

```
<script src="node_modules/systemjs/dist/system.js"></script>
<script src="node_modules/typescript/lib/typescript.js"></script>
<script>
  System.config({
    transpiler: 'typescript',
    packages: {
      '': {
        defaultExtension: 'ts'
      }
    }
  });
  System.import('index')
</script>
```

It supports debugging, but might break the loading flow of your current setup as it is happens asynchronously.    
[This thread](https://github.com/systemjs/systemjs/issues/261) suggests a solution that might work for you.     
To me it sounds like a minor issue to tackle. I am sure each framework has its own way of resolving this, angular for example suggests this:  

```
angular.bootstrap(document, ['myApp']);
```

Which you can either pack as another file that systemjs loads, or as a callback on the `System.import().then(...)` to execute when everything is loaded.


# Running protractor with typescript

So protractor is actually the reason I am inspired to use typescript.     
I think tests are a wonderful starting point for new technologies to be experienced in a project/team.   

The thing about protractor is that you write a lot of code to represent the different components on your page, and then you also have WebElements, 
and you end up with a lot of APIs that you need to know to quickly write a test. 

And this is a problem Typescript solves perfectly.
 
So to make intellij run `ts` files, you simply need to run `ts-node`. Similar to the trick I showed you before, running `ts-node ./node_modules/.bin/protractor protractor.conf.js` does the trick here too. 

And when I need to debug, I fallback to the compilation method. 

# Using existing js libraries 

When I tried to use nodejs libraries like `fs`, or protractor api like `browser.get` I started getting errors from the compiler about undefined variables.   
It seems it is pretty easy to bridge the gap between Typescript and existing js libraries.   

All Typescript needs is `definition` for the missing types. Definitions are managed with `typings` - the definition manager for Typescript.
 
 
### Update - typings no longer required? (updated on november 2016) 

According to [this stackoverflow question](http://stackoverflow.com/questions/37548066/typescript-typings-in-npm-types-org-packages) it seems that typings might be going away soon to a more comfortable
setup with `npm` and [`@types` project](https://github.com/Microsoft/types-publisher).

I sure hope this will happen and that the transition is smooth.   

When I do the transition myself I will update here.    
For now I am still using typings.
 
## Installing definitions

[#alert-info]
As mentioned above typings is changing.   
It is not becoming more popular to publish the types alongside your code at npm repository.     
It seems the need for `reference` comments is also going away. 
   
However, you might still find yourself in need for this if you are working on an old project.    
I will keep this here for now and update it when I feel it is time. 
[#/alert-info]

Typings is very similar to `npm` in nature - for example it can save the dependencies using `-S` or `--save` flags to a `typings.json` file.. 
 
Simply do `npm install typings -S` and then `./node_modules/.bin/typings search protractor` and you will find the package you need to install. 

```bash
typings install dt~angular-protractor -S --global
typings install dt~selenium-webdriver -S --global
typings install dt~jasmine -S --global
```

will install the definitions for protractor, selenium and jasmine. all are needed to run tests in protractor.  
  
I also recommend adding a `postinstall` script in npm 

```
"postinstall": "typings install",
```

which will automatically install the definition after running `npm install`. gotta love npm scripts.. 

## Importing definitions 

It is not enough to install the definitions, you also need to do something similar to `require` on them. 
So write a test for protractor will have these lines at the top of the file

```js
/// <reference path="../typings/globals/angular-protractor/index.d.ts" />
/// <reference path="../typings/globals/jasmine/index.d.ts" />
/// <reference path="../typings/globals/selenium-webdriver/index.d.ts" />
```

Note the path is relative and so might change in your project. 

Once you've done this the Typescript compiler is happy and you can work as usual. 

# Using existing nodejs libraries

One last item is left for this post, and that's how to use existing nodejs libraries (like 'path' and 'fs') with Typescript.
All you will need is to install nodejs typings

```
typings install dt~node -S --global
```

and then reference it

```
/// <reference path="../typings/globals/node/index.d.ts" />
```

Then you can write code as you know it

```
var path = require('path');
//or
import path from 'path';
```

# That's all folks
 
So this sums up all my setup experience in typescript.     
As you can see adding typescript to an existing project is easy and can be done in a none intrusive way.   
While for a new project programs like webpack and rollup might get you an easier start, there is no reason 
why not to add typescript to your existing projects right now. 

 
