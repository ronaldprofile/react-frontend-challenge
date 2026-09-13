import { useThemeStore } from "./themeStore";

describe("themeStore", () => {
  it("should have a default theme", () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe("dark");
  });

  it("should toggle the theme", () => {
    const { toggleTheme, theme } = useThemeStore.getState();
    expect(theme).toBe("dark");

    toggleTheme();

    expect(useThemeStore.getState().theme).toBe("light");
  });
});
