import { HomeTheme } from '@/constants/home-theme';

export const LINE_COLORS = {
  TKL: HomeTheme.lineTKL,
  KTL: '#00A040',
  QUB: '#00A5DB',
  TML: '#CC743B',
} as const;

export const STATION_COLORS: Record<string, string> = {
  LHP: LINE_COLORS.TKL,
  TKO: LINE_COLORS.TKL,
  QUB: LINE_COLORS.TKL,
  TIK: LINE_COLORS.TKL,
  DIH: LINE_COLORS.TML,
};

export function getStationColor(code: string, context?: 'outbound' | 'inbound'): string {
  if (context === 'outbound' && code === 'TIK') {
    return LINE_COLORS.KTL;
  }
  if (context === 'outbound' && code === 'DIH') {
    return LINE_COLORS.TML;
  }
  if (context === 'inbound' && code === 'QUB') {
    return LINE_COLORS.QUB;
  }

  return STATION_COLORS[code] ?? HomeTheme.lineTKL;
}
