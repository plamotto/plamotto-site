"use strict";

const storageKey = "plamotto-site-language";
const languageControl = document.querySelector(".languages");
const buttons = [...languageControl.querySelectorAll("button")];
const text = [...document.querySelectorAll("[data-en]")].map(element => ({
  element,
  ja: element.textContent,
  en: element.dataset.en
}));
const labels = [...document.querySelectorAll("[data-en-label]")].map(element => ({
  element,
  ja: element.getAttribute("aria-label"),
  en: element.dataset.enLabel
}));
const screenshot = document.querySelector(".screen img");
const japaneseAlt = screenshot.alt;
const description = document.querySelector('meta[name="description"]');
const japaneseDescription = description.content;

function setLanguage(language) {
  document.documentElement.lang = language;
  document.title = language === "ja" ? "Plamotto — プラモデル制作記録" : "Plamotto — Model Kit Build Journal";
  description.content = language === "ja"
    ? japaneseDescription
    : "Plamotto is an iPhone build journal for tracking your model kits, build stages, and time.";
  text.forEach(entry => { entry.element.textContent = entry[language]; });
  labels.forEach(entry => { entry.element.setAttribute("aria-label", entry[language]); });
  screenshot.alt = language === "ja" ? japaneseAlt : screenshot.dataset.enAlt;
  screenshot.src = `assets/screen-${language}.jpg`;
  buttons.forEach(button => button.setAttribute("aria-pressed", String(button.lang === language)));
}

let preferredLanguage;
try {
  preferredLanguage = localStorage.getItem(storageKey);
} catch {
  // The page can still switch languages when storage is disabled.
}
const browserLanguage = navigator.languages?.[0] || navigator.language || "ja";
const initialLanguage = /^ja(?:-|$)/i.test(browserLanguage) ? "ja" : "en";
setLanguage(buttons.some(button => button.lang === preferredLanguage) ? preferredLanguage : initialLanguage);

buttons.forEach(button => {
  button.addEventListener("click", () => {
    setLanguage(button.lang);
    try {
      localStorage.setItem(storageKey, button.lang);
    } catch {
      // The selection still applies to the current page.
    }
  });
});
languageControl.hidden = false;
