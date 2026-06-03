import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppHeader } from '@/components/home/app-header';
import { NavDrawer } from '@/components/home/nav-drawer';
import { SectionCard } from '@/components/home/section-card';
import { StationLinkCard } from '@/components/home/station-link-card';
import { StationScheduleRow } from '@/components/home/station-schedule-row';
import { HomeTheme } from '@/constants/home-theme';
import {
  HOME_CONTENT_MAX_WIDTH_NARROW,
  HOME_CONTENT_MAX_WIDTH_WIDE,
  HOME_WIDE_BREAKPOINT,
} from '@/constants/layout';
import { fetchTrainTimes, UNAVAILABLE_TIMES } from '@/lib/mtr-schedule';

const REFRESH_MS = 15000;
const REFRESH_LOCK_MS = 2000;
const TRAIN_LIMIT = 3;

const LHP_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=lhp&lang=tc';
const TKO_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=Tko&lang=tc';
const QUB_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=qub&lang=tc';
const TIK_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=tik&lang=tc';
const KTL_API_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=KTL&sta=tik&lang=tc';

const APP_VERSION = 'v1.0.5';

export type StationTimes = {
  code: string;
  label: string;
  times: string[];
};

const LOADING_TIMES = ['Loading...', 'Loading...', 'Loading...'];

const INITIAL_OUTBOUND: StationTimes[] = [
  { code: 'LHP', label: 'LHP 康城開出', times: LOADING_TIMES },
  { code: 'TIK', label: 'TIK 調景嶺開出', times: LOADING_TIMES },
];

const INITIAL_INBOUND: StationTimes[] = [
  { code: 'TIK', label: 'TIK 調景嶺開出', times: LOADING_TIMES },
  { code: 'TKO', label: 'TKO 將軍澳開出', times: LOADING_TIMES },
  { code: 'QUB', label: 'QUB 鰂魚涌開出', times: LOADING_TIMES },
];

function mapRowsWithUnavailable(rows: StationTimes[]): StationTimes[] {
  return rows.map((row) => ({
    ...row,
    times: [...UNAVAILABLE_TIMES],
  }));
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= HOME_WIDE_BREAKPOINT;

  const [outboundRows, setOutboundRows] = useState<StationTimes[]>(INITIAL_OUTBOUND);
  const [inboundRows, setInboundRows] = useState<StationTimes[]>(INITIAL_INBOUND);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const contentStyle = useMemo(
    () => [
      styles.scrollContent,
      isWide && styles.scrollContentWide,
      {
        maxWidth: isWide ? HOME_CONTENT_MAX_WIDTH_WIDE : HOME_CONTENT_MAX_WIDTH_NARROW,
        alignSelf: 'center' as const,
        width: '100%' as const,
      },
    ],
    [isWide]
  );

  const sectionCardStyle = isWide ? styles.sectionCardWide : undefined;

  const fetchSummary = useCallback(async () => {
    setSummaryError(null);

    const [lhpOut, tikOut, tikIn, tkoIn, qubIn] = await Promise.all([
      fetchTrainTimes(LHP_API_URL, { direction: 'DOWN', limit: TRAIN_LIMIT }),
      fetchTrainTimes(KTL_API_URL, { direction: 'DOWN', limit: TRAIN_LIMIT }),
      fetchTrainTimes(TIK_API_URL, { direction: 'UP', destFilter: 'LHP', limit: TRAIN_LIMIT }),
      fetchTrainTimes(TKO_API_URL, { direction: 'UP', destFilter: 'LHP', limit: TRAIN_LIMIT }),
      fetchTrainTimes(QUB_API_URL, { direction: 'UP', destFilter: 'LHP', limit: TRAIN_LIMIT }),
    ]);

    setOutboundRows([
      { code: 'LHP', label: 'LHP 康城開出', times: lhpOut },
      { code: 'TIK', label: 'TIK 調景嶺開出', times: tikOut },
    ]);
    setInboundRows([
      { code: 'TIK', label: 'TIK 調景嶺開出', times: tikIn },
      { code: 'TKO', label: 'TKO 將軍澳開出', times: tkoIn },
      { code: 'QUB', label: 'QUB 鰂魚涌開出', times: qubIn },
    ]);
    setLastUpdatedAt(
      new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    );
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      await fetchSummary();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setSummaryError(`Unable to refresh live data: ${message}`);
      setOutboundRows(mapRowsWithUnavailable(INITIAL_OUTBOUND));
      setInboundRows(mapRowsWithUnavailable(INITIAL_INBOUND));
    }
  }, [fetchSummary]);

  const refreshWithMinLock = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    const started = Date.now();

    try {
      await loadSummary();
    } finally {
      const remaining = REFRESH_LOCK_MS - (Date.now() - started);
      if (remaining > 0) await delay(remaining);
      setIsRefreshing(false);
    }
  }, [isRefreshing, loadSummary]);

  const handleManualRefresh = useCallback(() => {
    void refreshWithMinLock();
  }, [refreshWithMinLock]);

  useEffect(() => {
    void loadSummary();
    const timer = setInterval(() => {
      void loadSummary();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadSummary]);

  return (
    <View style={styles.container}>
      <AppHeader
        onMenuPress={() => setMenuOpen(true)}
        onRefreshPress={handleManualRefresh}
        isRefreshing={isRefreshing}
      />
      <NavDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeItemId="home"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void refreshWithMinLock()}
            tintColor={HomeTheme.accent}
            colors={[HomeTheme.accent]}
          />
        }>
          
        {lastUpdatedAt ? (
          <Text style={styles.lastUpdatedBanner}>Last updated: {lastUpdatedAt}</Text>
        ) : null}
        <View style={[styles.scheduleRow, isWide && styles.scheduleRowWide]}>
          <SectionCard
            title="Next train from LOHAS Park (出街)"
            error={summaryError}
            style={sectionCardStyle}>
            {outboundRows.map((row, index) => (
              <StationScheduleRow
                key={`out-${row.code}`}
                code={row.code}
                label={row.label}
                times={row.times}
                isLast={index === outboundRows.length - 1}
              />
            ))}
          </SectionCard>

          <SectionCard title="Next train to LOHAS Park (返屋企)" style={sectionCardStyle}>
            {inboundRows.map((row, index) => (
              <StationScheduleRow
                key={`in-${row.code}`}
                code={row.code}
                label={row.label}
                times={row.times}
                isLast={index === inboundRows.length - 1}
              />
            ))}
          </SectionCard>
        </View>

        <Text style={styles.linksHeading}>Station details</Text>
        <StationLinkCard
          title="Tseung Kwan O (TKO) 將軍澳站"
          onPress={() => router.push('/tko')}
        />
        <StationLinkCard
          title="LOHAS Park (LHP) 日出康城站"
          onPress={() => router.push('/lhp')}
        />
        <StationLinkCard
          title="Quarry Bay (QUB) 鰂魚涌站"
          onPress={() => router.push('/tbc')}
        />

        <Text style={styles.version}>Version {APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HomeTheme.pageBg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  scrollContentWide: {
    paddingHorizontal: 32,
  },
  scheduleRow: {
    marginBottom: 16,
  },
  scheduleRowWide: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  sectionCardWide: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
  },
  lastUpdatedBanner: {
    textAlign: 'center',
    color: HomeTheme.textMuted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  linksHeading: {
    color: HomeTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  version: {
    textAlign: 'center',
    color: HomeTheme.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
});
