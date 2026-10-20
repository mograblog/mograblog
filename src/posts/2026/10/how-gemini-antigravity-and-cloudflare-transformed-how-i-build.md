---
title: "Building Websites in the AI Era: How Gemini Antigravity and Cloudflare Changed Everything"
published: 2026-10-20
description: "How pairing Gemini Antigravity (Gemini 3.8 Flash on Medium effort) with Cloudflare eliminated site maintenance friction, accelerated content, and transformed both my blog and my wife's clinic website."
keywords: ai, gemini antigravity, cloudflare, astro, fullstack, software engineering, developer productivity, gemini 3.8 flash
cover: /koalas/gemini-cloudflare-koala.jpg
coverTitle: Senior koala engineer pairing Gemini Antigravity with Cloudflare to ship blazing fast fullstack websites
draft: true
---

A decade ago, running a personal technical blog meant constantly fighting your own stack.

Back in 2016, when I wrote about [adding a page counter with Firebase](/2016/08/static-site-page-counter/), I was writing custom jQuery, wrangling client-side JSON security rules, and maintaining a Metalsmith build pipeline. Every small design tweak, database migration, or interactive widget felt like an uphill chore.

Fast forward to 2026. The way I build, write, and maintain web projects has fundamentally changed.

Today, this blog runs on a pairing that has virtually eliminated maintenance friction: **Gemini Antigravity** and **Cloudflare**. 

In fact, the setup worked so well that I also moved my wife’s aesthetic clinic website ([Mila Beauty Injections](https://www.milabeautyinjections.com)) onto the exact same stack.

---

## The AI Engine: Gemini 3.8 Flash on Medium Effort

There is a common misconception that using AI to build or write means outsourcing your thinking.

It doesn’t.

**The ideas are still mine. The perspectives are still mine. The posts are still mine.**

What changed is that AI stripped away the mechanical drag between having an idea and having it live on the web.

For development, I rely heavily on **Gemini Antigravity**, specifically running **Gemini 3.8 Flash with Medium thinking effort**.

While many people default to the largest, slowest models available, I’ve found 3.8 Flash on Medium effort to hit the ultimate sweet spot for software engineering:
* **Speed:** Instant responsiveness without long delays.
* **Reasoning:** Thorough enough to refactor code, catch subtle edge cases, and run multi-step workspace tasks cleanly.
* **Token & Cost Efficiency:** Incredibly lightweight, letting me iterate through dozens of diffs in a single sitting without hitting rate limits or high bills.

Because the tool friction is gone, the editorial quality actually goes *up*:
1. **Focus on substance over maintenance:** I spend my energy thinking through the thesis, not debugging CSS layout bugs or configuring build pipelines.
2. **Timely publishing cadence:** When an interesting tech debate happens, I can publish a thoughtful take while the conversation is still relevant.
3. **Sharp polish:** Better English phrasing, tighter arguments, and bespoke cover art that adds personality to every post.
4. **Live, working examples:** Instead of just pasting static code snippets, I can comfortably drop working, client-side demos (from WebGPU neural models to WebAssembly pipelines) directly into the page.

---

## The Infrastructure: Why Cloudflare Is Built for the AI Era

An AI assistant is only as fast as the infrastructure backing it. If spinning up a database or deploying changes requires fifteen configuration consoles, the loop slows down.

Cloudflare has turned out to be the ultimate target for AI-assisted development—especially for sites that are **heavy frontend, lightweight backend, and database-backed**. (And if your project is pure frontend, it’s even better).

Virtually everything this blog needs is provided under one unified roof:
* **Cloudflare Pages & Functions:** Static site generation at the edge with instant serverless API endpoints.
* **Cloudflare D1:** A fast, serverless relational SQL database (SQLite) that is infinitely easier to manage than document stores.
* **Cloudflare R2:** S3-compatible object storage with zero egress fees.
* **DNS & Domain Management:** Built-in SSL, DDoS protection, and edge caching out of the box.

Best of all: **the free tier is extraordinarily generous**, and the entire platform can be managed through clean APIs using a single scoped token. 

When your AI coding environment can push migrations, query D1, and deploy to Pages with simple CLI commands, the barrier to shipping drops to zero.

---

## The Real-World Test: A Clinic Website

A personal developer blog is one thing—we tolerate tinkering and rough edges on our own sites. A real business is another.

My wife runs an aesthetic clinic, and her website ([www.milabeautyinjections.com](https://www.milabeautyinjections.com)) is how clients discover treatments and book appointments.

In the past, maintaining a family member's business website was something every software engineer quietly dreaded: updating service lists, changing photo layouts, or fixing mobile navigation meant context-switching, local builds, and manual testing. You’d put off small requests because the friction was annoying.

With Gemini Antigravity and Cloudflare, **I don’t think twice before making a change.**

When she asks for an update—whether it's adjusting the design, adding a treatment section, or polishing the mobile layout—it's done in minutes. She gets faster turnaround and better design, and I don't have to spend my weekend babysitting infrastructure.

---

## The Evolution of a Mantra: From "Let's Make It Work" to "Let's Build Something"

Ever since I started Mograblog in 2010, the tagline under the title has been:  
**"Let's make it work!"**

That mantra came from the gritty reality of early-2010s software engineering. Back then, half the job was just wrestling with stubborn tools—Apache configs, SVN repos, brittle build pipelines, and obscure compiler quirks. You had an idea, but before you could build anything, you had to spend days just surviving the plumbing. *"Let's make it work"* was about rolling up your sleeves and getting stubborn tech over the finish line.

But lately, I find myself thinking about a new mantra: **"Let's build something."**

When you pair Gemini Antigravity (running Gemini 3.8 Flash) with Cloudflare, the friction of "making it work" largely evaporates. The AI writes the boilerplate, wires the API endpoints, and refactors the CSS in seconds; Cloudflare deploys it to the global edge without a hiccup.

We don't have to spend all our creative energy just getting the plumbing to work anymore. 

The focus has shifted from *wrestling the tool* to *building the thing*. Whether it’s an interactive in-browser neural net demo for this blog, or shipping a clean new feature for my wife’s clinic, the feeling at the keyboard is completely different. It's no longer *"Can I get this stack to work?"* 

It's: *"What can we build today?"*
