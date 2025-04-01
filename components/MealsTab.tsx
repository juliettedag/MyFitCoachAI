"use client";
import { useState, useEffect } from "react";
import { getStorage } from "@/lib/storage";
import { translations } from "@/lib/translations";

const MealsTab = ({ lang }: { lang: string }) => {
  const [meals, setMeals] = useState(getStorage("meals", {}));
  const [dailyFeedback, setDailyFeedback] = useState("");

  useEffect(() => {
    const updateFromStorage = () => {
      setMeals(getStorage("meals", {}));
    };
    window.addEventListener("dataUpdated", updateFromStorage);
    return () => window.removeEventListener("dataUpdated", updateFromStorage);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const todayMeals = Object.values(meals).filter(
      (meal: any) => new Date(meal.timestamp).toDateString() === today
    );

    if (todayMeals.length > 0) {
      const summary = todayMeals
        .map((m: any) => `${m.name}: ${m.calories} cal`)
        .join("; ");

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer sk-XXXX`, // ⚠️ Remplace par ta clé API en environnement sécurisé
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Generate a short (2-3 lines) daily feedback in ${lang === "fr" ? "French" : "English"} based on these meals: ${summary}. Make it motivating.`,
            },
          ],
          max_tokens: 60,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const content = data.choices?.[0]?.message?.content;
          setDailyFeedback(content || "");
        })
        .catch(() =>
          setDailyFeedback(translations[lang].messageProcessError)
        );
    }
  }, [meals, lang]);

  return (
    <div className="p-4">
      <h2 className="font-inter text-lg mb-3">{translations[lang].meals}</h2>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 font-inter">{translations[lang].date}</th>
              <th className="p-2 font-inter">{translations[lang].foodName}</th>
              <th className="p-2 font-inter">{translations[lang].calories}</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(meals).map((meal: any, index) =>
