---
title: Rails Quicky - Mistakes with Blocks
published: 2010-03-09T09:09:00.000-08:00
keywords: rails, ruby
description: avoid my mistakes using rails/ruby blocks
layout: post.pug
cover: /style/images/memes/wobbly-road-lines.jpg
coverTitle: You Had One Job - Wobbly Road Lines
---


# Looking for Tutorials?

What I wrote here - you won't find in the links below, but if you are looking for tutorials try these cool articles I found  

*   [Basic tutorial](http://blog.codahale.com/2005/11/24/a-ruby-howto-writing-a-method-that-uses-code-blocks/)  
*   [Brackets or do/end?](http://talklikeaduck.denhaven2.com/2007/10/02/ruby-blocks-do-or-brace)

# Function with a variable and a block as parameters

As I am implementing the "depot" tutorial from the [Rails book](http://www.pragprog.com/titles/rails3/agile-web-development-with-rails-third-edition) I tried to write a function with a block.  

It should look like this :  

```
def update_cart(action_as_str, &block)
  ... # do something  
  yield product if block_given? #product was assigned before and now passed to the block  
  ... # do something else  
end  
```

As you can see - I have a parameter and a block given to the function.  
The function calculates a variable named "product" and passes it to the block.  

I stumbled upon some error trying to call this function.  

# Calling the function

The correct way to call this function is  

```
update_cart("add"){|product| ... }
```

However, since it looks as if the parameter and the block are parameters of the function (they are both in the brackets) I initially wrote  

```
update_cart("add",{|product|...})
```

which didn't work. I also knew that ruby doesn't require me to write the brackets, so I tried  

```
update_cart "add",{|product|...}
```

which also didn't work. Last but not least, the following didn't work as well  

```
update_cart "add" {|product|...}
```

Which is weird because it looks syntactically correct to me.  
As you know - you can replace the brackets with do/end , so for the record it behaves just the same as the brackets in all the above scenarios