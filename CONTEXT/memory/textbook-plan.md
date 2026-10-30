---
name: textbook-plan
description: Structure of Nick's study textbook (chapters ∅, ∇, ∠, 𝒩, ⊥), where each part stands, and the commitment to merge all parts into one PDF
metadata:
  type: project
  modified: 2026-10-23T09:07:24.476Z
---

Decided 2026-10-05 with Nick: the study material is one textbook, ordered by logic, not by study order.
- Ch.∅ Measure & Lebesgue integral, 3 parts, complete; URLs, sources, numbering in [[textbook-ch0-state]].
- Ch.∇ Geometry of shape: v2 published 2026-10-20, details in [[textbook-ch-nabla-state]].
- Ch.∠ Random variables as vectors (split out of §∅.10 on 2026-10-23 at Nick's request): published 2026-10-23, details in [[textbook-ch-angle-state]].
- Ch.𝒩 Gaussian processes, 4 parts: (1) Gaussian vectors & conditioning — https://claude.ai/artifact/6fDRAqCpQNqHudJgqvxAs5 (numbers 𝒩.1–𝒩.22, figs 𝒩.1–𝒩.4, Упр. 𝒩.1–𝒩.4, Вопрос 𝒩.1–𝒩.5; sources textbook/src_chNp1, page textbook/ch2_part1_gaussian_vectors.html); (2) rigorous GP, kernels, building on ch.∠ (what is left of the geometry promise: [[gp-part2-geometry-section]]), plus the infinite-dim "no translation-invariant measure on functions" argument done properly (norms, balls, separability, bump pictures), plus (promised in chat 2026-10-23) why «f непрерывна» is not in the cylinder σ-algebra (example X̃_t = X_t + 1{t=U}) and continuous/smooth versions of a process; (3) linear functionals, derivatives; (4) code + tests.
- Ch.⊥ Grasping: c-space, first/second-order immobility.
- Order: ∅ → ∇ → ∠ → 𝒩 parts 2–4 → ⊥ → merge.
- Chapters are labelled by symbols: ∅, ∇, ∠, 𝒩, ⊥ (Σ reserved for the glossary icon), so "Лемма ∅.15", "Рис. ∅.3", "§∅.2". Refer to other chapters by topic ("в главе о гауссовских процессах"), not by symbol.
- Format rules live in textbook/FORMAT.md (proof markup, exercises, glossary, page controls, 2D/3D figures, folded captions, clickable cross-references); read it before writing.
- Clickable mentions (Nick, 2026-10-23): every «лемма ∅.42», «рис. ∠.4», «§∅.10» etc. opens a card (statement text; for a figure the picture itself in miniature + first caption sentence; for a section only its heading); other parts open in a new tab at a plain anchor like #st-o.26 (old #ref=key still parsed) (Nick confirmed it works). Built by kit/xref.html + kit/xref_index.py (+ kit/xref_thumbs.cjs for thumbnails of figures in other parts); a new chapter must be added to PAGES there, and builds need two passes.
**Why:** Nick asked not to forget to merge everything at the end, and later sessions need to know which part comes next.
**How to apply:** write parts in the order above; when all exist, merge into one book and render a PDF with consistent numbering. See [[nick-working-rules]].
