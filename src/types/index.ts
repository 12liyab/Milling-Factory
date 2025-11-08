export interface SalesRecord {
  id: string;
  date: string;
  clientName: string;
  phoneNumber?: string;
  machineType: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  paymentType: 'Cash' | 'Mobile Money' | 'Credit';
  notes?: string;
  createdAt: number;
}

export interface MachineType {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
}

export interface DailySummary {
  totalSales: number;
  clientsServed: number;
  salesByMachine: Record<string, number>;
}
