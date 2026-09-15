import type { Company } from "./company";
import type { BlockDoc, BlockSize } from "./block";
import type { IconName } from "@/data/fonts";

export type Align = "left" | "center" | "right";

export type RectCorner = "tl" | "tr" | "br" | "bl";

export type DocElement =
  | {
      kind: "text";
      x: number;
      y: number;
      size: number;
      bold?: boolean;
      align?: Align;
      width?: number;
      text: string;
      gray?: number;
      fontFamily?: string;
    }
  | {
      kind: "icon";
      x: number;
      y: number;
      size: number;
      icon: IconName;
      gray?: number;
    }
  | {
      kind: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      lineWidth?: number;
      dash?: number[];
      gray?: number;
    }
  | {
      kind: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      lineWidth?: number;
      stroke?: number | null;
      fill?: number | null;
      dash?: number[];
      radius?: number;
      corners?: RectCorner[];
    }
  | {
      kind: "image";
      x: number;
      y: number;
      w: number;
      h: number;
      src: string;
    };

export interface LayoutContext {
  company: Company;
  doc: BlockDoc;
  size: BlockSize;
  /** margem segura horizontal e referência X da área útil */
  m: number;
  /** deslocamento vertical adicional para acabamentos superiores */
  topOffsetMm: number;
  contentW: number;
  contentH: number;
  stubW: number;
  stubX: number;
  stubH: number;
  logoBox: { w: number; h: number } | null;
}

export type TemplateRenderer = (ctx: LayoutContext) => DocElement[];
