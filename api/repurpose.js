// Vercel Serverless Function
// This runs on Vercel's servers, NOT in the browser — so the API key
// stored in the ANTHROPIC_API_KEY environment variable is never exposed
// to anyone visiting your site.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { sourceChannel, content, signal, targets } = req.body || {};

  if (!content || !Array.isArray(targets) || targets.length === 0) {
    return res.status(400).json({ error: "Missing content or target channels." });
  }

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

  const channelSpecs = targets
    .map((key) => `"${key}" (${CHANNEL_LABELS[key] || key})`)
    .join(", ");

  const prompt = `You are a senior growth marketer at a B2B health technology company, repurposing a proven, high-performing piece of content into other marketing channels.

SOURCE CHANNEL: ${sourceChannel || "unspecified"}
WHY IT WORKED (signal from the marketer, may be blank): ${signal || "Not specified — infer likely reasons from the content itself."}

SOURCE CONTENT:
"""
${content}
"""

Repurpose this into the following channels: ${channelSpecs}.

Rules:
- Preserve the core message, proof points, and any stats/claims exactly as given — do not invent new facts or numbers.
- Adapt tone, length, and format to fit native conventions of each channel (e.g. LinkedIn = professional narrative hook, X thread = numbered short punchy tweets separated by newlines, SMS = under 160 characters with a clear CTA, Google/LinkedIn/Meta Ads = a headline line and a description line clearly labeled, Email = subject line then body, Educational script = short spoken-style script with scene/beat markers).
- Keep each output tight and ready to publish, not a description of what you would write.
- Respond ONLY with valid minified JSON, no markdown fences, no preamble. Shape: {"channel_key": "content string", ...} using exactly these keys: ${targets.map((t) => `"${t}"`).join(", ")}.`;

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
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return res.status(response.status).json({ error: "Anthropic API request failed." });
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    const clean = text.replace(/^```json\s*|^```\s*|```$/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json({ result: parsed });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Something went wrong generating the content." });
  }
}
