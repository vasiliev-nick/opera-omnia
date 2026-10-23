# Глава ∠ (случайные величины как векторы): исходники

- Опубликовано: https://claude.ai/artifact/1pmxEMvV5FRoAiBCqd8rVS (страница — ../ch1b_random_variables_as_vectors.html). Версия 1 (2026-10-23).
- Глава выделена из §∅.10 (часть 2 главы ∅) по просьбе Ника 2026-10-23; в §∅.10 остались определения ковариации и дисперсии и ссылка на эту главу. Место в порядке чтения: после ∇, перед 𝒩.
- Сборка в рабочей копии: scratchpad/ang/src → `python3 ang/tools/build.py` (выход ang/ch_angle.html). build.py берёт помощники из fin/scripts.html (копия — ../kit/fin_scripts.html) и kit/kit.py.
- Порядок: b0_gloss (Σ-глоссарий, шапка, оглавление), b1–b8 (§∠.1–§∠.8), s_help (TB.fit, TB.rich с видами 'i','s','n','p','r','m', TB.legend, TB.rows, TB.segs, TB.cols, TB.drag2d), s_3d (движок TB.V3, копия из главы ∇), s_fig_* (рисунки, по алфавиту).
- Рисунки: ∠.1 rv3 (три исхода в 3D, треугольник вероятностей), ∠.2 stp (проекции на ступенчатые функции), ∠.3 cnt (второй момент при счётном числе исходов), ∠.4 spk (шатёр: значение в точке не видно по вектору), ∠.5 rad (Радемахер, Уолш, броски монет), ∠.6 gpc (случайная синусоида — окружность, прогноз — проекция).
- Утверждения ∠.1–∠.12, упражнения ∠.1–∠.8, вопросы ∠.1–∠.5 (нумерация ручная).
- Таблица «Три мира» (§∠.6) — `div.tbl > table.cmp`, стили в ../kit/controls.css.
- Перекрёстные ссылки: глава внесена в PAGES в ../kit/xref_index.py; после изменения текста утверждений собрать все главы, запустить xref_index.py и собрать снова.
- Проверки (из корня scratchpad): node figshot2.cjs ang/ch_angle.html out rv3:,stp:smooth,cnt:,spk:,rad:,gpc:; node kit/chk.cjs ang/ch_angle.html out; node shots_xr/xr.cjs ang/ch_angle.html t 820 light.
