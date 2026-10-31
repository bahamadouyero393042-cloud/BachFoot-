
// Vercel serverless function: the SportsAPI secret stays on the server.
const BASE = "https://api.sportsapi.app/v2";

module.exports = async function handler(req, res) {
  const key = process.env.SPORTSAPI_KEY;
  if (!key) {
    return res.status(500).json({
      error: "La variable SPORTSAPI_KEY n'est pas configurée sur Vercel."
    });
  }

  const { resource, sport, date } = req.query || {};
  const safeSport =
    typeof sport === "string" && /^[a-z0-9-]{1,40}$/.test(sport)
      ? sport
      : null;

  const safeDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? date
      : new Date().toISOString().slice(0, 10);

  let path;

  if (resource === "sports") path = "/sports";
  else if (resource === "livescores") {
    path = safeSport
      ? `/livescores?sport=${encodeURIComponent(safeSport)}`
      : "/livescores";
  } else if (resource === "fixtures" && safeSport) {
    path = `/fixtures?date=${safeDate}&sport=${encodeURIComponent(safeSport)}&page=0`;
  } else if (resource === "races" && safeSport) {
    path = `/races?date=${safeDate}&sport=${encodeURIComponent(safeSport)}`;
  } else {
    return res.status(400).json({ error: "Paramètres invalides." });
  }

  try {
    const upstream = await fetch(BASE + path, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json"
      }
    });

    const body = await upstream.json();

    if (!upstream.ok) {
      const message =
        body?.error?.message ||
        "Le fournisseur de données a répondu avec une erreur.";

      return res.status(upstream.status).json({
        error: message,
        code: body?.error?.code || "upstream_error"
      });
    }

    res.setHeader(
      "Cache-Control",
      resource === "livescores"
        ? "s-maxage=20, stale-while-revalidate=20"
        : "s-maxage=60, stale-while-revalidate=120"
    );

    return res.status(200).json(body);
  } catch (err) {
    return res.status(502).json({
      error: "Impossible de joindre SportsAPI pour le moment."
    });
  }
};
        
