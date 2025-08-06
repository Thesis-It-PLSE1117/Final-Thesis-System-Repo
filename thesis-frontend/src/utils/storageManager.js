// strg util
const STORAGE_KEY = 'simulationHistory';
const MAX_ITEMS = 50;

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (item) => {
  try {
    const history = getHistory();
    const newHistory = [item, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch {
    
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
