import { BLOCK_TYPES } from "@/data/blockTypes";
import { useStudio } from "@/hooks/useStudio";
import { cn } from "@/lib/utils";

export function TemplateSelector() {
  const { doc, changeType } = useStudio();
  return (
    <div className="grid grid-cols-1 gap-1 p-3">
      {BLOCK_TYPES.map((t) => {
        const active = t.id === doc.typeId;
        return (
          <button
            key={t.id}
            onClick={() => changeType(t.id)}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-[3px] border px-2.5 py-1.5 text-left transition-colors",
              active
                ? "border-primary bg-accent"
                : "border-border bg-surface hover:border-border-strong",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                active ? "text-accent-foreground" : "text-foreground",
              )}
            >
              {t.label}
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">{t.description}</span>
          </button>
        );
      })}
    </div>
  );
}
