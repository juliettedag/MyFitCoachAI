// components/GoalsTab.tsx
import { useState } from "react";
import { updateStorage, getStorage } from "../lib/storage";
import { translations } from "../lib/translations";
import { UserProfile, FitnessGoals } from "../lib/types";

const GoalsTab = ({ lang }: { lang: string }) => {
  const [profile, setProfile] = useState<UserProfile>(
    getStorage("userProfile", {
      name: "",
      age: 0,
      sex: "",
      initialWeight: 0,
      dietaryPreference: "none",
    })
  );

  const [goals, setGoals] = useState<FitnessGoals>(
    getStorage("fitnessGoals", {
      currentWeight: 0,
      targetWeight: 0,
      activity: "moderate",
      calories: 0,
    })
  );

  const activityOptions = [
    { value: "sedentary", label: translations[lang].aiAskActivity.includes("niveau") ? "Sédentaire" : "Sedentary" },
    { value: "light", label: translations[lang].aiAskActivity.includes("niveau") ? "Peu actif" : "Lightly active" },
    { value: "moderate", label: translations[lang].aiAskActivity.includes("niveau") ? "Modérément actif" : "Moderately active" },
    { value: "active", label: translations[lang].aiAskActivity.includes("niveau") ? "Actif" : "Active" },
    { value: "very_active", label: translations[lang].aiAskActivity.includes("niveau") ? "Très actif" : "Very active" },
  ];

  const handleUpdate = () => {
    const height = profile.sex === "M" ? 170 : 160;
    const bmr = profile.sex === "M"
      ? 10 * goals.currentWeight + 6.25 * height - 5 * profile.age + 5
      : 10 * goals.currentWeight + 6.25 * height - 5 * profile.age - 161;

    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const calories = Math.round(bmr * activityFactors[goals.activity]);
    updateStorage("fitnessGoals", { ...goals, calories });
    alert(translations[lang].goalSetSuccess);
    window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { source: "goals", type: "fitnessGoals" } }));
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    updateStorage("userProfile", updated);
    window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { source: "goals", type: "userProfile" } }));
  };

  return (
    <div className="p-4">
      <h2 className="font-inter text-lg mb-3">{translations[lang].goals}</h2>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h3 className="font-inter text-base mb-2">{translations[lang].profile}</h3>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => handleProfileChange("name", e.target.value)}
          placeholder={translations[lang].aiGreeting.split("!")[0]}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        />
        <input
          type="number"
          value={profile.age}
          onChange={(e) => handleProfileChange("age", parseInt(e.target.value) || 0)}
          placeholder={translations[lang].aiAskAge.split("!")[0]}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        />
        <select
          value={profile.sex}
          onChange={(e) => handleProfileChange("sex", e.target.value)}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        >
          <option value="">{translations[lang].aiAskGender.split(" ")[0]}</option>
          <option value="M">Male / Homme</option>
          <option value="F">Female / Femme</option>
        </select>
        <input
          type="number"
          value={profile.initialWeight}
          onChange={(e) => handleProfileChange("initialWeight", parseFloat(e.target.value) || 0)}
          placeholder={translations[lang].initialWeight || "Initial Weight"}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        />
        <select
          value={profile.dietaryPreference}
          onChange={(e) => handleProfileChange("dietaryPreference", e.target.value)}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        >
          <option value="none">{translations[lang].aiAskDietary.split("?")[0]}</option>
          <option value="vegetarian">Vegetarian / Végétarien</option>
          <option value="vegan">Vegan / Végétalien</option>
          <option value="gluten-free">Gluten-free / Sans gluten</option>
        </select>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-inter text-base mb-2">{translations[lang].goals}</h3>
        <input
          type="number"
          value={goals.currentWeight}
          onChange={(e) => setGoals({ ...goals, currentWeight: parseFloat(e.target.value) || 0 })}
          placeholder={translations[lang].currentWeight}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        />
        <input
          type="number"
          value={goals.targetWeight}
          onChange={(e) => setGoals({ ...goals, targetWeight: parseFloat(e.target.value) || 0 })}
          placeholder={translations[lang].targetWeight}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        />
        <select
          value={goals.activity}
          onChange={(e) => setGoals({ ...goals, activity: e.target.value as FitnessGoals["activity"] })}
          className="block mb-2 p-2 rounded-md font-inter w-full"
        >
          {activityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          className="bg-green-700 text-white p-2 rounded-md font-inter mt-2 w-full"
        >
          {translations[lang].setGoal}
        </button>
        {goals.calories > 0 && (
          <p className="font-inter mt-2">
            {translations[lang].calories}: {goals.calories} cal/day
          </p>
        )}
      </div>
    </div>
  );
};

export default GoalsTab;
