---
name: gp-part2-geometry-section
description: Geometry of random variables as vectors: now chapter ∠ (2026-10-23); what of the promise is still left for 𝒩 part 2
metadata:
  type: project
  modified: 2026-10-22T10:14:48.263Z
---

Nick (2026-10-22, while reading §∅.10) asked to "пощупать" random variables as vectors on examples and figures, and suggested the GP chapter. Promised in chat: 𝒩 part 2 opens with a section on this geometry, with interactive (3D) figures:
- finite Ω: a random variable is an arrow in ℝⁿ, ⟨ξ,η⟩=Σpᵢξᵢηᵢ; constants = diagonal; mean = foot of the perpendicular onto it; variance = squared length of the perpendicular; covariance = scalar product of deviations; correlation = cosine of their angle;
- values f(x) of a process are vectors in L²(P), k(x,x') their scalar products, so a kernel must be PSD because it is a Gram matrix;
- the process is a curve x↦f(x) in L²; derivative = velocity, second derivative = acceleration;
- conditioning on touches = orthogonal projection onto the span of observed vectors; posterior variance = squared distance to the span; the distance grows like |x−x_j| (values only), (x−x_j)² (+derivative), |x−x_j|³ (+curvature), hence thinner uncertainty threads (link to the paper's H1).
2026-10-23: Nick asked to make this a separate chapter ∠ «Случайные величины как векторы» (between ∇ and 𝒩), with the countable and uncountable cases at the end; done, see [[textbook-ch-angle-state]]. ∠ covers the finite case (3D figure), Gram matrix/PSD, curve in L², prediction from ONE observation as projection (sinusoid = circle). STILL for 𝒩 part 2: derivative = velocity of the curve, conditioning on several touches = projection onto their span, distance growth |x−x_j| / (x−x_j)² / |x−x_j|³ (link to H1); cite ∠ for the basics.
**Why:** an explicit promise to Nick; the section also motivates PSD kernels and the curvature gain.
**How to apply:** in 𝒩 part 2 build on ∠ (cite its statements by number) instead of repeating it; add the remaining items above. See [[textbook-plan]], [[textbook-ch0-state]].
