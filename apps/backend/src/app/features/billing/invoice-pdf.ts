import PDFDocument from "pdfkit";
import type { BillingPayment } from "./billing.repository.js";

// Who the invoice is from. Add a GSTIN line here once the business is registered.
const SELLER = {
  name: "Nakka AI",
  email: "nakkaanakarao77@gmail.com",
  website: "nakka.in",
};

const INK = "#171b26";
const MUTED = "#5f6473";
const LINE = "#e3e5ec";
const ACCENT = "#0b5c8e";
const PAID = "#087f5b";

export interface InvoiceCustomer {
  name: string;
  email: string;
}

// e.g. NAKKA-20261013-1A2B3C4D: the paid date (in India) plus the start of the payment's id.
export const invoiceNumber = (payment: BillingPayment) => {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" })
    .format(new Date(payment.paidAt ?? payment.createdAt));
  return `NAKKA-${date.replace(/-/g, "")}-${payment.id.slice(0, 8).toUpperCase()}`;
};

// The built-in PDF fonts have no ₹ glyph, so amounts are written as "INR 1,699.00".
const inr = (paise: number) =>
  `INR ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paise / 100)}`;

const day = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
    .format(new Date(iso));

const dateTime = (iso: string) =>
  `${new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata",
  }).format(new Date(iso))} IST`;

// The access period this payment bought: it ends at accessUntil and lasts one cycle.
function periodStart(payment: BillingPayment): string | null {
  if (!payment.accessUntil) return null;
  const start = new Date(payment.accessUntil);
  if (payment.cycle === "yearly") start.setUTCFullYear(start.getUTCFullYear() - 1);
  else start.setUTCMonth(start.getUTCMonth() - 1);
  return start.toISOString();
}

// A one-page A4 invoice for a paid payment.
export function renderInvoice(payment: BillingPayment, customer: InvoiceCustomer): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: { Title: `Invoice ${invoiceNumber(payment)}`, Author: SELLER.name },
  });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const left = 50;
  const right = doc.page.width - 50;
  const width = right - left;
  const cycle = payment.cycle === "yearly" ? "Yearly" : "Monthly";
  const paidAt = payment.paidAt ?? payment.createdAt;

  // Header band.
  doc.rect(0, 0, doc.page.width, 6).fill(ACCENT);
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(24).text(SELLER.name, left, 50);
  doc.fillColor(MUTED).font("Helvetica").fontSize(9)
    .text(SELLER.website, left, 80)
    .text(SELLER.email, left, 93);

  doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(20).text("INVOICE", left, 50, { width, align: "right" });
  doc.fillColor(MUTED).font("Helvetica").fontSize(9)
    .text(`Invoice no.  ${invoiceNumber(payment)}`, left, 78, { width, align: "right" })
    .text(`Invoice date  ${day(paidAt)}`, left, 91, { width, align: "right" });

  // Paid stamp.
  const badgeWidth = 46;
  doc.roundedRect(right - badgeWidth, 108, badgeWidth, 18, 9).fill("#e6fcf5");
  doc.fillColor(PAID).font("Helvetica-Bold").fontSize(9).text("PAID", right - badgeWidth, 113, { width: badgeWidth, align: "center" });

  doc.moveTo(left, 145).lineTo(right, 145).lineWidth(1).strokeColor(LINE).stroke();

  // Billed to / payment summary.
  const label = (text: string, x: number, y: number) =>
    doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8).text(text.toUpperCase(), x, y, { characterSpacing: 0.8 });
  label("Billed to", left, 165);
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(11).text(customer.name || customer.email, left, 180);
  if (customer.name) doc.fillColor(MUTED).font("Helvetica").fontSize(10).text(customer.email, left, 196);

  const col = left + width / 2 + 20;
  label("Amount paid", col, 165);
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(18).text(inr(payment.amountPaise), col, 180);
  doc.fillColor(MUTED).font("Helvetica").fontSize(10).text(`on ${day(paidAt)}`, col, 203);

  // Line items.
  const tableTop = 250;
  const amountX = right - 110;
  const periodX = left + 230;
  doc.rect(left, tableTop, width, 26).fill("#f4f5f9");
  doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8);
  doc.text("DESCRIPTION", left + 12, tableTop + 9, { characterSpacing: 0.8 });
  doc.text("SERVICE PERIOD", periodX, tableTop + 9, { characterSpacing: 0.8 });
  doc.text("AMOUNT", amountX, tableTop + 9, { width: 98, align: "right", characterSpacing: 0.8 });

  const rowTop = tableTop + 40;
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(11).text(`NakkaAI Pro (${cycle})`, left + 12, rowTop);
  doc.fillColor(MUTED).font("Helvetica").fontSize(9)
    .text("One-time payment. Does not auto-renew.", left + 12, rowTop + 16);
  const start = periodStart(payment);
  doc.fillColor(INK).font("Helvetica").fontSize(10)
    .text(start && payment.accessUntil ? `${day(start)} - ${day(payment.accessUntil)}` : "-", periodX, rowTop);
  doc.font("Helvetica-Bold").fontSize(11).text(inr(payment.amountPaise), amountX, rowTop, { width: 98, align: "right" });
  doc.moveTo(left, rowTop + 40).lineTo(right, rowTop + 40).strokeColor(LINE).stroke();

  // Totals.
  const totalsX = right - 230;
  let y = rowTop + 56;
  const totalRow = (name: string, value: string, bold = false) => {
    doc.fillColor(bold ? INK : MUTED).font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 12 : 10)
      .text(name, totalsX, y)
      .text(value, totalsX, y, { width: 230 - 12, align: "right" });
    y += bold ? 24 : 18;
  };
  totalRow("Subtotal", inr(payment.amountPaise));
  doc.moveTo(totalsX, y).lineTo(right, y).strokeColor(LINE).stroke();
  y += 8;
  totalRow("Total paid", inr(payment.amountPaise), true);

  // Payment details.
  y += 24;
  label("Payment details", left, y);
  y += 16;
  const details: [string, string][] = [
    ["Payment method", payment.method ? payment.method.toUpperCase() : "-"],
    ["Paid on", dateTime(paidAt)],
    ["Razorpay payment ID", payment.paymentId ?? "-"],
    ["Razorpay order ID", payment.orderId ?? "-"],
  ];
  for (const [name, value] of details) {
    doc.fillColor(MUTED).font("Helvetica").fontSize(10).text(name, left, y);
    doc.fillColor(INK).font("Helvetica").fontSize(10).text(value, left + 150, y);
    y += 17;
  }

  // Footer.
  const footerY = doc.page.height - 90;
  doc.moveTo(left, footerY).lineTo(right, footerY).strokeColor(LINE).stroke();
  doc.fillColor(MUTED).font("Helvetica").fontSize(9)
    .text(`Thank you for choosing ${SELLER.name}. Questions about this invoice? Write to ${SELLER.email}.`, left, footerY + 14, { width })
    .text("This is a computer-generated invoice and does not require a signature.", left, footerY + 28, { width });

  doc.end();
  return done;
}
