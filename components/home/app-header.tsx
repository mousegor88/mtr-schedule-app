import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeTheme } from '@/constants/home-theme';

type AppHeaderProps = {
  onMenuPress: () => void;
  onRefreshPress: () => void;
  isRefreshing: boolean;
};

export function AppHeader({ onMenuPress, onRefreshPress, isRefreshing }: AppHeaderProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.bar}>
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>M</Text>
          </View>
          <Text style={styles.brandText}>
            <Text style={styles.brandDark}>MTR </Text>
            <Text style={styles.brandAccent}>Schedule</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.refreshButton, isRefreshing && styles.refreshButtonActive]}
            onPress={onRefreshPress}
            disabled={isRefreshing}
            accessibilityRole="button"
            accessibilityLabel="Refresh schedule">
            {isRefreshing ? (
              <View style={styles.refreshInner}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.refreshTextActive}>Refreshing...</Text>
              </View>
            ) : (
              <Text style={styles.refreshText}>Refresh</Text>
            )}
          </Pressable>
          <Pressable
            style={styles.menuButton}
            onPress={onMenuPress}
            accessibilityRole="button"
            accessibilityLabel="Open menu">
            <MaterialIcons name="menu" size={26} color={HomeTheme.textPrimary} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: HomeTheme.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: HomeTheme.headerBorder,
    zIndex: 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: HomeTheme.lineTKL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  brandText: {
    fontSize: 18,
  },
  brandDark: {
    color: HomeTheme.textPrimary,
    fontWeight: '700',
  },
  brandAccent: {
    color: HomeTheme.accent,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  refreshButton: {
    backgroundColor: HomeTheme.refreshIdleBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: HomeTheme.refreshIdleBorder,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonActive: {
    backgroundColor: HomeTheme.accent,
    borderColor: HomeTheme.accent,
  },
  refreshInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshText: {
    color: HomeTheme.refreshIdleText,
    fontSize: 13,
    fontWeight: '600',
  },
  refreshTextActive: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
  },
});
