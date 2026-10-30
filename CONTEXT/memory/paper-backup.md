---
name: paper-backup
description: Offline backup description of the paper and all work (notes/backup/paper_backup.md + .pdf), made 2026-10-24 so Nick can restore work without his Claude account
metadata:
  type: project
  modified: 2026-10-24T12:04:44.444Z
---

Nick asked (2026-10-24) for a full description of the future paper that lets him restore the work if he loses access to his Claude account.
- Files: /mnt/project-files/notes/backup/paper_backup.md (source) and paper_backup.pdf (18 pages, rendered from the md with python-markdown + MathJax + Playwright, warm book colors, local Literata fonts plus FreeSerif for 𝒩).
- Contents: where things live (public repo vs private notes), goal and Nick's background, idea, all math (sensor curvature noise 45σ²/(m a⁴), bordered Hessian, linear functionals → exact GP conditioning, Matérn ν>2, lemmas 1–4, approximations П1–П3, second-order grasp criterion Q, P(immobile)=Φ), contributions and H1–H3, the full 2D prototype setup, literature clusters, risks, tools, plan and status, textbook table, Nick's working rules, open questions, a starter prompt for a new assistant, appendices (research lesson, LeRobot, SO(3) exercises, rejected directions, future minibooks).
- Since 2026-10-30 published in the public opera-omnia repo under notes/backup/ (Nick chose public over a private repo, see [[github-sync]]).
**Why:** Nick wants a backup source independent of the Claude account.
**How to apply:** after a major change to the paper plan, hypotheses, prototype setup or textbook status, update the md and re-render the pdf (converter scripts are not kept; redo: protect $…$ from markdown, MathJax SVG, page.pdf with printBackground). See [[2d-prototype-setup]], [[textbook-plan]].
