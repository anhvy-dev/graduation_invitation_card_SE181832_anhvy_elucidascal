/**
 * Vercel Serverless Function: Facebook Access Token Verification (Deprecated)
 * Facebook Login has been removed in favor of direct personalized links and public invitations.
 */

export const config = {
  runtime: "edge",
};

export default async function handler(): Promise<Response> {
  return new Response(
    JSON.stringify({
      deprecated: true,
      message: "Facebook Login is removed. Invitation modes are now Public (/) and Personalized (/?to=Name).",
    }),
    {
      status: 410,
      headers: { "Content-Type": "application/json" },
    }
  );
}
