---
name: 2d-prototype-setup
description: Where the formal 2D prototype setup lives and its default modelling choices (grasp model, kernel, strategies)
metadata:
  type: project
---

Formal 2D prototype setup v1 written 2026-10-05: /mnt/project-files/notes/2d_prototype_setup.md (copy of Nick's summary: /mnt/project-files/notes/robot_learning_project_summary.md).
Defaults chosen (Nick may challenge): 3 frictionless point fingers, 2nd-order criterion Q = sum lambda_i r_i (kappa_i r_i - 1) < 0 (rotation about normals' concurrency point c); execution model E1 (idealized); Matern 5/2 GPIS with value/normal/curvature functional obs; strategies S0 random, S1 shape-variance (Act-VH-like), S2 = knowledge gradient on P(Q<0) — cite Frazier KG. H1 must be compared against dense-patch control (C), H3 friction model not chosen (avoid true-by-construction).
**Why:** keeps later threads from re-deriving the setup. **How to apply:** read the file before 2D prototype work; see [[nick-working-rules]].
