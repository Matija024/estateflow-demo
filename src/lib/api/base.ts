// EstateFlow Base API Client
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

  // Simulate occasional errors (10% chance)
  if (Math.random() < 0.1) {
    throw new ApiError(500, 'Netzwerkfehler - Bitte erneut versuchen');
  }

  // Return mock data
  return data as T;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}