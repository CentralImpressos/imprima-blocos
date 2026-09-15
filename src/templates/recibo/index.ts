import type { DocElement, LayoutContext, TemplateRenderer } from "@/types/template";
import { buildFooter, buildHeader, footerHeight, ptToMm } from "../shared";

const line = (x1: number, y: number, x2: number): DocElement => ({
  kind: "line",
  x1,
  y1: y,
  x2,
  y2: y,
  lineWidth: 0.3,
  gray: 0.3,
});

export const renderRecibo: TemplateRenderer = (ctx: LayoutContext) => {
  const { doc, m, contentW, contentH } = ctx;
  const els: DocElement[] = [];
  const stubW = ctx.stubH > 0 ? 0 : 0;
  void stubW;

  const header = buildHeader(ctx, { title: doc.title || "RECIBO", subtitle: doc.subtitle, compact: true });
  els.push(...header.els);
  let y = header.y;

  // nº e valor em destaque
  const boxH = 8;
  els.push(
    { kind: "rect", x: m + contentW - 46, y: y - 1, w: 46, h: boxH, stroke: 0.15, lineWidth: 0.5 },
    {
      kind: "text",
      x: m + contentW - 44,
      y: y + (boxH - ptToMm(9)) / 2 - 1,
      size: 9,
      bold: true,
      text: `R$ ${doc.fields["valor"] || "____________"}`,
    },
    { kind: "text", x: m, y, size: 8, bold: true, text: `Nº ${doc.fields["numero"] || "0001"}` },
  );
  y += boxH + 2;

  const bottom = m + contentH - ctx.stubH;
  const fH = footerHeight(ctx);
  const sigBlockH = 15;
  const sigY = bottom - fH - sigBlockH;

  const s = 8;
  const rows = [
    "Recebemos de:",
    "A importância de:",
    `Referente a:${doc.fields["referente"] ? " " + doc.fields["referente"] : ""}`,
  ];
  const gap = Math.max(ptToMm(s) + 2, (sigY - 4 - y) / rows.length);
  rows.forEach((label) => {
    els.push({ kind: "text", x: m, y, size: s, text: label, gray: 0.2 });
    els.push(line(m + label.length * s * 0.16 + 2, y + ptToMm(s) + 0.5, m + contentW));
    y += gap;
  });

  els.push(
    { kind: "text", x: m, y: y + 1, size: 7.5, text: "Data:  ____ / ____ / ______", gray: 0.2 },
    line(m + contentW * 0.5, y + 4, m + contentW),
    {
      kind: "text",
      x: m + contentW * 0.5,
      y: y + 5,
      size: 6.5,
      align: "center",
      width: contentW * 0.5,
      text: "Assinatura",
      gray: 0.35,
    },
  );

  els.push(...buildFooter(ctx, bottom - 1));

  // CANHOTO
  if (ctx.stubH > 0) {
    const sy = bottom + 3;
    els.push(
      { kind: "text", x: m, y: sy, size: 7, bold: true, text: "CANHOTO" },
      {
        kind: "text",
        x: m,
        y: sy,
        size: 7,
        bold: true,
        align: "right",
        width: contentW,
        text: `Nº ${doc.fields["numero"] || "0001"}`,
      },
      { kind: "text", x: m, y: sy + 6, size: 7, text: "Recebido de:", gray: 0.25 },
      line(m + 22, sy + 6 + ptToMm(7) + 0.5, m + contentW),
      { kind: "text", x: m, y: sy + 12, size: 7, text: `R$ ${doc.fields["valor"] || "__________"}`, gray: 0.25 },
      { kind: "text", x: m + 40, y: sy + 12, size: 7, text: "Data: ____/____/______", gray: 0.25 },
    );
  }

  return els;
};
