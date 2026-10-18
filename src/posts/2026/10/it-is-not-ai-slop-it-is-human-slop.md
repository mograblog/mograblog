---
title: "It's Not 'AI Slop'—It's Human Slop"
published: 2026-10-18
description: "Everyone is complaining about low-quality AI code and 'vibe coding'. But code quality didn't crash because of AI. It crashed because humans are rubber-stamping code they didn't review."
keywords: ai, code quality, software engineering, code review, vibe coding, developer productivity, tech debt
cover: /koalas/human-slop-koala-just-approve-it.jpg
coverTitle: Senior koala engineer wearing a 'Just Approve It / human slop' shirt with an LGTM coffee mug
---

I recently came across this [post on X by Patrick Kuhnke](https://x.com/patrick_kuhnke_/status/2111825796872732921):

> *"vibe coding is the new low-code.*  
> *good luck to whoever has to maintain it in five years."*

Every developer seems to be nodding along right now, blaming "AI slop" for ruining codebases.

Calling it AI slop is a cop-out. **It's Human Slop.**

---

## Low-Quality Code Was Always Normal

Software has never been pristine by default. 

Juniors have always written awkward abstractions. Seniors have always cut corners when rushing against a deadline. That’s why code review exists.

AI didn't invent low quality. **It just increased the throughput.**

There's a classic [Alberta Tech video](https://www.youtube.com/shorts/lUBPD2bWodA) that captured this long before LLMs:
* **Review a 10-line PR:** 50 comments, 3 debates about variable naming.
* **Review a 1,000-line PR:** *"Looks good to me (LGTM)"* ➔ Instant Approve.

Huge, unreadable PRs have always been rubber-stamped. AI just made generating those 1,000-line diffs take 20 seconds instead of three days. 

When someone prompts an agent, glances at the output, and their peer clicks "Approve" without reading it—that is not an AI failure. 

**AI generated the code. A human clicked "Merge."**

---

## The Steering Wheel Is Still Ours

AI is a genuine superpower. But the consequences of that speed are entirely in our control:

1. **Keep PRs small.** AI didn't force a 2,000-line monolith on you. You control the scope of the prompt and the commit.
2. **If you can't explain it, don't merge it.** If the author doesn't understand the diff and the reviewer didn't verify it, it shouldn't reach `main`.
3. **Use the AI as a quality gate, too.** Feed your linters, design rules, and constraints back into the agent before the code is ever committed.

**AI is not vibe coding.**

AI is an engineering multiplier. Vibe coding is just abandoning code review.

Our job isn't to fight the tool—it's to stop human review from becoming a rubber stamp.
