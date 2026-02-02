import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface WelcomeEmailProps {
  name: string
}

export const WelcomeEmailTemplate = ({ name }: WelcomeEmailProps) => {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`

  return (
    <Html>
      <Head />
      <Preview>Welcome to TechSci CodeCraft!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to TechSci CodeCraft!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for joining TechSci CodeCraft! We're excited to have you
            as part of our community.
          </Text>
          <Text style={text}>
            Your account is now active and you can start exploring our premium
            digital products designed to accelerate your business growth.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions or need assistance, feel free to reach out
            to our support team.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            The TechSci CodeCraft Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "580px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 40px",
}

const buttonContainer = {
  margin: "32px 40px",
}

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
}

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 40px 0",
}
