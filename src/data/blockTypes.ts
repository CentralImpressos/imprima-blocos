import type { BlockDoc, BlockType, BlockTypeId, TableConfig } from "@/types/block";

export const BLOCK_TYPES: BlockType[] = [
  {
    id: "comanda",
    label: "Comanda",
    description: "Tabela de itens com preenchimento manual",
    defaultSizeId: "14x20",
    copies: [1, 2, 3],
    rules: { serrilha: "optional", grampo: "optional", canhoto: "none", stubRatio: 0 },
    hasItemsTable: true,
  },
  {
    id: "pedido",
    label: "Pedido",
    description: "Qtd / Descrição / Observação com linhas em branco",
    defaultSizeId: "14x20",
    copies: [1, 2, 3],
    rules: { serrilha: "optional", grampo: "optional", canhoto: "none", stubRatio: 0 },
    hasItemsTable: true,
  },
  {
    id: "recibo",
    label: "Recibo",
    description: "Canhoto, serrilha e grampo obrigatórios",
    defaultSizeId: "20x9",
    copies: [1, 2, 3],
    rules: { serrilha: "required", grampo: "required", canhoto: "required", stubRatio: 0.22 },
    hasItemsTable: false,
  },
  {
    id: "rifa",
    label: "Rifa",
    description: "Numeração, prêmio e canhoto destacável",
    defaultSizeId: "20x7",
    copies: [1, 2, 3],
    rules: { serrilha: "required", grampo: "required", canhoto: "required", stubRatio: 0.22 },
    hasItemsTable: false,
  },
  {
    id: "carne",
    label: "Carnê",
    description: "Parcela, vencimento, valor e canhoto",
    defaultSizeId: "20x9",
    copies: [1, 2, 3],
    rules: { serrilha: "required", grampo: "required", canhoto: "required", stubRatio: 0.22 },
    hasItemsTable: false,
  },
];

export const getType = (id: BlockTypeId): BlockType =>
  BLOCK_TYPES.find((t) => t.id === id) ?? BLOCK_TYPES[0]!;

// Conteúdo demonstrativo propositalmente genérico: ajuda a visualizar uma
// comanda real sem amarrar o template a um cliente ou estabelecimento.
const COMANDA_ITEMS = [
  "Hambúrguer",
  "Sanduíche",
  "Porção",
  "Prato",
  "Massa",
  "Salada",
  "Sobremesa",
  "Cerveja 600ml",
  "Cerveja long",
  "Drink",
  "Vinho",
  "Refri 290ml",
  "Refri lata",
  "Refri 600ml",
  "Refri 1 lt",
  "Suco",
  "Energético",
  "Dose",
  "Água Mineral",
];

const rid = () => crypto.randomUUID();

function comandaTable(): TableConfig {
  return {
    columns: [
      { id: "qtd", label: "QTD", widthPct: 22, align: "center" },
      { id: "desc", label: "DESCRIÇÃO", widthPct: 78, align: "left" },
    ],
    rows: COMANDA_ITEMS.map((i) => ({ id: rid(), cells: ["", i] })),
    rowHeightMm: 6,
    fontSize: 7.5,
    borderWidth: 0.3,
    showBorders: true,
    twoColumns: true,
    fillRows: true,
  };
}

function pedidoTable(): TableConfig {
  return {
    columns: [
      { id: "qtd", label: "QTD", widthPct: 15, align: "center" },
      { id: "desc", label: "DESCRIÇÃO", widthPct: 55, align: "left" },
      { id: "obs", label: "OBSERVAÇÃO", widthPct: 30, align: "left" },
    ],
    rows: Array.from({ length: 14 }, () => ({ id: rid(), cells: ["", "", ""] })),
    rowHeightMm: 7,
    fontSize: 8,
    borderWidth: 0.3,
    showBorders: true,
    twoColumns: false,
    fillRows: true,
  };
}

export function emptyTable(): TableConfig {
  return {
    columns: [{ id: "c1", label: "ITEM", widthPct: 100, align: "left" }],
    rows: [],
    rowHeightMm: 6,
    fontSize: 8,
    borderWidth: 0.3,
    showBorders: true,
    fillRows: true,
    twoColumns: false,
  };
}

export function applyTypeRules(doc: BlockDoc): BlockDoc {
  const t = getType(doc.typeId);
  return {
    ...doc,
    roundedCorners: doc.roundedCorners ?? false,
    serrilha: t.rules.serrilha === "required" ? true : t.rules.serrilha === "none" ? false : doc.serrilha,
    grampo: t.rules.grampo === "required" ? true : t.rules.grampo === "none" ? false : doc.grampo,
    canhoto: t.rules.canhoto === "required",
    stubRatio: t.rules.canhoto === "required" ? doc.stubRatio || t.rules.stubRatio : 0,
  };
}

export function createBlockDoc(typeId: BlockTypeId, name?: string): BlockDoc {
  const t = getType(typeId);
  const base: BlockDoc = {
    id: rid(),
    name: name || `${t.label} sem título`,
    typeId,
    sizeId: t.defaultSizeId,
    copies: 2,
    serrilha: false,
    grampo: false,
    canhoto: false,
    stubRatio: t.rules.stubRatio,
    roundedCorners: false,
    title: t.label.toUpperCase(),
    subtitle: "",
    fields: defaultFields(typeId),
    table:
      typeId === "comanda" ? comandaTable() : typeId === "pedido" ? pedidoTable() : emptyTable(),
    footer: {
      showName: true,
      showAddress: true,
      showPhone: true,
      showWhatsapp: true,
      showEmail: false,
      showWebsite: true,
      showInstagram: true,
      showFacebook: false,
      showNotes: false,
      message: "Obrigado pela preferência!",
      fontSize: 6,
    },
    updatedAt: Date.now(),
  };
  return applyTypeRules(base);
}

export function defaultFields(typeId: BlockTypeId): Record<string, string> {
  switch (typeId) {
    case "comanda":
      return { mesa: "MESA", atendente: "ATENDENTE", totalLabel: "TOTAL R$" };
    case "pedido":
      return { mesa: "MESA", atendente: "ATENDENTE", totalLabel: "TOTAL R$", obsLinhas: "3" };
    case "recibo":
      return { numero: "0001", valor: "", referente: "" };
    case "rifa":
      return {
        numero: "0001",
        premio: "Descreva o prêmio",
        sorteio: "",
        valorCota: "",
        promocao: "",
      };
    case "carne":
      return { numero: "0001", parcela: "01/12", vencimento: "", valor: "", cliente: "" };
    default:
      return {};
  }
}
