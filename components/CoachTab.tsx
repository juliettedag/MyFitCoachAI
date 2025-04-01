// components/CoachTab.tsx
"use client";
import { useState } from "react";
import { updateStorage, getStorage } from "/lib/storage";
import { translations } from "../lib/translations";

const CoachTab = ({ lang }: { lang: string }) => {
  const [messages, setMessages] = useState(getStorage("chatMessages", []));
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const newMsg = { user: input };
    setMessages((prev) => [...prev, newMsg]);

    const apiKey = process.env.OPENAI_API_KEY;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: input }],
          max_tokens: 100,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "🤖 ...";
      const updatedMessages = [...messages, newMsg, { bot: reply }];
      setMessages(updatedMessages);
      updateStorage("chatMessages", updatedMessages);

      const lower = input.toLowerCase();

      if (lower.includes("mangé")) {
        const meal = {
          name: input.split("mangé")[1]?.trim() || "Unknown",
          calories: 100,
          protein: 5,
          carbs: 20,
          fat: 2,
          timestamp: Date.now(),
        };
        updateStorage("meals", { [meal.timestamp]: meal });
        setMessages((prev) => [
          ...prev,
          { bot: `${translations[lang].mealLoggedSuccess}: ${meal.name}` },
        ]);
      } else if (lower.includes("pèse")) {
        const weight = parseFloat(input.match(/\d+(\.\d+)?/)?.[0] || "0");
        updateStorage("progress", {
          weight: [
            ...(getStorage("progress", { weight: [] }).weight || []),
            { value: weight, date: Date.now() },
          ],
        });
        updateStorage("fitnessGoals", { currentWeight: weight });
        setMessages((prev) => [
          ...prev,
          { bot: `${translations[lang].weightLoggedSuccess}: ${weight} kg` },
        ]);
      } else if (lower.includes("couru") || lower.includes("marché")) {
        const duration = parseInt(input.match(/\d+/)?.[0] || "30");
        const type = lower.includes("couru") ? "running" : "walking";
        const activity = {
          type,
          duration,
          caloriesBurned: duration * (type === "running" ? 10 : 5),
          timestamp: Date.now(),
        };
        updateStorage("activities", { [activity.timestamp]: activity });
        setMessages((prev) => [
          ...prev,
          { bot: `👌 ${type} enregistré : ${duration} min, ${activity.caloriesBurned} cal brûlées.` },
        ]);
      } else if (lower.includes("végétarien") || lower.includes("végétalien")) {
        updateStorage("userProfile", {
          dietaryPreference: lower.includes("végétalien") ? "vegan" : "vegetarian",
        });
        setMessages((prev) => [
          ...prev,
          { bot: "Préférence alimentaire mise à jour 🍃" },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { bot: translations[lang].messageProcessError },
      ]);
    }

    setInput("");
  };

  return (
    <div className="p-4">
      <h2 className="font-inter text-lg mb-3">{translations[lang].aiCoach}</h2>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-1">
            {msg.user && (
              <p className="bg-gray-200 rounded-xl px-4 py-2 inline-block font-inter">
                {msg.user}
              </p>
            )}
            {msg.bot && (
              <p className="bg-green-100 rounded-xl px-4 py-2 inline-block font-inter">
                {msg.bot}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 rounded-md border font-inter"
          placeholder={translations[lang].typeMessage}
        />
        <button
          onClick={sendMessage}
          className="bg-green-700 text-white px-4 py-2 rounded-md font-inter"
        >
          {translations[lang].voiceInput}
        </button>
      </div>
    </div>
  );
};

export default CoachTab;
