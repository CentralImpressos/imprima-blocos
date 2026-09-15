import type { BlockSize } from "@/types/block";

export const BLOCK_SIZES: BlockSize[] = [
  { id: "14x20", label: "14 x 20 cm", widthMm: 140, heightMm: 200 },
  { id: "14x10", label: "14 x 10 cm", widthMm: 140, heightMm: 100 },
  { id: "28x20", label: "28 x 20 cm", widthMm: 280, heightMm: 200 },
  { id: "20x9", label: "20 x 9 cm", widthMm: 200, heightMm: 90 },
  { id: "20x7", label: "20 x 7 cm", widthMm: 200, heightMm: 70 },
  { id: "9x20", label: "9 x 20 cm", widthMm: 90, heightMm: 200 },
];

export const getSize = (id: string): BlockSize =>
  BLOCK_SIZES.find((s) => s.id === id) ?? BLOCK_SIZES[0]!;
