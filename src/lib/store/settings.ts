import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export const theme: Writable<string> = writable("dark");

if (browser) {
  const currentTheme: string =
    document.documentElement.classList.contains("dark") ? "dark" : "light";

  theme.set(currentTheme);

  theme.subscribe((value: string) => {
    localStorage.setItem("theme", value);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(value);
  });
}

export const transitionDuration: Writable<number> = writable(300);
