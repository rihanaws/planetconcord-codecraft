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

interface PurchaseConfirmationEmailProps {
  name: string
  productName: string
  productUrl: string
  amount?: string
  orderId?: string
  discordInviteUrl?: string
}

export const PurchaseConfirmationEmailTemplate = ({
  name,
  productName,
  productUrl,
  amount,
  orderId,
  discordInviteUrl,
}: PurchaseConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your purchase: {productName}
        {orderId ? ` (Order #${orderId})` : ""}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your purchase!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your purchase of <strong>{productName}</strong> has been confirmed
            and your access has been granted.
          </Text>

          {(amount || orderId) && (
            <Section style={orderBox}>
              <Text style={orderTitle}>Order Confirmation</Text>
              <Text style={orderDetail}>
                <strong>Product:</strong> {productName}
              </Text>
              {amount && (
                <Text style={orderDetail}>
                  <strong>Amount Paid:</strong> ${amount}
                </Text>
              )}
              {orderId && (
                <Text style={orderDetail}>
                  <strong>Order ID:</strong> {orderId}
                </Text>
              )}
              <Text style={orderDetail}>
                <strong>Credit Card Statement:</strong> This charge will appear
                as &quot;TECHSCI&quot; or &quot;CodeCraft Agency&quot;
              </Text>
            </Section>
          )}

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
                <strong>Join our community!</strong> Connect with other members,
                get support, and stay up to date with the latest tips and
                updates.
              </Text>
              <Section style={buttonContainer}>
                <Button style={discordButton} href={discordInviteUrl}>
                  Join Discord Community
                </Button>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Text style={warningText}>
            If you don&apos;t recognize this charge, please contact us BEFORE
            contacting your bank. We can resolve any issues immediately and help
            you avoid unnecessary dispute fees.
          </Text>
          <Text style={text}>
            Need help? Reply to this email or contact us at{" "}
            <strong>support@techsci.xyz</strong> — we typically respond within 4
            hours on business days.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            TechSci CodeCraft Agency
            <br />
            <br />
            TechSci, Inc. | EIN: 35-2800827
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

const orderBox = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "20px",
  border: "1px solid #e9ecef",
}

const orderTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
}

const orderDetail = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "22px",
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

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 40px",
}

const warningText = {
  color: "#e74c3c",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "16px 40px",
  fontWeight: "bold",
}

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 40px 0",
}
