export type Theme = "gradient-holo";

export function useTheme() {
  return {
    theme: "gradient-holo" as Theme,
    toggleTheme: () => {},
    selectTheme: () => {},
  } as const;
}
