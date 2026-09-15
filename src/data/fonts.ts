export const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Merriweather",
  "Playfair Display",
  "DM Sans",
  "Space Mono",
  "Raleway",
  "Didact Gothic",
  "Cinzel",
  "Oswald",
  "Nunito",
  "Lora",
  "Crimson Text",
  "Quicksand",
  "Alegreya",
] as const;

export type GoogleFont = (typeof GOOGLE_FONTS)[number];

export const DEFAULT_TITLE_FONT: GoogleFont = "Inter";
export const DEFAULT_BODY_FONT: GoogleFont = "Inter";

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
