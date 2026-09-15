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
  /** área útil principal (dentro da margem segura e à direita do canhoto) */
  m: number;
  contentW: number;
  contentH: number;
  /** largura do canhoto em mm (0 se não houver) */
  stubW: number;
  /** posição X do início do canhoto */
  stubX: number;
  /** mantido para compatibilidade interna: 0 no novo layout vertical */
  stubH: number;
  logoBox: { w: number; h: number } | null;
}

export type TemplateRenderer = (ctx: LayoutContext) => DocElement[];
