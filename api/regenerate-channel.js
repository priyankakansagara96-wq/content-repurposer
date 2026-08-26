import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CHANNEL_LABELS = {
  blog: "Blog Post",
  linkedin_post: "LinkedIn Post",
  twitter_thread: "X Thread",
  facebook_post: "Facebook Post",
  instagram_caption: "Instagram Caption",
  email: "Email",
  sms: "SMS",
  google_ads: "Google Ads",
  linkedin_ads: "LinkedIn Ads",
  meta_ads: "Meta Ads",
  educational: "Educational Script",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { sourceChannel, content, signal, channel, voiceId } = req.body || {};

  if (!content || !channel) {
    return res.status(400).json({ error: "Missing content or channel." });
  }

  let voiceInstructions = "";
  if (voiceId) {
    const { data: voice } = await supabase
      .from("brand_voices")
      .select("*")
      .eq("id", voiceId)
      .single();

    if (voice) {
      voiceInstructions = `
BRAND VOICE TO APPLY: ${voice.name}
Tone: ${voice.tone_description}
Do: ${voice.dos}
Don't: ${voice.donts}
Example of this voice: "${voice.example_snippet}"`;
    }
  }

  const prompt = `You are a senior growth marketer repurposing content into a single channel.

SOURCE CHANNEL: ${sourceChannel || "unspecified"}
WHY IT WORKED: ${signal || "Not specified."}
${voiceInstructions}

SOURCE CONTENT:
"""
${content}
"""

Write a fresh, alternative version of this for "${channel}" (${CHANNEL_LABELS[channel] || channel}).
Give a different angle/hook than a typical first attempt would.
Preserve all facts and proof points exactly as given.
Respond with ONLY the ready-to-publish content, no preamble, no labels, no markdown.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Anthropic API request failed." });
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    return res.status(200).json({ content: text });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Something went wrong regenerating this channel." });
  }
}