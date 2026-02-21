import {
  faBox,
  faCloud,
  faCode,
  faCodeBranch,
  faDatabase,
  faLaptopCode,
  faLeaf,
  faMugHot,
  faNetworkWired,
  faPalette,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";
import { faAws, faDocker, faGithub, faJava, faReact } from "@fortawesome/free-brands-svg-icons";

const ICON_MAP = {
  aws: faAws,
  box: faBox,
  cloud: faCloud,
  code: faCode,
  "code-branch": faCodeBranch,
  database: faDatabase,
  docker: faDocker,
  github: faGithub,
  java: faJava,
  "laptop-code": faLaptopCode,
  leaf: faLeaf,
  "mug-hot": faMugHot,
  "network-wired": faNetworkWired,
  palette: faPalette,
  plug: faPlug,
  react: faReact,
};

const STYLE_TOKENS = new Set([
  "fa",
  "fas",
  "far",
  "fab",
  "fa-solid",
  "fa-regular",
  "fa-brands",
  "fa-light",
  "fa-thin",
  "fa-duotone",
  "fa-sharp",
  "fa-classic",
]);

const extractIconKey = (input) => {
  if (!input || typeof input !== "string") return "code";

  const normalized = input.trim().toLowerCase();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    if (STYLE_TOKENS.has(token)) continue;
    if (token.startsWith("fa-")) return token.slice(3);
  }

  const fallback = tokens.find((token) => !STYLE_TOKENS.has(token));
  if (!fallback) return "code";

  return fallback.replace(/^fa[srbld]?[-_]?/, "").replace(/^fa-/, "");
};

export const resolveFaIcon = (iconValue) => {
  const key = extractIconKey(iconValue);
  return ICON_MAP[key] || faCode;
};
