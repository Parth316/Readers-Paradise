import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Order } from "../types/orderTypes";

export const usePacking = (order: Order | null, setOrder: (order: Order) => void) => {
  const [packedItems, setPackedItems] = useState<boolean[]>([]);
  const [isPacked, setIsPacked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        `http://localhost:5000/api/orders/${order._id}/pack`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setIsPacked(true);
      setOrder({ ...order, status: "packed", updatedAt: new Date().toISOString() });
      toast.success("Order packed successfully!");
    } catch (error: any) {
      const errorMessage = (error as AxiosError).response?.data?.message || "Failed to pack order.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { packedItems, setPackedItems, isPacked, isSubmitting, toggleItemPacked, completePacking };
};