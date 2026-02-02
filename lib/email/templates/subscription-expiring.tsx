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

interface SubscriptionExpiringEmailProps {
  name: string
  productName: string
  expiryDate: string
  renewUrl: string
}

export const SubscriptionExpiringEmailTemplate = ({
  name,
  productName,
  expiryDate,
  renewUrl,
}: SubscriptionExpiringEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your subscription to {productName} is expiring soon</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Subscription Expiring Soon</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            This is a friendly reminder that your subscription to{" "}
            <strong>{productName}</strong> will expire on{" "}
            <strong>{expiryDate}</strong>.
          </Text>
          <Text style={text}>
            To continue enjoying uninterrupted access to all the features and
            content, please renew your subscription before it expires.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={renewUrl}>
              Renew Subscription
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions about your subscription or need assistance,
            our support team is here to help.
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
