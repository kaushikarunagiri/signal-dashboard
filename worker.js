// Signal Dashboard — GNews Proxy Worker
// Cloudflare Workers (free tier: 100,000 req/day)
// API key is stored as a Cloudflare Secret named GNEWS_API_KEY — never hardcoded

const CORS_HEADERS = {
‘Access-Control-Allow-Origin’: ‘https://kaushikarunagiri.github.io’,
‘Access-Control-Allow-Methods’: ‘GET, OPTIONS’,
‘Access-Control-Allow-Headers’: ‘Content-Type’,
‘Content-Type’: ‘application/json’,
};

export default {
async fetch(request, env) {
// Handle CORS preflight
if (request.method === ‘OPTIONS’) {
return new Response(null, { headers: CORS_HEADERS });
}

```
const url = new URL(request.url);
const query = url.searchParams.get('q');

if (!query) {
return new Response(
JSON.stringify({ error: 'Missing query parameter q' }),
{ status: 400, headers: CORS_HEADERS }
);
}

// Read API key from Cloudflare Secret (never exposed publicly)
const apiKey = env.GNEWS_API_KEY;
if (!apiKey) {
return new Response(
JSON.stringify({ error: 'API key not configured. Add GNEWS_API_KEY as a Cloudflare Secret.' }),
{ status: 500, headers: CORS_HEADERS }
);
}

try {
// Fetch from GNews server-side — no CORS issues here
const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=5&token=${apiKey}`;
const gnewsRes = await fetch(gnewsUrl);
const data = await gnewsRes.json();

return new Response(JSON.stringify(data), {
status: gnewsRes.status,
headers: CORS_HEADERS,
});
} catch (err) {
return new Response(
JSON.stringify({ error: 'Failed to fetch from GNews', detail: err.message }),
{ status: 500, headers: CORS_HEADERS }
);
}
```

},
};
