import { useMemo } from "react";
import { useStudio } from "@/hooks/useStudio";
import { buildDocument } from "@/templates";
import type { DocElement, RectCorner } from "@/types/template";
import { getSize } from "@/data/blockSizes";
import { getType } from "@/data/blockTypes";

const gray = (v = 0) => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 255)})`;
const ptToMm = (pt: number) => (pt * 25.4) / 72;

function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  corners: RectCorner[] = ["tl", "tr", "br", "bl"],
) {
  const r = Math.min(radius, w / 2, h / 2);
  const tl = corners.includes("tl");
  const tr = corners.includes("tr");
  const br = corners.includes("br");
  const bl = corners.includes("bl");
  return [
    `M ${x + (tl ? r : 0)} ${y}`,
    `L ${x + w - (tr ? r : 0)} ${y}`,
    tr ? `A ${r} ${r} 0 0 1 ${x + w} ${y + r}` : `L ${x + w} ${y}`,
    `L ${x + w} ${y + h - (br ? r : 0)}`,
    br ? `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}` : `L ${x + w} ${y + h}`,
    `L ${x + (bl ? r : 0)} ${y + h}`,
    bl ? `A ${r} ${r} 0 0 1 ${x} ${y + h - r}` : `L ${x} ${y + h}`,
    `L ${x} ${y + (tl ? r : 0)}`,
    tl ? `A ${r} ${r} 0 0 1 ${x + r} ${y}` : `L ${x} ${y}`,
    "Z",
  ].join(" ");
}

function Element({ el, i }: { el: DocElement; i: number }) {
  if (el.kind === "text") {
    const anchor = el.align === "center" ? "middle" : el.align === "right" ? "end" : "start";
    const x =
      el.align === "center" && el.width
        ? el.x + el.width / 2
        : el.align === "right" && el.width
          ? el.x + el.width
          : el.x;
    return (
      <text
        key={i}
        x={x}
        y={el.y + ptToMm(el.size) * 0.78}
        fontSize={ptToMm(el.size)}
        fontWeight={el.bold ? 700 : 400}
        textAnchor={anchor}
        fill={gray(el.gray ?? 0)}
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {el.text}
      </text>
    );
  }
  if (el.kind === "line") {
    return (
      <line
        key={i}
        x1={el.x1}
        y1={el.y1}
        x2={el.x2}
        y2={el.y2}
        stroke={gray(el.gray ?? 0)}
        strokeWidth={el.lineWidth ?? 0.3}
        strokeDasharray={el.dash?.join(" ")}
      />
    );
  }
  if (el.kind === "rect") {
    const hasRadius = (el.radius ?? 0) > 0;
    return hasRadius ? (
      <path
        key={i}
        d={roundedRectPath(el.x, el.y, el.w, el.h, el.radius ?? 0, el.corners)}
        fill={el.fill != null ? gray(el.fill) : "none"}
        stroke={el.stroke != null ? gray(el.stroke) : "none"}
        strokeWidth={el.lineWidth ?? 0.3}
        strokeDasharray={el.dash?.join(" ")}
      />
    ) : (
      <rect
        key={i}
        x={el.x}
        y={el.y}
        width={el.w}
        height={el.h}
        fill={el.fill != null ? gray(el.fill) : "none"}
        stroke={el.stroke != null ? gray(el.stroke) : "none"}
        strokeWidth={el.lineWidth ?? 0.3}
        strokeDasharray={el.dash?.join(" ")}
      />
    );
  }
  return (
    <image key={i} href={el.src} x={el.x} y={el.y} width={el.w} height={el.h} preserveAspectRatio="xMinYMin meet" />
  );
}

export function DocumentPreview() {
  const { company, doc, production, logoAspect } = useStudio();
  const built = useMemo(
    () => buildDocument(company, doc, production, logoAspect),
    [company, doc, production, logoAspect],
  );
  const size = getSize(doc.sizeId);
  const type = getType(doc.typeId);
  const b = production.showBleed ? production.bleedMm : 0;
  const vw = built.widthMm + b * 2;
  const vh = built.heightMm + b * 2;

  return (
    <div className="flex h-full flex-col items-center justify-start gap-3 overflow-auto bg-background p-6">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="font-semibold text-foreground">{type.label}</span>
        <span>{size.label}</span>
        <span>
          {size.widthMm} × {size.heightMm} mm
        </span>
        <span>{doc.copies} via(s)</span>
      </div>

      <div
        className="relative shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
        style={{
          width: "100%",
          maxWidth: `min(100%, ${vw * 3.2}px)`,
          aspectRatio: `${vw} / ${vh}`,
        }}
      >
        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          className="h-full w-full bg-white"
          style={{ outline: "1px solid var(--color-border-strong)" }}
        >
          {b > 0 && (
            <rect x={0} y={0} width={vw} height={vh} fill="var(--color-accent)" opacity={0.5} />
          )}
          <g transform={`translate(${b} ${b})`}>
            <rect x={0} y={0} width={built.widthMm} height={built.heightMm} fill="#ffffff" />
            {built.guides.map((el, i) => (
              <Element key={`g${i}`} el={el} i={i} />
            ))}
            {built.content.map((el, i) => (
              <Element key={`c${i}`} el={el} i={i} />
            ))}
            {built.production.map((el, i) => (
              <Element key={`p${i}`} el={el} i={i} />
            ))}
            {built.stubY !== null && (
              <text
                x={built.widthMm - 2}
                y={built.stubY - 1}
                fontSize={2.2}
                textAnchor="end"
                fill="var(--color-primary)"
                fontFamily="Helvetica, Arial, sans-serif"
              >
                SERRILHA
              </text>
            )}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {production.showBleed && <span>Sangria {production.bleedMm} mm</span>}
        <span>Margem segura {production.safeMm} mm</span>
        {doc.serrilha && <span className="text-primary">Serrilha</span>}
        {doc.grampo && <span className="text-primary">Grampo</span>}
        {doc.canhoto && <span className="text-primary">Canhoto</span>}
        {doc.roundedCorners && <span className="text-primary">Cantos arredondados</span>}
      </div>
    </div>
  );
}
