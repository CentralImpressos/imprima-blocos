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
  stubX: number | null;
}

function shiftElementX(el: DocElement, dx: number): DocElement {
  if (dx === 0) return el;
  if (el.kind === "line") return { ...el, x1: el.x1 + dx, x2: el.x2 + dx };
  return { ...el, x: el.x + dx };
}

export function buildDocument(
  company: Company,
  doc: BlockDoc,
  prod: ProductionSettings,
  logoAspect: number | null,
): BuiltDocument {
  const size = getSize(doc.sizeId);
  const safe = prod.safeMm;
  const fullContentW = size.widthMm - safe * 2;
  const contentH = size.heightMm - safe * 2;

  // Para recibo, rifa e carnê, o canhoto ocupa uma faixa vertical à esquerda.
  const stubW = doc.canhoto ? Math.round(fullContentW * doc.stubRatio) : 0;
  const stubX = doc.canhoto ? safe : 0;
  const m = safe;
  const contentW = fullContentW - stubW;

  const ctx: LayoutContext = {
    company,
    doc,
    size,
    m,
    contentW,
    contentH,
    stubW,
    stubX,
    stubH: 0,
    logoBox: company.logo && logoAspect ? { w: logoAspect, h: 1 } : null,
  };

  // Os templates calculam o conteúdo principal normalmente a partir de m/contentW.
  // Depois deslocamos todo o conteúdo para a direita para abrir espaço ao canhoto.
  const rawContent = RENDERERS[doc.typeId](ctx);
  const content = stubW > 0 ? rawContent.map((el) => shiftElementX(el, stubW)) : rawContent;

  const production: DocElement[] = [];
  const stubXLine = doc.canhoto ? safe + stubW : null;

  if (stubXLine !== null && doc.serrilha && prod.showSerrilha) {
    production.push({
      kind: "line",
      x1: stubXLine,
      y1: 0,
      x2: stubXLine,
      y2: size.heightMm,
      lineWidth: 0.4,
      dash: [2, 1.6],
      gray: 0.45,
    });
  } else if (doc.serrilha && prod.showSerrilha && stubXLine === null) {
    // Serrilha opcional sem canhoto: lateral esquerda.
    production.push({
      kind: "line",
      x1: 6,
      y1: 0,
      x2: 6,
      y2: size.heightMm,
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
      x: safe,
      y: safe,
      w: fullContentW,
      h: contentH,
      stroke: 0.7,
      lineWidth: 0.2,
      dash: [1.5, 1.5],
      fill: null,
    });
  }
  if (stubXLine !== null) {
    guides.push({
      kind: "rect",
      x: safe,
      y: safe,
      w: stubW,
      h: contentH,
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
    stubY: null,
    stubX: stubXLine,
  };
}
