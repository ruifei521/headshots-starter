import { Html, Head, Body, Container, Section, Heading, Text, Button } from '@react-email/components';

export default function HeadshotsReadyEmail({ 
  headshotCount, 
  dashboardUrl = 'https://snapprohead.com/overview' 
}: { 
  headshotCount: number; 
  dashboardUrl?: string 
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '40px', textAlign: 'center' }}>
            <Heading style={{ fontSize: 24, color: '#111827' }}>Your Headshots Are Ready! 🎉</Heading>
            <Text style={{ fontSize: 16, color: '#6b7280', margin: '20px 0' }}>
              Fantastic! Your <strong>{headshotCount} AI headshots</strong> have been generated successfully.
            </Text>
            <Button 
              href={dashboardUrl} 
              style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 16 }}
            >
              View My Headshots
            </Button>
            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
              Questions? Reply to this email or contact support@snapprohead.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
