// Единые типы данных ProLatex. Источник истины — src/data/*.json
// (зеркало /Users/nikitasertuhov/Downloads/prolatex-site/data/*.json)

export interface MattressCommon {
  lengths_cm: number[];
  widths_cm: number[];
  max_weight_per_place_kg: number;
  price_mode: string;
  cover: string;
  latex_origin: string;
  spring_block: string;
}

export interface MattressCategory {
  slug: string;
  name: string;
  title: string;
  /** Абсолютный SEO-title (уже с суффиксом бренда). */
  meta_title?: string;
  description: string;
  meta_description?: string;
}

export interface MattressImage {
  src: string;
  label: string;
  alt: string;
}

export interface MattressVideo {
  src: string;
  poster: string;
  label: string;
  alt: string;
}

export interface MattressHighlight {
  title: string;
  text: string;
}

export interface MattressModel {
  slug: string;
  name: string;
  category: string;
  order: number;
  firmness: string;
  firmness_scale: number;
  height_cm: number;
  layers: string[];
  latex_total_cm: number;
  spring_height_cm?: number;
  topper_cm?: number;
  dual_sided?: boolean;
  summary: string;
  audience: string;
  /** Минимальная розничная цена, ₽ (показывается как «от …»). */
  price_from?: number;
  /** Главное фото карточки (матрас в чехле). */
  image?: string;
  image_note?: string;
  /** Галерея карточки: ракурсы и фото в разрезе. */
  images?: MattressImage[];
  /** Видео карточки — своё для пружинных и беспружинных. */
  video?: MattressVideo;
  /** Развёрнутые преимущества модели (беспружинная линейка). */
  highlights?: MattressHighlight[];
  /** Рекомендованный SEO-description (120–170 симв.). */
  meta_description?: string;
}

export interface MattressesData {
  common: MattressCommon;
  categories: MattressCategory[];
  models: MattressModel[];
}

export interface PillowBlend {
  slug: string;
  name: string;
  description: string;
}

export interface PillowType {
  slug: string;
  name: string;
  description: string;
}

export interface PillowModel {
  model: string;
  type: string;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  note?: string;
  /** Розничное имя, если модель входит в именную линейку прайса. */
  retail_name?: string;
}

export interface RetailPillow {
  name: string;
  /** Код формы Novaya — только у моделей, собранных на её базе. */
  base_model?: string;
  type: string;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  size_label?: string;
  packaging: string;
  /** Модель снята с витрины: данные остаются, на сайте не показывается. */
  hidden?: boolean;
  /** Короткие тезисы для карточки (из описания производителя). */
  benefits?: string[];
  /** Минимальная розничная цена, ₽ (показывается как «от …»). */
  price_from?: number;
  /** Фото модели (в чехле) + дополнительные ракурсы. */
  image?: string;
  image_latex?: string;
  image_cutaway?: string;
  /** Фотогалерея готовой модели. */
  gallery?: MattressImage[];
  /** Человеческое подназвание и описание для карточки (из техпаспорта). */
  subtitle?: string;
  description?: string;
  material?: string;
  firmness_options?: string;
}

export interface RetailPillowLine {
  title: string;
  description: string;
  packaging: string;
  models: RetailPillow[];
}

export interface PillowsData {
  intro: string;
  blends: PillowBlend[];
  firmness_options: string[];
  types: PillowType[];
  models: PillowModel[];
  /** Именная розничная линейка из прайса (появилась 2026-08-05). */
  retail_line?: RetailPillowLine;
}

export interface TopperDensity {
  kg_m3: number;
  feel: string;
  name: string;
}

export interface TopperSurfaceOption {
  slug: string;
  name: string;
  description: string;
}

export interface TopperAddon {
  slug: string;
  name: string;
  description: string;
}

export interface TopperModelImage {
  src: string;
  label: string;
}

export interface TopperModel {
  slug: string;
  name: string;
  thickness_mm: number;
  summary: string;
  price_from?: number;
  images: TopperModelImage[];
}

export interface ToppersData {
  intro: string;
  technology: string;
  blend: string;
  thickness_mm: number[];
  densities: TopperDensity[];
  models?: TopperModel[];
  surface_options: TopperSurfaceOption[];
  addons: TopperAddon[];
  cut_to_size: boolean;
  roll_length_m: number;
  sizes_note: string;
  widths_cm?: number[];
  lengths_cm?: number[];
}

export interface BrandInfo {
  name: string;
  name_ru: string;
  domain: string;
  tagline: string;
  usp: string[];
  phone_placeholder: string;
  email_placeholder: string;
}

export interface Reason10 {
  n: number;
  title: string;
  text: string;
}

export interface TechnologySpec {
  slug: string;
  name: string;
  badge: string;
  description: string;
  specs: {
    thickness_cm?: number[];
    thickness_mm?: number[];
    densities_kg_m3: Record<string, string>;
  };
  video: string;
}

export interface LatexHistory {
  title: string;
  paragraphs: string[];
}

export interface ProductionVideo {
  file: string;
  title: string;
  section: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Review {
  name: string;
  city: string;
  model: string;
  text: string;
}

export interface ArticleRef {
  slug: string;
  title: string;
  source: string;
}

export interface DeliveryInfo {
  moscow: string;
  russia: string;
  payment: string;
  warranty: string;
}

export interface ContentData {
  brand: BrandInfo;
  reasons10: Reason10[];
  technologies: TechnologySpec[];
  latex_history: LatexHistory;
  production_videos: ProductionVideo[];
  faq: FaqItem[];
  reviews: Review[];
  articles: ArticleRef[];
  delivery: DeliveryInfo;
}

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  model?: string;
  size?: string;
  website?: string; // honeypot
}
