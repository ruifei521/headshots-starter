export async function GET() {
  // Redirect to Google Cloud Console OAuth Consent Screen
  // Project ID: 929789267603 (from OAuth Client ID)
  return Response.redirect(
    'https://console.cloud.google.com/apis/credentials/consent?project=929789267603',
    302
  );
}
