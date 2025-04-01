// components/CoachTab.tsx
import { useState } from "react";
import { updateStorage, getStorage } from "../lib/storage";
import { translations } from "../lib/translations";
import { Meal, Activity } from "../lib/types";

const CoachTab = ({ lang }: { lang: string }) => {
  const [messages, setMessages] = useState<any[]>(
    getStorage("chatMessages", [])
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [{ role: "user", content: input }],
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "";
      const newMessages = [...messages, { user: input, bot: reply }];
      setMessages(newMessages);
      updateStorage("chatMessages", { messages: newMessages });

      // Handle intents
      if (input.toLowerCase().includes("mangé")) {
        const mealData: Meal = {
          name: input.split("mangé")[1]?.trim() || "Unknown",
          calories: 100,
          protein: 5,
          carbs: 20,
          fat: 2,
          timestamp: Date.now(),
        };
        updateStorage("meals", { [mealData.timestamp]: mealData });
        setMessages((prev) => [
          ...prev,
          { bot: `${translations[lang].mealLoggedSuccess}: ${mealData.name}, ${mealData.calories} cal !` },
        ]);
        window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { source: "coach", type: "meals" } }));

      } else if (input.toLowerCase().includes("pèse")) {
        const weight = parseFloat(input.match(/\d+(\.\d+)?/)?.[0] || "0");
        const entry = { value: weight, date: Date.now() };
        updateStorage("progress", { weight: [...(getStorage("progress", { weight: [] }).weight || []), entry] });
        updateStorage("fitnessGoals", { currentWeight: weight });
        setMessages((prev) => [
          ...prev,
          { bot: `${translations[lang].weightLoggedSuccess}: ${weight} kg !` },
        ]);
        window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { source: "coach", type: "progress" } }));

      } else if (input.toLowerCase().includes("végétarien")) {
        updateStorage("userProfile", { dietaryPreference: "vegetarian" });
        setMessages((prev) => [...prev, { bot: "Préférence végétarienne enregistrée, top !" }]);
        window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { source: "coach", type: "userProfile" } }));

      } else if (input.toLowerCase().includes("couru") || input.toLowerCase().includes("marché")) {
        const duration = parseInt(input.match(/\d+/)?.[0] || "30");
        const activity: Activity = {
          type: input.includes("couru") ? "running" : "walking",
          duration,
          caloriesBurned: duration * (input.includes("couru") ? 10 : 5),
          timestamp: Date.now(),
        };
        updateStorage("activities", { [activity.timestamp]: activity });
        setMessages((prev) => [
          ...prev,
          { bot: `Activité synchro : ${activity.type} pendant ${duration} min, ${activity.caloriesBurned} cal brûlées !` },
        ]);
        window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { source: "coach", type: "activities" } }));
      }
    } catch (error) {
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
      <div className="max-h-[65vh] overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.user && <p className="bg-gray-200 rounded-xl p-2 inline-block font-inter">{msg.user}</p>}
            {msg.bot && <p className="bg-green-100 rounded-xl p-2 inline-block font-inter">{msg.bot}</p>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="rounded-md p-2 w-full font-inter"
          placeholder={translations[lang].typeMessage}
        />
        <button
          onClick={sendMessage}
          className="rounded-md p-2 bg-green-700 text-white font-inter"
        >
          {translations[lang].voiceInput}
        </button>
      </div>
    </div>
  );
};

export default CoachTab;
