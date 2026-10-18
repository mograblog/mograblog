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

It echoes a sentiment you hear everywhere across tech right now: that AI is flooding our repositories with low-quality, unmaintainable "slop."

I disagree. Code quality today did not suddenly drop because of AI. The connection is not direct.

If your codebase is turning into a swamp of unmaintainable code, calling it **AI Slop** is letting yourself off the hook. 

In reality, **it’s Human Slop.**

> [!NOTE]
> ### TL;DR
> - **AI doesn't commit to `main`:** AI merely increased code generation throughput. Humans are the ones clicking "Merge."
> - **We always wrote bad code:** Juniors (and tired seniors) have always delivered subpar first drafts. That’s why we invented code reviews, linters, and design patterns.
> - **The real failure is review culture:** AI made it easy to generate 1,000 lines of code in seconds, and humans took the bait by rubber-stamping it with "LGTM."
> - **The senior engineer’s real job:** Don't fight AI—build the guardrails, enforce small PRs, and use the same AI to enforce quality standards before code ever reaches production.

---

## Low-Quality Code Isn't New

Let's be honest about software history: developers have been shipping buggy, unreadable, brittle code for as long as compilers have existed.

Junior developers have always submitted pull requests with awkward abstractions, missing edge cases, and questionable architecture. Honestly, so have experienced developers when rushing against a deadline.

We never expected developers to write pristine code on the first try. That’s why the industry spent decades building defensive engineering infrastructure:
* Peer code reviews
* Automated test suites and CI pipelines
* Linters and static analysis
* Architectural design patterns

The contract was simple: **you draft the code, but the team's review process ensures the quality.**

So what actually changed with AI?

---

## The LGTM Syndrome, Amplified

AI didn’t degrade code quality. **It increased throughput.**

Before AI, generating 1,500 lines of messy boilerplate took an engineer three days. Now, a model generates it in twenty seconds.

And what happens when an engineer is handed a massive pull request? There's a classic [video by Alberta Tech](https://www.youtube.com/shorts/lUBPD2bWodA) that captures this perfectly:
* **Review a 10-line PR:** 50 comments, deep debates over variable names, and intense scrutiny.
* **Review a 1,000-line PR:** *"Looks good to me (LGTM)"* ➔ Instant Approve.

AI didn't invent this dynamic. Huge, bloated PRs existed long before language models, and developers were already rubber-stamping them because thoroughly reviewing 1,000 lines of code is mentally exhausting.

AI just made it trivial to produce those massive PRs repeatedly. 

When developers prompt an agent, glance at the diff for three seconds, open a giant pull request, and their peer hits "Approve" without reading it—**that is not an AI failure. That is a human review failure.**

AI produced the text. Humans allowed it into production.

---

## The Fix Is In Our Control

AI is undeniably a massive improvement. It enables engineers to prototype faster, explore unfamiliar frameworks, and automate tedious boilerplate.

The good news is that the remedy is entirely in our hands. We don't have to accept bloated, unmaintainable code just because an LLM helped write it:

1. **Keep PRs small:** There is no rule that says an AI-assisted PR has to be a 2,000-line monolith. Break problems down. Generate, review, and commit in small, digestible increments.
2. **Never approve code you wouldn't explain in an interview:** If the author cannot explain how the code works, and the reviewer cannot explain why it’s safe, it shouldn't merge. Period.
3. **Use AI to enforce standards, not just generate code:** If you have strict architectural conventions, feed them back into your agent via `CLAUDE.md`, system prompts, or automated pre-commit review bots. Make AI your first line of automated linting.

---

## What Experienced Engineers Should Focus On

If you are a senior engineer, tech lead, or engineering manager, cursing "vibe coding" or lamenting "AI slop" is a waste of energy. The technology is here, and the productivity leverage is real.

Our job right now is to **streamline AI usage while upholding engineering rigor**:
* Establish the guardrails that prevent unchecked code generation.
* Re-instill a culture where thorough code review is valued over sheer commit volume.
* Help junior engineers learn how to critique and refine AI output rather than blindly accepting it.

AI makes generating code effortless. It’s up to us to make sure it’s code worth keeping.

---

*What do you think? Are you seeing "AI slop" in your codebase, or is the breakdown really happening at the code review stage? Let me know in the comments below!*
