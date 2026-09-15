export interface ProductionSettings {
  bleedMm: number;
  safeMm: number;
  showBleed: boolean;
  showSafe: boolean;
  showCrop: boolean;
  showSerrilha: boolean;
  showGrampo: boolean;
  /** cópias do bloco por folha de produção (imposição futura) */
  quantity: number;
}

export const defaultProduction = (): ProductionSettings => ({
  bleedMm: 2,
  safeMm: 5,
  showBleed: true,
  showSafe: false,
  showCrop: false,
  showSerrilha: true,
  showGrampo: true,
  quantity: 1,
});
