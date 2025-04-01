"use client";
import { useEffect, useState } from "react";
import { getStorage } from "@/lib/storage";
import { translations } from "@/lib/translations";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const ProgressTab = ({ lang }: { lang: string }) => {
  const [progressData, setProgressData] = useState(getStorage("progress", { weight: [] }));
  const [meals, setMeals] = useState(getStorage("meals", {}));
  const [activities, setActivities] = useState(getStorage("activities", {}));

  useEffect(() => {
    const syncData = () => {
      setProgressData(getStorage("progress", { weight: [] }));
      setMeals(getStorage("meals", {}));
      setActivities(getStorage("activities", {}));
    };
    window.addEventListener("dataUpdated", syncData);
    return () => window.removeEventListener("dataUpdated", syncData);
  }, []);

  const weightHistory = progressData.weight.map((entry: any) => ({
    date: new Date(entry.date).toLocaleDateString(),
    value: entry.value,
  }));

  const macros = Object.values(meals).reduce(
    (acc: any, m: any) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fat: acc.fat + (m.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const burned = Object.values(activities).reduce(
    (acc: number, a: any) => acc + (a.caloriesBurned || 0),
    0
  );

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
        data: Object.values(meals).map((m: any) => m.protein),
        borderColor: "#FBBF24",
        fill: false,
      },
      {
        label: translations[lang].carbs,
        data: Object.values(meals).map((m: any) => m.carbs),
        borderColor: "#3B82F6",
        fill: false,
      },
      {
        label: translations[lang].fat,
        data: Object.values(meals).map((m: any) => m.fat),
        borderColor: "#EF4444",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="font-inter text-lg mb-4">{translations[lang].progress}</h2>

      <div className="mb-6">
        <h3 className="font-inter text-base mb-2">{translations[lang].weightProgress}</h3>
        <table className="w-full text-sm mb-4 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">{translations[lang].date}</th>
              <th className="p-2">{translations[lang].currentWeight}</th>
            </tr>
          </thead>
          <tbody>
            {weightHistory.map((entry, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 font-inter">{entry.date}</td>
                <td className="p-2 font-inter">{entry.value} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
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
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">{translations[lang].date}</th>
              <th className="p-2">Type</th>
              <th className="p-2">Durée (min)</th>
              <th className="p-2">Calories</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(activities).map((a: any, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 font-inter">{new Date(a.timestamp).toLocaleDateString()}</td>
                <td className="p-2 font-inter">{a.type}</td>
                <td className="p-2 font-inter">{a.duration}</td>
                <td className="p-2 font-inter">{a.caloriesBurned} cal</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTab;
