export const COPIES_OPTIONS = [
  { value: 1 as const, label: "1 via" },
  { value: 2 as const, label: "2 vias" },
  { value: 3 as const, label: "3 vias" },
];

export const VIA_LABELS = ["1ª via — Cliente", "2ª via — Empresa", "3ª via — Arquivo"];

export const FINISHING_LABELS: Record<string, string> = {
  serrilha: "Serrilha",
  grampo: "Grampo",
  canhoto: "Canhoto",
};
