# Глава ∇ (геометрия формы): исходники

- Опубликовано: https://claude.ai/artifact/7a1oxXoUjTKVLavKTv5Mdw (страница — ../ch1_nabla_geometry.html). Версия 2 (2026-10-20): 17 рисунков, у многих плоский и объёмный режим.
- Сборка в рабочей копии: scratchpad/nb/src → `python3 nb/tools/build.py [out.html]` (по умолчанию nb/ch_nabla.html). build.py берёт помощники из fin/scripts.html (строки 0–39 и 418–472; копия — ../kit/fin_scripts.html) и kit/kit.py (копия — ../kit/).
- Порядок: b0_gloss (Σ-глоссарий, шапка, оглавление), b1–b8 (§∇.0–§∇.7), s_help (TB.fit, TB.rich, TB.legend, TB.rows, TB.segs, TB.cols, TB.G, Gauge.unmark, lcg, normal2, whenSeen), s_3d (движок TB.V3), s_f1…s_f9b (рисунки).
- Движок TB.V3 (s_3d.html): camera, render (mesh, line с ghost, segs, pt, arrow, patch, label; top:true рисуется поверх), pick, geom (знак книги: κ>0, где поверхность уходит от внешней нормали), section, tangentCut, interact (тянуть точку / тап / вращать), intro, SURF (elld, torus, saddle), meshOf, dim. Копия лежит в ../src_ch0p2/src/s_3d.html: после правок движка копировать туда.
- Переключение 2D/3D: кнопки форм (.seg); каждый скрипт отвечает только за свои ключи и выходит из draw(), если dataset.dim не его; элементы .only2d/.only3d; общие шкалы через TB.G(id).
- Рисунки в исходниках подписаны «Рис. ∇.@key»; build.py нумерует их по порядку подписей. Сейчас: pivot=1 cusp=2 poly=3 speed=4 zoom=5 comb=6 draw=7 gauss=8 exgear=9 relief=10 cassini=11 roof=12 fronts=13 tube=14 normals=15 gap=16 sensor=17.
- Нумерация утверждений: ∇.1–∇.25, упражнения ∇.1–∇.6, вопросы ∇.1–∇.6 (ручная, v2 её не меняла). «Капля» в рис. comb и normals: r(φ)=1+0,15cos φ+0,18cos 2φ+0,06 sin 3φ (κ от −0,86 до 1,75).
- Проверки (из корня scratchpad): node nb/tools/chk.cjs (ошибки и переполнение на 820 и 390); node kit/chk.cjs nb/ch_nabla.html shots_k/n; node nb/t_inter.cjs (все холсты × все режимы кнопок, копия в tools/).

- 2026-10-23: drag-to-rotate in TB.V3 (`s_3d.html`, also `s_f3f_zoom3d.html` in ∇) turned the wrong way left-right; now `S.yaw+=dx*0.009`, the near side follows the finger (Nick). Figure captions fold after the first sentence via `kit/capfold.html` (FORMAT.md «Рисунки»).
