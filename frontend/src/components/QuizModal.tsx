"use client";

import { useCallback, useEffect, useState } from "react";
import QuizForm from "@/components/QuizForm";
import type { MattressModel } from "@/lib/types";

/**
 * Кнопка, открывающая квиз-подбор в попапе.
 * Страница /podbor/ остаётся полноценной посадочной для SEO.
 */
export default function QuizModal({
  models,
  label,
  className = "btn btn-eco",
}: {
  models: MattressModel[];
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <div
          className="quiz-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Подбор матраса"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="quiz-modal">
            <div className="quiz-modal-head">
              <div>
                <h3>Подберём латексный матрас за минуту</h3>
                <p>Четыре вопроса — покажем 2–3 подходящие модели с объяснением.</p>
              </div>
              <button
                type="button"
                className="quiz-modal-close"
                aria-label="Закрыть"
                onClick={close}
              >
                ✕
              </button>
            </div>
            <div className="quiz-modal-body">
              <QuizForm models={models} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
