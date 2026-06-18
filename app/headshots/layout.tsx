import ProfessionHubLinks from "@/components/headshots/ProfessionHubLinks";

export default function HeadshotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProfessionHubLinks />
    </>
  );
}
