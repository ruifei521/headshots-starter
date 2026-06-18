/** Canonical data-retention copy — aligned with current ops (manual deletion on request). */

export const DATA_RETENTION_CONTACT_EMAIL = "contact@snapprohead.com";

/** SLA for verified deletion requests (manual process). */
export const DATA_DELETION_SLA_DAYS = 7;

/** Short badge for pricing, tiers, comparison tables. */
export const PRIVACY_RETENTION_BADGE = "Privacy-first · delete on request";

/** Trust line under pricing cards. */
export const PRICING_RETENTION_TRUST_LINE =
  "Photos used only for your order · delete on request";

/** Tier feature bullet (all tiers). */
export const TIER_PRIVACY_FEATURE = "Privacy-first — delete on request";

/** Train flow consent checkbox. */
export const TRAIN_CONSENT_UPLOAD_LINE =
  "Original photos are used only for training and removed after your order completes (or sooner on request)";

export const TRAIN_CONSENT_GENERATED_LINE =
  "Generated headshots stay in your account until you download them; we delete on request";

/** Privacy policy — section 2 (how we use photos). */
export const LEGAL_UPLOAD_RETENTION_SECTION2 =
  "Original uploaded photos are used solely for headshot generation. We delete them after your order completes, or within a reasonable period thereafter — whichever comes first.";

export const LEGAL_GENERATED_RETENTION_SECTION2 =
  "Generated headshots remain in your account so you can view and download them. We retain them until you request deletion.";

/** Privacy policy — section 5 (retention and deletion). */
export const LEGAL_UPLOAD_RETENTION_SECTION5 =
  "Original uploaded photos: Used solely for headshot generation. Deleted after your order completes, or within a reasonable period thereafter.";

export const LEGAL_GENERATED_RETENTION_SECTION5 =
  "Generated headshots: Stored in your account so you can download them. Retained until you request deletion.";

export const LEGAL_DELETION_ON_REQUEST = `You may request deletion of your photos and generated images at any time by contacting us at ${DATA_RETENTION_CONTACT_EMAIL}. We process verified requests within ${DATA_DELETION_SLA_DAYS} business days.`;

export const LEGAL_ACCOUNT_DELETION = `Upon a verified account deletion request, we remove your personal data, uploaded photos, and generated images within ${DATA_DELETION_SLA_DAYS} business days.`;

/** Homepage privacy card. */
export const HOMEPAGE_PRIVACY_CARD_TITLE = "You're in Control of Your Data";

export const HOMEPAGE_PRIVACY_CARD_DESCRIPTION = `We never sell your photos. Uploads are used only for your order. Generated headshots stay available until you've downloaded them. Email ${DATA_RETENTION_CONTACT_EMAIL} anytime for prompt deletion.`;

/** Comparison table row label. */
export const COMPARISON_PRIVACY_ROW_LABEL = "Delete on request";

/** Why AI vs photographer table. */
export const WHY_AI_PRIVACY_DIMENSION = "Delete on request";

/** FAQ / schema — what happens to uploaded photos. */
export const PHOTOS_FAQ_ANSWER = `We never sell, share, or display your photos. They're used solely to train your personal AI model. Original uploads are removed after your order completes (or sooner on request). Generated headshots stay in your account until you download them; we delete on request within ${DATA_DELETION_SLA_DAYS} business days. All data is transmitted with SSL encryption. Contact ${DATA_RETENTION_CONTACT_EMAIL} anytime.`;

/** Competitor comparison FAQ snippet. */
export const COMPARE_PRIVACY_SNIPPET =
  "privacy-first data handling with deletion on request";
