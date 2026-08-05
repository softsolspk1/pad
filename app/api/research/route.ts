import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const member = await requireMember(req);
  const admin = member ? null : await requireAdmin(req);
  if (!member && !admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = req.nextUrl.searchParams.get("category");
  const params: any[] = [];
  let where = "";
  if (category) {
    params.push(category);
    where = `WHERE category = $1`;
  }

  const result = await pool.query(
    `SELECT id, category, title, description, author_or_source, file_url, cover_image_url, published_date, created_at
     FROM research_items ${where} ORDER BY published_date DESC NULLS LAST, created_at DESC`,
    params
  );
  
  // Demo content related to Dermatology
  const demoContent = [
    {
      id: 901, category: "paper",
      title: "Efficacy of novel topical therapies for Melasma",
      description: "This study evaluates the comparative efficacy of tranexamic acid versus triple combination cream in epidermal melasma in a South Asian population cohort over 12 weeks.",
      author_or_source: "Journal of Pakistan Association of Dermatologists - Vol 34, Issue 2",
      file_url: "#"
    },
    {
      id: 902, category: "paper",
      title: "Biologics in Psoriasis: A 5-year retrospective cohort",
      description: "Analyzing the long-term safety and efficacy of IL-17 inhibitors among Pakistani patients.",
      author_or_source: "International Journal of Dermatology",
      file_url: "#"
    },
    {
      id: 903, category: "ebook",
      title: "Dermatology in Practice (3rd Edition)",
      description: "Comprehensive open-source guide covering common skin conditions, diagnosis, and clinical management.",
      author_or_source: "PAD Open-Source Library",
      file_url: "#"
    },
    {
      id: 904, category: "ebook",
      title: "Aesthetic Medicine & Lasers Handbook",
      description: "A complete guide on laser physics, safety, and clinical applications for aesthetic dermatologists.",
      author_or_source: "Rederm Connect Publications",
      file_url: "#"
    },
    {
      id: 905, category: "guideline",
      title: "PAD National Guidelines for Management of Scabies 2026",
      description: "Updated protocols addressing treatment-resistant scabies, ivermectin dosage, and community health strategies.",
      author_or_source: "PAD Clinical Committee",
      file_url: "#"
    },
    {
      id: 906, category: "guideline",
      title: "Acne Vulgaris Treatment Algorithm",
      description: "Step-by-step clinical pathway for mild, moderate, and severe acne including indications for oral isotretinoin.",
      author_or_source: "Rederm Helix Guidelines Group",
      file_url: "#"
    }
  ];

  const filteredDemo = category ? demoContent.filter(c => c.category === category) : demoContent;
  
  return NextResponse.json([...result.rows, ...filteredDemo]);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category, title, description, author_or_source, file_url, cover_image_url, published_date } = await req.json();
  if (!title || !category) {
    return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO research_items (category, title, description, author_or_source, file_url, cover_image_url, published_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [category, title, description || null, author_or_source || null, file_url || null, cover_image_url || null, published_date || null]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
