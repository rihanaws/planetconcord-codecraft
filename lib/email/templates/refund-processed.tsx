import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface RefundProcessedEmailProps {
  name: string
  productName: string
  amount: string
  orderId?: string
}

export const RefundProcessedEmailTemplate = ({
  name,
  productName,
  amount,
  orderId,
}: RefundProcessedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Refund Processed - ${amount} | TechSci CodeCraft
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Refund Processed</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>Your refund has been processed.</Text>

          <Section style={detailBox}>
            <Text style={detailTitle}>Refund Details</Text>
            <Text style={detailItem}>
              <strong>Original Purchase:</strong> {productName}
            </Text>
            <Text style={detailItem}>
              <strong>Refund Amount:</strong> ${amount}
            </Text>
            {orderId && (
              <Text style={detailItem}>
                <strong>Order ID:</strong> {orderId}
              </Text>
            )}
            <Text style={detailItem}>
              <strong>Refund Date:</strong>{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Section>

          <Text style={text}>
            Your refund will appear on your credit card statement within 5-10
            business days as a credit from &quot;TECHSCI&quot; or
            &quot;CodeCraft Agency&quot;.
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Your access to <strong>{productName}</strong> has been revoked.
          </Text>
          <Text style={text}>
            If you have any questions about this refund or would like to discuss
            alternatives, please reply to this email or contact{" "}
            <strong>support@techsci.xyz</strong>.
          </Text>
          <Text style={text}>
            We&apos;re sorry to see you go. If there&apos;s anything we could
            have done better, we&apos;d love to hear your feedback.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            TechSci CodeCraft Agency
            <br />
            support@techsci.xyz
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
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "20px",
  border: "1px solid #e9ecef",
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
