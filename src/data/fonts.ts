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
  "Rubik",
  "Space Mono",
] as const;

export type GoogleFont = (typeof GOOGLE_FONTS)[number];

export const DEFAULT_TITLE_FONT: GoogleFont = "Rubik";
export const DEFAULT_BODY_FONT: GoogleFont = "Open Sans";

const FONT_WEIGHTS: Record<GoogleFont, string> = {
  Alegreya: "400;700",
  "Bebas Neue": "400",
  Cinzel: "400;700",
  "Crimson Text": "400;700",
  "Didact Gothic": "400",
  "DM Sans": "400;700",
  Inter: "400;700",
  Lato: "400;700",
  Lora: "400;700",
  Merriweather: "400;700",
  Montserrat: "400;700",
  Nunito: "400;700",
  "Open Sans": "400;700",
  Oswald: "400;700",
  "Playfair Display": "400;700",
  Poppins: "400;700",
  Quicksand: "400;700",
  Raleway: "400;700",
  Roboto: "400;700",
  Rubik: "400;700",
  "Space Mono": "400;700",
};

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

export const ICON_VIEWBOX = {
  phone: [512, 512],
  envelope: [512, 512],
  globe: [512, 512],
  location: [384, 512],
  whatsapp: [448, 512],
  instagram: [448, 512],
  facebook: [512, 512],
} as const;

export const ICON_PATHS = {
  phone: "M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z",
  envelope: "M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z",
  globe: "M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z",
  location: "M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 0 0 0 128z",
  whatsapp: "M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z",
  instagram: "M224.3 141a115 115 0 1 0-.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1-.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1-53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.7-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7 2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
  facebook: "M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z",
} as const;

export type IconName = keyof typeof ICON_GLYPHS;

export function googleFontsCssUrl(): string {
  const families = GOOGLE_FONTS.map((font) => {    
    const family = encodeURIComponent(font).replace(/%20/g, "+");
    return `family=${family}:wght@${FONT_WEIGHTS[font]}`;
  }).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export async function loadGoogleFont(font: GoogleFont, weight: 400 | 700): Promise<ArrayBuffer> {
  const family = encodeURIComponent(font).replace(/%20/g, "+");
  const requestedWeight = FONT_WEIGHTS[font].includes(String(weight)) ? weight : 400;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${requestedWeight}&display=swap`;
  const cssResponse = await fetch(cssUrl);
  if (!cssResponse.ok) throw new Error(`Falha ao carregar o CSS da fonte ${font}.`);
  const css = await cssResponse.text();
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
  const latinUrl = urls[urls.length - 1] ?? urls[0];
  if (!latinUrl) throw new Error(`Não foi possível localizar a fonte ${font} ${requestedWeight}.`);
  const response = await fetch(latinUrl);
  if (!response.ok) throw new Error(`Falha ao baixar a fonte ${font} ${requestedWeight}.`);
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
