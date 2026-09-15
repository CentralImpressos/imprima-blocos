import type { TableConfig } from "@/types/block";
import type { DocElement } from "@/types/template";
import { ptToMm } from "@/templates/shared";

interface Opts {
  x: number;
  y: number;
  w: number;
  maxH: number;
  table: TableConfig;
  roundedCorners?: boolean;
}

/** Desenha a tabela de forma vetorial (linhas + texto). Suporta duas colunas de blocos. */
export function buildTableElements({ x, y, w, maxH, table, roundedCorners = false }: Opts): {
  els: DocElement[];
  y: number;
} {
  const els: DocElement[] = [];
  const gap = 4;
  const blocks = table.twoColumns ? 2 : 1;
  const colW = (w - gap * (blocks - 1)) / blocks;
  const rowsPerBlock = Math.ceil(Math.max(table.rows.length, 1) / blocks);
  const headerH = table.rowHeightMm;
  const available = Math.max(0, maxH);
  const maxRows = Math.max(1, Math.floor((available - headerH) / table.rowHeightMm));
  const visibleRows = table.fillRows ? maxRows : Math.min(rowsPerBlock, maxRows);
  const lw = table.borderWidth;
  const stroke = table.showBorders ? 0.15 : null;
  const radius = Math.min(1.8, headerH / 3);

  for (let b = 0; b < blocks; b++) {
    const bx = x + b * (colW + gap);
    let by = y;
    const rows = table.rows.slice(b * rowsPerBlock, b * rowsPerBlock + visibleRows);
    while (rows.length < visibleRows) rows.push({ id: `blank-${b}-${rows.length}`, cells: [] });

    // Cabeçalho: somente os dois cantos externos superiores são arredondados.
    els.push({
      kind: "rect",
      x: bx,
      y: by,
      w: colW,
      h: headerH,
      fill: 0.88,
      stroke,
      lineWidth: lw,
      ...(roundedCorners ? { radius, corners: ["tl", "tr"] } : {}),
    });
    let cx = bx;
    table.columns.forEach((c) => {
      const cw = (c.widthPct / 100) * colW;
      els.push({
        kind: "text",
        x: cx + 1,
        y: by + (headerH - ptToMm(table.fontSize)) / 2,
        size: table.fontSize,
        bold: true,
        align: c.align,
        width: cw - 2,
        text: c.label,
      });
      cx += cw;
    });
    by += headerH;

    rows.forEach((r, ri) => {
      const isLastRow = ri === rows.length - 1;
      if (stroke !== null) {
        els.push({
          kind: "rect",
          x: bx,
          y: by,
          w: colW,
          h: table.rowHeightMm,
          stroke,
          lineWidth: lw,
          ...(roundedCorners && isLastRow ? { radius, corners: ["bl", "br"] } : {}),
        });
      } else {
        els.push({
          kind: "line",
          x1: bx,
          y1: by + table.rowHeightMm,
          x2: bx + colW,
          y2: by + table.rowHeightMm,
          lineWidth: lw,
          gray: 0.5,
        });
      }
      let ix = bx;
      table.columns.forEach((c, ci) => {
        const cw = (c.widthPct / 100) * colW;
        if (stroke !== null && ci > 0) {
          els.push({
            kind: "line",
            x1: ix,
            y1: by,
            x2: ix,
            y2: by + table.rowHeightMm,
            lineWidth: lw,
            gray: 0.15,
          });
        }
        const txt = r.cells[ci] ?? "";
        if (txt) {
          els.push({
            kind: "text",
            x: ix + 1.2,
            y: by + (table.rowHeightMm - ptToMm(table.fontSize)) / 2,
            size: table.fontSize,
            align: c.align,
            width: cw - 2.4,
            text: txt,
          });
        }
        ix += cw;
      });
      by += table.rowHeightMm;
    });
  }

  return { els, y: y + headerH + visibleRows * table.rowHeightMm };
}
