export type BlockTypeId = "comanda" | "pedido" | "recibo" | "rifa" | "carne";

export interface BlockSize { id: string; label: string; widthMm: number; heightMm: number; }
export interface FinishingRules { serrilha: "optional" | "required" | "none"; grampo: "optional" | "required" | "none"; canhoto: "required" | "none"; stubRatio: number; }
export interface BlockType { id: BlockTypeId; label: string; description: string; defaultSizeId: string; copies: Array<1 | 2 | 3>; rules: FinishingRules; hasItemsTable: boolean; }
export interface TableRow { id: string; cells: string[]; }
export interface TableConfig {
  columns: Array<{ id: string; label: string; widthPct: number; align: "left" | "center" | "right" }>;
  rows: TableRow[]; rowHeightMm: number; fontSize: number; borderWidth: number; showBorders: boolean; twoColumns: boolean; fillRows: boolean;
}
export interface FooterConfig {
  showName: boolean; showAddress: boolean; showPhone: boolean; showWhatsapp: boolean; showEmail: boolean; showWebsite: boolean; showInstagram: boolean; showFacebook: boolean; showNotes: boolean; message: string; fontSize: number;
}
export interface BlockDoc {
  id: string; name: string; typeId: BlockTypeId; sizeId: string; copies: 1 | 2 | 3;
  serrilha: boolean; grampo: boolean; canhoto: boolean; stubRatio: number; roundedCorners: boolean;
  brandFont?: string; titleFont: string; bodyFont: string;
  /** tamanho da marca em pt */ brandSize?: number;
  /** tamanho-base dos títulos em pt */ titleSize: number;
  /** tamanho dos totais/valores destacados em pt */ totalSize: number;
  /** tamanho-base dos textos do corpo em pt */ bodySize: number;
  title: string; subtitle: string; fields: Record<string, string>; table: TableConfig; footer: FooterConfig; updatedAt: number;
}
