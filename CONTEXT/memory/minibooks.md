---
name: minibooks
description: Mini-textbooks thread: cross-entropy minibook audience, plan, file locations and decisions
metadata:
  type: project
  modified: 2026-10-18T17:52:19.880Z
---
Second minibook chosen by Nick 2026-10-27: optimizers, culminating in a gentle explanation of Muon and Shampoo («цены тебе не будет»). Plan: minibooks/optimizers/PLAN.md. Spine: steepest descent depends on the norm (ℓ2→GD, ℓ∞→sign/Adam, spectral→Muon UVᵀ); Shampoo L^{-1/4}GR^{-1/4}; Shampoo without accumulation = Muon. Approved and being written in waves; part 1 (§1–§6, 45 statements, 10 figures) published 2026-10-28 as artifact https://claude.ai/artifact/XAdyoRDeyvygfLBjha37dB and pushed (minibooks/optimizers). Part 2 (§7–§11: Newton, natural gradient/Fisher, heavy ball+Nesterov, SGD, AdaGrad/RMSProp/Adam/AdamW; 75 statements, 18 figures total) published 2026-10-28 as version 2 of the same artifact, offline file regenerated, pushed. Next: wave 3 §12–§16 (SVD/matrix norms, Shampoo, Muon, summary, exercises incl. Adam counterexample); then add the book to the hub. Figure lesson: heavy-ball figures need starts near the ravine floor (transient k·ρ^k growth flies out of frame). Book uses a third colour --sage and a formula-fit script (FORMAT.md, 28.10). Offline copy (Nick 28.10): tools/offline.py embeds fonts (scratchpad fonts_inline.css from Google Fonts css2, cyrillic/latin/greek subsets) and MathJax tex-svg 3.2.2 → optimizers_offline.html (~3.8 MB); build part only with MAXSEC=N.

Book format spec for ALL books (main chapters + minibooks): /mnt/project-files/textbook/FORMAT.md; every format change Nick asks for goes there first and is applied everywhere (Nick, 2026-10-18).

Mini-textbooks live in their own thread; sources under /mnt/project-files/minibooks/<topic>/ (src/, tools/, PLAN.md). Same style as the main book (see [[textbook-plan]]), plus round fixed buttons: top-left a navigation (contents) circle with the Σ glossary circle below it, top-right the light/dark theme toggle; a second click on a circle closes its panel. Nick wants the nav circle in ALL textbooks from now on (2026-10-18). Section headings start with § («§8. …»).

Future minibooks Nick asked to plan (2026-10-18): attention + modern LLM (RLHF, quantization, architecture tricks); optimizers (random search, annealing, SGD → Muon, Shampoo); robotics (where control theory and physics ODEs come from); RL up to RLHF and robotics methods; modern GPU architecture from his level (he can build a simple RISC CPU from gates) to tensor cores, HBM, SIMT (added 2026-10-19); diffusion and modern generative models incl. flow matching (added 2026-10-20); a functional analysis longread focused on overlaps: L^p, Hilbert spaces, contraction principle (Picard, Bellman), Riesz, spectral theorem, Mercer, Bochner, RKHS for ch.𝒩 (added 2026-10-20); VLA (vision-language-action models), after the LLM, diffusion and robotics books (added 2026-10-23). List and order in /mnt/project-files/minibooks/FUTURE.md; order not chosen yet. Cross-entropy minibook declared COMPLETE by Nick 2026-10-18 (v16). Nick wants a break from heavy math after Lebesgue and to switch topics; 2026-10-27 Nick asked to start the next book and to rank them; ranking in FUTURE.md; info-gain plan draft minibooks/value_of_information/PLAN.md mentions the paper idea: never push it.

First minibook (2026-10-18): «Кросс-энтропия: удивление, информация и расстояние между распределениями», plan in /mnt/project-files/minibooks/cross_entropy/PLAN.md, agreed with Nick before writing.
- Audience: junior undergrads after a probability course (outcomes, events, discrete distributions known; §2 only a short recap). Nick wants to hand it to students.
- Introduce likelihood and information from basics (model, likelihood as product, MLE on a coin; information as number of yes/no questions → log2, then surprise axioms).
- Do NOT mark hard parts with asterisks/optional labels.
- Published 2026-10-18: https://claude.ai/artifact/7JUQRANXVdiuqgyDMfaSdh (built by tools/build.py from src/ → cross_entropy.html; republish same file path to keep URL). build.py also writes cross_entropy_file.html (doctype + utf-8 meta) for sending to students as one file; the artifact file has no doctype, so test ids for case clashes (quirks mode matched getElementById('emP') to id="emp").
- Nick wants many explanatory interactive pictures, even for recap material (2026-10-18: added dice events, simplex Δ(X), empirical distribution figures to §2).
- Numbering: plain numbers (Теорема 19, Рис. 3, §5).
- Framing nuance agreed in plan: cross-entropy itself is not a distance (H(p,p)=H(p)); the distance-like part is KL = H(p,q) − H(p).
**Why:** Nick asked to approve the plan before writing ("ты что-то придумал, а я даже не вижу").
**How to apply:** for each new minibook, send a plan first and wait for approval.

