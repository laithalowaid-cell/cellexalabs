// ===========================================================
// Cellexa Labs — Product Catalog data
// Prices are stored in AED.
// ===========================================================

export type Focus =
  | "weightloss"
  | "growth"
  | "recovery"
  | "antiaging"
  | "wellness";

export const FOCUS_META: Record<
  Focus,
  { title: string; short: string; cap: string; blurb: string }
> = {
  weightloss: {
    title: "Metabolic & Incretin",
    short: "Metabolic",
    cap: "var(--color-cap-gold)",
    blurb: "GLP-1, GIP and glucagon-receptor agonists and related metabolic-pathway peptides.",
  },
  growth: {
    title: "Growth-Hormone Axis",
    short: "GH Axis",
    cap: "var(--color-cap-lavender)",
    blurb: "GHRH analogues, GH secretagogues and growth-factor peptides.",
  },
  recovery: {
    title: "Regenerative & Structural",
    short: "Regenerative",
    cap: "var(--color-cap-mint)",
    blurb: "Peptides studied in vitro for extracellular-matrix, angiogenesis and tissue-remodelling pathways.",
  },
  antiaging: {
    title: "Mitochondrial & Cellular",
    short: "Cellular",
    cap: "var(--color-cap-rose)",
    blurb: "Mitochondrial-targeted and cellular-energy peptides and cofactors.",
  },
  wellness: {
    title: "Neuro & Signalling",
    short: "Neuro",
    cap: "var(--color-cap-peach)",
    blurb: "Neuropeptides and signalling peptides studied in vitro for CNS and endocrine-pathway activity.",
  },
};

export type Form = "pen" | "vial";

export interface Variant {
  /** Display label e.g. "20 mg" or "30 mg + 5 mg" */
  label: string;
  /** total mg for sorting / syringe calc hint */
  mg: number;
  price: number; // AED
  /** optional real product photo for this dose (path under /public). Falls back to vector pen if missing. */
  image?: string;
}

export interface Molecular {
  sequence?: string;
  formula?: string;
  weight?: string;
  cas?: string;
}

export interface Product {
  id: string;
  name: string;
  /** subtitle / blend breakdown */
  subtitle?: string;
  form: Form;
  focus: Focus[];
  cap: string; // css color for cap indicator
  /** short chemical-class descriptor, e.g. "Synthetic pentadecapeptide" */
  summary: string;
  /** neutral, research-framed mechanism sentence (intro, meta, og, feed) */
  mechanism: string;
  /** storefront category tag, e.g. "peptides" */
  category: string;
  variants: Variant[];
  molecular: Molecular;
  purity: string;
  featured?: boolean;
  /** optional real product photos (paths under /public). Falls back to vector pen if absent/missing. */
  images?: string[];
}

const CAP = {
  gold: "var(--color-cap-gold)",       // Weight Loss
  navy: "var(--color-cap-lavender)",   // Growth
  bronze: "var(--color-cap-mint)",     // Recovery
  champagne: "var(--color-cap-rose)",  // Longevity
  slate: "var(--color-cap-peach)",     // Wellness
} as const;

export const PRODUCTS: Product[] = [
  // ========================= INJECTION PENS =========================
  {
    id: "retatrutide",
    name: "Retatrutide",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Synthetic triple-agonist peptide (GLP-1 / GIP / glucagon receptors)",
    category: "peptides",
    mechanism:
      "Retatrutide, 99.4% purity, for laboratory research use. A synthetic peptide investigated in vitro and in animal models for agonist activity at GLP-1, GIP, and glucagon receptors.",
    variants: [
      { label: "10 mg", mg: 10, price: 800, image: "/products/retatrutide-10mg.png" },
      { label: "20 mg", mg: 20, price: 950, image: "/products/retatrutide-20mg.png" },
      { label: "30 mg", mg: 30, price: 1050, image: "/products/retatrutide-30mg.png" },
      { label: "40 mg", mg: 40, price: 1150, image: "/products/retatrutide-40mg.png" },
      { label: "50 mg", mg: 50, price: 1250, image: "/products/retatrutide-50mg.png" },
      { label: "60 mg", mg: 60, price: 1350, image: "/products/retatrutide-60mg.png" },
    ],
    molecular: { formula: "C221H342N46O68", weight: "4731.3 g/mol", cas: "2381089-83-2" },
    purity: "99.4%",
    featured: true,
  },
  {
    id: "retatrutide-cagrilintide",
    name: "Retatrutide + Cagrilintide",
    subtitle: "Triple agonist + amylin analogue blend",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Peptide research blend (triple-agonist + amylin analogue)",
    category: "peptides",
    mechanism:
      "Retatrutide + Cagrilintide, 99% purity, for laboratory research use. A research blend of a GLP-1/GIP/glucagon triple-agonist peptide and a long-acting amylin-analogue peptide, investigated in vitro for incretin- and amylin-receptor activity.",
    variants: [
      { label: "30 mg + 5 mg", mg: 35, price: 1250, image: "/products/retatrutide-cagrilintide-30mg-5mg.png" },
      { label: "40 mg + 10 mg", mg: 50, price: 1450, image: "/products/retatrutide-cagrilintide-40mg-10mg.png" },
    ],
    molecular: { cas: "2381089-83-2 / 1415456-99-3" },
    purity: "99%+",
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 No DAC + Ipamorelin",
    subtitle: "GHRH analogue + GH secretagogue blend",
    form: "pen",
    focus: ["growth", "recovery"],
    cap: CAP.navy,
    summary: "Peptide research blend (GHRH analogue + ghrelin-receptor agonist)",
    category: "peptides",
    mechanism:
      "CJC-1295 No DAC + Ipamorelin, 99% purity, for laboratory research use. A research blend of a GHRH-analogue peptide and a selective ghrelin-receptor agonist, studied in vitro for growth-hormone secretagogue activity.",
    variants: [
      { label: "10 mg (5+5)", mg: 10, price: 950, image: "/products/cjc-ipamorelin-10mg.png" },
      { label: "20 mg (10+10)", mg: 20, price: 1100, image: "/products/cjc-ipamorelin-20mg.png" },
      { label: "40 mg (20+20)", mg: 40, price: 1550, image: "/products/cjc-ipamorelin-40mg.png" },
    ],
    molecular: { cas: "863288-34-0 / 170851-70-4" },
    purity: "99%+",
    featured: true,
  },
  {
    id: "cjc-1295",
    name: "CJC-1295 No DAC",
    subtitle: "Modified GRF (1-29)",
    form: "pen",
    focus: ["growth"],
    cap: CAP.navy,
    summary: "Synthetic GHRH-analogue peptide (Modified GRF 1-29)",
    category: "peptides",
    mechanism:
      "CJC-1295 No DAC, 99% purity, for laboratory research use. A synthetic GHRH-analogue peptide investigated in vitro for growth-hormone-releasing-hormone receptor signalling.",
    variants: [
      { label: "10 mg", mg: 10, price: 649, image: "/products/cjc-1295-10mg.png" },
      { label: "20 mg", mg: 20, price: 799, image: "/products/cjc-1295-20mg.png" },
    ],
    molecular: { formula: "C152H252N44O42", weight: "3367.9 g/mol", cas: "863288-34-0" },
    purity: "99%+",
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    form: "pen",
    focus: ["growth"],
    cap: CAP.navy,
    summary: "Synthetic pentapeptide (ghrelin-receptor agonist)",
    category: "peptides",
    mechanism:
      "Ipamorelin, 99% purity, for laboratory research use. A synthetic pentapeptide studied in vitro for selective agonist activity at the ghrelin / GH-secretagogue receptor.",
    variants: [
      { label: "10 mg", mg: 10, price: 749, image: "/products/ipamorelin-10mg.png" },
      { label: "20 mg", mg: 20, price: 849, image: "/products/ipamorelin-20mg.png" },
      { label: "30 mg", mg: 30, price: 949, image: "/products/ipamorelin-30mg.png" },
    ],
    molecular: { sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2", formula: "C38H49N9O5", weight: "711.85 g/mol", cas: "170851-70-4" },
    purity: "99%+",
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    form: "pen",
    focus: ["weightloss", "growth"],
    cap: CAP.gold,
    summary: "Synthetic GHRH-analogue peptide",
    category: "peptides",
    mechanism:
      "Tesamorelin, 99.6% purity, for laboratory research use. A synthetic GHRH-analogue peptide investigated in animal models for growth-hormone-axis signalling.",
    variants: [
      { label: "10 mg", mg: 10, price: 800 },
      { label: "20 mg", mg: 20, price: 900, image: "/products/tesamorelin-20mg.png" },
      { label: "30 mg", mg: 30, price: 1050 },
      { label: "40 mg", mg: 40, price: 1250, image: "/products/tesamorelin-40mg.png" },
    ],
    molecular: { formula: "C221H366N72O67S", weight: "5135.9 g/mol", cas: "218949-48-5" },
    purity: "99.6%",
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    subtitle: "hGH fragment 176-191",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Synthetic hGH fragment (176-191)",
    category: "peptides",
    mechanism:
      "AOD-9604, 99% purity, for laboratory research use. A synthetic fragment of human growth hormone (176-191) investigated in vitro and in animal models for its role in lipid-metabolism pathways.",
    variants: [
      { label: "10 mg", mg: 10, price: 900, image: "/products/aod-9604-10mg.png" },
      { label: "20 mg", mg: 20, price: 1000, image: "/products/aod-9604-20mg.png" },
      { label: "30 mg", mg: 30, price: 1200, image: "/products/aod-9604-30mg.png" },
    ],
    molecular: { formula: "C78H123N23O23S2", weight: "1815.1 g/mol", cas: "221231-10-3" },
    purity: "99%+",
  },
  {
    id: "igf-1-lr3",
    name: "IGF-1 LR3",
    subtitle: "Long R3 Insulin-like Growth Factor-1",
    form: "pen",
    focus: ["growth"],
    cap: CAP.navy,
    summary: "Recombinant IGF-1 analogue (Long R3)",
    category: "peptides",
    mechanism:
      "IGF-1 LR3, 99% purity, for laboratory research use. A recombinant IGF-1 analogue studied in vitro for IGF-1 receptor signalling and cellular proliferation.",
    variants: [{ label: "1 mg", mg: 1, price: 1400, image: "/products/igf-1-lr3-1mg.png" }],
    molecular: { formula: "C400H625N111O115S9", weight: "9117.6 g/mol", cas: "946870-92-4" },
    purity: "99%+",
  },
  {
    id: "klow",
    name: "KLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500 + KPV",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Multi-peptide research blend (GHK-Cu + BPC-157 + TB-500 + KPV)",
    category: "peptides",
    mechanism:
      "KLOW, 99% purity, for laboratory research use. A research blend of GHK-Cu, BPC-157, TB-500, and KPV investigated in vitro for roles in tissue-remodelling and extracellular-matrix pathways.",
    variants: [{ label: "80 mg", mg: 80, price: 1050, image: "/products/klow-80mg.png" }],
    molecular: {},
    purity: "99%+",
    featured: true,
  },
  {
    id: "glow",
    name: "GLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Multi-peptide research blend (GHK-Cu + BPC-157 + TB-500)",
    category: "peptides",
    mechanism:
      "GLOW, 99% purity, for laboratory research use. A research blend of GHK-Cu, BPC-157, and TB-500 studied in vitro for roles in extracellular-matrix and angiogenesis pathways.",
    variants: [{ label: "70 mg", mg: 70, price: 1000, image: "/products/glow-70mg.png" }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Copper Tripeptide-1",
    form: "pen",
    focus: ["recovery", "antiaging"],
    cap: CAP.bronze,
    summary: "Copper-binding tripeptide",
    category: "peptides",
    mechanism:
      "GHK-Cu, 99.8% purity, for laboratory research use. A copper-binding tripeptide investigated in vitro for its role in collagen and extracellular-matrix gene expression.",
    variants: [
      { label: "50 mg", mg: 50, price: 700, image: "/products/ghk-cu-50mg.png" },
      { label: "100 mg", mg: 100, price: 800, image: "/products/ghk-cu-100mg.png" },
    ],
    molecular: { sequence: "Gly-His-Lys (Cu²⁺)", formula: "C14H24N6O4·Cu", weight: "403.9 g/mol", cas: "49557-75-7" },
    purity: "99.8%",
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    subtitle: "Body Protection Compound-157",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Synthetic pentadecapeptide",
    category: "peptides",
    mechanism:
      "BPC-157, 99.3% purity, for laboratory research use. A synthetic pentadecapeptide investigated in vitro and in animal models for its role in angiogenesis and fibroblast migration.",
    variants: [{ label: "10 mg", mg: 10, price: 649, image: "/products/bpc-157-10mg.png" }],
    molecular: { sequence: "GEPPPGKPADDAGLV", formula: "C62H98N16O22", weight: "1419.5 g/mol", cas: "137525-51-0" },
    purity: "99.3%",
    featured: true,
  },
  {
    id: "nad-plus",
    name: "NAD+",
    subtitle: "Nicotinamide Adenine Dinucleotide",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Pyridine-dinucleotide coenzyme",
    category: "research compound",
    mechanism:
      "NAD+, 99% purity, for laboratory research use. A pyridine-dinucleotide coenzyme studied in vitro for its role in redox reactions and sirtuin/PARP-dependent pathways.",
    variants: [
      { label: "500 mg", mg: 500, price: 750, image: "/products/nad-plus-500mg.png" },
      { label: "1000 mg", mg: 1000, price: 900, image: "/products/nad-plus-1000mg.png" },
    ],
    molecular: { formula: "C21H27N7O14P2", weight: "663.43 g/mol", cas: "53-84-9" },
    purity: "99%+",
  },
  {
    id: "wolverine",
    name: "Wolverine Stack",
    subtitle: "BPC-157 + TB-500",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Peptide research blend (BPC-157 + TB-500)",
    category: "peptides",
    mechanism:
      "Wolverine Stack, 99% purity, for laboratory research use. A research blend of BPC-157 and TB-500 peptides investigated in vitro for roles in angiogenesis and actin-regulation pathways.",
    variants: [
      { label: "10 mg", mg: 10, price: 700, image: "/products/wolverine-10mg.png" },
      { label: "20 mg", mg: 20, price: 800, image: "/products/wolverine-20mg.png" },
      { label: "40 mg", mg: 40, price: 1200 },
    ],
    molecular: { cas: "137525-51-0 / 77591-33-4" },
    purity: "99%+",
  },
  {
    id: "pt-141",
    name: "PT-141",
    subtitle: "Bremelanotide",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Cyclic heptapeptide (melanocortin agonist)",
    category: "peptides",
    mechanism:
      "PT-141 (Bremelanotide), 99% purity, for laboratory research use. A cyclic heptapeptide studied in animal models for its role in melanocortin-receptor signalling.",
    variants: [
      { label: "10 mg", mg: 10, price: 649, image: "/products/pt-141-10mg.png" },
      { label: "40 mg", mg: 40, price: 1049, image: "/products/pt-141-40mg.png" },
    ],
    molecular: { sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH", formula: "C50H68N14O10", weight: "1025.2 g/mol", cas: "189691-06-3" },
    purity: "99%+",
  },
  {
    id: "kisspeptin",
    name: "Kisspeptin-10",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Synthetic decapeptide",
    category: "peptides",
    mechanism:
      "Kisspeptin-10, 99% purity, for laboratory research use. A synthetic decapeptide investigated in vitro and in animal models for KISS1R receptor signalling and GnRH regulation.",
    variants: [
      { label: "10 mg", mg: 10, price: 800, image: "/products/kisspeptin-10mg.png" },
      { label: "20 mg", mg: 20, price: 950, image: "/products/kisspeptin-20mg.png" },
    ],
    molecular: { sequence: "YNWNSFGLRF-NH2", formula: "C63H83N17O14", weight: "1302.4 g/mol", cas: "374675-21-5" },
    purity: "99%+",
  },
  {
    id: "slu-pp-332",
    name: "SLU-PP-332",
    subtitle: "ERR pan-agonist",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Synthetic small-molecule ERR agonist",
    category: "research compound",
    mechanism:
      "SLU-PP-332, 99% purity, for laboratory research use. A synthetic small molecule investigated in vitro for pan-agonist activity at estrogen-related receptors (ERR-alpha / beta / gamma).",
    variants: [
      { label: "10 mg", mg: 10, price: 800 },
      { label: "20 mg", mg: 20, price: 1000 },
    ],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "mots-c",
    name: "MOTS-C",
    subtitle: "Mitochondrial-derived peptide",
    form: "pen",
    focus: ["antiaging", "weightloss"],
    cap: CAP.champagne,
    summary: "Mitochondrial-derived peptide",
    category: "peptides",
    mechanism:
      "MOTS-C, 99.9% purity, for laboratory research use. A mitochondrial-derived peptide studied in vitro and in animal models for its role in AMPK-pathway and metabolic signalling.",
    variants: [
      { label: "10 mg", mg: 10, price: 800 },
      { label: "20 mg", mg: 20, price: 950, image: "/products/mots-c-20mg.png" },
      { label: "40 mg", mg: 40, price: 1100, image: "/products/mots-c-40mg.png" },
      { label: "80 mg", mg: 80, price: 1400 },
    ],
    molecular: { sequence: "MRWQEMGYIFYPRKLR", formula: "C101H152N28O22S2", weight: "2174.6 g/mol", cas: "1627580-64-6" },
    purity: "99.9%",
    featured: true,
  },
  {
    id: "selank",
    name: "Selank",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Synthetic heptapeptide (tuftsin analogue)",
    category: "peptides",
    mechanism:
      "Selank, 99% purity, for laboratory research use. A synthetic heptapeptide analogue of tuftsin investigated in animal models for GABAergic and BDNF-related signalling.",
    variants: [
      { label: "10 mg", mg: 10, price: 750, image: "/products/selank-10mg.png" },
      { label: "20 mg", mg: 20, price: 950 },
    ],
    molecular: { sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro", formula: "C33H57N11O9", weight: "751.9 g/mol", cas: "129954-34-3" },
    purity: "99%+",
  },
  {
    id: "dsip",
    name: "DSIP",
    subtitle: "Delta Sleep-Inducing Peptide",
    form: "pen",
    focus: ["wellness", "recovery"],
    cap: CAP.slate,
    summary: "Nonapeptide (delta sleep-inducing peptide)",
    category: "peptides",
    mechanism:
      "DSIP, 99% purity, for laboratory research use. A naturally occurring nonapeptide investigated in animal models for sleep-architecture and neuroendocrine signalling.",
    variants: [
      { label: "5 mg", mg: 5, price: 800 },
      { label: "10 mg", mg: 10, price: 900, image: "/products/dsip-10mg.png" },
    ],
    molecular: { sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu", formula: "C35H48N10O15", weight: "848.8 g/mol", cas: "62568-57-4" },
    purity: "99%+",
  },
  {
    id: "semax",
    name: "Semax",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Synthetic ACTH(4-10)-analogue heptapeptide",
    category: "peptides",
    mechanism:
      "Semax, 99% purity, for laboratory research use. A synthetic ACTH(4-10)-analogue heptapeptide studied in vitro and in animal models for BDNF expression and neurotrophic signalling.",
    variants: [
      { label: "10 mg", mg: 10, price: 750, image: "/products/semax-10mg.png" },
      { label: "20 mg", mg: 20, price: 950 },
    ],
    molecular: { sequence: "Met-Glu-His-Phe-Pro-Gly-Pro", formula: "C37H51N9O10S", weight: "813.9 g/mol", cas: "80714-61-0" },
    purity: "99%+",
  },

  // ---- Added Nov 2026 price list ----
  {
    id: "cagrilintide",
    name: "Cagrilintide",
    subtitle: "Long-acting amylin analogue",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Long-acting amylin-analogue peptide",
    category: "peptides",
    mechanism:
      "Cagrilintide, 99% purity, for laboratory research use. A long-acting acylated amylin-analogue peptide investigated in vitro and in animal models for amylin- and calcitonin-receptor activity.",
    variants: [{ label: "10 mg", mg: 10, price: 1000 }],
    molecular: { cas: "1415456-99-3" },
    purity: "99%+",
  },
  {
    id: "5-amino-1mq",
    name: "5-Amino-1MQ",
    subtitle: "NNMT inhibitor",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Small-molecule NNMT inhibitor",
    category: "research compound",
    mechanism:
      "5-Amino-1MQ, 99% purity, for laboratory research use. A small-molecule methylquinolinium compound investigated in vitro and in animal models for inhibition of nicotinamide N-methyltransferase (NNMT).",
    variants: [{ label: "100 mg", mg: 100, price: 1050 }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "hgh-frag",
    name: "HGH Fragment 176-191",
    subtitle: "HGH Frag",
    form: "pen",
    focus: ["weightloss", "growth"],
    cap: CAP.gold,
    summary: "Synthetic hGH fragment (176-191)",
    category: "peptides",
    mechanism:
      "HGH Fragment 176-191, 99% purity, for laboratory research use. A synthetic C-terminal fragment of human growth hormone investigated in vitro and in animal models for lipolytic-pathway signalling.",
    variants: [{ label: "10 mg", mg: 10, price: 1000 }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "ahk-cu",
    name: "AHK-Cu",
    subtitle: "Copper Tripeptide-3",
    form: "pen",
    focus: ["recovery", "antiaging"],
    cap: CAP.bronze,
    summary: "Copper-binding tripeptide",
    category: "peptides",
    mechanism:
      "AHK-Cu, 99% purity, for laboratory research use. A copper-binding tripeptide investigated in vitro for its role in dermal-papilla and extracellular-matrix signalling.",
    variants: [{ label: "100 mg", mg: 100, price: 1000 }],
    molecular: { sequence: "Ala-His-Lys (Cu²⁺)" },
    purity: "99%+",
  },
  {
    id: "matrixyl",
    name: "Matrixyl",
    subtitle: "Palmitoyl Pentapeptide-4",
    form: "pen",
    focus: ["antiaging", "recovery"],
    cap: CAP.champagne,
    summary: "Palmitoylated pentapeptide (matrikine)",
    category: "peptides",
    mechanism:
      "Matrixyl (Palmitoyl Pentapeptide-4), 99% purity, for laboratory research use. A palmitoylated matrikine pentapeptide studied in vitro for collagen and extracellular-matrix synthesis.",
    variants: [{ label: "10 mg", mg: 10, price: 900 }],
    molecular: { sequence: "Pal-Lys-Thr-Thr-Lys-Ser", cas: "214047-00-4" },
    purity: "99%+",
  },
  {
    id: "glutathione",
    name: "Glutathione",
    subtitle: "Reduced L-Glutathione",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Tripeptide antioxidant (γ-Glu-Cys-Gly)",
    category: "research compound",
    mechanism:
      "Glutathione, 99% purity, for laboratory research use. An endogenous tripeptide thiol studied in vitro for its role in cellular redox balance and detoxification pathways.",
    variants: [{ label: "1500 mg", mg: 1500, price: 900 }],
    molecular: { sequence: "γ-Glu-Cys-Gly", formula: "C10H17N3O6S", weight: "307.3 g/mol", cas: "70-18-8" },
    purity: "99%+",
  },
  {
    id: "epitalon",
    name: "Epitalon",
    subtitle: "Epithalon tetrapeptide",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Synthetic tetrapeptide",
    category: "peptides",
    mechanism:
      "Epitalon, 99% purity, for laboratory research use. A synthetic tetrapeptide investigated in vitro and in animal models for telomerase activity and pineal-gland signalling.",
    variants: [
      { label: "25 mg", mg: 25, price: 900 },
      { label: "50 mg", mg: 50, price: 1000 },
    ],
    molecular: { sequence: "Ala-Glu-Asp-Gly", formula: "C14H22N4O9", weight: "390.3 g/mol", cas: "307297-39-8" },
    purity: "99%+",
  },
  {
    id: "pinealon",
    name: "Pinealon",
    form: "pen",
    focus: ["wellness", "antiaging"],
    cap: CAP.slate,
    summary: "Synthetic tripeptide",
    category: "peptides",
    mechanism:
      "Pinealon, 99% purity, for laboratory research use. A synthetic short tripeptide investigated in vitro and in animal models for neuroprotective and gene-expression signalling.",
    variants: [{ label: "20 mg", mg: 20, price: 1000 }],
    molecular: { sequence: "Glu-Asp-Arg" },
    purity: "99%+",
  },
  {
    id: "ara-290",
    name: "ARA-290",
    subtitle: "Cibinetide",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Synthetic EPO-derived peptide",
    category: "peptides",
    mechanism:
      "ARA-290 (Cibinetide), 99% purity, for laboratory research use. A synthetic peptide derived from erythropoietin, investigated in vitro and in animal models for innate-repair-receptor signalling.",
    variants: [{ label: "10 mg", mg: 10, price: 900 }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    subtitle: "Tα1",
    form: "pen",
    focus: ["recovery", "wellness"],
    cap: CAP.bronze,
    summary: "Synthetic 28-amino-acid thymic peptide",
    category: "peptides",
    mechanism:
      "Thymosin Alpha-1, 99% purity, for laboratory research use. A synthetic thymic peptide investigated in vitro for its role in T-cell and immune-signalling pathways.",
    variants: [{ label: "10 mg", mg: 10, price: 1000 }],
    molecular: { cas: "62304-98-7" },
    purity: "99%+",
  },
  {
    id: "ss-31",
    name: "SS-31",
    subtitle: "Elamipretide",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Mitochondria-targeted tetrapeptide",
    category: "peptides",
    mechanism:
      "SS-31 (Elamipretide), 99% purity, for laboratory research use. A mitochondria-targeted tetrapeptide studied in vitro for its interaction with cardiolipin and mitochondrial bioenergetics.",
    variants: [{ label: "50 mg", mg: 50, price: 1200 }],
    molecular: { sequence: "D-Arg-Dmt-Lys-Phe-NH2", cas: "736992-21-5" },
    purity: "99%+",
  },
  {
    id: "kpv",
    name: "KPV",
    subtitle: "α-MSH C-terminal tripeptide",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Synthetic tripeptide (α-MSH fragment)",
    category: "peptides",
    mechanism:
      "KPV, 99% purity, for laboratory research use. A C-terminal tripeptide fragment of α-MSH investigated in vitro for its role in inflammatory-signalling pathways.",
    variants: [{ label: "10 mg", mg: 10, price: 650 }],
    molecular: { sequence: "Lys-Pro-Val" },
    purity: "99%+",
  },
  {
    id: "vip",
    name: "VIP",
    subtitle: "Vasoactive Intestinal Peptide",
    form: "pen",
    focus: ["recovery", "wellness"],
    cap: CAP.bronze,
    summary: "28-amino-acid neuropeptide",
    category: "peptides",
    mechanism:
      "VIP (Vasoactive Intestinal Peptide), 99% purity, for laboratory research use. A 28-amino-acid neuropeptide studied in vitro for VPAC-receptor signalling.",
    variants: [{ label: "10 mg", mg: 10, price: 900 }],
    molecular: { cas: "40077-57-4" },
    purity: "99%+",
  },
  {
    id: "dihexa",
    name: "Dihexa",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Angiotensin IV-derived small peptide",
    category: "research compound",
    mechanism:
      "Dihexa, 99% purity, for laboratory research use. An angiotensin IV-derived compound investigated in vitro and in animal models for HGF / c-Met signalling and synaptogenesis.",
    variants: [{ label: "10 mg", mg: 10, price: 1000 }],
    molecular: { cas: "1401708-83-5" },
    purity: "99%+",
  },
  {
    id: "snap-8",
    name: "Snap-8",
    subtitle: "Acetyl Octapeptide-3",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Synthetic octapeptide (SNAP-25 analogue)",
    category: "peptides",
    mechanism:
      "Snap-8 (Acetyl Octapeptide-3), 99% purity, for laboratory research use. A synthetic octapeptide modelled on the SNAP-25 N-terminus, studied in vitro for SNARE-complex modulation.",
    variants: [{ label: "10 mg", mg: 10, price: 1000 }],
    molecular: { sequence: "Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2" },
    purity: "99%+",
  },

  // ============================== VIALS ==============================
  {
    id: "retatrutide-vial",
    name: "Retatrutide",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Synthetic triple-agonist peptide (GLP-1 / GIP / glucagon receptors)",
    category: "peptides",
    mechanism:
      "Retatrutide, 99.4% purity, for laboratory research use. A synthetic peptide investigated in vitro and in animal models for agonist activity at GLP-1, GIP, and glucagon receptors.",
    variants: [
      { label: "60 mg", mg: 60, price: 1079, image: "/products/retatrutide-vial-60mg.png" },
    ],
    molecular: { formula: "C221H342N46O68", weight: "4731.3 g/mol", cas: "2381089-83-2" },
    purity: "99.4%",
  },
  {
    id: "tesamorelin-vial",
    name: "Tesamorelin",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["weightloss", "growth"],
    cap: CAP.gold,
    summary: "Synthetic GHRH-analogue peptide",
    category: "peptides",
    mechanism:
      "Tesamorelin, 99.6% purity, for laboratory research use. A synthetic GHRH-analogue peptide investigated in animal models for growth-hormone-axis signalling.",
    variants: [{ label: "20 mg", mg: 20, price: 550, image: "/products/tesamorelin-vial-20mg.png" }],
    molecular: { formula: "C221H366N72O67S", weight: "5135.9 g/mol", cas: "218949-48-5" },
    purity: "99.6%",
  },
  {
    id: "cjc-ipamorelin-vial",
    name: "CJC-1295 + Ipamorelin Blend",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["growth", "recovery"],
    cap: CAP.navy,
    summary: "Peptide research blend (GHRH analogue + ghrelin-receptor agonist)",
    category: "peptides",
    mechanism:
      "CJC-1295 + Ipamorelin, 99% purity, for laboratory research use. A research blend of a GHRH-analogue peptide and a selective ghrelin-receptor agonist, studied in vitro for growth-hormone secretagogue activity.",
    variants: [{ label: "20 mg", mg: 20, price: 550, image: "/products/cjc-ipamorelin-vial-20mg.png" }],
    molecular: { cas: "863288-34-0 / 170851-70-4" },
    purity: "99%+",
  },
  {
    id: "mots-c-vial",
    name: "MOTS-C",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["antiaging", "weightloss"],
    cap: CAP.champagne,
    summary: "Mitochondrial-derived peptide",
    category: "peptides",
    mechanism:
      "MOTS-C, 99.9% purity, for laboratory research use. A mitochondrial-derived peptide studied in vitro and in animal models for its role in AMPK-pathway and metabolic signalling.",
    variants: [{ label: "40 mg", mg: 40, price: 625, image: "/products/mots-c-vial-40mg.png" }],
    molecular: { sequence: "MRWQEMGYIFYPRKLR", formula: "C101H152N28O22S2", weight: "2174.6 g/mol", cas: "1627580-64-6" },
    purity: "99.9%",
  },
  {
    id: "ghk-cu-vial",
    name: "GHK-Cu",
    subtitle: "Copper Tripeptide-1 — vial",
    form: "vial",
    focus: ["recovery", "antiaging"],
    cap: CAP.bronze,
    summary: "Copper-binding tripeptide",
    category: "peptides",
    mechanism:
      "GHK-Cu, 99.8% purity, for laboratory research use. A copper-binding tripeptide investigated in vitro for its role in collagen and extracellular-matrix gene expression.",
    variants: [{ label: "100 mg", mg: 100, price: 500, image: "/products/ghk-cu-vial-100mg.png" }],
    molecular: { sequence: "Gly-His-Lys (Cu²⁺)", formula: "C14H24N6O4·Cu", weight: "403.9 g/mol", cas: "49557-75-7" },
    purity: "99.8%",
  },
  {
    id: "wolverine-vial",
    name: "Wolverine Stack",
    subtitle: "BPC-157 + TB-500 — vial",
    form: "vial",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Peptide research blend (BPC-157 + TB-500)",
    category: "peptides",
    mechanism:
      "Wolverine Stack, 99% purity, for laboratory research use. A research blend of BPC-157 and TB-500 peptides investigated in vitro for roles in angiogenesis and actin-regulation pathways.",
    variants: [{ label: "20 mg", mg: 20, price: 550, image: "/products/wolverine-vial-20mg.png" }],
    molecular: { cas: "137525-51-0 / 77591-33-4" },
    purity: "99%+",
  },
  {
    id: "glow-vial",
    name: "GLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500 — vial",
    form: "vial",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Multi-peptide research blend (GHK-Cu + BPC-157 + TB-500)",
    category: "peptides",
    mechanism:
      "GLOW, 99% purity, for laboratory research use. A research blend of GHK-Cu, BPC-157, and TB-500 studied in vitro for roles in extracellular-matrix and angiogenesis pathways.",
    variants: [{ label: "70 mg", mg: 70, price: 550, image: "/products/glow-vial-70mg.png" }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "klow-vial",
    name: "KLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500 + KPV — vial",
    form: "vial",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Multi-peptide research blend (GHK-Cu + BPC-157 + TB-500 + KPV)",
    category: "peptides",
    mechanism:
      "KLOW, 99% purity, for laboratory research use. A research blend of GHK-Cu, BPC-157, TB-500, and KPV investigated in vitro for roles in tissue-remodelling and extracellular-matrix pathways.",
    variants: [{ label: "80 mg", mg: 80, price: 600, image: "/products/klow-vial-80mg.png" }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "pt-141-vial",
    name: "PT-141",
    subtitle: "Bremelanotide — lyophilised powder, vial",
    form: "vial",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Cyclic heptapeptide (melanocortin agonist)",
    category: "peptides",
    mechanism:
      "PT-141 (Bremelanotide), 99% purity, for laboratory research use. A cyclic heptapeptide studied in animal models for its role in melanocortin-receptor signalling.",
    variants: [{ label: "10 mg", mg: 10, price: 550, image: "/products/pt-141-vial-10mg.png" }],
    molecular: { sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH", formula: "C50H68N14O10", weight: "1025.2 g/mol", cas: "189691-06-3" },
    purity: "99%+",
  },
];


export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function fromPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export function formatPrice(aed: number): string {
  return `${aed.toLocaleString("en-US")} AED`;
}
