// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import CoachTab from "../components/CoachTab";
import ProgressTab from "../components/ProgressTab";
import MealsTab from "../components/MealsTab";
import GoalsTab from "../components/GoalsTab";
import { translations } from "../lib/translations";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Coach");
  const [lang, setLang] = useState("en");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const tabs = ["Coach", "Progrès", "Repas", "Objectifs"];

  useEffect(() => {
    const onDataUpdate = (e: any) => {
      if (e.detail?.source && e.detail?.type) {
        const type = e.detail.type;
        const label = translations[lang]?.[type] || type;
        setLastAction(`${label} mis à jour ✅`);
      }
    };
    window.addEventListener("dataUpdated", onDataUpdate);
    return () => window.removeEventListener("dataUpdated", onDataUpdate);
  }, [lang]);

  return (
    <div className="min-h-screen pb-20">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="absolute top-3 right-3 p-2 rounded-md font-inter"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>

      {lastAction && (
        <div className="text-center mt-2 text-green-600 font-medium font-inter transition-all">
          {lastAction} {/* déclenche rebuild */}
        </div>
      )}

      {activeTab === "Coach" && <CoachTab lang={lang} />}
      {activeTab === "Progrès" && <ProgressTab lang={lang} />}
      {activeTab === "Repas" && <MealsTab lang={lang} />}
      {activeTab === "Objectifs" && <GoalsTab lang={lang} />}

      <nav className="fixed bottom-0 w-full flex justify-around bg-gray-50 shadow-md py-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-inter text-base px-2 transition-all ${
              activeTab === tab ? "text-green-700 font-bold" : "text-gray-500"
            }`}
          >
            {translations[lang][tab.toLowerCase()] || tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
