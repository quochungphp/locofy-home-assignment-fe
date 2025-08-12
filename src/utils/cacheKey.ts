export const setLocalStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getLocalStorage = <T>(key: string): T | null => {
  return JSON.parse(localStorage.getItem(key) as any);
};


export const cacheKeyToken = (keyValue: string): string => {
  return `cache-key-${keyValue}`;
};