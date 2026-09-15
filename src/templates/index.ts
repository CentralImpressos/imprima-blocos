import type { BlockDoc } from "@/types/block";
import type { Company } from "@/types/company";
import type { ProductionSettings } from "@/types/production";
import type { DocElement, LayoutContext } from "@/types/template";
import { getSize } from "@/data/blockSizes";
import { renderComanda } from "./comanda";
import { renderPedido } from "./pedido";
import { renderRecibo } from "./recibo";
import { renderRifa } from "./rifa";
import { renderCarne } from "./carne";

const RENDERERS = {
  comanda: renderComanda,
  pedido: renderPedido,
  recibo: renderRecibo,
  rifa: renderRifa,
  carne: renderCarne,
} as const;

export interface BuiltDocument {
  widthMm: number;
  heightMm: number;
  /** conteúdo do cliente (vai para o PDF) */
  content: DocElement[];
  /** marcas de produção que também são impressas (serrilha / grampo / corte) */
  production: DocElement[];
  /** guias apenas de tela (sangria, área segura) */
  guides: DocElement[];
  stubY: number | null;
}

export function buildDocument(
  company: Company,
  doc: BlockDoc,
  prod: ProductionSettings,
  logoAspect: number | null,
): BuiltDocument {
  const size = getSize(doc.sizeId);
  const m = prod.safeMm;
  const contentW = size.widthMm - m * 2;
  const contentH = size.heightMm - m * 2;
  const stubH = doc.canhoto ? Math.round(contentH * doc.stubRatio) : 0;

  const ctx: LayoutContext = {
    company,
    doc,
    size,
    m,
    contentW,
    contentH,
    stubH,
    logoBox: company.logo && logoAspect ? { w: logoAspect, h: 1 } : null,
  };

  const content = RENDERERS[doc.typeId](ctx);

  const production: DocElement[] = [];
  const stubY = stubH > 0 ? m + contentH - stubH : null;

  if (stubY !== null && doc.serrilha && prod.showSerrilha) {
    production.push({
      kind: "line",
      x1: 0,
      y1: stubY,
      x2: size.widthMm,
      y2: stubY,
      lineWidth: 0.4,
      dash: [2, 1.6],
      gray: 0.45,
    });
  } else if (doc.serrilha && prod.showSerrilha && stubY === null) {
    // serrilha de destaque na base do bloco
    production.push({
      kind: "line",
      x1: 0,
      y1: size.heightMm - 6,
      x2: size.widthMm,
      y2: size.heightMm - 6,
      lineWidth: 0.4,
      dash: [2, 1.6],
      gray: 0.45,
    });
  }

  if (doc.grampo && prod.showGrampo) {
    const cx = size.widthMm / 2;
    production.push(
      { kind: "rect", x: cx - 6, y: 1.2, w: 12, h: 2.2, fill: 0.55, stroke: null },
      {
        kind: "text",
        x: cx - 20,
        y: 4,
        size: 4.5,
        width: 40,
        align: "center",
        text: "GRAMPO",
        gray: 0.55,
      },
    );
  }

  if (prod.showCrop) {
    const b = prod.bleedMm;
    const len = 4;
    const marks: DocElement[] = [];
    const corners: Array<[number, number]> = [
      [0, 0],
      [size.widthMm, 0],
      [0, size.heightMm],
      [size.widthMm, size.heightMm],
    ];
    corners.forEach(([x, y]) => {
      const sx = x === 0 ? -b - len : b + len;
      const sy = y === 0 ? -b - len : b + len;
      marks.push(
        { kind: "line", x1: x, y1: y + sy, x2: x, y2: y + (sy > 0 ? b : -b), lineWidth: 0.25 },
        { kind: "line", x1: x + sx, y1: y, x2: x + (sx > 0 ? b : -b), y2: y, lineWidth: 0.25 },
      );
    });
    production.push(...marks);
  }

  const guides: DocElement[] = [];
  if (prod.showSafe) {
    guides.push({
      kind: "rect",
      x: m,
      y: m,
      w: contentW,
      h: contentH,
      stroke: 0.7,
      lineWidth: 0.2,
      dash: [1.5, 1.5],
      fill: null,
    });
  }
  if (stubY !== null) {
    guides.push({
      kind: "rect",
      x: 0,
      y: stubY,
      w: size.widthMm,
      h: stubH,
      fill: 0.97,
      stroke: null,
    });
  }

  return {
    widthMm: size.widthMm,
    heightMm: size.heightMm,
    content,
    production,
    guides,
    stubY,
  };
}
