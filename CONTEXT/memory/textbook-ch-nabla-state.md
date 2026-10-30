---
name: textbook-ch-nabla-state
description: State of textbook chapter ∇ (geometry of shape): URL, sources, numbering, figures incl. 3D modes, key formulas, what Nick has seen
metadata:
  type: project
  modified: 2026-10-20T23:33:07.846Z
---

Chapter ∇ «Геометрия формы: кривизна, которую чувствует палец»: https://claude.ai/artifact/7a1oxXoUjTKVLavKTv5Mdw (built copy textbook/ch1_nabla_geometry.html, sources textbook/src_chNabla/ with NOTES.md; plan textbook/ch_nabla/PLAN.md). v1 published 2026-10-20 18:41; v2 (2026-10-20 night) added 2D/3D figures after Nick asked «больше иллюстраций» and to drag points over 3D surfaces. Nick has not reviewed v2 yet.
- Sections §∇.0–§∇.7 as in v1 (curves, curvature, implicit curves, signed distance f_K, bowl/dome, sensor Lemma ∇.24/Cor. ∇.25, summary + Вопросы ∇.1–∇.6). Statements ∇.1–∇.25 and exercises unchanged by v2 (manual numbering; v2 added only paragraphs, «В 3D» boxes, asides and figures).
- Figures v2 (auto-numbered via «Рис. ∇.@key»): pivot, cusp, poly, speed, zoom, comb, draw, gauss, exgear, relief, cassini, roof, fronts, tube, normals, gap, sensor (17).
- 3D: engine TB.V3 in src/s_3d.html (camera, painter's render with top/ghost items, pick, geom with book sign κ>0 bending away from outward n, tangentCut, interact grab/move/tap, intro). Shared surfaces V.SURF elld/torus/saddle. Figures switch 2D↔3D by shape buttons (no 2D/3D toggle), only2d/only3d elements; shared gauges via TB.G(id), Gauge.unmark. Rule recorded in FORMAT.md.
- New «В 3D» boxes: §∇.2 #d3curv (normal sections, κ(v)=−⟨γ'',n⟩, principal curvatures, Euler formula, K, umbilics), Gauss map box, osculating paraboloid box; §∇.3 box rewritten (κ(v)=⟨v,∇²f v⟩/|∇f|, Euler from spectral theorem); §∇.4 #parsurf (parallel surfaces κ_i/(1+dκ_i), centres z_i) and Δf_K=2H; §∇.5 #focal (ρ''=1−rκ(v), bowl/dome/saddle); §∇.6 box before sensor.
- Notation: K means the shape, but in «В 3D» boxes K is Gaussian curvature (stated in #d3curv). Λ = inscribed polyline length. n=−Jt introduced in §∇.2 #gaussmap.
- Conventions: K={f≤0}, n outward, t=Jn, κ>0 convex. Var ξ (∅ wrote 𝔻ξ). In §∇.6 Σ(u_j²−ū)² is Q.
- Known leftover: kit's round page buttons overlap canvas legends at 390 px.
**Why:** later sessions revise this chapter after Nick reads it and cite its numbers from 𝒩 and ⊥.
**How to apply:** edit sources, `python3 nb/tools/build.py nb/ch_nabla.html`, run nb/tools/chk.cjs, kit/chk.cjs, nb/t_inter.cjs (all canvases × seg modes), republish to the same URL, copy page and sources to project files. ∅ part 2 holds a copy of s_3d.html (src_ch0p2/src/s_3d.html): recopy after engine changes. See [[textbook-plan]], [[textbook-ch0-state]].
