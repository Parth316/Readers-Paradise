import React, { useEffect, useState, useCallback } from "react";

interface ShippingAddress {
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface LowStockBook {
  title: string;
  isbn: string;
  stock: number;
}

interface Order {
  _id: string;
  shippingAddress: ShippingAddress;
  totalAmount: string;
  status: string;
}

interface OrderOverTime {
  date: string;
  count: number;
}

interface DashboardData {
  totalBooks: number;
  pendingOrders: number;
  totalUsers: number;
  recentActivity: string;
  ordersOverTime: OrderOverTime[];
  lowStockBooks: LowStockBook[];
  recentOrders: Order[];
}

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBooks: 0,
    pendingOrders: 0,
    totalUsers: 0,
    recentActivity: "",
    ordersOverTime: [],
    lowStockBooks: [],
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/adminPanel");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data: DashboardData = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { dashboardData, loading, refetch: fetchData };
};