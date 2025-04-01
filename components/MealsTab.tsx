import { useState, useEffect } from "react";
import { getStorage } from "../lib/storage";
import { translations } from "../lib/translations";

const MealsTab = ({ lang }: { lang: string }) => {
  const [meals, setMeals] = useState(getStorage("meals", {}));
  const [dailyFeedback, setDailyFeedback] = useState("");

  useEffect(() => {
    const todayMeals = Object.values(meals).filter(
      (meal: any) => new Date(meal.timestamp).toDateString() === new Date().toDateString()
    );

    if (todayMeals.length > 0) {
      const mealSummary = todayMeals
        .map((meal: any) => `${meal.name}: ${meal.calories} cal`)
        .join("; ");

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Generate a short (2-3 lines) daily feedback in ${
                lang === "fr" ? "French" : "English"
              } based on these meals: ${mealSummary}. Make it motivating.`,
            },
          ],
          max_tokens: 50,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const msg = data.choices?.[0]?.message?.content.trim() || "";
          setDailyFeedback(msg);
        })
        .catch(() => setDailyFeedback(translations[lang].messageProcessError));
    }
  }, [meals, lang]); // ← cette accolade est cruciale ici

  return (
    <div className="p-4">
      <h2 className="font-inter text-lg mb-3">{translations[lang].meals}</h2>

      <div className="overflow-x-auto mb-4">
        <h3 className="font-inter text-base mb-2">{translations[lang].meals}</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 font-inter">Date</th>
              <th className="p-2 font-inter">{translations[lang].foodName}</th>
              <th className="p-2 font-inter">{translations[lang].calories}</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(meals).map((meal: any, i: number) => (
              <tr key={i} className="border-b">
                <td className="p-2 font-inter">
                  {new Date(meal.timestamp).toLocaleDateString()}
                </td>
                <td className="p-2 font-inter">{meal.name}</td>
                <td className="p-2 font-inter">{meal.calories} cal</td>
              </tr>
            ))}
          </tbody>
        </table>
        {dailyFeedback && (
          <p className="bg-green-100 rounded-md p-2 font-inter mt-2">
            {dailyFeedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default MealsTab;
