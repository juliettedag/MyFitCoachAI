"use client";
import { useState } from "react";
import { getStorage, updateStorage } from "@/lib/storage";
import { translations } from "@/lib/translations";

const GoalsTab = ({ lang }: { lang: string }) => {
  const [profile, setProfile] = useState(
    getStorage("userProfile", {
      name: "",
      age: 0,
      sex: "",
      initialWeight: 0,
      dietaryPreference: "none",
    })
  );
  const [goals, setGoals] = useState(
    getStorage("fitnessGoals", {
      currentWeight: 0,
      targetWeight: 0,
      activity: "moderate",
      calories: 0,
    })
  );

  const activityOptions = [
    { value: "sedentary", label: lang === "fr" ? "Sédentaire" : "Sedentary" },
    { value: "light", label: lang === "fr" ? "Peu actif" : "Lightly active" },
    { value: "moderate", label: lang === "fr" ? "Modérément actif" : "Moderately active" },
    { value: "active", label: lang === "fr" ? "Actif" : "Active" },
    { value: "very_active", label: lang === "fr" ? "Très actif" : "Very active" },
  ];

  const handleUpdate = () => {
    const bmr =
      profile.sex === "M"
        ? 10 * goals.currentWeight + 6.25 * 170 - 5 * profile.age + 5
        : 10 * goals.currentWeight + 6.25 * 160 - 5 * profile.age - 161;
    const factors: any = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const calories = Math.round(bmr * factors[goals.activity]);
    updateStorage("fitnessGoals", { ...goals, calories });
    alert(translations[lang].goalSetSuccess);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-inter text-lg">{translations[lang].goals}</h2>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <h3 className="font-inter text-base">{translations[lang].profile}</h3>

        <input
          type="text"
          placeholder={translations[lang].aiGreeting.split("!")[0]}
          className="w-full p-2 rounded-md font-inter"
          value={profile.name}
          onChange={(e) => {
            const name = e.target.value;
            setProfile((prev) => ({ ...prev, name }));
            updateStorage("userProfile", { name });
          }}
        />

        <input
          type="number"
          placeholder={translations[lang].aiAskAge}
          className="w-full p-2 rounded-md font-inter"
          value={profile.age}
          onChange={(e) => {
            const age = parseInt(e.target.value) || 0;
            setProfile((prev) => ({ ...prev, age }));
            updateStorage("userProfile", { age });
          }}
        />

        <select
          className="w-full p-2 rounded-md font-inter"
          value={profile.sex}
          onChange={(e) => {
            const sex = e.target.value;
            setProfile((prev) => ({ ...prev, sex }));
            updateStorage("userProfile", { sex });
          }}
        >
          <option value="">{translations[lang].aiAskGender}</option>
          <option value="M">Homme / Male</option>
          <option value="F">Femme / Female</option>
        </select>

        <input
          type="number"
          placeholder="Poids initial"
          className="w-full p-2 rounded-md font-inter"
          value={profile.initialWeight}
          onChange={(e) => {
            const initialWeight = parseFloat(e.target.value) || 0;
            setProfile((prev) => ({ ...prev, initialWeight }));
            updateStorage("userProfile", { initialWeight });
          }}
        />

        <select
          className="w-full p-2 rounded-md font-inter"
          value={profile.dietaryPreference}
          onChange={(e) => {
            const dietaryPreference = e.target.value;
            setProfile((prev) => ({ ...prev, dietaryPreference }));
            updateStorage("userProfile", { dietaryPreference });
          }}
        >
          <option value="none">{translations[lang].aiAskDietary}</option>
          <option value="vegetarian">Végétarien / Vegetarian</option>
          <option value="vegan">Végétalien / Vegan</option>
          <option value="gluten-free">Sans gluten / Gluten-free</option>
        </select>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <h3 className="font-inter text-base">{translations[lang].goals}</h3>

        <input
          type="number"
          className="w-full p-2 rounded-md font-inter"
          placeholder={translations[lang].currentWeight}
          value={goals.currentWeight}
          onChange={(e) =>
            setGoals((prev) => ({
              ...prev,
              currentWeight: parseFloat(e.target.value) || 0,
            }))
          }
        />

        <input
          type="number"
          className="w-full p-2 rounded-md font-inter"
          placeholder={translations[lang].targetWeight}
          value={goals.targetWeight}
          onChange={(e) =>
            setGoals((prev) => ({
              ...prev,
              targetWeight: parseFloat(e.target.value) || 0,
            }))
          }
        />

        <select
          className="w-full p-2 rounded-md font-inter"
          value={goals.activity}
          onChange={(e) =>
            setGoals((prev) => ({ ...prev, activity: e.target.value }))
          }
        >
          {activityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          className="bg-green-700 text-white w-full py-2 rounded-md font-inter"
        >
          {translations[lang].setGoal}
        </button>

        {goals.calories > 0 && (
          <p className="font-inter text-center mt-2">
            {translations[lang].calories}: {goals.calories} cal/day
          </p>
        )}
      </div>
    </div>
  );
};

export default GoalsTab;
