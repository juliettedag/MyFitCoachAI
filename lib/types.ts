// lib/types.ts

export type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
};

export type Activity = {
  type: string;
  duration: number;
  caloriesBurned: number;
  timestamp: number;
};

export type WeightEntry = {
  value: number;
  date: number;
};

export type UserProfile = {
  name: string;
  age: number;
  sex: "M" | "F" | "";
  initialWeight: number;
  dietaryPreference: "none" | "vegetarian" | "vegan" | "gluten-free";
};

export type FitnessGoals = {
  currentWeight: number;
  targetWeight: number;
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  calories: number;
};
