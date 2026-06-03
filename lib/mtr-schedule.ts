export type RawTrain = {
  seq: string;
  dest: string;
  ttnt: string;
};

const EMPTY_SLOT = '—';

export function mapNextTrain(ttnt: string) {
  if (ttnt === '0') return 'Departing';
  if (ttnt === '1') return 'Arriving';
  return `${ttnt} mins`;
}

export async function fetchTrainTimes(
  apiUrl: string,
  options: {
    direction: 'UP' | 'DOWN';
    destFilter?: string;
    limit?: number;
  }
): Promise<string[]> {
  const limit = options.limit ?? 3;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const payload = await response.json();
  const dataKey = Object.keys(payload?.data ?? {})[0];
  const stationData = dataKey ? payload.data[dataKey] : null;
  const rows: RawTrain[] = stationData?.[options.direction] ?? [];

  let filtered = [...rows];
  if (options.destFilter) {
    filtered = filtered.filter((item) => item.dest === options.destFilter);
  }

  const times = filtered
    .sort((a, b) => Number(a.seq) - Number(b.seq))
    .slice(0, limit)
    .map((item) => mapNextTrain(item.ttnt));

  while (times.length < limit) {
    times.push(EMPTY_SLOT);
  }

  return times;
}

export const UNAVAILABLE_TIMES = ['Unavailable', 'Unavailable', 'Unavailable'] as const;
