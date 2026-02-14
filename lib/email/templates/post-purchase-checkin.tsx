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

interface PostPurchaseCheckinEmailProps {
  name: string
  productName: string
  productUrl: string
  amount?: string
}

export const PostPurchaseCheckinEmailTemplate = ({
  name,
  productName,
  productUrl,
  amount,
}: PostPurchaseCheckinEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        How&apos;s it going with {productName}? (Quick check-in)
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Quick Check-in</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Just checking in! It&apos;s been a couple days since you got access
            to <strong>{productName}</strong>.
          </Text>
          <Text style={text}>
            Have you been able to access everything okay? If you&apos;re having
            any trouble accessing your product, downloading files, or getting
            started, just hit reply and let me know. I&apos;m here to help!
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={productUrl}>
              Go to Your Product
            </Button>
          </Section>

          <Section style={linksBox}>
            <Text style={linksTitle}>Quick Links</Text>
            <Text style={linksItem}>
              Your Dashboard: codecraft.techsci.xyz/dashboard
            </Text>
            <Text style={linksItem}>
              Contact Support: support@techsci.xyz
            </Text>
          </Section>

          <Hr style={hr} />

          {amount && (
            <Text style={reminderText}>
              Your purchase of ${amount} appears as &quot;TECHSCI&quot; or
              &quot;CodeCraft Agency&quot; on your credit card statement. If you
              see this charge and don&apos;t remember making this purchase,
              please reply to this email BEFORE contacting your bank. I can help
              verify your order and resolve any concerns immediately.
            </Text>
          )}

          <Text style={footer}>
            Thanks for being a customer!
            <br />
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

const linksBox = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "20px",
  border: "1px solid #e9ecef",
}

const linksTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
}

const linksItem = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 40px",
}

const reminderText = {
  color: "#856404",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "16px 40px",
  backgroundColor: "#fff3cd",
  padding: "12px 16px",
  borderRadius: "6px",
  border: "1px solid #ffc107",
}

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 40px 0",
}
