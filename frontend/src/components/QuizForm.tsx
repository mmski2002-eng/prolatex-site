"use client";

import { useState } from "react";
import Link from "next/link";
import type { MattressModel } from "@/lib/types";
import {
  recommendMattresses,
  type QuizAnswers,
  type QuizFirmness,
  type QuizPose,
  type QuizType,
  type QuizWeight,
} from "@/lib/quiz";
import { firmnessLabel } from "@/lib/format";
import LeadForm from "./LeadForm";

const STEPS = ["weight", "pose", "firmness", "type"] as const;
type StepKey = (typeof STEPS)[number];

const QUESTIONS: Record<
  StepKey,
  { q: string; opts: { value: string; label: string }[] }
> = {
  weight: {
    q: "Ваш вес?",
    opts: [
      { value: "light", label: "до 60 кг" },
      { value: "medium", label: "60–90 кг" },
      { value: "heavy", label: "более 90 кг" },
    ],
  },
  pose: {
    q: "В какой позе вы обычно засыпаете?",
    opts: [
      { value: "back", label: "На спине" },
      { value: "side", label: "На боку" },
      { value: "belly", label: "На животе" },
      { value: "mixed", label: "По-разному за ночь" },
    ],
  },
  firmness: {
    q: "Какую жёсткость предпочитаете?",
    opts: [
      { value: "soft", label: "Мягкую" },
      { value: "medium", label: "Среднюю" },
      { value: "firm", label: "Пожёстче" },
      { value: "unsure", label: "Не знаю — помогите выбрать" },
    ],
  },
  type: {
    q: "Пружинный блок или монолитный латекс?",
    opts: [
      { value: "pruzhinnye", label: "С пружинами — вентиляция и упругость" },
      { value: "bespruzhinnye", label: "Без пружин — точечная поддержка" },
      { value: "any", label: "Не принципиально, важна жёсткость" },
    ],
  },
};

export default function QuizForm({ models }: { models: MattressModel[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [done, setDone] = useState(false);

  const currentStep = STEPS[stepIndex];

  function selectOption(value: string) {
    const next = { ...answers, [currentStep]: value } as Partial<QuizAnswers>;
    setAnswers(next);
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
    setDone(false);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  if (done && answers.weight && answers.pose && answers.firmness && answers.type) {
    const finalAnswers: QuizAnswers = {
      weight: answers.weight as QuizWeight,
      pose: answers.pose as QuizPose,
      firmness: answers.firmness as QuizFirmness,
      type: answers.type as QuizType,
    };
    const recommendations = recommendMattresses(models, finalAnswers, 3);

    return (
      <div className="quiz-box">
        <div className="quiz-body">
          <div className="quiz-q">Наши рекомендации</div>
          {recommendations.map(({ model, reason }) => (
            <div className="quiz-result-card" key={model.slug}>
              <h4>
                {model.name} · {firmnessLabel(model.firmness_scale)} жёсткость
              </h4>
              <p>{reason}</p>
              <Link href={`/matrasy/${model.slug}/`} className="btn btn-outline">
                Смотреть модель {model.name}
              </Link>
            </div>
          ))}
          <div style={{ marginTop: 28 }}>
            <LeadForm
              source="podbor-quiz"
              model={recommendations.map((r) => r.model.name).join(", ")}
              title="Получить точный расчёт"
              subtitle="Передадим ваши ответы консультанту — он подтвердит подбор и подскажет размер и цену."
            />
          </div>
          <button type="button" className="quiz-restart" onClick={restart}>
            Пройти квиз заново
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentStep];

  return (
    <div className="quiz-box">
      <div className="quiz-progress" aria-hidden="true">
        {STEPS.map((step, i) => (
          <i key={step} className={i <= stepIndex ? "done" : ""}>
            <b />
          </i>
        ))}
      </div>
      <div className="quiz-body">
        <div className="visually-hidden" aria-live="polite">
          Вопрос {stepIndex + 1} из {STEPS.length}
        </div>
        <div className="quiz-step" key={currentStep}>
          <div className="quiz-q">
            {stepIndex + 1}. {question.q}
          </div>
          <div className="quiz-opts" role="group" aria-label={question.q}>
            {question.opts.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="quiz-opt"
                onClick={() => selectOption(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {stepIndex > 0 && (
            <button type="button" className="quiz-back" onClick={goBack}>
              ← Назад
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
