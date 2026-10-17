---
title: SQL for interviews - Continued
published: 2010-03-11T23:06:00.000-08:00
keywords: mysql
description: some questions you should know in mysql before an interview
layout: post.pug
cover: /style/images/memes/buy-3-get-2-sale.jpg
coverTitle: Design Flaws - Buy 3 Get 2 Logic Fail
---

In a [previous entry](http://mograblog.blogspot.com/2010/03/basic-things-you-should-know-about-sqls.html) I explained how I always get asked the same SQL questions in interviews. Lo and behold, I am asked the very same questions in an interview I had just the other day.

This time I had no problem answering "which join joins which joins.."  

So I decided to expand the previous entry with some more things I see a lot in interviews.

# Aggregations and Dates

Based on:  

*   [GROUP BY](http://www.w3schools.com/sql/sql_groupby.asp)from w3c
*   [DATEs in SQL](http://www.tizag.com/sqlTutorial/sqldate.php) from some cool site

I am using mysql for the following queries.  
Lets look at the following table definition :  

```
+---------------+--------------+------+-----+---------+-------+
| Field         | Type         | Null | Key | Default | Extra |  
+---------------+--------------+------+-----+---------+-------+  
| customer_name | varchar(255) | YES  |     | NULL    |       |  
| order_id      | int(11)      | NO   | PRI | 0       |       |  
| price         | int(11)      | YES  |     | NULL    |       |  
| date          | date         | YES  |     | NULL    |       |  
+---------------+--------------+------+-----+---------+-------+  
```

created with this SQL  

```
create table ORDERS (customer_name varchar(255), order_id int, price int, date DATE, PRIMARY KEY(order_id));
```

In real life - you will have a FK and customer_id instead of customer_name, but since we are not dealing with any FK feature today, I replaced it with a name to be visually nicer.  

and with queries that look like this  

```
insert into orders values ('boris',7,1067,'2001-11-15');
```

I created the following table  

```
+---------------+----------+-------+------------+
| customer_name | order_id | price | date       |  
+---------------+----------+-------+------------+  
| liron         |        1 |    45 | 2001-05-23 |  
| liron         |        2 |   150 | 2004-03-15 |  
| liron         |        3 |   150 | 2008-08-12 |  
| liron         |        4 |   350 | 2008-08-17 |  
| sharon        |        5 |    15 | 2008-02-02 |  
| sharon        |        6 |    25 | 2008-04-10 |  
| boris         |        7 |  1067 | 2001-11-15 |  
+---------------+----------+-------+------------+  
```

# The challenge

*   select all customers since 2002.  

```
select distinct customer_name from orders where YEAR(orders.date) > '2002'
```

*   select customers and the sum of their orders  

```
select customer_name,SUM(price) from orders GROUP BY customer_name;
```

*   select number of orders each customer had since 2005  

```
select count(*) from orders where YEAR(orders.date) > '2005' GROUP BY customer_name;
```

*   select the customer name and number of orders for customers that ordered over 100$ total  

```
select customer_name,count(*) from orders  GROUP BY customer_name HAVING SUM(orders.price) > 100;
```

*   now to combines everything : show the name of the customer and the number of order, but only for customers that ordered more than 100$ since 2005  

```
select customer_name,count(*) from orders WHERE YEAR(orders.date) > 2005 GROUP BY customer_name HAVING SUM(orders.price) > 100;
```

The important things you should remember for the interview are :  

*   The HAVING keyword that is used for conditions on aggregation functions
*   The YEAR function operated on the date.
*   GROUP BY keyword. I also used DISTINCT in the first option
*   The order in which they should appear : GROUP BY and then HAVING

# Stored Procedures

In one interview I was asked to list pros and cons for Stored Procedure.  
You should know - I am not a DBA and so far, I worked in companies that had DBAs so when I defined a Stored Procedure it was solely for tests.  

However, the question interested me. Lets focus on data validation for example. Should we validate in a Stored Procedure on DB's side or in code on Server side?  

This reminded me the same issue concerning Client side and Server side.. Where do you validate the integrity of the data? If I write it in the client side, I save unnecessary load on the server, but we also have to validate in the server side if we want to enable web-services. (for example).  

We also define constraints on the schema. Should we validate them and if so should we do that on server side or maybe client side? The usual solution would be to validate on all levels but that would require a lot of maintenance in days to come. That, in itself, might even be a good thing. If I accidentally delete a line of code that validated a field, I always have other layers to fall on.  

Stored Procedures play the same problematic part in this entire story. Some would claim that modifying a Stored Procedure will affect the application more than if the logic was determined in Server side by Dynamic Queries. I don't really see the difference.  

Thank god for Ajax and ORM layers to minimize the problem a bit. Ajax allows us to minimize the client/server problem by minimizing the data transferred between them. This, in turn, increases the speed and we get a good user experience. The ORM layer allows us to define the constraints in the code and that will take care of defining them in the schema as well, and (sometimes) validate them at runtime.  

In Rails, for example, this entire mechanism is implemented so well, you are almost unaware of it. For more reading you should focus on [ActiveRecord](http://api.rubyonrails.org/classes/ActiveRecord/Base.html) documentation.  

So to conclude - Stored Procedures are yet another method for encapsulating logic, but as a developer I will prefer to keep their usage to a **minimum** (minimum and not disregard them as I am assuming there are situations using them is crucial). As for other topics such as security and performance that I stumble upon in articles on the matter, I can only say that the above applies to them as well - Stored Procedures are just another layer that complicates our decision making.