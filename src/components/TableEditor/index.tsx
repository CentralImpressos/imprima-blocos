import { useStudio } from "@/hooks/useStudio";
import { Btn, Check, Field, NumberField } from "@/components/ui-kit/Field";
import type { TableRow } from "@/types/block";

export function TableEditor() {
  const { doc, setDoc } = useStudio();
  const table = doc.table;

  const update = (patch: Partial<typeof table>) => setDoc({ table: { ...table, ...patch } });
  const setRows = (rows: TableRow[]) => update({ rows });

  const addRow = () =>
    setRows([...table.rows, { id: crypto.randomUUID(), cells: table.columns.map(() => "") }]);
  const removeRow = (i: number) => setRows(table.rows.filter((_, idx) => idx !== i));
  const duplicateRow = (i: number) => {
    const row = table.rows[i]!;
    const copy = { ...row, id: crypto.randomUUID(), cells: [...row.cells] };
    const next = [...table.rows];
    next.splice(i + 1, 0, copy);
    setRows(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= table.rows.length) return;
    const next = [...table.rows];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setRows(next);
  };
  const setCell = (i: number, c: number, v: string) => {
    const next = table.rows.map((r, idx) =>
      idx === i ? { ...r, cells: r.cells.map((cell, ci) => (ci === c ? v : cell)) } : r,
    );
    setRows(next);
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Altura da linha"
          suffix="mm"
          value={table.rowHeightMm}
          step={0.5}
          min={3}
          onChange={(v) => update({ rowHeightMm: v || 6 })}
        />
        <NumberField
          label="Fonte"
          suffix="pt"
          value={table.fontSize}
          step={0.5}
          min={4}
          onChange={(v) => update({ fontSize: v || 8 })}
        />
        <NumberField
          label="Espessura da borda"
          suffix="mm"
          value={table.borderWidth}
          step={0.05}
          min={0.1}
          onChange={(v) => update({ borderWidth: v || 0.3 })}
        />
        <div className="flex flex-col justify-end">
          <Check label="Bordas" checked={table.showBorders} onChange={(v) => update({ showBorders: v })} />
          <Check
            label="Preencher altura"
            checked={table.fillRows}
            onChange={(v) => update({ fillRows: v })}
          />
          <Check
            label="Duas colunas"
            checked={table.twoColumns}
            onChange={(v) => update({ twoColumns: v })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="panel-label">Colunas</span>
        {table.columns.map((c, ci) => (
          <div key={c.id} className="flex items-center gap-1.5">
            <input
              className="field-input flex-1"
              value={c.label}
              onChange={(e) =>
                update({
                  columns: table.columns.map((x, i) =>
                    i === ci ? { ...x, label: e.target.value } : x,
                  ),
                })
              }
            />
            <input
              type="number"
              className="field-input w-16"
              value={c.widthPct}
              min={5}
              max={100}
              onChange={(e) =>
                update({
                  columns: table.columns.map((x, i) =>
                    i === ci ? { ...x, widthPct: parseFloat(e.target.value) || 10 } : x,
                  ),
                })
              }
            />
            <select
              className="field-input w-20"
              value={c.align}
              onChange={(e) =>
                update({
                  columns: table.columns.map((x, i) =>
                    i === ci ? { ...x, align: e.target.value as typeof x.align } : x,
                  ),
                })
              }
            >
              <option value="left">Esq.</option>
              <option value="center">Centro</option>
              <option value="right">Dir.</option>
            </select>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground">Largura em % da tabela.</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="panel-label">Linhas ({table.rows.length})</span>
        <Btn size="sm" variant="primary" onClick={addRow}>
          + Linha
        </Btn>
      </div>

      <div className="flex max-h-[45vh] flex-col gap-1 overflow-auto pr-1">
        {table.rows.map((r, i) => (
          <div key={r.id} className="flex items-center gap-1">
            <span className="w-5 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
              {i + 1}
            </span>
            {table.columns.map((c, ci) => (
              <input
                key={c.id}
                className="field-input min-w-0 flex-1"
                value={r.cells[ci] ?? ""}
                placeholder={c.label}
                onChange={(e) => setCell(i, ci, e.target.value)}
              />
            ))}
            <Btn size="sm" variant="ghost" title="Subir" onClick={() => move(i, -1)}>
              ↑
            </Btn>
            <Btn size="sm" variant="ghost" title="Descer" onClick={() => move(i, 1)}>
              ↓
            </Btn>
            <Btn size="sm" variant="ghost" title="Duplicar" onClick={() => duplicateRow(i)}>
              ⧉
            </Btn>
            <Btn size="sm" variant="danger" title="Excluir" onClick={() => removeRow(i)}>
              ×
            </Btn>
          </div>
        ))}
        {table.rows.length === 0 && (
          <p className="text-[11px] text-muted-foreground">Nenhuma linha. Adicione itens à tabela.</p>
        )}
      </div>

      <Field label="Rótulo do total">
        <input
          className="field-input"
          value={doc.fields["totalLabel"] ?? ""}
          onChange={(e) => setDoc({ fields: { ...doc.fields, totalLabel: e.target.value } })}
        />
      </Field>
    </div>
  );
}
