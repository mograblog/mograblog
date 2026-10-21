---
title: "Braindump: From 'Let's Make It Work' to 'Let's Build Something'"
published: 2026-10-21
description: "An honest braindump on how pairing Gemini Antigravity (Gemini 3.8 Flash on Medium effort) with Cloudflare eliminated site maintenance friction, accelerated content, and transformed both my blog and my wife's clinic website."
keywords: braindump, ai, gemini antigravity, cloudflare, astro, fullstack, software engineering, developer productivity, gemini 3.8 flash, devops, clickops, microsoft clarity
cover: /koalas/gemini-cloudflare-koala.jpg
coverTitle: Senior koala engineer pairing Gemini Antigravity with Cloudflare to ship blazing fast fullstack websites
draft: false
toc: true
---

*An honest braindump on how Gemini Antigravity, Cloudflare, and shipping real projects changed my relationship with building software.*

---

Ever since I started Mograblog in 2010, the tagline under the title has been:  
**"Let's make it work!"**

That mantra came from the gritty reality of early-2010s software engineering. Back then, half the job was just wrestling with stubborn tools—Apache configs, SVN repos, brittle build pipelines, and obscure compiler quirks. When I wrote about [adding a page counter with Firebase in 2016](/2016/08/static-site-page-counter/), I had to write custom jQuery and hand-craft client-side JSON validation rules just to increment a number.

You had an idea, but before you could build anything, you had to spend 80% of your energy surviving the plumbing. *"Let's make it work"* was about rolling up your sleeves and forcing stubborn tech over the finish line.

Lately, though, I find myself thinking about a new mantra: **"Let's build something."**

When you pair modern AI tooling (**Gemini Antigravity**) with serverless edge infrastructure (**Cloudflare**), the friction of "making it work" largely evaporates. The AI scaffolds the boilerplate, wires the API endpoints, and refactors responsive layouts in seconds; Cloudflare deploys it to the global edge without a hiccup.

The ideas are still mine. The vision is still mine. The posts are still mine. 

What changed is that we don't have to burn all our creative energy just getting the plumbing to run. When you sit down at the keyboard today, the question is no longer *"Can I get this stubborn stack to work?"* 

It's: **"What can we build today?"**

---

## The Infrastructure: Why DevOps Was a Failed Promise

Writing website code was never the hard part for me. 

The real bottlenecks were always two things: **Design** and **Deployments**.

Design could sometimes be solved by outsourcing to Fiverr. But deployments had no clean solution. Even the modern wave of "Docker-to-cloud" platforms was a partial fix at best—they just shifted the operational headache from bare-metal servers to container orchestration and YAML soup.

In fact:

> <span class="quote-highlight text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white not-italic block my-1" data-quote-id="devops-unfulfilled-promise">“DevOps was an unfulfilled promise for a decade—we traded server management for YAML soup and ClickOps. AI is the missing piece that finally makes continuous delivery effortless.”</span>

We preached "Infrastructure as Code" and continuous delivery, but in reality, most developers still defaulted to **ClickOps**—manually clicking around five different cloud dashboards. Why? Because writing, debugging, and maintaining deployment automations took longer than just clicking the buttons ourselves.

ClickOps wasn't laziness; it was a rational economic choice. When an automation pipeline breaks every three months due to an upstream runner update or an expired secret, writing scripts is slower than manual clicking.

DevOps needed a missing piece to actually deliver on its promise.

---

## Why Wix, Squarespace, and Framer Are Falling Behind

If deployments were the backend operational barrier, visual site builders were supposed to be the frontend shortcut. For years, whenever someone needed a website quickly, the standard advice was: *"Just use Wix, Squarespace, or Framer."*

I tried. I really tried to use them.

Even for experienced programmers who can write code with their eyes closed, those platforms added a massive overhead of learning their proprietary visual builders, quirky UI widgets, and locked-in ecosystems. You spent hours clicking around unfamiliar menus, fighting responsive breakpoints inside a visual canvas, and ending up with bloated, slow-loading pages.

And while these platforms are now scrambling to adapt to the AI age—bolting on "AI site builders" and copilot sidebars inside their visual editors—they're doing an awful job at it. 

> <span class="quote-highlight text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white not-italic block my-1" data-quote-id="traditional-site-builders-dead">“Traditional site builders are failing to adapt to the AI era. They are practically dead; they just don't know it yet.”</span>

Visual site builders were always an intermediate compromise: an awkward visual layer invented because non-programmers couldn't write code, and programmers didn't have the time to build everything from scratch. 

Now that an AI agent can write, refactor, and deploy standard, pristine web code—HTML, CSS, TypeScript, Astro, and Tailwind—the entire premise of a proprietary visual canvas collapses. You get total control, instant page loads, zero vendor lock-in, and zero subscription tax. You don't need a visual builder anymore. You just need an agent and the open web.

---

## The Winning Stack: AI + Cloudflare

When you remove both the deployment headache and the visual builder compromise, what takes their place?

For me, the winning combination is **Gemini Antigravity** paired with **Cloudflare**.

### The Engine: Gemini 3.8 Flash on Medium Effort
There is a common misconception that using AI in software engineering requires defaulting to the largest, slowest models available.

For development, I rely heavily on **Gemini Antigravity** (which, let's be honest, is heavily subsidized right now 😉), specifically running **Gemini 3.8 Flash with Medium thinking effort**.

I’ve found 3.8 Flash on Medium effort to hit the ultimate sweet spot:
* **Speed:** Instant responsiveness without long delays.
* **Reasoning:** Thorough enough to refactor code, catch subtle edge cases, and run multi-step workspace tasks cleanly.
* **Token & Cost Efficiency:** Incredibly lightweight, letting me iterate through dozens of diffs in a single sitting without hitting rate limits or high bills.

Because the tool friction is gone, the editorial quality actually goes *up*:
1. **Focus on substance over maintenance:** I spend my energy thinking through the thesis, not debugging CSS layout bugs or configuring build pipelines.
2. **Timely publishing cadence:** When an interesting tech debate happens, I can publish a thoughtful take while the conversation is still relevant.
3. **Overcoming the language tax:** English is not my first language. In the past, writing technical articles in English always carried an extra cognitive tax. I knew the engineering concepts inside out, but I’d spend energy second-guessing phrasing, grammar, or whether an idiom sounded natural. Gemini acts like an in-house technical editor: it polishes the English and tightens the flow while keeping my authentic voice and technical arguments intact.
4. **Live, working examples:** Instead of just pasting static code snippets, I can comfortably drop working, client-side demos (from WebGPU neural models to WebAssembly pipelines) directly into the page.

### The Cloud: Why Cloudflare Clicks in the AI Era
On the infrastructure side, Cloudflare is built for the agentic workflow.

Now, DevOps feels like the natural way to build. I’m actually motivated to go the extra mile, generate a scoped Cloudflare API token, and hand it to my agent. Why? Because it’s **actually faster**.

Instead of me spending three hours debugging CI scripts and webhook configs, I give the agent the API token, and it handles the entire loop:
* **Cloudflare Pages & Functions:** Static site generation at the edge with instant serverless API endpoints.
* **Cloudflare D1:** A fast, serverless relational SQL database (SQLite) that is infinitely easier to manage than document stores.
* **Cloudflare R2:** S3-compatible object storage with zero egress fees.
* **DNS & Domain Management:** Built-in SSL, DDoS protection, and edge caching out of the box.

Best of all: **the free tier is extraordinarily generous**, and the entire platform can be managed through clean APIs using a single scoped token.

When your AI coding environment can manipulate your entire cloud infrastructure through a clean API token in seconds, the friction of deployment completely vanishes.

---

## The Real-World Test: A Clinic Website

A personal tech blog is one thing—we tolerate tinkering and rough edges on our own sites. A real commercial business is another.

My wife runs an aesthetic medical clinic, and her website ([www.milabeautyinjections.com](https://www.milabeautyinjections.com)) is how clients discover treatments and book appointments.

In the past, maintaining a family member's business website was something every software engineer quietly dreaded. Updating service lists, changing photo layouts, or fixing mobile navigation meant context-switching, local builds, and manual testing. You’d put off requests because the friction was annoying.

With Gemini Antigravity and Cloudflare, **I don’t think twice before making a change.** Here are a few real examples:

### 1. Breaking the "Deer in the Headlights" Paralysis: The Awards Page
Mila won an industry award at the beginning of the year. I had meant to showcase it on the site for months, but never found the time.

When starting a brand-new page from scratch, I often get blinded like a deer in the headlights—there are too many design directions, layout options, and copy decisions. Analysis paralysis sets in, and you stall.

With Gemini Antigravity:
1. **It found the lost asset:** I had misplaced the original high-res award image; the AI helped locate it across project directories.
2. **It generated the first implementation:** Instead of staring at an empty file, the AI scaffolded a complete, styled layout.
3. **We iterated:** It is infinitely easier to refine something that already exists than to start from zero. Make it work, then make it work better. A task delayed for nine months was completed and deployed in twenty minutes.

### 2. The Packages Carousel: Pricing Front and Center
We received feedback from prospective clients that treatment packages and pricing needed to be more front and center on the site.

Instead of fighting clunky visual builder widgets, I brainstormed the UX directly with the AI. Together, we built an elegant interactive packages carousel that brought pricing, treatment details, and booking triggers right into the spotlight—fully responsive and matching the clinic's luxury aesthetic.

### 3. Discovering Unknown Blockers with Microsoft Clarity
My analytics setup was only as good as the tools I already knew—historically, that meant heavyweight platforms like Mixpanel or FullStory.

When I asked the AI how to get better visibility into user drop-offs without slowing down the site, it recommended **Microsoft Clarity**. It set up the integration script in seconds.

The result was unbelievable: session recordings immediately highlighted unexpected friction points where real visitors were getting stuck on mobile navigation. We diagnosed and fixed those blockers the exact same day.

### 4. Breaking Free from Platform Constraints: "Chat with Mila"
Beyond visual tweaks, the real unlock was building custom interactive features without feeling like the platform was working against me.

On traditional site builders like Squarespace or Wix, whenever you want to introduce custom interactive logic, you constantly struggle with limitations. You find yourself hacking around awkward iframe embeds, fighting script restrictions, or compromising on UX because the platform’s constraints box you in.

A prime example is **"Chat with Mila"**—a custom on-site interactive assistant that helps patients explore aesthetic treatments and answers common questions before booking.

Building that directly in standard web code with an AI agent felt completely natural. No workarounds, no fighting proprietary platform limitations, and no compromising on the user experience—just clean, custom functionality that fits seamlessly into the site.

---

## Over to You

For more than a decade, building on the web meant spending most of our creative energy surviving the plumbing. Today, with the right combination of an agentic coding partner and modern edge infrastructure, that tax has largely vanished.

What has been your experience? Have you felt that shift from *"let's make it work"* to *"let's build something"*, or are you still wrestling with YAML configs and site builders? 

Share your thoughts and experiences in the comments below—I'd love to hear how your workflow is evolving!
