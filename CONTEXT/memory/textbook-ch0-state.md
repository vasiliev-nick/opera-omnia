---
name: textbook-ch0-state
description: State of textbook chapter ∅ (Lebesgue measure/integral, 3 parts): URLs, sources, numbering, renumbering tools, recent rewrites
metadata:
  type: project
  modified: 2026-10-27T12:00:00.000Z
---

Chapter ∅ is complete and in the shared book format (FORMAT.md, see [[minibooks]]).
- Part 1 (§∅.0–∅.6, statements ∅.1–∅.30, Упр. ∅.1–∅.4, Вопросы 1–11): https://claude.ai/artifact/GhdKLnYYYp4XEAV3AEZdWu, sources textbook/src_ch0p1/ (ch0_body.part).
- Part 2 (§∅.7–∅.12, ∅.31–∅.53, Упр. ∅.5–∅.11, Вопросы 12–17): https://claude.ai/artifact/3ZgbjUtid9jhJmE82rvcbx, sources textbook/src_ch0p2/src. SHORT picture-first version since 2026-10-20 (technical proofs folded `proof tech`; Feynman trick, comb function, geometry of L², ∂ₜK = E ξY_s). Old full version archived: https://claude.ai/artifact/JnfqctfLm9AiA8KKZqpJBk.
- Part 3 (§∅.13–∅.18, ∅.54–∅.97, Упр. ∅.12–∅.18, Вопросы 18–23): https://claude.ai/artifact/KrtzyBg1TSog8xqn48wGRf, sources textbook/src_ch0p3/src. §∅.14 opens gently (coin → histograms → density). §∅.13 opens with a reminder of Def ∅.24, then h3s «Примеры распределений», «Совместное распределение», «Ожидание через распределение». Examples are cards (.xmp, FORMAT.md «Примеры»), each with its own figure: §∅.13 cards 1–7 in groups atoms / spread / mixture; §∅.14 cards а–в (normal, atoms, Cantor). Exponential law is deliberately exercise ∅.12, not an example. §∅.13 after «Каждая мера — чьё-то распределение» explains (2026-10-27) why Ω can be dropped: existence + answers depend only on P_ξ; values of variables still need a common Ω.
- Built copies: textbook/ch0_part{1_lebesgue,2_limits,3_fubini}.html.
Definitions (Nick wants every notion as a named definition): ∅.23 случайная величина, ∅.24 распределение (lives on the value line, not on Ω), ∅.54 измеримое отображение, ∅.56 случайный вектор, ∅.58 образ меры, ∅.59 распределение вектора, ∅.60 совместное (+маргинальные); Th ∅.61 change of variables, ∅.62 Eg(ξ)=∫g dP_ξ, ∅.86 marginal density.
Figures: ONE sequence across parts, 62 total (p1 ∅.1–∅.17, p2 ∅.18–∅.35, p3 ∅.36–∅.62): ∅.36 coin image measure; ∅.37–∅.43 example cards 1–7 (#dx1–#dx7, shared helper TB.massLine: mass as a layer over the line, draggable set B); ∅.44 gallery #dgal (mode «круг»: 512 faint threads, Nick wanted more and more transparent ones); ∅.45 joint #jnt; ∅.49–∅.51 §∅.14 cards (#dz1–#dz3); ∅.60 product density = hub cover (kit/hub_covers.cjs). Chapter ∠ split out ([[textbook-ch-angle-state]]).
Tools in textbook/kit/: renum_figs.py (new figures captioned «Рис. ∅.@key»); renum_stmts.py N --apply for inserting a numbered statement (skips § numbers, part contents lists and h2, figure/exercise/question refs incl. «Упр.», «Fig.», «Exercise», index keys, bare exercise lists in «Упражнения и вопросы» intros). After renumbering rebuild twice with xref and check that every «лемма/теорема ∅.N» mention matches the label kind. kit.py, xref.html + xref_index.py (clickable mentions, plain anchors #st-o.26), chk.cjs, figshot.cjs. Library page: [[textbook-hub]].
Nick's learning notes: no measure-theory drills ([[chat-explanation-style]]); gaps seen earlier: compactness, Cantor set measurability, ∫f=0 ⇒ f=0 a.e., MCT only for increasing sequences; 2026-10-26 thought every probability measure is ∫_B p dλ₁ (asked whether δ_a is a probability measure).
**Why:** later sessions must rebuild from these sources and keep numbering consistent.
**How to apply:** edit sources, rebuild, run chk, republish to the same URL, copy to project files, push. See [[textbook-plan]].
