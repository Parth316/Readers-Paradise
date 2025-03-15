import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { ToastContainer } from "react-toastify";
import { Check, CircleMinus} from "lucide-react";

interface Item {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email: string;
  deliveryInstructions: string;
}

interface Order {
  _id: string;
  userId: string;
  items: Item[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
  carrier?: string;
}

interface Box {
  size: string | null;
  items: Item[];
}

const OrderProcess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [packedItems, setPackedItems] = useState<boolean[]>([]);
  const [isPacked, setIsPacked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedBoxSize, setSelectedBoxSize] = useState<string>();
  const [isbnInput, setIsbnInput] = useState<string>("");
  const [isbnMatch, setIsbnMatch] = useState<string|null>(null);
  const [isbnError, setIsbnError] = useState<string | null>(null);

  const BACKEND_URL = "http://localhost:5000";

  const boxSizes = [
    "Small (10x8x4)",
    "Medium (12x10x6)",
    "Large (15x12x8)",
    "Extra Large (18x14x10)",
    "Book Box (12x9x3)",
    "Flat Box (16x12x2)",
    "Tall Box (10x10x12)",
    "Cube (12x12x12)",
    "Long Box (20x8x6)",
    "Wide Box (14x14x4)",
    "Heavy Duty (16x12x10)",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(response.data);
        setPackedItems(new Array(response.data.items.length).fill(false));
        setIsPacked(response.data.status === "packed");
        setError(null);
      } catch (err: any) {
        const errorMessage = "Failed to fetch order";
        setError(errorMessage);
        toast.error("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const fetchBookByIsbn = async (isbn: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/isbn/${isbn}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsbnMatch(response.data);
      setIsbnError(null);
    } catch (err: any) {
      setIsbnMatch(null);
      setIsbnError(
        err.response?.data?.message || "No book found with this ISBN."
      );
    }
  };
  // Add this to handle ISBN input change
  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isbn = e.target.value;
    setIsbnInput(isbn);
    if (isbn.length >= 10) {
      // Assuming ISBN-10 or ISBN-13 length
      fetchBookByIsbn(isbn);
    } else {
      setIsbnMatch(null);
      setIsbnError(null);
    }
  };

  // Updated addBox function
  const addBox = () => {
    if (!selectedBoxSize) {
      toast.error("Please select a box size.");
      return;
    }
    setBoxes([...boxes, { size: selectedBoxSize, items: [] }]);
    setSelectedBoxSize(""); // Reset selection after adding
  };

  // Updated removeBox function
  const removeBox = (index: number) => {
    setBoxes(boxes.filter((_, i) => i !== index));
  };

  const toggleItemPacked = (index: number) => {
    if (!isPacked && order) {
      setPackedItems((prev) => {
        const newPacked = [...prev];
        newPacked[index] = !newPacked[index];
        return newPacked;
      });
    }
  };

  const completePacking = async () => {
    if (!order) {
      toast.error("No order data available to pack.");
      return;
    }
    if (!packedItems.every((p) => p)) {
      toast.error("Please ensure all items are packed.");
      return;
    }
    if (isPacked) {
      toast.info("Order is already packed.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/orders/${order._id}/pack`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsPacked(true);
      setOrder({
        ...order,
        status: "packed",
        updatedAt: new Date().toISOString(),
      });
      toast.success("Order packed successfully!");
    } catch (error: any) {
      const errorMessage =
        (error as AxiosError).response?.data?.message ||
        "Failed to pack order.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateShippingLabel = () => {
    if (!order) {
      toast.error("No order data available to generate label.");
      return;
    }
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [4.1, 6.2],
    });
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
    addressLines.forEach((line, index) =>
      doc.text(line, 0.35, 2.7 + index * 0.18)
    );

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
    const packageWeight = "0.5"; // Placeholder
    doc.text(`Method: ${shippingMethod}`, 0.35, 4.15);
    doc.text(`Weight: ${packageWeight} kg`, 2.0, 4.15);

    const maxItemsToShow = 5;
    const itemsToDisplay =
      order.items.length > maxItemsToShow
        ? order.items.slice(0, maxItemsToShow)
        : order.items;
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
      const title =
        item.title.length > 30
          ? item.title.substring(0, 27) + "..."
          : item.title;
      doc.text(title, 0.7, y);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 3.6, y, {
        align: "right",
      });
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
    doc.text(`$${order.totalAmount.toFixed(2)}`, 3.5, totalY + 0.2, {
      align: "right",
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg animate-pulse">Loading order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3f3d3c] my-8">
          Process Order #{order._id}
        </h1>

        <div className="felx grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
                Order Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4"></th>
                      <th className="p-4">Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">ISBN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const imageUrl = item.image?.startsWith("http")
                        ? item.image
                        : `${BACKEND_URL}/${item.image}`;
                      return (
                        <tr
                          key={item.bookId}
                          className="border-b border-gray-200"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={packedItems[index]}
                              onChange={() => toggleItemPacked(index)}
                              disabled={isPacked || isSubmitting}
                              className="h-5 w-5 text-[#d2b47f] focus:ring-[#d2b47f] border-gray-300 rounded"
                            />
                          </td>
                          <td className="p-4">
                            {item.image && (
                              <img
                                src={
                                  imageUrl || "https://via.placeholder.com/150"
                                }
                                alt={item.title}
                                className="w-10 h-10 object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://via.placeholder.com/150";
                                }}
                              />
                            )}
                          </td>
                          <td className="p-4 text-gray-800 font-medium">
                            {item.title}
                          </td>
                          <td className="p-4 text-gray-600">{item.quantity}</td>
                          <td className="p-4 text-gray-600">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-4 text-gray-700 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td>
                            <input
                              type="text"
                              value={isbnInput}
                              onChange={handleIsbnChange}
                              placeholder="Enter ISBN"
                              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />
                            {isbnMatch && (
                              <p className="text-green-600 mt-1 ms-3">
                                Match: {isbnMatch.title}
                              </p>
                            )}
                            {isbnError && (
                              <p className="text-red-600 mt-1">{isbnError}</p>
                            )}{" "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <h3 className="text-lg font-semibold text-[#3f3d3c]">Total:</h3>
                <p className="text-lg font-semibold text-[#3f3d3c]">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Packing Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
                Packing Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#3f3d3c] mb-1">
                    Shipping Address
                  </h3>
                  <p className="text-gray-600">
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>

                {/* Box Management  */}
                <div>
                  <h3 className="text-lg font-semibold text-[#3f3d3c] mb-1">
                    Carrier
                  </h3>
                  <p className="text-gray-600">
                    {order.carrier || "Not Assigned"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#3f3d3c] mb-1">
                    Status
                  </h3>
                  <p className="text-gray-600">{order.status.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#3f3d3c] mb-1">
                    Box Management
                  </h3>
                  <div className="flex flex-col space-y-2">
                    <select
                      value={selectedBoxSize}
                      onChange={(e) => setSelectedBoxSize(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      {boxSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={addBox}
                        className="flex-1 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition duration-300"
                      >
                        Add Box
                      </button>
                     
                    </div>
                    <div>
                      <p className="text-gray-600">Current Boxes:</p>
                      <ul className="list-disc pl-5 text-gray-600">
                        {boxes.map((box, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between py-2"
                          >
                            <span>{box.size}</span>
                            <button
                              onClick={() => removeBox(index)}
                              className="text-white font-extrabold hover:text-red-800 bg-red-500 w-8 h-8 border  rounded-3xl focus:outline-none"
                            >
                              -
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {!isPacked ? (
                  <button
                    onClick={completePacking}
                    disabled={!packedItems.every((p) => p) || isSubmitting}
                    className={`w-full text-lg bg-slate-600 text-white py-3 rounded-full border-2 border-gray-600 transition duration-300 ${
                      !packedItems.every((p) => p) || isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#c1a36f] hover:text-black"
                    }`}
                  >
                    {isSubmitting ? "Packing..." : "Complete Packing"}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-green-600 font-semibold">
                      Order has been packed.
                    </p>
                    <button
                      onClick={generateShippingLabel}
                      className="w-full text-lg bg-slate-600 text-white py-3 rounded-full border-2 border-gray-600 hover:bg-[#c1a36f] hover:text-black transition duration-300"
                    >
                      Print Shipping Label
                    </button>
                  </div>
                )}
                <button
                  onClick={() => navigate("/listOrders")}
                  className="w-full text-lg bg-gray-300 text-[#3f3d3c] py-3 rounded-full border-2 border-gray-300 hover:bg-gray-400 transition duration-300"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OrderProcess;
