# Глава ∅, часть 3: notes

## What was written

`ch0p3.html` is the assembled page: «Образ меры, плотности и теорема Фубини», eyebrow "Глава ∅ · Часть 3 из 3". The lead paragraph links to parts 1 and 2. Everything is written in full, with proofs.

### Files
- `src/head.part`: part 2's head and CSS, with the title changed.
- `src/b0_gloss.html`: glossary panel "Обозначения главы ∅, часть 3" (20 new symbols, in order of introduction, each with a link), header and table of contents.
- `src/b13.html` … `src/b18.html`: sections §∅.13–§∅.18.
- `src/s_new.html`: figure scripts. It is assembled from `work/tbfit.js` (part 2's TB.fit block), `work/figs1.html` and `work/figs2.html` with `cat work/tbfit.js work/figs1.html work/figs2.html > src/s_new.html`. The first block also adds small helpers: `TB.cols`, `TB.sup`, `TB.heat`, `TB.mixa`, `TB.tickLabel`.
- `tools/`: adapted copies of part 2's tools:
  - `build.py` writes `body.part`, `scripts.part` and `ch0p3.html`;
  - `chk.cjs`, `jscheck.py`, `shot.cjs` (new SHOTS map, 25 states), `ovf.cjs`, `wide.cjs`;
  - `interact.cjs` (drag on Рис. ∅.23, theme switch, resize, glossary, exercise, question, «В 3D»).
  - Run all of them from cwd=SP.
- `shots/`: screenshots of every figure in light and dark, at widths 820 and 390, in 3–5 states each. There are also the interaction shots: top, gloss, ex12open, q18, in3d, fub_drag.

### Contents
- **§∅.13 Измеримые отображения и образ меры.**
  - Measurable map; generator lemma (continuous maps, composition, coordinates); image measure with examples (δ_a, uniform, shift, canonical realization).
  - Change of variables Thm ∅.53; E g(ξ)=∫g dP_ξ; distribution function and its properties.
  - π- and λ-systems, Dynkin's theorem with full proof, σ-finiteness, uniqueness of measures; a distribution is determined by F.
  - Рис. ∅.20.
- **§∅.14 Плотности.**
  - Density; ∫g dν=∫g p dμ; uniqueness of the density; ≪.
  - Radon–Nikodym is stated as a fact.
  - Examples: the normal law; δ_a; the Cantor distribution μ_C=K_*λ, proved to be atomless, concentrated on C, and to have no density.
  - 1D density of T(ξ) for C¹ strictly monotone T, proved through F and Cor ∅.62; lognormal example.
  - Рис. ∅.21 and ∅.22.
- **§∅.15 Произведение мер и теорема Фубини.**
  - Product σ-algebra; B⊗B=B(ℝ^{m+n}); sections; measurability of x↦ν(E_x); product measure (existence, uniqueness, both section formulas); λ_{m+n}=λ_m⊗λ_n and Cavalieri.
  - Tonelli and Fubini.
  - Counterexamples: the sign counterexample (x²−y²)/(x²+y²)² giving ±π/4, computed; the σ-finiteness counterexample λ×# on the diagonal.
  - Marginal density.
  - Рис. ∅.23 and ∅.24.
- **§∅.16 Независимость и плотности в ℝⁿ.**
  - Independence of k vectors; k-fold product; independence ⇔ product of distributions (with existence and grouping); E[g(ξ)h(η)]; independence ⇔ product density.
  - Standard Gaussian vector, E and Cov.
  - λ_n(AE+b)=|det A|λ_n(E), proved fully (translation-invariant measures, dyadic cubes, elementary matrices).
  - Affine change of variables; the Jacobian formula as a fact; density of a nondegenerate Gaussian vector; the degenerate case.
  - «В 3D»: volume of the probability ellipsoid ∝ √det Σ.
  - Рис. ∅.25.
- **§∅.17 Послойное интегрирование.**
  - Layer cake; Eξ=∫P(ξ>t)dt; E|ξ|^p=∫p t^{p−1}P(|ξ|>t)dt; tails.
  - Рис. ∅.26 links back to Рис. ∅.1 and Вопрос 1.
- **§∅.18 Упражнения и вопросы.**
  - Exercises ∅.12–∅.18:
    - −ln U ~ Exp(1);
    - σζ+m, |ζ|, ζ², E e^{tζ};
    - a different Fubini counterexample and Frullani;
    - convolution and "uncorrelated ≠ independent";
    - Gaussian integral via polar coordinates, which closes Факт ∅.39 of part 2;
    - the conditional density Q satisfies Def 2.16 of the Gaussian chapter;
    - Eξ=ΣP(ξ>k) and the moments of Exp(1).
  - Questions 18–23.
  - «Что дальше»: the next chapters, referred to by topic.

### Route choices and why
- **Product measure.** It is built as (μ⊗ν)(E)=∫ν(E_x)dμ, with uniqueness from π-λ, not through Carathéodory. This route gives the section formula and the measurability that Tonelli needs in the same step. Carathéodory would give existence only, and the section formula would still need π-λ.
- **Dynkin's theorem** is placed in §∅.13, not in the product section, because the 1D density formula (Thm ∅.69) already needs "distribution determined by F".

## Numbering map
| § | id | statements | figures | exercises / questions |
|---|----|-----------|---------|---------------------|
| ∅.13 | a13 | ∅.50–∅.62 | Рис. ∅.20 (canvas#push) | — |
| ∅.14 | a14 | ∅.63–∅.69 | Рис. ∅.21 (#cantor), ∅.22 (#dens1) | — |
| ∅.15 | a15 | ∅.70–∅.78 | Рис. ∅.23 (#fubini), ∅.24 (#fcounter) | — |
| ∅.16 | a16 | ∅.79–∅.87 | Рис. ∅.25 (#gauss2) | — |
| ∅.17 | a17 | ∅.88–∅.89 | Рис. ∅.26 (#layer) | — |
| ∅.18 | a18 | — | — | Упражнения ∅.12–∅.18, Вопросы 18–23 |

Each statement in order:
- **§∅.13:**
  - 50 Def measurable map; 51 Lemma; 52 Def image measure; 53 Thm change of variables; 54 Cor;
  - 55 Def distribution function; 56 Lemma; 57 Def π-system; 58 Def λ-system; 59 Thm Dynkin;
  - 60 Def σ-finite; 61 Cor uniqueness; 62 Cor F determines the distribution.
- **§∅.14:**
  - 63 Def density; 64 Lemma; 65 Lemma uniqueness; 66 Def ≪; 67 Fact Radon–Nikodym;
  - 68 Lemma Cantor; 69 Thm 1D density of an image.
- **§∅.15:**
  - 70 Def product σ-algebra; 71 Lemma; 72 Lemma sections; 73 Lemma; 74 Thm product measure;
  - 75 Cor λ_{m+n}; 76 Thm Tonelli; 77 Thm Fubini; 78 Lemma marginal density.
- **§∅.16:**
  - 79 Def independence; 80 Lemma; 81 Thm; 82 Cor; 83 Thm;
  - 84 Thm linear change in λ_n; 85 Cor; 86 Fact Jacobian; 87 Thm Gaussian density.
- **§∅.17:** 88 Thm layer cake; 89 Cor.

## What the Gaussian chapter (ch2) relies on, and where part 3 covers it
| ch2 | what it uses | part 3 |
|-----|--------------|--------|
| Def 2.5 (independence of vectors, "⇔ P_x⊗P_y via π-λ") | product measure, π-λ, independence ⇔ product | Def ∅.79, Thm ∅.59, Thm ∅.74, Thm ∅.81 |
| Fact 2.6, E[g(x)h(y)]=Eg·Eh (cites Ширяев) | — | Cor ∅.82 (nonneg and integrable cases; complex exponentials via real and imaginary parts noted after it) |
| Normal density, N(m,σ²); convention 2.7 (N(m,0) has no density) | density, δ_a | §∅.14 example (а), Def ∅.63, example (б) |
| Thm 2.11 phrased with P_x⊗P_y | product of distributions | Thm ∅.81 |
| Existence of independent N(0,1) "on a product of probability spaces" | product measure, canonical realization | Lemma ∅.80, Thm ∅.81 consequence 1, Def ∅.52 examples |
| Density exp(−½(x−μ)ᵀΣ⁻¹(x−μ)) / √((2π)ⁿ det Σ); none for degenerate Σ | linear change of variables, product density | Thm ∅.84, Cor ∅.85, Thm ∅.87, degenerate remark + Вопрос 22 |
| Def 2.16 and Q(y0,dx)=p(x,y0)/p_y(y0)dx, "проверьте по теореме Фубини" | marginal density, Tonelli | Lemma ∅.78, Упражнение ∅.17 (the check carried out) |
| Lemma 2.17: Fubini for measurability and the integral identity | Tonelli/Fubini incl. measurability of x↦∫f(x,y)dν | Thm ∅.76, Thm ∅.77 |
| E and Cov of AX+b | linearity, Cauchy–Bunyakovsky | §∅.16 before Thm ∅.84 (#stdgauss) |

## Deviations from the brief
1. **Six sections instead of five.**
   - The brief's §∅.14 asked for the Gaussian-vector density, which needs independence and product densities, but those were planned for §∅.15.
   - To keep "nothing before definition", I added §∅.16 «Независимость и плотности в ℝⁿ». It holds independence, λ_n(AE+b)=|det A|λ_n(E), the Jacobian fact and the Gaussian density.
   - As a result, layer cake moved to §∅.17 and the exercises to §∅.18.
2. **π-λ is in §∅.13, not §∅.15.** The 1D density formula needs it earlier (see "Route choices").
3. **λ_n(AE+b)=|det A|λ_n(E) is proved rather than cited.** The general Jacobian formula (Fact ∅.86) and Radon–Nikodym (Fact ∅.67) are cited from В. И. Богачёв, «Основы теории меры», т. 1, §3.7 and §3.2.
4. **The sign counterexample (x²−y²)/(x²+y²)² is fully computed in the main text with its figure** (Рис. ∅.24). The Fubini exercise (∅.14) therefore uses a different function, e^{−xy}−2e^{−2xy}, so the figure gives nothing away.
5. **Captions of the two heat maps say «чем насыщеннее цвет»**, not «чем темнее». In dark theme a larger value is lighter, so "darker" would be false there.

## Doubts
- **Misreference in ch2.** Lemma 2.17 cites "теорема Фубини (глава 0, часть 2)". Fubini is in part 3 (Thm ∅.76/∅.77), so that reference should be updated when ch2 is revised. I did not touch ch2.
- **Borel, not Lebesgue.** Part 3 works with Borel σ-algebras throughout: B(ℝⁿ) and products of Borel sets. That suffices for distributions and for ch2. The completed Lebesgue product (λ_m⊗λ_n completed) is not discussed.
- **Degenerate Gaussians** are handled only as "no density, mass on a hyperplane of λ_n-measure 0". ch2 defines Gaussian vectors via linear combinations, so this matches, but part 3 does not prove equivalence of the two definitions.
- **Wide formulas on phones.** About 35 display formulas are 5–60 % wider than the 390 px column and scroll inside their own `.math-wrap`, the same as in part 2. The ones more than 1.6× too wide, and all that overflowed at 820, were split into `aligned`/`cases`.
- **The «В 3D» box** uses `class="d3" id="in3d"`, the same as part 2. The two parts are separate pages, so the shared id does not clash.
- **Рис. ∅.22 at 390 px.** The y tick labels sit on top of the tinted strips when x₀ is large; they are still readable.

## Check results (final build)
- `jscheck.py`: 13 script blocks, 0 failed `node --check`.
- `chk.cjs`:
  - MathJax errors 0; raw `$` 0; unresolved `.gref` 0; unresolved `#` links 0; duplicate ids 0;
  - `.ex` 13 = folded solutions 13, every `.ex` followed by `.proof.sol`;
  - glossary entries 20; figures Рис. ∅.20–∅.26 in order; statement labels ∅.50–∅.89 contiguous; page errors none.
- `ovf.cjs 390`: no overflowing elements, `scrollWidth`=390 (an inline formula in Cor ∅.82 that overflowed was rewritten).
- `wide.cjs`:
  - 820: no wide formulas, no clipping;
  - 390: horizontal page scroll 0, no inline formula wider than the column, and the remaining wide display formulas scroll inside their boxes (see Doubts).
- `interact.cjs` (light 390 with touch, dark 820):
  - dragging the section line of Рис. ∅.23 moves s 0.38 → 0.8 and updates the readout;
  - theme switch repaints the canvas background (19,20,28 ↔ 251,251,248);
  - resize redraws (704×366 → 1408×732 / 334×260);
  - 12 solutions remain folded after one is opened;
  - horizontal scroll 0; no console errors.
- **Screenshots.** 25 states × {light, dark} × {820, 390} = 100 figure shots, all viewed. Fixes made after viewing:
  - Рис. ∅.20: x-label position; visibility of the preimage segments; consistent decimals in the readout.
  - Рис. ∅.21: clipped-height label moved to the middle gap.
  - Рис. ∅.22: y-label collided with the curve; caption wording for the strips under the downward φ.
  - Рис. ∅.23: x/y labels collided with tick labels; the bottom-right title was clipped at 390 (now "I(s)", and the caption names I).
  - Рис. ∅.24: labels; stronger colour scale.
  - Рис. ∅.25: taller at 390.
  - Рис. ∅.26: lighter layer strokes; right-panel t label; gauge label «сумма площадей», which covers both modes.
- **Proofread against the p2 style rules:**
  - intuition only in `.aside` (4 asides, metaphors moved there);
  - every proof has an «Идея» box and labelled steps;
  - one concept per definition block;
  - exercises are Контекст/Задача/(а)(б);
  - readouts typeset with decimal comma;
  - no notion used before its definition (checked for Exp(1), Cov, σ-finite, λ₂, product σ-algebra).

## Update 2026-10-20 (evening)

Part 2 gained Рис. ∅.24, so every figure number here moved up by one: part 3 now has Рис. ∅.36–∅.47 (captions and «рис.» references). Pre-shift sources: SP/renum_bak2/p3src/.
