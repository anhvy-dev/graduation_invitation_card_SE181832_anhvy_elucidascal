import { logEvent } from "firebase/analytics";
import { firebaseAnalytics } from "../firebase";

let sessionTracked = false;

/**
 * Tracks an invitation visit distinguishing between public visits and personalized-link visits.
 *
 * Privacy Notice:
 * - For personalized links, linkRecipientLabel is strictly a parameter label from the shared URL,
 *   NOT verified identity of the actual person viewing the invitation.
 * - Deduplication is enforced via memory and sessionStorage to prevent repeated events during
 *   React re-renders or StrictMode lifecycles.
 */
export function trackInvitationVisit(
  mode: "public" | "personalized",
  linkRecipientLabel?: string
) {
  if (typeof window === "undefined" || sessionTracked) return;

  const sessionKey = `tracked_visit_${mode}_${linkRecipientLabel || "public"}`;
  try {
    if (sessionStorage.getItem(sessionKey)) {
      sessionTracked = true;
      return;
    }
  } catch {
    // Ignore storage restrictions
  }

  sessionTracked = true;
  try {
    sessionStorage.setItem(sessionKey, "1");
  } catch {
    // Ignore
  }

  firebaseAnalytics
    .then((analytics) => {
      if (!analytics) return;
      try {
        if (mode === "personalized" && linkRecipientLabel) {
          logEvent(analytics, "invitation_view", {
            invitation_mode: "personalized",
            link_recipient_label: linkRecipientLabel,
          });
        } else {
          logEvent(analytics, "invitation_view", {
            invitation_mode: "public",
          });
        }
      } catch (err) {
        console.warn("[Tracking] Error logging event:", err);
      }
    })
    .catch(() => {
      // Ignore
    });

  if (import.meta.env.DEV) {
    console.log(
      `[Tracking] Visit tracked: mode=${mode}${
        linkRecipientLabel ? ` (link_recipient_label="${linkRecipientLabel}" - label only, not verified identity)` : ""
      }`
    );
  }
}
