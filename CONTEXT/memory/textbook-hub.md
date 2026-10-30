---
name: textbook-hub
description: Library page «Opera omnia» (index.html) linking all books: URL, generator, back-links, plain-anchor deep links, definition-naming rule
metadata:
  type: project
  modified: 2026-10-23T22:39:46.273Z
---

Nick asked (2026-10-23) for one entry point to all books, "as you see it, we'll fix later". Built and published:
- Artifact https://claude.ai/artifact/GsAXGC62CPJkWxh1PEy9WQ (private, icon "book"); copy at /mnt/project-files/index.html and repo root index.html.
- Generator: textbook/kit/hub.py OUT.html [MINIBOOK.html] + kit/hub_template.html; covers kit/covers/*.webp made by kit/hub_covers.cjs (one figure per part, both themes). Chapter/part descriptions are hand-written in hub.py (MAIN, MINI); items come from kit/xref_index.json plus regexes over the minibook. Rebuild + republish after any book change that adds items or books.
- Content: reading path ∅ → ∇ → ∠ → 𝒩 → ⊥ (𝒩 parts 2–4 "пишется", ⊥ "впереди"), minibooks, search over statements/figures/sections (word-prefix match), "Как устроены книги". Never list FUTURE.md plans there (public repo).
- Every book's contents panel has «Все учебники ↗» (class ghome, data-file relative path for file:), in kit/nav.html and minibook b0_gloss.html.
- Deep links: artifact viewer passes only plain anchors, so keys travel as #st-o.26 (∅ ∇ ∠ 𝒩 → o d a n); kit/xref.html has toHash/fromHash, old #ref= still parsed. Minibook src/s_xref.html is a copy of kit/xref.html.
- Same evening Nick asked: every definition heading has a name in parentheses (menu pills show it); a notion defined inline goes into its own definition block (∅.3 measurable space, ∅.53 Borel map, ∅.54 random vector); section-link cards show only the title. All in FORMAT.md.
**Why:** later sessions must keep the hub in sync with the books.
**How to apply:** after adding a book/part, add it to hub.py and covers, rebuild, republish to the same URL, copy to index.html, push. See [[textbook-ch0-state]], [[github-sync]].
