import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface AccessGrantedEmailProps {
  name: string
  productName: string
  accessUrl: string
  accessType?: string
}

export const AccessGrantedEmailTemplate = ({
  name,
  productName,
  accessUrl,
  accessType,
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

          <Section style={detailBox}>
            <Text style={detailTitle}>Access Details</Text>
            <Text style={detailItem}>
              <strong>Product:</strong> {productName}
            </Text>
            <Text style={detailItem}>
              <strong>Access Type:</strong>{" "}
              {accessType === "SUBSCRIPTION" ? "Subscription" : "Lifetime"}
            </Text>
            <Text style={detailItem}>
              <strong>Statement Descriptor:</strong> Charges appear as
              &quot;TECHSCI&quot; or &quot;CodeCraft Agency&quot;
            </Text>
          </Section>

          <Text style={text}>
            You can now access all the content, resources, and materials included
            with this product.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={accessUrl}>
              Access Your Product
            </Button>
          </Section>

          <Section style={stepsBox}>
            <Text style={stepsTitle}>Next Steps</Text>
            <Text style={stepsItem}>
              1. Log in to your dashboard at codecraft.techsci.xyz/dashboard
            </Text>
            <Text style={stepsItem}>
              2. Navigate to &quot;My Products&quot; to see {productName}
            </Text>
            <Text style={stepsItem}>
              3. Download your files, access your tools, and get started!
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Need help getting started? Reply to this email or contact us at{" "}
            <strong>support@techsci.xyz</strong> — we typically respond within 4
            hours on business days.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            TechSci CodeCraft Agency
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

const detailBox = {
  backgroundColor: "#f0f7ff",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "20px",
  border: "1px solid #d0e3f7",
}

const detailTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
}

const detailItem = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
}

const stepsBox = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "20px",
  border: "1px solid #e9ecef",
}

const stepsTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
}

const stepsItem = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 0",
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

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 40px",
}

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 40px 0",
}
