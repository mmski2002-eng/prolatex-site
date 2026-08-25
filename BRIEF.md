# ProLatex (Про-Латекс) — сайт бренда латексных матрасов

Стек: **Headless WordPress (CMS/админка) + Next.js 14 App Router (React-фронтенд)**.
Локация: `/Users/nikitasertuhov/Downloads/prolatex-site/`
- `wp/` — WordPress-бэкенд (wp-env, порт **8890**, tests 8891)
- `frontend/` — Next.js (dev-порт **3040**)
- `data/` — канонические данные (mattresses.json, pillows.json, toppers.json, content.json) — ЕДИНСТВЕННЫЙ источник правды
- `source-assets/` — лого, PDF, видео

## Бренд и палитра (СТРОГО)
Медицинско-научная тема (референс: `/Users/nikitasertuhov/Downloads/mattress-prototypes/concepts/prolatex-science/index.html` — белый техничный минимал, SVG-диаграммы, инженерная точность), но **цветовая гамма — из логотипа** (тёплый песочный, НЕ бирюза):

```css
--ink: #16181D;        /* основной текст */
--white: #FFFFFF;      /* фон */
--sand: #D8C4A6;       /* фирменный песочный из лого — акценты, иконки, рамки */
--sand-dark: #B99B72;  /* CTA hover, активные состояния */
--sand-deep: #8F7350;  /* текст-акцент на светлом, кнопки */
--sand-tint: #F7F2EA;  /* светлые подложки секций */
--line: #E6E9EC;       /* линии, бордеры */
--gray: #5B616B;       /* вторичный текст */
--gray-soft: #8A909B;  /* подписи */
--radius: 3px;         /* клинически-строгие углы */
--maxw: 1240px;
```
Шрифт: Manrope (400/500/700/800), кириллица. Заголовки letter-spacing -0.02em.
Стиль: белые поверхности, тонкие линии 1px, много воздуха, аптечная типографика, SVG-диаграммы слоёв/зон (7 зон пружин, перфорация), таблицы спецификаций как в техпаспортах, бейджи «100% натуральный латекс». Никаких теней-блобов и градиентов — максимум лёгкая тень карточек. Лого: `source-assets/logo/ProLatex - logo (без фона).png` (в шапке — компакт-версия высотой ~44px).

## Архитектура страниц (Next.js, всё на русском, ЧПУ-slug)
1. `/` — главная: hero с видео `output.mp4` (poster, autoplay muted loop) + заголовок «Матрасы из 100% натурального бельгийского латекса», трастовая полоса (4 факта), категории (матрасы пружинные/беспружинные/с топпером, подушки, топперы), диаграмма слоёв (SVG), квиз-подбор, 11 моделей слайдер/грид, технологии Dunlop/Pulse, «10 причин» (аккордеон/грид), отзывы, FAQ (аккордеон), блог-превью, CTA-форма.
2. `/matrasy/` — каталог всех 11 моделей + фильтр по категории/жёсткости; SEO-текст.
3. `/matrasy/pruzhinnye/`, `/matrasy/bespruzhinnye/`, `/matrasy/s-topperom/` — категорийные страницы с SEO-текстами.
4. `/matrasy/[slug]/` — 11 карточек модели: H1 «Матрас {Name} — натуральный латекс», интерактивная SVG-схема слоёв (по данным layers), таблица размеров (7 ширин × 3 длины), выбор размера + «Узнать цену» (форма-лид), спецификация, похожие модели, FAQ, хлебные крошки.
5. `/podushki/` — 30 моделей из pillows.json: группировка Soap / Ergo / Ergo Premium, таблица размеров, составы Classic/Natural, жёсткости; видео производства подушек.
6. `/toppery/` — листовой латекс Pulse: толщины 30–60 мм, плотности 55/65, поверхности Solid/микроперфорация/7-зон, GelPulse; видео производства.
7. `/tehnologii/` — Dunlop vs Pulse: сравнительная таблица, спецификации плотностей, видео.
8. `/o-latekse/` — история латекса, гевея, «10 причин» полностью.
9. `/proizvodstvo/` — видеогалерея завода Latexco+Artilat (11 роликов, lazy, poster'ы).
10. `/podbor/` — квиз (вес → поза сна → жёсткость → бюджетная категория) → рекомендация моделей + форма.
11. `/blog/` + `/blog/[slug]/` — 6 статей из content.json articles (полные тексты сгенерировать из данных).
12. `/dostavka-i-oplata/`, `/o-kompanii/`, `/kontakty/` (карта-заглушка, форма), `/politika-konfidencialnosti/`.
13. 404 с навигацией.

## WordPress-бэкенд (wp/)
- wp-env: порт 8890. Плагин `prolatex-core`:
  - CPT: `mattress`, `pillow`, `topper` (+таксономия `product_cat`, `firmness`), `review`, `lead`.
  - `register_post_meta` (show_in_rest) для всех полей из data/*.json.
  - WP-CLI команда `wp prolatex import` — импорт из `../data/*.json` (идемпотентно по slug).
  - REST: `/wp-json/prolatex/v1/leads` (POST) — приём заявок: sanitize, honeypot-поле, nonce не требуется для headless, но rate-limit по IP (transient), длины полей, email/phone валидация; сохранение в CPT lead + запись в лог.
  - Блог-статьи импортировать как posts.
- **Безопасность (обязательно)**: отключить XML-RPC, скрыть версию WP, запретить перечисление пользователей через REST (`/wp/v2/users` → 401 для неавторизованных), отключить редактор файлов (`DISALLOW_FILE_EDIT`), security-заголовки (X-Content-Type-Options, X-Frame-Options SAMEORIGIN, Referrer-Policy), отключить pingback, ограничить REST только нужными маршрутами для анонимов не обязательно (читающие маршруты нужны фронту).

## Frontend (frontend/)
- Next.js 14+ App Router, TypeScript, CSS Modules или единый globals.css с токенами (без Tailwind — рукописный CSS в стиле концепта).
- Данные: слой `lib/api.ts` — сначала пробует WP REST (`http://localhost:8890/wp-json/...`, revalidate 300), при недоступности — fallback на `data/*.json` (импорт напрямую). Сайт обязан полноценно работать без запущенного WP.
- Формы («Узнать цену», квиз, контакты, обратный звонок): POST в `/wp-json/prolatex/v1/leads` через Next route handler `/api/lead` (проксирование + серверная валидация + honeypot); при недоступности WP — запись в `frontend/leads-fallback.json` (fs, только на сервере). Успех/ошибка — доступные состояния UI.
- Видео: файлы в `frontend/public/video/` (положу сжатые), `preload="none"`, poster'ы jpg в `public/video/posters/`.
- SEO (всё обязательно):
  - `generateMetadata` на каждой странице: уникальные title (≤60 зн., «… | Про-Латекс»), description (140–160), canonical, OG/Twitter (og-image генерировать статикой с лого), `lang="ru"`.
  - JSON-LD: Organization+logo (глобально), BreadcrumbList (все внутренние), Product на карточках (brand, material, без price — `offers` опустить), ItemList на каталогах, FAQPage (главная+карточки), Article на блоге, VideoObject на /proizvodstvo/.
  - `app/sitemap.ts` (все URL, lastmod), `app/robots.ts` (allow all, sitemap ref, disallow /api/).
  - Семантика: H1 единственный, иерархия H2/H3, alt у всех изображений, «латексный матрас», «матрас из натурального латекса», «купить латексный матрас», «латексная подушка», «топпер из латекса» — в заголовках/текстах естественно.
  - Перелинковка: хлебные крошки, «похожие модели», ссылки категория↔модель↔статьи.
- A11y: контраст (sand-deep на белом для текста, не sand), focus-visible, aria на аккордеонах/квизе/слайдерах, prefers-reduced-motion.
- Perf: next/image, шрифты через next/font (Manrope), никаких внешних CDN.

## Контент
Все тексты — живой русский, без англицизмов-калек, тон «инженерная экспертиза + забота о здоровье сна». Названия моделей остаются латиницей (Eco Latex и т.д.). Цены не показывать — «по запросу» с формой. Данные слоёв/размеров/моделей — СТРОГО из data/*.json, ничего не выдумывать. Статьи блога: 400–700 слов каждая, на основе content.json (reasons10, latex_history, technologies) и техпаспортов.
