---
name: textbook-ch-angle-state
description: State of textbook chapter ∠ «Случайные величины как векторы» (published 2026-10-23): URL, sources, contents, numbering, open questions
metadata:
  type: project
  modified: 2026-10-23T18:11:53.126Z
---

Chapter ∠ was split out of §∅.10 on 2026-10-23 at Nick's request ("выделим часть про случайные величины как векторы в отдельную главу", plus what changes for countable and uncountable Ω, with a beautiful picture).
- Page: https://claude.ai/artifact/1pmxEMvV5FRoAiBCqd8rVS (private until Nick shares it); copy textbook/ch1b_random_variables_as_vectors.html; sources textbook/src_chAngle (NOTES.md has build and checks).
- §∠.1 three outcomes in ℝ³, §∠.2 L²(P), mean = projection onto constants, Cov/ρ = inner product/cos of deviations, §∠.3 unequal probabilities (weighted coordinates, zero-probability outcomes), §∠.4 [0,1): cells, step functions, dyadic averages converge (Thm ∠.6), §∠.5 countable Ω: ℓ², not every function is a vector, orthonormal sequence with no convergent subsequence, §∠.6 uncountable: value at a point is invisible (tent figure), Rademacher = coins, Walsh basis (Thm ∠.11), table «Три мира», §∠.7 bridge to GP: process = curve in L², Gram matrix PSD, prediction = projection, random sinusoid = circle, §∠.8 exercises.
- Numbering (manual): statements ∠.1–∠.12, Упр. ∠.1–∠.8, Вопросы ∠.1–∠.5, figures ∠.1–∠.6 (rv3, stp, cnt, spk, rad, gpc).
- Not answered by Nick yet: what confused him in the old flat figure ∅.26 (now replaced by the 3D Fig ∠.1).
**Why:** later sessions must rebuild from these sources and cite ∠ from 𝒩 part 2.
**How to apply:** edit sources, rebuild, run xref two-pass build if statement text changes, republish to the same URL, sync GitHub ([[github-sync]]). See [[textbook-plan]], [[gp-part2-geometry-section]].
