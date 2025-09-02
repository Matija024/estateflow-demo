// EstateFlow Analysis API
import { request } from './base';

export interface MarketData {
  region: string;
  averageRent: number;
  priceGrowth: number;
  vacancy: number;
  chartData: Array<{
    period: string;
    rent: number;
    growth: number;
  }>;
}

export interface PortfolioProperty {
  id: string;
  name: string;
  city: string;
  yield: number;
  value: number;
  occupancy: number;
  status: 'active' | 'maintenance' | 'vacant';
}

export interface PortfolioData {
  properties: PortfolioProperty[];
  totalValue: number;
  averageYield: number;
  occupancyRate: number;
}

export async function getMarketAnalysis(region: string, assetClass: string): Promise<MarketData> {
  return request<MarketData>('GET', `/analysis/market?region=${region}&class=${assetClass}`, {
    region,
    averageRent: 12.5 + Math.random() * 3,
    priceGrowth: 2.1 + Math.random() * 1.5,
    vacancy: 5.2 + Math.random() * 2,
    chartData: [
      { period: '2023 Q1', rent: 11.8, growth: 1.8 },
      { period: '2023 Q2', rent: 12.1, growth: 2.0 },
      { period: '2023 Q3', rent: 12.3, growth: 2.2 },
      { period: '2023 Q4', rent: 12.5, growth: 2.1 },
    ],
  });
}

export async function loadPortfolio(): Promise<PortfolioData> {
  return request<PortfolioData>('GET', '/analysis/portfolio', {
    properties: [
      {
        id: 'prop-1',
        name: 'Bürokomplex München',
        city: 'München',
        yield: 4.1,
        value: 8500000,
        occupancy: 92,
        status: 'active' as const,
      },
      {
        id: 'prop-2', 
        name: 'Wohnanlage Berlin',
        city: 'Berlin',
        yield: 3.8,
        value: 6200000,
        occupancy: 88,
        status: 'active' as const,
      },
      {
        id: 'prop-3',
        name: 'Einzelhandel Hamburg',
        city: 'Hamburg', 
        yield: 4.5,
        value: 4200000,
        occupancy: 85,
        status: 'maintenance' as const,
      },
    ],
    totalValue: 18900000,
    averageYield: 4.1,
    occupancyRate: 88.3,
  });
}