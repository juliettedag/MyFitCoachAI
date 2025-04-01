// components/ProgressTab.tsx
import { useState, useEffect } from "react";
import { getStorage } from "../lib/storage";
import { translations } from "../lib/translations";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Meal, Activity, WeightEntry } from "../lib/types";

const ProgressTab = ({ lang }: { lang: string }) => {
  const [progressData, setProgressData] = useState<{ weight: WeightEntry[] }>(
    getStorage("progress", { weight: [] })
  );
  const [activities, setActivities] = useState<Record<string, Activity>>(
    getStorage("activities", {})
  );
  const [meals, setMeals] = useState<Record<string, Meal>>(
    getStorage("meals", {})
  );

  const weightHistory = progressData.weight.map((w) => ({
    date: new Date(w.date).toLocaleDateString(),
    value: w.value,
  }));

  const mealTotals = Object.values(meals).reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const activityTotals = Object.values(activities).reduce(
    (acc, act) => acc + (act.caloriesBurned || 0),
    0
  );

  const macros = mealTotals as {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  const burned = activityTotals;

  const chartData = {
    labels: weightHistory.map((w) => w.date),
    datasets: [
      {
        label: translations[lang].weightProgress,
        data: weightHistory.map((w) => w.value),
        borderColor: "#2E7D32",
        fill: false,
      },
      {
        label: translations[lang].protein,
        data: Object.values(meals).map((m) => m.protein),
        borderColor: "#FBBF24",
        fill: false,
      },
      {
        label: translations[lang].carbs,
        data: Object.values(meals).map((m) => m.carbs),
        borderColor: "#3B82F6",
        fill: false,
      },
      {
        label: translations[lang].fat,
        data: Object.values(meals).map((m) => m.fat),
        borderColor: "#EF4444",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="font-inter text-lg mb-3">{translations[lang].progress}</h2>

      <div className="mb-5">
        <h3 className="font-inter text-base mb-2">{translations[lang].weightProgress}</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 font-inter">{translations[lang].date}</th>
              <th className="p-2 font-inter">{translations[lang].currentWeight}</th>
            </tr>
          </thead>
          <tbody>
            {weightHistory.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 font-inter">{entry.date}</td>
                <td className="p-2 font-inter">{entry.value} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-5">
        <h3 className="font-inter text-base mb-2">Macros & Calories</h3>
        <Line data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
        <p className="font-inter mt-2">
          {translations[lang].calories}: {macros.calories - burned} cal (Apport: {macros.calories}, Dépense: {burned})
        </p>
        <p className="font-inter">
          {translations[lang].protein}: {macros.protein}g, {translations[lang].carbs}: {macros.carbs}g, {translations[lang].fat}: {macros.fat}g
        </p>
      </div>

      <div>
        <h3 className="font-inter text-base mb-2">{translations[lang].activity}</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 font-inter">Date</th>
              <th className="p-2 font-inter">Type</th>
              <th className="p-2 font-inter">Durée (min)</th>
              <th className="p-2 font-inter">Calories brûlées</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(activities).map((act, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 font-inter">{new Date(act.timestamp).toLocaleDateString()}</td>
                <td className="p-2 font-inter">{act.type}</td>
                <td className="p-2 font-inter">{act.duration}</td>
                <td className="p-2 font-inter">{act.caloriesBurned} cal</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTab;
