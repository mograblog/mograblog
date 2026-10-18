---
title: "It's Not 'AI Slop'—It's Human Slop"
published: 2026-10-18
description: "Everyone is complaining about low-quality AI code and 'vibe coding'. But code quality didn't crash because of AI. It crashed because humans are rubber-stamping code they didn't review."
keywords: ai, code quality, software engineering, code review, vibe coding, developer productivity, tech debt
cover: /koalas/ai-slop-code-review-koala.jpg
coverTitle: Senior koala engineer wearing a 'Just Approve It / human slop' shirt with an LGTM coffee mug
---

I recently came across this [post on X by Patrick Kuhnke](https://x.com/patrick_kuhnke_/status/2111825796872732921):

> *"vibe coding is the new low-code.*  
> *good luck to whoever has to maintain it in five years."*

Every developer seems to be nodding along right now, blaming "AI slop" for ruining repositories.

I disagree. Code quality didn't drop because of AI. 

Calling it AI slop is a cop-out. **It's Human Slop.**

---

## Low-Quality Code Was Always Normal

Software has never been pristine by default. 

Junior developers have always written questionable abstractions. Seniors have always written brittle shortcuts when rushing against a deadline. We expected bad first drafts—that is literally why code reviews exist in the first place.

AI didn't introduce low-quality code to engineering teams. **It just increased the throughput.**

Writing 1,000 lines of messy boilerplate used to take an engineer three days. Now it takes twenty seconds.

And what happens when an engineer gets handed a 1,000-line diff? 

There's a classic [video by Alberta Tech](https://www.youtube.com/shorts/lUBPD2bWodA) that captures reality:
* **Review a 10-line PR:** 50 comments, 3 heated debates about variable naming.
* **Review a 1,000-line PR:** *"Looks good to me (LGTM)"* ➔ Instant Approve.

Huge, unreadable PRs existed long before language models, and people were already rubber-stamping them because reviewing a thousand lines of unfamiliar code is exhausting.

AI just gave everyone an infinite firehose to generate those pull requests.

When an engineer prompts an agent, glances at the diff for five seconds, opens a giant PR, and their teammate clicks "Approve" without reading it—that is not an AI failure. 

**AI generated the code. A human clicked "Merge."**

---

## The Steering Wheel Is Still Ours

AI is a genuine superpower. It lets anyone prototype faster and eliminates tedious boilerplate. 

The consequences of that speed are entirely in our control. We don't have to accept bloated, unmaintainable code:

1. **Keep PRs small.** There is no law saying an AI-assisted PR has to be a 2,000-line monolith. You control the scope of the prompt, the commit, and the review.
2. **If you can't explain it, don't merge it.** If the author doesn't understand the diff and the reviewer didn't verify it, it has no business reaching `main`.
3. **Use the AI as a quality gate, too.** Feed your linters, design rules, and architectural constraints back into the agent before code ever opens as a PR.

Cursing "vibe coding" won't stop people from using it. 

The real job for experienced engineers right now isn't to fight AI code generation—it's to make sure human review doesn't become a rubber stamp.
