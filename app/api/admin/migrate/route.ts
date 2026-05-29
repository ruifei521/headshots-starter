import { NextResponse } from "next/server";
import { Client } from "pg";
import fs from "fs";
import path from "path";

const PROJECT_REF = "vgrqvwhkvnqsawlwywld";

/**
 * Try multiple possible sources for the database password.
 * Vercel's Supabase integration auto-injects some env vars but
 * SUPABASE_DB_PASSWORD may need to be manually added.
 */
function findDbPassword(): string | null {
  // Priority order for finding the password
  const candidates = [
    process.env.SUPABASE_DB_PASSWORD,
    process.env.DATABASE_URL, // May contain full connection string
    process.env.POSTGRES_PASSWORD,
    process.env.PGPASSWORD,
  ];
  return candidates.find(Boolean) || null;
}

/**
 * Build connection string from a password.
 */
function buildConnectionString(password: string): string {
  // If it looks like a full connection string, use it directly
  if (password.startsWith("postgresql://") || password.startsWith("postgres://")) {
    return password;
  }
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
}

export async function POST() {
  const results: string[] = [];
  const diagnostics: Record<string, string> = {};

  // Log which env vars are present (names only, no values)
  for (const key of [
    "SUPABASE_DB_PASSWORD",
    "DATABASE_URL",
    "POSTGRES_PASSWORD",
    "PGPASSWORD",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]) {
    diagnostics[key] = process.env[key] ? "SET" : "NOT SET";
  }

  const dbPassword = findDbPassword();
  if (!dbPassword) {
    return NextResponse.json(
      {
        error: "No database password found in environment variables.",
        hint: "Add SUPABASE_DB_PASSWORD to Vercel environment variables (get it from Supabase Dashboard → Settings → Database → Connection string).",
        diagnostics,
      },
      { status: 500 }
    );
  }

  const connectionString = buildConnectionString(dbPassword);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    // Read the migration SQL file
    const sqlPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "add_training_progress.sql"
    );

    if (!fs.existsSync(sqlPath)) {
      return NextResponse.json(
        { error: `SQL file not found at: ${sqlPath}` },
        { status: 500 }
      );
    }

    const sql = fs.readFileSync(sqlPath, "utf-8");
    results.push(`SQL file loaded (${sql.length} chars)`);

    await client.connect();
    results.push("Connected to database");

    // Execute the SQL (pg supports multi-statement strings)
    const res = await client.query(sql);
    // pg returns QueryResult[] for multi-statement, QueryResult for single
    const resArray = Array.isArray(res) ? res : [res];
    results.push(`SQL executed: ${resArray.length} statement(s)`);

    // Show the last result (verification)
    if (resArray.length > 0) {
      const lastResult = resArray[resArray.length - 1];
      results.push(
        `Verification: ${JSON.stringify(lastResult.rows)}`
      );
    }

    // Verify columns were added
    const verifyCols = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'models' 
      AND column_name IN ('images_generated', 'total_images')
    `);
    results.push(
      `Models columns: ${JSON.stringify(verifyCols.rows)}`
    );

    // Verify constraint
    const verifyConstraint = await client.query(`
      SELECT conname FROM pg_constraint 
      WHERE conname = 'images_modelId_uri_key'
    `);
    results.push(
      `Constraint exists: ${verifyConstraint.rows.length > 0 ? "YES" : "NO"}`
    );

    await client.end();

    return NextResponse.json({
      success: true,
      message: "Migration executed successfully",
      details: results,
    });
  } catch (error: any) {
    try {
      await client.end();
    } catch {}
    return NextResponse.json(
      {
        error: "Migration failed",
        message: error.message,
        details: results,
        diagnostics,
      },
      { status: 500 }
    );
  }
}
