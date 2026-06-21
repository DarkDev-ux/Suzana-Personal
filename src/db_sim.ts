import fs from 'fs';
import path from 'path';
import { PaymentSubscription } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'payments.json');

// Helper to ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Initial mockup data so the admin panel has beautiful content out-of-the-box
const initialPayments: PaymentSubscription[] = [
  {
    id: "tx_120398",
    planId: "semestral",
    planName: "Plano Semestral (6 Meses)",
    paymentMethod: "pix",
    amount: 479.40,
    status: "approved",
    customerName: "Mariana Silva Santos",
    customerEmail: "mariana.silva@email.com",
    customerWhatsApp: "11988887777",
    pixCode: "00020101021226870014br.gov.bcb.pix2565qr.mercadopago.com/inst/v2/f0e386ce-55a2-4a73-8aef-13b06bc917d25204000053039865802BR5925Mariana%20Silva%20Santos6009Sao%20Paulo62070503***6304CA1F",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    id: "tx_120399",
    planId: "mensal",
    planName: "Plano Mensal (1 Mês)",
    paymentMethod: "card",
    amount: 99.90,
    status: "pending",
    customerName: "Rodrigo Almeida",
    customerEmail: "rodrigo.almeida@hotmail.com",
    customerWhatsApp: "21977776666",
    cardLastFour: "4321",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: "tx_120400",
    planId: "trimestral",
    planName: "Plano Trimestral (3 Meses)",
    paymentMethod: "pix",
    amount: 269.70,
    status: "approved",
    customerName: "Camila Fernandes",
    customerEmail: "camila.fer@gmail.com",
    customerWhatsApp: "19966665555",
    createdAt: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  }
];

export function getPayments(): PaymentSubscription[] {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } else {
      // Create with initial mockup
      savePayments(initialPayments);
      return initialPayments;
    }
  } catch (error) {
    console.error('Error reading payments file, returning memory fallback:', error);
    return initialPayments;
  }
}

export function savePayments(payments: PaymentSubscription[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(payments, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing payments file:', error);
    return false;
  }
}

export function addPayment(payment: PaymentSubscription): PaymentSubscription {
  const current = getPayments();
  current.unshift(payment); // Insert at the beginning (latest first)
  savePayments(current);
  return payment;
}

export function updatePaymentStatus(id: string, status: 'approved' | 'pending' | 'failed'): PaymentSubscription | null {
  const current = getPayments();
  const index = current.findIndex(p => p.id === id);
  if (index !== -1) {
    current[index].status = status;
    savePayments(current);
    return current[index];
  }
  return null;
}
