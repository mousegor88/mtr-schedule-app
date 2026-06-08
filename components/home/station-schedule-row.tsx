import { StyleSheet, Text, View } from 'react-native';

import { ArrivalTimesColumn } from '@/components/home/arrival-times-column';
import { HomeTheme } from '@/constants/home-theme';

type StationScheduleRowProps = {
  code: string;
  label: string;
  times: string[];
  color: string;
  isLast?: boolean;
};

export function StationScheduleRow({ code, label, times, color, isLast }: StationScheduleRowProps) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={[styles.lineBar, { backgroundColor: color }]} />
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{code}</Text>
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <ArrivalTimesColumn times={times} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: HomeTheme.border,
    gap: 10,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  lineBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    color: HomeTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
