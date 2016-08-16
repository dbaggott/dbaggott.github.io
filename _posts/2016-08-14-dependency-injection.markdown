---
title:  "Dependency Injection"
date:   2016-01-08
categories: [programming]
tags: [better code]
---


From: Dan Baggott 
Sent: Monday, March 28, 2016 8:06 PM
Subject: Re: Feedback: code standards
 
That's very interesting!  Here's some of my thoughts on the DI part...
 
In my experience, the hardest part of mentoring junior developers as it relates to DI (and really programming in general) is helping them to get a handle on how to first identify and then separate discrete responsibilities.  It's not something that comes easily to many people and I think it takes lots of practice and feedback on code-level design in order to really start getting it.
 
In my opinion, DI (framework or not) is the glue that makes the concept of Object Oriented programming cohere.  Without DI, breaking up responsibilities becomes more confusing than it already is b/c cohesion is forced to come from *tight coupling* instead of loose coupling, ie the code is always responsible for knowing its dependencies.  When that happens, the lines of responsibilities by definition become blurred.  In the absence of DI, it's really hard for someone without a lot of experience to understand how to create higher-level functionality without tight coupling and blurred responsibilities.  And, pretty quickly, you end up with some large class that's 1000 lines long and responsible for way too many things!
 
DI is the best mechanism I've seen for organizing higher-level application complexity from modular parts and, without it, OO seems like a great concept without a practical means of executing on the promise it holds.  In fact, before I was first introduced to DI, I thought I "got" OO programming but I discovered that it was as if I had been in the dark for years but didn't know it and then someone suddenly turned on the lights for me...  There was a brief moment of shock and confusion (aka "learning") but then everything suddenly made so much more sense!  Needless to say, I'm a strong believer in DI and think it's worth a considerable amount of effort to teach it to anyone who cares about programing!
 
Forgive me for preaching to the choir but I want to underscore that DI itself is often hard to learn but also so incredibly helpful.
 
With that in mind, when it comes to DI *frameworks*, as you were perhaps alluding to, it's been my experience that the main difficulty in teaching a DI framework to someone is that you're usually teaching them DI concepts at the same time.  And it's DI itself that's hard for people to get.  Anyone who already understands DI can usually learn most of a new DI framework in a couple of hours or less.  But someone who doesn't understand DI is so hung up on the concepts that they have trouble understanding the context of the framework and therefore the framework itself.  I suspect this is exactly the problem that you alluded to...  So, to the extent that you persist and give the person enough understanding of DI to get past that, the framework itself is usually not *that* difficult.  For example, if you take someone who has written a bunch of DI-based code and tests without a DI framework, introducing the framework would then go a lot smoother.
 
That being said, the framework-specific difficulty that I see with using (and therefore learning) DI frameworks is when the "wiring" of the objects is some opaque configuration file and there's no integration with your IDE.  The "magic" you referred to...  For example, the cafepress.com .NET code (which uses an ancient VS and similarly ancient Spring.NET) suffers heavily from that problem.  Moreover, the problem in that case is compounded by poorly organized configuration files.  That is legitimately difficult code to navigate but I think it's mostly damning to that particular use of a DI framework and not frameworks themselves.
 
In fact, in the java-world, that's pretty much a solved problem -- there's good integration available between DI frameworks and IDEs so, for example, it's easy to find all uses of a particular class as a dependency by point-and-click.  And, these days, DI frameworks often use code-based wiring strategies anyway which are often amenable to standard code navigation.  Eg, no opaque xml-based configuration file!  I'm not familiar with the .NET DI frameworks but I'd be shocked if there wasn't something reasonable to use...
 
Now, some of the upsides of using a formal framework that I see are that, by leveraging the work of a community of people, you get a lot of flexibility in your wiring (and often more than that) for free.  Particularly for bigger projects, I think there are some not particularly esoteric or unrealistic use cases that aren't well-supported with the argument-less constructor approach.
 
For example, how do you re-use the same *instance* as a dependency in multiple places?  If you're using the constructor approach then everybody that uses that class as a dependency necessarily gets their own *new* instance.  A lot of code is stateless so that's often not a problem, but what about some object whose implementation uses an in-memory data structure of some sort and you don't want every dependency graph to independently build that same structure?  Sure, there's a way to work around that in a "roll your own" approach but your code is getting increasingly complicated and suddenly you start having to think about stuff that you don't want to spend your energy on (like race conditions during instantiation).
 
Similarly, if you have some class Foo that depends on an IBarStrategy and you want multiple versions of Foo that use different IStrategy implementations for their dependency what do you do?  Sure you can replace the argument-less constructor on Foo with appropriately named static constructor methods but, again, with increasing complexity that can start to get unwieldy and confusing.  Similar issues can come up for decorators.
 
I think you touched on these points as well but fundamentally, the responsibility of dependency injection in the argument-less constructor approach is also distributed throughout the code which makes it harder to see the big picture.  In a framework, the application's organization is typically organized into coherent modules which (once you understand the framework) make understanding the big picture of the application easier.  Also, a DI framework makes writing good code the path of least resistance.  For example, you can't, in the middle of some method, reach out and call "new Foo()" to obtain a dependency...  (And, yes, I understand that something like that makes testing hard and therefore makes it likely that it will be caught in code review but the point still stands.)
 
Basically, in my opinion, I think it's worth the upfront effort and pain of teaching DI (inclusive of a framework) because: 1) I think most of that pain is not actually framework-specific; 2) DI is sufficiently helpful/important for writing good code to be worth the pain and 3) frameworks come with enough upsides to offset any additional pain of also teaching the framework.  If necessary, I think it's worth it to spend a transition period where you provide a lot of hand-holding through using the framework.  It will eventually click.  And, if it doesn't, then I guess that's good to know earlier rather than later...
 
As far as coding standards go, I personally wouldn't *require* that a DI framework always be used but I'd heavily encourage it (particularly for any project of significant complexity).  Or, at a bare minimum, I would not *discourage* it.  And, of course, I'd want to standardize on a .NET DI framework (after researching which one has the least barriers to learning) so that there's consistency across .NET projects...
 
Dan