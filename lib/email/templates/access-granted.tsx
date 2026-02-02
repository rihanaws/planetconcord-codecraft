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

interface AccessGrantedEmailProps {
  name: string
  productName: string
  accessUrl: string
}

export const AccessGrantedEmailTemplate = ({
  name,
  productName,
  accessUrl,
}: AccessGrantedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your access to {productName} has been granted</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Access Granted!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Great news! Your access to <strong>{productName}</strong> has been
            successfully granted.
          </Text>
          <Text style={text}>
            You can now access all the content, resources, and materials included
            with this product.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={accessUrl}>
              Access Your Product
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions or need help getting started, please don't
            hesitate to reach out to our support team.
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
