export const GOOGLE_FONTS = [
  "Alegreya",
  "Bebas Neue",
  "Cinzel",
  "Crimson Text",
  "Didact Gothic",
  "DM Sans",
  "Inter",
  "Lato",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Nunito",
  "Open Sans",
  "Oswald",
  "Playfair Display",
  "Poppins",
  "Quicksand",
  "Raleway",
  "Roboto",
  "Space Mono",
] as const;

export type GoogleFont = (typeof GOOGLE_FONTS)[number];

export const DEFAULT_TITLE_FONT: GoogleFont = "Inter";
export const DEFAULT_BODY_FONT: GoogleFont = "Inter";

export const ICON_SOLID_FONT = "Font Awesome 6 Free";
export const ICON_BRANDS_FONT = "Font Awesome 6 Brands";

export const ICON_GLYPHS = {
  phone: "\uf095",
  envelope: "\uf0e0",
  globe: "\uf0ac",
  location: "\uf3c5",
  whatsapp: "\uf232",
  instagram: "\uf16d",
  facebook: "\uf39e",
} as const;

export type IconName = keyof typeof ICON_GLYPHS;

export function googleFontsCssUrl(): string {
  const families = GOOGLE_FONTS.map(
    (font) => `family=${encodeURIComponent(font).replace(/%20/g, "+")}:ital,wght@0,400;0,700;1,400;1,700`,
  ).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export async function loadGoogleFont(font: GoogleFont, weight: 400 | 700): Promise<ArrayBuffer> {
  const family = encodeURIComponent(font).replace(/%20/g, "+");
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
  if (!match?.[1]) throw new Error(`Não foi possível localizar a fonte ${font} ${weight}.`);
  const response = await fetch(match[1]);
  if (!response.ok) throw new Error(`Falha ao baixar a fonte ${font} ${weight}.`);
  return response.arrayBuffer();
}

export async function loadIconFont(kind: "solid" | "brands"): Promise<ArrayBuffer> {
  const url = kind === "solid"
    ? "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-solid-900.woff2"
    : "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-brands-400.woff2";
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao baixar a fonte Font Awesome ${kind}.`);
  return response.arrayBuffer();
}
