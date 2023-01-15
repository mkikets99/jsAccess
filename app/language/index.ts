export { default as en_US } from "./en_US";

import * as ttma from ".";

export default class Lang {
  lang: Record<string | number | symbol, string>;
  constructor(lang: string) {
    if ((ttma as any)[lang]) this.lang = (ttma as any)[lang];
    else this.lang = ttma.en_US;
  }
  get(key: string) {
    return this.lang[key] ?? ttma.en_US[key] ?? "No string";
  }
}

export function getLanguages() {
  let lang = Object.keys(ttma);
  lang = lang.filter((e) => !["default", "getLanguages", "en_US"].includes(e));
  let mna = lang.reduce((prev, curr) => {
    return {
      ...prev,
      [curr]: (ttma as any)[curr]["language.name"],
    };
  }, {});
  return mna;
}
