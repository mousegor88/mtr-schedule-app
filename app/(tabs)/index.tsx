import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const REFRESH_MS = 15000;
const TKO_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=Tko&lang=tc';
const QUB_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=qub&lang=tc';
const TIK_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=tik&lang=tc';
const APP_VERSION = 'v1.0.3';

type RawTrain = {
  seq: string;
  dest: string;
  ttnt: string;
};

function mapNextTrain(ttnt: string) {
  if (ttnt === '0') return 'Departing';
  if (ttnt === '1') return 'Arriving';
  return `${ttnt} mins`;
}

async function fetchLhpNextTrain(apiUrl: string) {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const payload = await response.json();
  const dataKey = Object.keys(payload?.data ?? {})[0];
  const stationData = dataKey ? payload.data[dataKey] : null;
  const upRows: RawTrain[] = stationData?.UP ?? [];

  const lhpTrain = [...upRows]
    .filter((item) => item.dest === 'LHP')
    .sort((a, b) => Number(a.seq) - Number(b.seq))[0];

  if (!lhpTrain) return '冇車';
  return mapNextTrain(lhpTrain.ttnt);
}

export default function HomeScreen() {
  const router = useRouter();
  const [tkoNextTrain, setTkoNextTrain] = useState('Loading...');
  const [qubNextTrain, setQubNextTrain] = useState('Loading...');
  const [tikNextTrain, setTikNextTrain] = useState('Loading...');
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setSummaryError(null);

    try {
      const [tkoNext, qubNext, tikNext] = await Promise.all([
        fetchLhpNextTrain(TKO_API_URL),
        fetchLhpNextTrain(QUB_API_URL),
        fetchLhpNextTrain(TIK_API_URL),
      ]);
      setTkoNextTrain(tkoNext);
      setQubNextTrain(qubNext);
      setTikNextTrain(tikNext);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setSummaryError(`Unable to refresh live data: ${message}`);
      setTkoNextTrain('Unavailable');
      setQubNextTrain('Unavailable');
      setTikNextTrain('Unavailable');
    }
  }, []);

  useEffect(() => {
    void loadSummary();
    const timer = setInterval(() => {
      void loadSummary();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadSummary]);

  return (
    <View style={styles.container}>
      <View style={styles.glowOrbTop} />
      <View style={styles.glowOrbBottom} />

      <View style={styles.headerCard}>
        <Text style={styles.kicker}>MTR LIVE MONITOR</Text>
        <Text style={styles.title}>MTR Schedule</Text>
        <Text style={styles.subtitle}>Real-time train insights</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Next train to LOHAS Park (返屋企)</Text>
         <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TIK  調景嶺開出</Text>
          <Text style={styles.summaryValue}>{tikNextTrain}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TKO 將軍澳開出</Text>
          <Text style={styles.summaryValue}>{tkoNextTrain}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>QUB 鰂魚涌開出</Text>
          <Text style={styles.summaryValue}>{qubNextTrain}</Text>
        </View>
       {summaryError ? <Text style={styles.errorText}>{summaryError}</Text> : null}
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => router.push('/tko')}>
          <Text style={styles.buttonText}>Tseung Kwan O(TKO) 將軍澳站資訊</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push('/lhp')}>
          <Text style={styles.buttonText}>LOHAS Park(LHP) 日出康城站資訊</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push('/tbc')}>
          <Text style={styles.buttonText}>Quarry Bay(QUB) 鰂魚涌站資訊</Text>
        </Pressable>
      </View>

      <Text style={styles.version}>Version {APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b1a',
    paddingHorizontal: 18,
    paddingTop: 64,
    paddingBottom: 30,
  },
  glowOrbTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#3a53f9',
    opacity: 0.25,
    top: -60,
    right: -50,
  },
  glowOrbBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#b530ff',
    opacity: 0.2,
    bottom: -80,
    left: -60,
  },
  headerCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#3044b8',
    backgroundColor: '#0f1631',
    padding: 18,
    marginBottom: 16,
  },
  kicker: {
    color: '#57e5ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  title: {
    color: '#f2f5ff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#a5afd8',
    fontSize: 14,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3e4fb1',
    backgroundColor: '#101736',
    padding: 16,
    marginBottom: 18,
  },
  summaryTitle: {
    color: '#e4e8ff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#24305f',
  },
  summaryLabel: {
    color: '#9da9d9',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#7dffcf',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#ff9a9a',
    fontSize: 12,
    marginTop: 10,
  },
  version: {
    marginTop: 'auto',
    textAlign: 'center',
    color: '#9ea9d8',
    fontSize: 13,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1a2550',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4f63d9',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
