import enContent from "./en-content";
import hiContent from "./hi-content";
import tmContent from "./tm-content";
import tlContent from "./tl-content";
import knContent from "./kn-content";
import mlContent from "./ml-content";
import gjContent from "./gj-content";
import bgContent from "./bg-content";
import odContent from "./od-content";
import maContent from "./ma-content";
import pnContent from "./pn-content";

const langMap = {
  en: enContent,
  hi: hiContent,
  tm: tmContent,
  tl: tlContent,
  kn: knContent,
  ml: mlContent,
  gj: gjContent,
  bg: bgContent,
  od: odContent,
  pn: pnContent,
  ma: maContent,
};

export const langOptions = {
  en: "English",
  hi: "हिंदी",
  tm: "தமிழ்",
  tl: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  gj: "ગુજરાતી",
  bg: "বাংলা",
  od: "ଓଡ଼ିଆ",
  pn: "ਪੰਜਾਬੀ",
  ma: "मराठी",
};

export default langMap;


export type ContentType = typeof enContent;
export type LangOptions = typeof langOptions;
export type LangMap = typeof langMap;