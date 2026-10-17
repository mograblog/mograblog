---
title: Getting really annoyed with Axis2
published: 2010-12-14T07:27:00.000-08:00
description: how to setup axis2 properly in your project
keywords: axis2, java
layout: post.pug
cover: /style/images/memes/parking-barriers-fail.jpg
coverTitle: You Had One Job - Parking Barriers Fail
---

## Axis 2 - Not Axis!

So I got a project while back that invoked SOAP messages, and I immediately thought about AXIS.  
I used AXIS a long time ago.  
This time around I decided to use MAVEN to build the project, and as I searched for axis plugins for maven, I was surprised to know I did the wrong search.  

I took me a while, but it seems that AXIS is deprecated for a long time now, and AXIS2 (just add 2 right after axis) is the updated project you should use. Funny enough, you won't know this by visiting AXIS project's homepage.  

I finally arrived to the [right axis2 maven plugin](http://axis.apache.org/axis2/java/core/tools/maven-plugins/maven-wsdl2code-plugin.html)  

The configuration I like most is the following :  

```
<plugin>
    <groupId>org.apache.axis2</groupId>
    <artifactId>axis2-wsdl2code-maven-plugin</artifactId>
    <version>1.5</version>
    <executions>
        <execution>
            <goals>
                <goal>wsdl2code</goal>
            </goals>
            <id>create-query</id>
            <configuration>
                <packageName>mogi.code.test.query</packageName>
                <wsdlFile>http://testsystem.fakedomain.com/wsdls/gasquery.wsdl</wsdlFile>
                <generateAllClasses>true</generateAllClasses>
                <generateServerSide>true</generateServerSide>
            </configuration>
        </execution>
        <execution>
            <id>generate-order</id>
            <goals>
                <goal>wsdl2code</goal>
            </goals>
            <configuration>
                <packageName>mogi.code.test.query</packageName>
                <wsdlFile>http://testsystem.fakedomain.com/wsdls/gasorder.wsdl</wsdlFile>
                <generateAllClasses>true</generateAllClasses>
                <generateServerSide>true</generateServerSide>
            </configuration>
        </execution>
    </executions>
</plugin>
```

Surprisingly enough, if I use different configuration, Intellij has difficulties understanding the output of the plugin. Some classes are undetected, and I get files marked with "J" (Java File) instead of "C" (Class File).. If the file is marked with C, Intellij detected the class successfully. Otherwise, it just detected it is a Java language file.  

Another surprise, is that the axis2 tutorial page I linked above, shows an example using "xmlbeans" as "databinding" method. However, I find the output to be unintuitive. I like the default "ADB" method. The output is very intuitive and similar to the required XML structure.  

# 62 Jars

The plugin page tells you how to generate the code, but when it comes to compiling it.. well.. At some point I got so many errors, I decided to download AXIS2\.  
It was then I discovered this project has about 62 jars in the dependency lib!  

In such cases the easiest thing you can do when working with MAVEN is to search NEXUS.  
I gathered around the necessary dependency list I finally got on my pom.xml.  

```
<dependency>
    <groupId>org.apache.axis2</groupId>
    <artifactId>axis2</artifactId>
    <version>1.5</version>
</dependency>
<dependency>
    <groupId>org.apache.ws.commons.axiom</groupId>
    <artifactId>axiom-impl</artifactId>
    <version>1.2.8</version>
</dependency>
<dependency>
    <groupId>axis</groupId>
    <artifactId>axis-wsdl4j</artifactId>
    <version>1.5.1</version>
</dependency>
<dependency>
    <groupId>org.apache.ws.commons.schema</groupId>
    <artifactId>XmlSchema</artifactId>
    <version>1.4</version>
</dependency>
<dependency>
    <groupId>org.apache.axis2</groupId>
    <artifactId>axis2-transport-local</artifactId>
    <version>1.5</version>
</dependency>
<dependency>
    <groupId>org.apache.axis2</groupId>
    <artifactId>axis2-transport-http</artifactId>
    <version>1.5</version>
</dependency>
```

The tricky jar was AXIOM. The download I did to AXIS2 (about 20 MB) finally revealed the answer. The artifact I needed was axiom-impl with version 1.2.8.  

# Code Sample

What the AXIS2 project won't show you, is how to use the output. weird huh?  
Well this is an example  

```
GasQueryServiceStub qstub = new GasQueryServiceStub(Properties.QUERY_URL);
GetDVApproverList appList = new GetDVApproverList();
GetDVApproverListRequest getDVApproverListRequest = new GetDVApproverListRequest();
getDVApproverListRequest.setFQDN("www.mograbi.co.il");
QueryRequestHeader requestHeader = new QueryRequestHeader();
AuthToken authToken = new AuthToken();
authToken.setPassword(Properties.PASSWORD);
authToken.setUserName(Properties.USERNAME);
requestHeader.setAuthToken(authToken);
getDVApproverListRequest.setQueryRequestHeader(requestHeader);
appList.setRequest(getDVApproverListRequest);
qstub.getDVApproverList(appList);
```

As you see, you use a "stub", and you simply invoke the method "getDVApproverList" - which is defined in the WSDL. (or documentation).  
The rest is dictated by method signatures.  
Now as I stated, the API gives you a 1-1 interpretation of the XML. So from look at the code you can see the XML looks something like  

```
<getDVApproverList>
      <getDVApproverListRequest>
           <FQDN>www.mograbi.co.il</FQDN>
           <AuthToken>
              <Username>myUsername</Username>
              <Password>myPassword</Password>
          </AuthToken>

</getDVApproverList>
```

# Using TCP Monitor for debugging

While writing code using SOAP messages, it is very helpful to see the outgoing and incoming messages.  

For this, there's a nifty tool named "TCP Monitor", and there are eclipse and intellij plugins.  

The idea is that you write the HOST and PORT in TCPMON, (for example www.realhost.com, 80) and then tell it to listen on port 8887\.  
Then in your code you redirect the stub to localhost:8887\.  
The TCPMON catches the message, and redirects it to www.realhost.com:80 while on the way - writing the XML going out, and the one coming in.  

As you can see in the example I wrote, I gave the stub a different URL.  

For convenience you can even tell TCPMON to format the messages in XML format. Making it more human readable.  

[![](http://4.bp.blogspot.com/_J3A8WqpdCX0/TR9-hlxWmCI/AAAAAAAAArg/VXzykoYEXJc/s320/tcpmon.png)](http://4.bp.blogspot.com/_J3A8WqpdCX0/TR9-hlxWmCI/AAAAAAAAArg/VXzykoYEXJc/s1600/tcpmon.png)

# Handling the xsi:nil="true"

At some point I got a lot of errors.  
As I was looking at the messages with TCPMON, I kept seeing xsi:nil="true" and I was sure this was the problem.  

I found a lot of articles referring to this, but none giving a solution how to get rid of it.  
Tried several things, but nothing was nice or successful.  

Eventually, I found that the errors and this attribute were independent of one another. lucky I guess. However, if you are headed this direction, my advice is stay way. Most probably this is not your problem.  

# TroubleShooting

```
org.apache.axis2.deployment.DeploymentException: org.apache.axis2.transport.local.LocalTransportSender
 at org.apache.axis2.deployment.AxisConfigBuilder.processTransportSenders(AxisConfigBuilder.java:694)  
 at org.apache.axis2.deployment.AxisConfigBuilder.populateConfig(AxisConfigBuilder.java:121)  
 at org.apache.axis2.deployment.DeploymentEngine.populateAxisConfiguration(DeploymentEngine.java:707)  
 at org.apache.axis2.deployment.FileSystemConfigurator.getAxisConfiguration(FileSystemConfigurator.java:116)  
```

Means you are missing jars.  
Check jars axis2-transport-http-1.5.3.jar , axis2-transport-local-1.5.3.jar  

# Conclusion

For a mainstream project, I felt it took to many resources. Too many jars are included, while the experience I expect from a MAVEN project is to have a single dependency and it should figure out the rest.  

I expected more code samples, and more documentations.  

I hope this post fills in a few gaps in the system.