import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type RawTrain = {
  seq: string;
  dest: string;
  plat: string;
  ttnt: string;
};

type DisplayTrain = {
  seq: number;
  destination: string;
  platform: string;
  nextTrain: string;
};

const API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=lhp&lang=tc';
const REFRESH_SECONDS = 15;

const DEST_MAP: Record<string, string> = {
  NOP: 'North Point',
};

function mapDestination(code: string) {
  return DEST_MAP[code] ?? code;
}

function mapNextTrain(ttnt: string) {
  if (ttnt === '0') {
    return 'Departing';
  }

  if (ttnt === '1') {
    return 'Arriving';
  }

  return `${ttnt} mins`;
}

function mapTrains(rows: RawTrain[] | undefined): DisplayTrain[] {
  if (!rows) return [];

  return [...rows]
    .sort((a, b) => Number(a.seq) - Number(b.seq))
    .map((item) => ({
      seq: Number(item.seq),
      destination: mapDestination(item.dest),
      platform: item.plat,
      nextTrain: mapNextTrain(item.ttnt),
    }));
}

export default function LhpScreen() {
  const router = useRouter();
  const [downRaw, setDownRaw] = useState<RawTrain[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('-');
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_SECONDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    debugger; 
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const dataKey = Object.keys(payload?.data ?? {})[0];
      const stationData = dataKey ? payload.data[dataKey] : null;

      setDownRaw(stationData?.DOWN ?? []);
      setLastUpdate(stationData?.curr_time ?? payload?.curr_time ?? '-');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(`Failed to load schedule: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          void load();
          return REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [load]);

  const downTrains = useMemo(() => mapTrains(downRaw), [downRaw]);
  const progressRatio = secondsLeft / REFRESH_SECONDS;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </Pressable>
        <Text style={styles.pageTitle}>LOHAS Park</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
      </View>
      <Text style={styles.refreshText}>Auto refresh in {secondsLeft}s</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? <Text style={styles.infoText}>Loading...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To North Point 往北角</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.destinationCol]}>Destination</Text>
              <Text style={[styles.headerCell, styles.platformCol]}>Platform</Text>
              <Text style={[styles.headerCell, styles.nextTrainCol]}>Next Train</Text>
            </View>

            {downTrains.map((train) => (
              <View key={`down-${train.seq}`} style={styles.row}>
                <Text style={[styles.rowText, styles.destinationCol]}>{train.destination}</Text>
                <View style={styles.platformCol}>
                  <View style={styles.platformCircle}>
                    <Text style={styles.platformText}>{train.platform}</Text>
                  </View>
                </View>
                <Text style={[styles.rowText, styles.nextTrainCol]}>{train.nextTrain}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Last update: {lastUpdate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  topBar: {
    backgroundColor: '#003a70',
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#d5dbe2',
  },
  progressFill: {
    height: 5,
    backgroundColor: '#7d2ca0',
  },
  refreshText: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#3e4e5e',
    fontSize: 14,
    backgroundColor: '#eef2f6',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  lineLabel: {
    fontSize: 24,
    color: '#4d335f',
    marginBottom: 12,
  },
  section: {
    marginBottom: 14,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    backgroundColor: '#e8edf2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 25,
    fontWeight: '700',
    color: '#2f3b46',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  headerCell: {
    fontWeight: '700',
    color: '#30353a',
    fontSize: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  rowText: {
    color: '#2f3439',
    fontSize: 22,
  },
  destinationCol: {
    flex: 1.6,
  },
  platformCol: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -18 }],
  },
  nextTrainCol: {
    flex: 1,
    textAlign: 'left',
  },
  platformCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7d2ca0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#b00020',
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#d9dfe5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#eef2f6',
  },
  footerText: {
    fontSize: 16,
    color: '#324252',
  },
});
