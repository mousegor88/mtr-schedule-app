import { StyleSheet, Text, View } from 'react-native';

import { HomeTheme } from '@/constants/home-theme';

type ArrivalTimesColumnProps = {
  times: string[];
};

export function ArrivalTimesColumn({ times }: ArrivalTimesColumnProps) {
  const slots = times.length >= 3 ? times.slice(0, 3) : [...times, '—', '—', '—'].slice(0, 3);

  return (
    <View style={styles.column}>
      {slots.map((time, index) => (
        <Text
          key={`${index}-${time}`}
          style={[styles.time, index === 0 ? styles.timePrimary : styles.timeMuted]}>
          {time}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    minWidth: 72,
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
  },
  timePrimary: {
    color: HomeTheme.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  timeMuted: {
    color: HomeTheme.textMuted,
  },
});
