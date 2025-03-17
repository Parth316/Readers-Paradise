import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { toast } from "react-toastify";
import { Order } from "../types/orderTypes";

export const generateShippingLabel = (order: Order | null) => {
  if (!order) {
    toast.error("No order data available to generate label.");
    return;
  }
  const doc = new jsPDF({ orientation: "portrait", unit: "in", format: [4.1, 6.2] });
  doc.setFillColor(250, 250, 250);
  doc.rect(0.1, 0.1, 3.9, 6.0, "F");

  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.01);
  doc.rect(0.25, 0.25, 3.6, 0.45, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text("SHIPPING LABEL", 2.05, 0.5, { align: "center" });

  const canvas = document.createElement("canvas");
  JsBarcode(canvas, order._id, {
    format: "CODE128",
    width: 1.8,
    height: 25,
    displayValue: true,
    fontSize: 9,
    textMargin: 2,
    background: "#FFFFFF",
  });
  doc.addImage(canvas.toDataURL("image/png"), "PNG", 0.5, 0.85, 3.1, 0.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Tracking #: ${order._id}`, 2.05, 1.4, { align: "center" });

  doc.setFillColor(240, 240, 240);
  doc.rect(0.25, 1.5, 3.6, 0.25, "F");
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.01);
  doc.rect(0.25, 1.5, 3.6, 0.65, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("From:", 0.35, 1.7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text("Reader's Paradise", 0.35, 1.9);
  doc.text("Algonquin College, Mississauga.", 0.35, 2.05);

  doc.setFillColor(240, 240, 240);
  doc.rect(0.25, 2.3, 3.6, 0.25, "F");
  doc.rect(0.25, 2.3, 3.6, 1.3, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("Ship To:", 0.35, 2.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  const addressLines = [
    order.shippingAddress.recipientName,
    order.shippingAddress.address,
    `${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
    order.shippingAddress.country,
    `Phone: ${order.shippingAddress.phoneNumber}`,
    `Email: ${order.shippingAddress.email}`,
  ];
  addressLines.forEach((line, index) => doc.text(line, 0.35, 2.7 + index * 0.18));

  doc.setFillColor(240, 240, 240);
  doc.rect(0.25, 3.75, 3.6, 0.25, "F");
  doc.rect(0.25, 3.75, 3.6, 0.5, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("Package Info:", 0.35, 3.95);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const shippingMethod = order.carrier || "Standard Shipping";
  const packageWeight = "0.5";
  doc.text(`Method: ${shippingMethod}`, 0.35, 4.15);
  doc.text(`Weight: ${packageWeight} kg`, 2.0, 4.15);

  const maxItemsToShow = 5;
  const itemsToDisplay = order.items.length > maxItemsToShow ? order.items.slice(0, maxItemsToShow) : order.items;
  const itemsSectionHeight = 0.25 + itemsToDisplay.length * 0.18 + 0.15;
  doc.setFillColor(240, 240, 240);
  doc.rect(0.25, 4.4, 3.6, 0.25, "F");
  doc.rect(0.25, 4.4, 3.6, itemsSectionHeight, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("Items:", 0.35, 4.6);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.005);
  doc.line(0.25, 4.7, 3.85, 4.7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(20, 20, 20);
  itemsToDisplay.forEach((item, index) => {
    const y = 4.85 + index * 0.18;
    doc.text(`${item.quantity}x`, 0.35, y);
    const title = item.title.length > 30 ? item.title.substring(0, 27) + "..." : item.title;
    doc.text(title, 0.7, y);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 3.6, y, { align: "right" });
    if (index < itemsToDisplay.length - 1) {
      doc.setDrawColor(230, 230, 230);
      doc.line(0.35, y + 0.09, 3.75, y + 0.09);
    }
  });

  const totalY = 4.85 + itemsToDisplay.length * 0.18 + 0.1;
  doc.setFillColor(60, 60, 60);
  doc.rect(0.25, totalY, 3.6, 0.3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Total:", 0.45, totalY + 0.2);
  doc.text(`$${order.totalAmount.toFixed(2)}`, 3.5, totalY + 0.2, { align: "right" });

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
};