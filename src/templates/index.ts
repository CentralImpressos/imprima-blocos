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

const RENDERERS = { comanda: renderComanda, pedido: renderPedido, recibo: renderRecibo, rifa: renderRifa, carne: renderCarne } as const;
const STUB_GAP_MM = 3;

export interface BuiltDocument { widthMm: number; heightMm: number; content: DocElement[]; production: DocElement[]; guides: DocElement[]; stubY: number | null; stubX: number | null; }

function shiftElementX(el: DocElement, dx: number): DocElement { if (dx === 0) return el; if (el.kind === "line") return { ...el, x1: el.x1 + dx, x2: el.x2 + dx }; return { ...el, x: el.x + dx }; }
function applyFonts(els: DocElement[], bodyFont: string): DocElement[] { return els.map((el) => (el.kind === "text" && !el.fontFamily ? { ...el, fontFamily: bodyFont } : el)); }

export function buildDocument(company: Company, doc: BlockDoc, prod: ProductionSettings, logoAspect: number | null): BuiltDocument {
  const size = getSize(doc.sizeId);
  const safe = prod.safeMm;
  const isPortrait = size.heightMm > size.widthMm;
  const hasTopFinish = doc.typeId === "comanda" || doc.typeId === "pedido";
  const topOffsetMm = hasTopFinish ? 9 : (isPortrait ? 6 : 0);
  const fullContentW = size.widthMm - safe * 2;
  // topOffsetMm desloca o início do conteúdo para baixo, mas não deve reduzir
  // a altura útil até a margem de segurança inferior. O ponto inferior é sempre
  // a margem segura real da página (m + contentH).
  const contentH = size.heightMm - safe * 2;
  const stubW = doc.canhoto ? Math.round(fullContentW * doc.stubRatio) : 0;
  const stubX = doc.canhoto ? safe : 0;
  const m = safe;
  const ctx: LayoutContext = { company, doc, size, m, topOffsetMm, contentW: fullContentW - stubW - (stubW > 0 ? STUB_GAP_MM : 0), contentH, stubW, stubX, stubH: 0, logoBox: company.logo && logoAspect ? { w: logoAspect, h: 1 } : null };

  const rawContent = RENDERERS[doc.typeId](ctx);
  const bodyShift = stubW > 0 ? stubW + STUB_GAP_MM : 0;
  const content = applyFonts(bodyShift ? rawContent.map((el) => shiftElementX(el, bodyShift)) : rawContent, doc.bodyFont);

  const production: DocElement[] = [];
  const stubXLine = doc.canhoto ? safe + stubW : null;
  if (doc.serrilha && prod.showSerrilha) {
    if (doc.typeId === "comanda" || doc.typeId === "pedido") production.push({ kind: "line", x1: safe, y1: 7, x2: size.widthMm - safe, y2: 7, lineWidth: 0.4, dash: [2, 1.6], gray: 0.45 });
    else if (stubXLine !== null) production.push({ kind: "line", x1: stubXLine, y1: 0, x2: stubXLine, y2: size.heightMm, lineWidth: 0.4, dash: [2, 1.6], gray: 0.45 });
    else production.push({ kind: "line", x1: 6, y1: 0, x2: 6, y2: size.heightMm, lineWidth: 0.4, dash: [2, 1.6], gray: 0.45 });
  }
  if (doc.grampo && prod.showGrampo) {
    if (doc.typeId === "comanda" || doc.typeId === "pedido") { const cx = size.widthMm / 2; production.push({ kind: "rect", x: cx - 6, y: 1.2, w: 12, h: 2.2, fill: 0.55, stroke: null }); }
    else { production.push({ kind: "rect", x: 1.2, y: size.heightMm / 2 - 6, w: 2.2, h: 12, fill: 0.55, stroke: null }); }
  }
  if (prod.showCrop) {
    const b = prod.bleedMm; const len = 4; const marks: DocElement[] = []; const corners: Array<[number, number]> = [[0, 0], [size.widthMm, 0], [0, size.heightMm], [size.widthMm, size.heightMm]];
    corners.forEach(([x, y]) => { const sx = x === 0 ? -b - len : b + len; const sy = y === 0 ? -b - len : b + len; marks.push({ kind: "line", x1: x, y1: y + sy, x2: x, y2: y + (sy > 0 ? b : -b), lineWidth: 0.25 }, { kind: "line", x1: x + sx, y1: y, x2: x + (sx > 0 ? b : -b), y2: y, lineWidth: 0.25 }); });
    production.push(...marks);
  }
  const guides: DocElement[] = [];
  if (prod.showSafe) guides.push({ kind: "rect", x: safe, y: safe, w: fullContentW, h: size.heightMm - safe * 2, stroke: 0.7, lineWidth: 0.2, dash: [1.5, 1.5], fill: null });
  if (stubXLine !== null) guides.push({ kind: "rect", x: safe, y: safe, w: stubW, h: size.heightMm - safe * 2, fill: 0.97, stroke: null });
  return { widthMm: size.widthMm, heightMm: size.heightMm, content, production: applyFonts(production, doc.bodyFont), guides, stubY: null, stubX: stubXLine };
}
