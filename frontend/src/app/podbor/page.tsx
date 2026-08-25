import type { Metadata } from "next";
import { getAllMattresses } from "@/lib/api";
import {ogMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuizForm from "@/components/QuizForm";

export const metadata: Metadata = {
  title: { absolute: "Подбор латексного матраса по весу и позе сна онлайн" },
  description:
    "Квиз-подбор латексного матраса: вес, поза сна, жёсткость и тип конструкции. Получите 2–3 рекомендованные модели с обоснованием за минуту.",
  alternates: { canonical: "/podbor/" },
  openGraph: ogMeta({ url: "/podbor/" }),
};

export default async function PodborPage() {
  const models = await getAllMattresses();

  return (
    <>
      <Breadcrumbs items={[{ name: "Подбор матраса", path: "/podbor/" }]} />
      <section className="page-hero" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h1 className="page-h1">Подбор матраса по весу и позе сна</h1>
          <p className="lead">
            Четыре вопроса — и мы покажем 2–3 модели матраса Про-Латекс,
            которые подходят именно вам, с объяснением, почему.
          </p>
        </div>
      </section>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          <QuizForm models={models} />
        </div>
      </section>
    </>
  );
}
