import { Html, Head, Body, Container, Section, Heading, Text, Button } from '@react-email/components';

export default function TrainingStartedEmail({ 
  modelName, 
  estimateMinutes = 30 
}: { 
  modelName: string; 
  estimateMinutes?: number 
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '40px', textAlign: 'center' }}>
            <Heading style={{ fontSize: 24, color: '#111827' }}>Training Started! 🚀</Heading>
            <Text style={{ fontSize: 16, color: '#6b7280', margin: '20px 0' }}>
              Great news! Your model <strong>"{modelName}"</strong> has started training.
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              Estimated time: ~{estimateMinutes} minutes. We'll email you when your headshots are ready!
            </Text>
            <Button 
              href="https://snapprohead.com/overview" 
              style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 16 }}
            >
              View Dashboard
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
