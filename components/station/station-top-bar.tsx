import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StationTopBarProps = {
  title: string;
  onBack: () => void;
};

export function StationTopBar({ title, onBack }: StationTopBarProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.bar}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Text style={styles.backText}>{'< Back'}</Text>
        </Pressable>
        <Text style={styles.pageTitle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#003a70',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
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
});
