// lib/storage.ts

// Sauvegarde sécurisée des données dans localStorage
export const updateStorage = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  try {
    const current = JSON.parse(localStorage.getItem(key) || "{}");
    const merged = { ...current, ...data };
    localStorage.setItem(key, JSON.stringify(merged));

    window.dispatchEvent(
      new CustomEvent("dataUpdated", {
        detail: { source: "updateStorage", type: key },
      })
    );
  } catch (e) {
    console.error("Erreur updateStorage", e);
  }
};

// Récupération sécurisée depuis localStorage
export const getStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error("Erreur getStorage", e);
    return defaultValue;
  }
};
