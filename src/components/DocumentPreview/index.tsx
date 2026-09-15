import { useEffect, useMemo, useRef, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { buildDocument } from "@/templates";
import type { DocElement, RectCorner } from "@/types/template";
import { getSize } from "@/data/blockSizes";
import { getType } from "@/data/blockTypes";

const gray = (v = 0) => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 255)})`;
const ptToMm = (pt: number) => (pt * 25.4) / 72;

type PreviewMode = "fit" | "width" | "zoom";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  // Sempre inicia em Ajustar. O modo escolhido anteriormente não deve alterar
  // a primeira visualização de um novo carregamento da aplicação.
  const [mode, setMode] = useState<PreviewMode>("fit");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const savedZoom = Number(localStorage.getItem("imprima-blocos-preview-zoom"));
    if (savedZoom >= 0.5 && savedZoom <= 3) setZoom(savedZoom);
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const update = () => setStage({ width: node.clientWidth, height: node.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const changeMode = (next: PreviewMode) => {
    setMode(next);
  };

  const changeZoom = (next: number) => {
    const value = Math.min(3, Math.max(0.5, next));
    setZoom(value);
    setMode("zoom");
    localStorage.setItem("imprima-blocos-preview-zoom", String(value));
  };

  const buttonClass = (active: boolean) =>
    `rounded-[3px] border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
    }`;

  // O stage contém um wrapper com p-4 (16px de cada lado). O cálculo precisa
  // usar a área interna real para que Ajustar não gere nem 1px de rolagem.
  const availableWidth = Math.max(0, stage.width - 32);
  const availableHeight = Math.max(0, stage.height - 32);
  const fitWidth = availableWidth > 0 && availableHeight > 0
    ? Math.min(availableWidth, availableHeight * (vw / vh))
    : 0;
  const widthModeWidth = availableWidth;
  const previewWidth = mode === "fit" ? fitWidth : mode === "width" ? widthModeWidth : fitWidth * zoom;
  const previewHeight = previewWidth > 0 ? previewWidth * (vh / vw) : 0;
  const isOversized = previewWidth > availableWidth || previewHeight > availableHeight;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background p-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="font-semibold text-foreground">{type.label}</span>
          <span>{size.label}</span>
          <span>{size.widthMm} × {size.heightMm} mm</span>
          <span>{doc.copies} via(s)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className={buttonClass(mode === "fit")} onClick={() => changeMode("fit")} title="Mostrar o documento inteiro">
            ⊞ Ajustar
          </button>
          <button type="button" className={buttonClass(mode === "width")} onClick={() => changeMode("width")} title="Preencher a largura disponível">
            ↔ Largura
          </button>
          <div className="ml-1 flex items-center overflow-hidden rounded-[3px] border border-border">
            <button type="button" className="px-2 py-1 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => changeZoom(zoom - 0.1)} aria-label="Diminuir zoom">−</button>
            <button type="button" className="min-w-[58px] border-x border-border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground" onClick={() => changeZoom(1)} title="Zoom 100%">{Math.round(zoom * 100)}%</button>
            <button type="button" className="px-2 py-1 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => changeZoom(zoom + 0.1)} aria-label="Aumentar zoom">+</button>
          </div>
        </div>
      </div>

      <div ref={stageRef} className="min-h-0 min-w-0 flex-1 overflow-auto rounded-[3px] bg-background">
        <div
          className="flex min-h-full min-w-full items-center justify-center p-4"
          style={{ minWidth: isOversized ? `${previewWidth + 32}px` : undefined, minHeight: isOversized ? `${previewHeight + 32}px` : undefined }}
        >
          <div
            className="relative shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
            style={{ width: previewWidth || undefined, height: previewHeight || undefined }}
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
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
