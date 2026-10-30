---
name: github-sync
description: All books are published in Nick's PUBLIC repo vasiliev-nick/opera-omnia and must be synced there after every change; what is excluded and how to commit
metadata:
  type: project
  modified: 2026-10-22T23:25:54.877Z
---

Nick asked on 2026-10-22: move project files to his GitHub and keep them synced after every change. Set up the same day.

- Repo: https://github.com/vasiliev-nick/opera-omnia, PUBLIC (Nick's choice, "пусть все видят"); name chosen by Nick (wanted something grand and academic, not robotics-only). First push 2026-10-22: textbook/, minibooks/, Russian README.md, LICENSE (CC BY 4.0, texts) + LICENSE-CODE (MIT, scripts), my recommendation; Nick had not explicitly confirmed the license (CC BY-NC-SA 4.0 was the alternative).
- Full procedure and file mapping: /mnt/project-files/GITHUB.md (not itself published). FORMAT.md carries a one-line pointer to the repo.
- 2026-10-30 Nick CHANGED this: asked to export all useful context to GitHub (to be able to continue with local LLMs) and, offered a private repo, explicitly chose to put the paper context into the PUBLIC opera-omnia too (risk of being scooped was stated on the card). Since then notes/ (summary, 2D setup, paper_backup.md/.pdf), minibooks/FUTURE.md, minibooks/value_of_information/ and a handoff folder CONTEXT/ (rules, state, workflow, memory export) live in the repo; AGENTS.md at the root points agents to CONTEXT/. Still excluded: uploads/ (raw duplicates), textbook/kit/BRIEF_wave2.md, *.bak*, branding/ sources.
- Commit author = Nick: "Nikita Vasiliev" <99510754+vasiliev-nick@users.noreply.github.com> (he insists he is the author); Claude credited as co-author via Co-Authored-By trailer (Nick agreed, 2026-10-22).
- Repo is NOT saved to the project (Nick declined the save prompt once); each thread attaches it with add_repo (owner vasiliev-nick, repo opera-omnia, access push). Claude GitHub App is installed on it.

- Nick edits files directly on GitHub (he rewrote the README intro on 2026-10-22): always pull main first and carry his edits back into /mnt/project-files, never overwrite them.
- README banner (2026-10-22): assets/banner.png, 1280×400 at 2x; light theme, kicker «собрание учебников» + «Opera omnia» in Literata italic on the left, a scattered cloud of book figures on the right (KL simplex central). Nick rejected logos (not needed), fade-outs around figures and slogans. Layout made by Nick in the sandbox artifact https://claude.ai/artifact/H4z25RqMbNfhYbMbf7ygEP (db doc banner/layout); sources in /mnt/project-files/branding/.

- No GitHub Pages (Nick, 2026-10-22): readers download the HTML and open it locally; don't propose Pages again.

**Why:** Nick wants his books visible publicly under his name.
**How to apply:** after any change to a book in /mnt/project-files, copy it into a clone of opera-omnia per GITHUB.md and push to main. Paper notes are public since 2026-10-30 (Nick's choice); keep CONTEXT/state.md and CONTEXT/memory/ in sync when the state changes. See [[nick-working-rules]].
