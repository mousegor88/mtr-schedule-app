import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeTheme } from '@/constants/home-theme';

type StationLinkCardProps = {
  title: string;
  onPress: () => void;
};

export function StationLinkCard({ title, onPress }: StationLinkCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.actions}>
        <View style={styles.outlineButton}>
          <Text style={styles.outlineText}>詳細班次</Text>
        </View>
        <View style={styles.solidButton}>
          <Text style={styles.solidText}>Live</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: HomeTheme.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: HomeTheme.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: HomeTheme.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: HomeTheme.linkOutline,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outlineText: {
    color: HomeTheme.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  solidButton: {
    flex: 1,
    backgroundColor: HomeTheme.linkSolid,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  solidText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
