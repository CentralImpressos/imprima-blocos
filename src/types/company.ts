export interface Company {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  address: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  notes: string;
  footerText: string;
  /** data URL (png/jpg/svg) */
  logo: string | null;
  logoScale: number; // 0.2 - 2
  logoOffsetX: number; // mm
  logoOffsetY: number; // mm
}

export const emptyCompany = (): Company => ({
  id: crypto.randomUUID(),
  name: "",
  tradeName: "",
  cnpj: "",
  address: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  instagram: "",
  facebook: "",
  notes: "",
  footerText: "Obrigado pela preferência!",
  logo: null,
  logoScale: 1,
  logoOffsetX: 0,
  logoOffsetY: 0,
});

export function fullAddress(c: Company): string {
  const l1 = [c.address, c.number].filter(Boolean).join(", ");
  const l2 = [c.complement, c.district].filter(Boolean).join(" - ");
  const l3 = [c.city, c.state].filter(Boolean).join("/");
  return [l1, l2, [l3, c.zip].filter(Boolean).join(" ")].filter(Boolean).join(" • ");
}
