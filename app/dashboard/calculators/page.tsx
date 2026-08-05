"use client";

import { useState } from "react";
import { Activity, ArrowRight, ArrowLeft } from "lucide-react";

const AREA_SCALE = [
  { v: 0, label: "0%" },
  { v: 1, label: "<10%" },
  { v: 2, label: "10–29%" },
  { v: 3, label: "30–49%" },
  { v: 4, label: "50–69%" },
  { v: 5, label: "70–89%" },
  { v: 6, label: "90–100%" },
];

function NumberField({ label, value, onChange, min = 0, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max: number; step?: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-crimson font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary-color)]"
      />
    </div>
  );
}

function ScoreResult({ score, max, bands }: { score: number; max: number; bands: { upTo: number; label: string; color: string }[] }) {
  const band = bands.find((b) => score <= b.upTo) || bands[bands.length - 1];
  return (
    <div className="card !bg-gray-50 flex items-center justify-between mt-4">
      <div>
        <p className="text-xs text-muted">Score</p>
        <p className="text-3xl font-bold text-crimson">{score.toFixed(1)} <span className="text-sm text-muted font-normal">/ {max}</span></p>
      </div>
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${band.color}`}>{band.label}</span>
    </div>
  );
}

// ---------------- PASI ----------------
function PASICalculator() {
  const regions = ["Head", "Upper Limbs", "Trunk", "Lower Limbs"] as const;
  const weights = [0.1, 0.2, 0.3, 0.4];
  const [scores, setScores] = useState(regions.map(() => ({ e: 0, i: 0, d: 0, a: 0 })));

  const update = (idx: number, key: "e" | "i" | "d" | "a", val: number) => {
    setScores((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  };

  const total = scores.reduce((sum, r, idx) => sum + (r.e + r.i + r.d) * r.a * weights[idx], 0);

  return (
    <div className="space-y-6">
      {regions.map((region, idx) => (
        <div key={region} className="card">
          <h4 className="font-bold text-sm mb-3">{region} <span className="text-muted font-normal">(weight {weights[idx]})</span></h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <NumberField label="Erythema (0-4)" value={scores[idx].e} max={4} onChange={(v) => update(idx, "e", v)} />
            <NumberField label="Induration (0-4)" value={scores[idx].i} max={4} onChange={(v) => update(idx, "i", v)} />
            <NumberField label="Desquamation (0-4)" value={scores[idx].d} max={4} onChange={(v) => update(idx, "d", v)} />
            <NumberField label="Area score (0-6)" value={scores[idx].a} max={6} onChange={(v) => update(idx, "a", v)} />
          </div>
          <p className="text-[11px] text-muted mt-2">Area: {AREA_SCALE.map((s) => `${s.v}=${s.label}`).join(", ")}</p>
        </div>
      ))}
      <ScoreResult
        score={total}
        max={72}
        bands={[
          { upTo: 10, label: "Mild", color: "bg-green-100 text-green-700" },
          { upTo: 20, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: 72, label: "Severe", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- EASI ----------------
function EASICalculator() {
  const regions = ["Head/Neck", "Upper Limbs", "Trunk", "Lower Limbs"] as const;
  const weights = [0.1, 0.2, 0.3, 0.4];
  const [scores, setScores] = useState(regions.map(() => ({ e: 0, i: 0, ex: 0, l: 0, a: 0 })));

  const update = (idx: number, key: "e" | "i" | "ex" | "l" | "a", val: number) => {
    setScores((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  };

  const total = scores.reduce((sum, r, idx) => sum + (r.e + r.i + r.ex + r.l) * r.a * weights[idx], 0);

  return (
    <div className="space-y-6">
      {regions.map((region, idx) => (
        <div key={region} className="card">
          <h4 className="font-bold text-sm mb-3">{region} <span className="text-muted font-normal">(weight {weights[idx]})</span></h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <NumberField label="Erythema (0-3)" value={scores[idx].e} max={3} onChange={(v) => update(idx, "e", v)} />
            <NumberField label="Induration/Papulation (0-3)" value={scores[idx].i} max={3} onChange={(v) => update(idx, "i", v)} />
            <NumberField label="Excoriation (0-3)" value={scores[idx].ex} max={3} onChange={(v) => update(idx, "ex", v)} />
            <NumberField label="Lichenification (0-3)" value={scores[idx].l} max={3} onChange={(v) => update(idx, "l", v)} />
            <NumberField label="Area score (0-6)" value={scores[idx].a} max={6} onChange={(v) => update(idx, "a", v)} />
          </div>
        </div>
      ))}
      <ScoreResult
        score={total}
        max={72}
        bands={[
          { upTo: 1, label: "Almost Clear", color: "bg-green-100 text-green-700" },
          { upTo: 7, label: "Mild", color: "bg-lime-100 text-lime-700" },
          { upTo: 21, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: 50, label: "Severe", color: "bg-orange-100 text-orange-700" },
          { upTo: 72, label: "Very Severe", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- SCORAD ----------------
function SCORADCalculator() {
  const [extent, setExtent] = useState(0); // A: % BSA 0-100
  const [intensity, setIntensity] = useState({ erythema: 0, edema: 0, oozing: 0, excoriation: 0, lichenification: 0, dryness: 0 });
  const [pruritus, setPruritus] = useState(0);
  const [sleepLoss, setSleepLoss] = useState(0);

  const B = Object.values(intensity).reduce((a, b) => a + b, 0);
  const C = pruritus + sleepLoss;
  const total = extent / 5 + (7 * B) / 2 + C;

  return (
    <div className="space-y-6">
      <div className="card">
        <h4 className="font-bold text-sm mb-3">A — Extent (% Body Surface Area affected)</h4>
        <NumberField label="Affected area" value={extent} max={100} onChange={setExtent} />
      </div>
      <div className="card">
        <h4 className="font-bold text-sm mb-3">B — Intensity (0-3 each)</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {(Object.keys(intensity) as (keyof typeof intensity)[]).map((key) => (
            <NumberField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={intensity[key]}
              max={3}
              onChange={(v) => setIntensity((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
        </div>
      </div>
      <div className="card">
        <h4 className="font-bold text-sm mb-3">C — Subjective Symptoms (0-10 each, VAS)</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField label="Pruritus (itch)" value={pruritus} max={10} onChange={setPruritus} />
          <NumberField label="Sleep loss" value={sleepLoss} max={10} onChange={setSleepLoss} />
        </div>
      </div>
      <ScoreResult
        score={total}
        max={103}
        bands={[
          { upTo: 25, label: "Mild", color: "bg-green-100 text-green-700" },
          { upTo: 50, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: 103, label: "Severe", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- DLQI ----------------
function DLQICalculator() {
  const questions = [
    "Over the last week, how itchy, sore, painful or stinging has your skin been?",
    "Over the last week, how embarrassed or self-conscious have you been because of your skin?",
    "Over the last week, how much has your skin interfered with shopping, home or garden work?",
    "Over the last week, how much has your skin influenced the clothes you wear?",
    "Over the last week, how much has your skin affected any social or leisure activities?",
    "Over the last week, how much has your skin made it difficult for you to do sport?",
    "Over the last week, has your skin prevented you from working or studying?",
    "Over the last week, how much has your skin created problems with your partner, close friends or relatives?",
    "Over the last week, how much has your skin caused any sexual difficulties?",
    "Over the last week, how much of a problem has the treatment for your skin been?",
  ];
  const options = ["Not at all", "A little", "A lot", "Very much"];
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));

  const total = answers.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="card">
          <p className="text-sm font-medium mb-3">{idx + 1}. {q}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((opt, val) => (
              <button
                key={opt}
                onClick={() => setAnswers((prev) => prev.map((a, i) => (i === idx ? val : a)))}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  answers[idx] === val ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]" : "border-gray-200 text-gray-600 hover:border-crimson-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <ScoreResult
        score={total}
        max={30}
        bands={[
          { upTo: 1, label: "No Effect", color: "bg-green-100 text-green-700" },
          { upTo: 5, label: "Small Effect", color: "bg-lime-100 text-lime-700" },
          { upTo: 10, label: "Moderate Effect", color: "bg-amber-100 text-amber-700" },
          { upTo: 20, label: "Very Large Effect", color: "bg-orange-100 text-orange-700" },
          { upTo: 30, label: "Extremely Large Effect", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- BSA (Rule of Nines) ----------------
function BSACalculator() {
  const regions = [
    { key: "head", label: "Head & Neck", total: 9 },
    { key: "rArm", label: "Right Arm", total: 9 },
    { key: "lArm", label: "Left Arm", total: 9 },
    { key: "anteriorTrunk", label: "Anterior Trunk", total: 18 },
    { key: "posteriorTrunk", label: "Posterior Trunk", total: 18 },
    { key: "rLeg", label: "Right Leg", total: 18 },
    { key: "lLeg", label: "Left Leg", total: 18 },
    { key: "genitals", label: "Genitals", total: 1 },
  ];
  const [pct, setPct] = useState<Record<string, number>>(Object.fromEntries(regions.map((r) => [r.key, 0])));

  const total = regions.reduce((sum, r) => sum + (r.total * (pct[r.key] ?? 0)) / 100, 0);

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted">Rule of Nines &mdash; for each region, estimate what % of that region's skin is affected.</p>
      {regions.map((r) => (
        <div key={r.key} className="card">
          <NumberField label={`${r.label} (of ${r.total}% total)`} value={pct[r.key]} max={100} onChange={(v) => setPct((prev) => ({ ...prev, [r.key]: v }))} />
        </div>
      ))}
      <ScoreResult
        score={total}
        max={100}
        bands={[
          { upTo: 10, label: "Minor", color: "bg-green-100 text-green-700" },
          { upTo: 30, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: 100, label: "Major", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- GAGS ----------------
function GAGSCalculator() {
  const regions = [
    { key: "forehead", label: "Forehead", factor: 2 },
    { key: "rCheek", label: "Right Cheek", factor: 2 },
    { key: "lCheek", label: "Left Cheek", factor: 2 },
    { key: "nose", label: "Nose", factor: 1 },
    { key: "chin", label: "Chin", factor: 1 },
    { key: "chest", label: "Chest & Upper Back", factor: 3 },
  ];
  const gradeLabels = ["0 = None", "1 = Comedones", "2 = Papules", "3 = Pustules", "4 = Nodules"];
  const [grades, setGrades] = useState<Record<string, number>>(Object.fromEntries(regions.map((r) => [r.key, 0])));

  const total = regions.reduce((sum, r) => sum + grades[r.key] * r.factor, 0);

  return (
    <div className="space-y-6">
      {regions.map((r) => (
        <div key={r.key} className="card">
          <h4 className="font-bold text-sm mb-2">{r.label} <span className="text-muted font-normal">(factor &times;{r.factor})</span></h4>
          <NumberField label={gradeLabels[grades[r.key]]} value={grades[r.key]} max={4} onChange={(v) => setGrades((prev) => ({ ...prev, [r.key]: v }))} />
        </div>
      ))}
      <ScoreResult
        score={total}
        max={38}
        bands={[
          { upTo: 18, label: "Mild", color: "bg-green-100 text-green-700" },
          { upTo: 30, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: 38, label: "Severe", color: "bg-orange-100 text-orange-700" },
          { upTo: 999, label: "Very Severe", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- Hurley Stage ----------------
function HurleyStaging() {
  const [stage, setStage] = useState<number | null>(null);
  const stages = [
    { n: 1, title: "Stage I", desc: "Abscess formation, single or multiple, without sinus tracts and cicatrization/scarring." },
    { n: 2, title: "Stage II", desc: "Recurrent abscesses with sinus tract formation and scarring, single or multiple widely separated lesions." },
    { n: 3, title: "Stage III", desc: "Diffuse or near-diffuse involvement, or multiple interconnected sinus tracts and abscesses across the entire area." },
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Hidradenitis Suppurativa clinical staging &mdash; select the stage matching the patient's presentation.</p>
      {stages.map((s) => (
        <button
          key={s.n}
          onClick={() => setStage(s.n)}
          className={`card w-full text-left transition-colors ${stage === s.n ? "border-2 border-[var(--primary-color)] bg-crimson-50" : "hover:border-crimson-200"}`}
        >
          <h4 className="font-bold text-crimson mb-1">{s.title}</h4>
          <p className="text-sm text-gray-700">{s.desc}</p>
        </button>
      ))}
      {stage && (
        <div className="card !bg-gray-50 text-center">
          <p className="text-xs text-muted">Selected</p>
          <p className="text-2xl font-bold text-crimson">Hurley Stage {stage}</p>
        </div>
      )}
    </div>
  );
}

// ---------------- MASI ----------------
function MASICalculator() {
  const regions = [
    { key: "forehead", label: "Forehead", weight: 0.3 },
    { key: "rMalar", label: "Right Malar", weight: 0.3 },
    { key: "lMalar", label: "Left Malar", weight: 0.3 },
    { key: "chin", label: "Chin", weight: 0.1 },
  ];
  const [scores, setScores] = useState(regions.map(() => ({ a: 0, d: 0, h: 0 })));

  const update = (idx: number, key: "a" | "d" | "h", val: number) => {
    setScores((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  };

  const total = scores.reduce((sum, r, idx) => sum + regions[idx].weight * r.a * (r.d + r.h), 0);

  return (
    <div className="space-y-6">
      {regions.map((region, idx) => (
        <div key={region.key} className="card">
          <h4 className="font-bold text-sm mb-3">{region.label} <span className="text-muted font-normal">(weight {region.weight})</span></h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <NumberField label="Area (0-6)" value={scores[idx].a} max={6} onChange={(v) => update(idx, "a", v)} />
            <NumberField label="Darkness (0-4)" value={scores[idx].d} max={4} onChange={(v) => update(idx, "d", v)} />
            <NumberField label="Homogeneity (0-4)" value={scores[idx].h} max={4} onChange={(v) => update(idx, "h", v)} />
          </div>
        </div>
      ))}
      <ScoreResult
        score={total}
        max={48}
        bands={[
          { upTo: 15, label: "Mild", color: "bg-green-100 text-green-700" },
          { upTo: 30, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: 48, label: "Severe", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

// ---------------- NAPSI ----------------
function NAPSICalculator() {
  const [nailCount, setNailCount] = useState(10);
  const [nails, setNails] = useState<{ matrix: number; bed: number }[]>(Array.from({ length: 10 }, () => ({ matrix: 0, bed: 0 })));

  const total = nails.slice(0, nailCount).reduce((sum, n) => sum + n.matrix + n.bed, 0);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">
        Each nail is divided into 4 quadrants. Score matrix features (pitting, leukonychia, red spots in lunula, crumbling) and
        bed features (onycholysis, splinter hemorrhage, hyperkeratosis, oil-drop spots) by number of quadrants involved (0-4 each).
      </p>
      <div className="card">
        <NumberField label="Number of nails assessed" value={nailCount} max={20} min={1} onChange={setNailCount} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: nailCount }).map((_, idx) => (
          <div key={idx} className="card">
            <h4 className="font-bold text-sm mb-3">Nail {idx + 1}</h4>
            <NumberField
              label="Matrix score (0-4)"
              value={nails[idx]?.matrix ?? 0}
              max={4}
              onChange={(v) => setNails((prev) => prev.map((n, i) => (i === idx ? { ...n, matrix: v } : n)))}
            />
            <div className="h-3" />
            <NumberField
              label="Bed score (0-4)"
              value={nails[idx]?.bed ?? 0}
              max={4}
              onChange={(v) => setNails((prev) => prev.map((n, i) => (i === idx ? { ...n, bed: v } : n)))}
            />
          </div>
        ))}
      </div>
      <ScoreResult
        score={total}
        max={nailCount * 8}
        bands={[
          { upTo: nailCount * 8 * 0.33, label: "Mild", color: "bg-green-100 text-green-700" },
          { upTo: nailCount * 8 * 0.66, label: "Moderate", color: "bg-amber-100 text-amber-700" },
          { upTo: nailCount * 8, label: "Severe", color: "bg-red-100 text-red-700" },
        ]}
      />
    </div>
  );
}

const CALCULATORS = [
  { key: "pasi", name: "PASI", desc: "Psoriasis Area and Severity Index", Component: PASICalculator },
  { key: "easi", name: "EASI", desc: "Eczema Area and Severity Index", Component: EASICalculator },
  { key: "scorad", name: "SCORAD", desc: "Scoring Atopic Dermatitis", Component: SCORADCalculator },
  { key: "dlqi", name: "DLQI", desc: "Dermatology Life Quality Index", Component: DLQICalculator },
  { key: "bsa", name: "BSA", desc: "Body Surface Area (Rule of Nines)", Component: BSACalculator },
  { key: "gags", name: "GAGS", desc: "Global Acne Grading System", Component: GAGSCalculator },
  { key: "hurley", name: "Hurley Stage", desc: "Hidradenitis Suppurativa Staging", Component: HurleyStaging },
  { key: "masi", name: "MASI", desc: "Melasma Area and Severity Index", Component: MASICalculator },
  { key: "napsi", name: "NAPSI", desc: "Nail Psoriasis Severity Index", Component: NAPSICalculator },
] as const;

export default function CalculatorsPage() {
  const [active, setActive] = useState<(typeof CALCULATORS)[number]["key"] | null>(null);

  if (active) {
    const calc = CALCULATORS.find((c) => c.key === active)!;
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <button onClick={() => setActive(null)} className="inline-flex items-center gap-2 text-sm text-muted hover:text-gray-900">
          <ArrowLeft size={16} /> Back to Calculators
        </button>
        <div>
          <h2 className="text-2xl font-bold text-crimson">{calc.name}</h2>
          <p className="text-muted">{calc.desc}</p>
        </div>
        <calc.Component />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Clinical Calculators & Scoring</h2>
        <p className="text-muted mt-1">Standardized tools for accurate clinical assessment.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {CALCULATORS.map((calc) => (
          <button
            key={calc.key}
            onClick={() => setActive(calc.key)}
            className="card hover:border-[var(--primary-color)] hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-crimson group-hover:text-red-700">{calc.name}</h3>
              <Activity size={18} className="text-gray-400 group-hover:text-[var(--primary-color)]" />
            </div>
            <p className="text-sm text-gray-600 mb-4">{calc.desc}</p>
            <div className="flex items-center text-xs font-semibold text-[var(--primary-color)]">
              Launch Tool <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
