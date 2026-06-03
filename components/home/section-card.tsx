import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { HomeTheme } from '@/constants/home-theme';

type SectionCardProps = {
  title: string;
  children: ReactNode;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function SectionCard({ title, children, error, style }: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: HomeTheme.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: HomeTheme.border,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: HomeTheme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: HomeTheme.border,
    backgroundColor: '#f8f9fb',
  },
  body: {
    paddingHorizontal: 14,
  },
  error: {
    color: HomeTheme.error,
    fontSize: 12,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
});
