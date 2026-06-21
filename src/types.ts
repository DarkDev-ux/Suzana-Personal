export interface Plan {
  id: string;
  name: string;
  durationMonths: number;
  priceTotal: number;
  priceMonthly: number;
  checkoutUrl: string;
  description: string;
  features: string[];
  badge?: string;
  isPopular?: boolean;
}

export interface PaymentSubscription {
  id: string;
  mpId?: string;
  planId: string;
  planName: string;
  paymentMethod: 'pix' | 'card';
  amount: number;
  status: 'pending' | 'approved' | 'failed';
  customerName: string;
  customerEmail: string;
  customerWhatsApp: string;
  pixCode?: string;
  pixQrCodeImage?: string;
  cardLastFour?: string;
  paymentUrl?: string;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  activeSubscriptions: number;
  pendingVerifications: number;
  approvedCount: number;
}
