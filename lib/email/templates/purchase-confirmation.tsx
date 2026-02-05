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

interface PurchaseConfirmationEmailProps {
  name: string
  productName: string
  productUrl: string
  discordInviteUrl?: string
}

export const PurchaseConfirmationEmailTemplate = ({
  name,
  productName,
  productUrl,
  discordInviteUrl,
}: PurchaseConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your purchase: {productName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your purchase!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your purchase of <strong>{productName}</strong> has been confirmed
            and your access has been granted.
          </Text>
          <Text style={text}>
            You can now access your product from your dashboard:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={productUrl}>
              Access Your Product
            </Button>
          </Section>
          {discordInviteUrl && (
            <>
              <Text style={text}>
                <strong>Join our community!</strong> Connect with other members, get support, and stay up to date with the latest tips and updates.
              </Text>
              <Section style={buttonContainer}>
                <Button style={discordButton} href={discordInviteUrl}>
                  Join Discord Community
                </Button>
              </Section>
            </>
          )}
          <Text style={text}>
            If you have any questions about your purchase or need assistance,
            please don&apos;t hesitate to contact our support team.
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

const discordButton = {
  backgroundColor: "#5865F2",
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
