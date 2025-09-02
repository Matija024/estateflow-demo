// EstateFlow Reports API
import { request } from './base';

export interface Report {
  id: string;
  period: string;
  region: string;
  assetClass: string;
  includeKpis: boolean;
  generatedAt: Date;
  data: {
    kpis: {
      yield: number;
      occupancy: number;
      totalValue: number;
    };
    table: Array<{
      property: string;
      city: string;
      yield: number;
      value: number;
    }>;
    chartData: Array<{
      month: string;
      value: number;
    }>;
  };
}

export interface ReportParams {
  period: string;
  region: string;
  assetClass: string;
  includeKpis: boolean;
}

export async function generateReport(params: ReportParams): Promise<Report> {
  return request<Report>('POST', '/reports/generate', {
    ...params,
    id: Math.random().toString(36).substr(2, 9),
    generatedAt: new Date(),
    data: {
      kpis: {
        yield: 4.2 + Math.random() * 1.5,
        occupancy: 88 + Math.random() * 10,
        totalValue: 15600000 + Math.random() * 5000000,
      },
      table: [
        {
          property: 'Bürokomplex München',
          city: 'München',
          yield: 4.1,
          value: 8500000,
        },
        {
          property: 'Wohnanlage Berlin',
          city: 'Berlin', 
          yield: 3.8,
          value: 6200000,
        },
      ],
      chartData: [
        { month: 'Q1', value: 4.0 },
        { month: 'Q2', value: 4.2 },
        { month: 'Q3', value: 4.1 },
      ],
    },
  });
}

export async function saveReportAsPdf(reportId: string): Promise<{ success: boolean; filename: string }> {
  return request<{ success: boolean; filename: string }>('POST', `/reports/${reportId}/pdf`, {
    success: true,
    filename: `estate-report-${reportId}.pdf`,
  });
}