import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { runId, outputs } = req.body || {};

  if (!runId || !outputs) {
    return res.status(400).json({ error: "Missing runId or outputs." });
  }

  const { error } = await supabase
    .from("content_runs")
    .update({ outputs })
    .eq("id", runId);

  if (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Could not save edits." });
  }

  return res.status(200).json({ success: true });
}