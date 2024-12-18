import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import type { TemplateProps } from "../types";
import { EditorContent } from "./components/editor-content";
import { LineItems } from "./components/line-items";
import { Meta } from "./components/meta";
import { Note } from "./components/note";
import { PaymentDetails } from "./components/payment-details";
import { Summary } from "./components/summary";

const CDN_URL = "https://cdn.midday.ai";

Font.register({
  family: "GeistMono",
  fonts: [
    {
      src: `${CDN_URL}/fonts/GeistMono/ttf/GeistMono-Regular.ttf`,
      fontWeight: 400,
    },
    {
      src: `${CDN_URL}/fonts/GeistMono/ttf/GeistMono-Medium.ttf`,
      fontWeight: 500,
    },
  ],
});

export async function PdfTemplate({
  invoice_number,
  issue_date,
  due_date,
  template,
  line_items,
  customer_details,
  from_details,
  payment_details,
  note_details,
  currency,
  vat,
  tax,
  amount,
  size = "a4",
  token,
}: TemplateProps) {
  return (
    <Document>
      <Page
        size={size.toUpperCase() as "LETTER" | "A4"}
        style={{
          padding: 20,
          backgroundColor: "#fff",
          fontFamily: "GeistMono",
          color: "#000",
        }}
      >
        <View style={{ marginBottom: 20 }}>
          {template?.logo_url && (
            <Image
              src={template.logo_url}
              style={{
                width: 78,
                height: 78,
              }}
            />
          )}
        </View>

        <Meta
          invoiceNoLabel={template.invoice_no_label}
          issueDateLabel={template.issue_date_label}
          dueDateLabel={template.due_date_label}
          invoiceNo={invoice_number}
          issueDate={issue_date}
          dueDate={due_date}
        />

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 9, fontWeight: 500 }}>
                {template.from_label}
              </Text>
              <EditorContent content={from_details} />
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 9, fontWeight: 500 }}>
                {template.customer_label}
              </Text>
              <EditorContent content={customer_details} />
            </View>
          </View>
        </View>

        <LineItems
          lineItems={line_items}
          currency={currency}
          descriptionLabel={template.description_label}
          quantityLabel={template.quantity_label}
          priceLabel={template.price_label}
          totalLabel={template.total_label}
        />

        <Summary
          amount={amount}
          tax={tax}
          vat={vat}
          currency={currency}
          totalLabel={template.total_label}
          taxLabel={template.tax_label}
          vatLabel={template.vat_label}
        />

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <PaymentDetails
                content={payment_details}
                paymentLabel={template.payment_label}
              />

              {/*<QRCode data={qrCode} />*/}
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Note content={note_details} noteLabel={template.note_label} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
