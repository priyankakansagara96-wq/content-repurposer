import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("content_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return res.status(500).json({ error: "Could not load runs." });
  }

  return res.status(200).json({ runs: data });
}