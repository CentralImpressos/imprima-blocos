import type { Company } from "./company";
import type { BlockDoc, BlockSize } from "./block";

export type Align = "left" | "center" | "right";

export type DocElement =
  | {
      kind: "text";
      x: number;
      y: number; // baseline-top reference (mm, top-left origin)
      size: number; // pt
      bold?: boolean;
      align?: Align;
      width?: number; // mm, used for center/right alignment box
      text: string;
      gray?: number; // 0 = black, 1 = white
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
  /** área útil (dentro da margem segura) */
  m: number;
  contentW: number;
  contentH: number;
  /** altura do canhoto em mm (0 se não houver) */
  stubH: number;
  logoBox: { w: number; h: number } | null;
}

export type TemplateRenderer = (ctx: LayoutContext) => DocElement[];
