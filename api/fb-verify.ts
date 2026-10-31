/**
 * Vercel Serverless Function: Facebook Access Token Verification
 * Runtime: Edge runtime (compatible with Vercel Edge & Node.js, zero external dependencies)
 */

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { accessToken, userID } = body;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing accessToken in request body" }),
        { status: 400, headers }
      );
    }

    // Verify the user token with Meta Graph API
    const graphUrl = `https://graph.facebook.com/me?access_token=${encodeURIComponent(
      accessToken
    )}&fields=id,name,picture.width(160).height(160)`;

    const graphRes = await fetch(graphUrl);
    const graphData = await graphRes.json();

    if (!graphRes.ok || graphData.error) {
      return new Response(
        JSON.stringify({
          valid: false,
          verified: false,
          error: graphData.error?.message || "Invalid Facebook access token",
        }),
        { status: 401, headers }
      );
    }

    // Verify userID match if provided
    if (userID && graphData.id !== userID) {
      return new Response(
        JSON.stringify({
          valid: false,
          verified: false,
          error: "Token userID does not match provided userID",
        }),
        { status: 403, headers }
      );
    }

    // Check if App ID / Secret environment variables are provided for extra server validation
    const serverAppId = process.env.FB_APP_ID || process.env.VITE_FB_APP_ID || "1469533411730984";
    const serverAppSecret = process.env.FB_APP_SECRET;

    let appLevelVerified = false;
    if (serverAppSecret) {
      // If FB_APP_SECRET is set, inspect the debug_token endpoint
      try {
        const appAccessToken = `${serverAppId}|${serverAppSecret}`;
        const debugUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(
          accessToken
        )}&access_token=${encodeURIComponent(appAccessToken)}`;
        const debugRes = await fetch(debugUrl);
        const debugData = await debugRes.json();

        if (debugRes.ok && debugData.data?.is_valid) {
          appLevelVerified = true;
        }
      } catch (err) {
        console.warn("[fb-verify] App debug_token check warning:", err);
      }
    }

    return new Response(
      JSON.stringify({
        valid: true,
        verified: true,
        appLevelVerified,
        user: {
          id: graphData.id,
          name: graphData.name,
          picture: graphData.picture,
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error during token verification",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers }
    );
  }
}
