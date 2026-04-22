import { StyleSheet, Text, View } from 'react-native';

const SETTINGS_ITEMS = ['Theme', 'About', 'Version'];

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Base options for future configuration</Text>

      <View style={styles.card}>
        {SETTINGS_ITEMS.map((item) => (
          <View key={item} style={styles.row}>
            <Text style={styles.rowLabel}>{item}</Text>
            <Text style={styles.rowValue}>Coming soon</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    backgroundColor: '#f3f5fa',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f6b7d',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e6f1',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f7',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#243041',
  },
  rowValue: {
    fontSize: 13,
    color: '#6c7a8f',
  },
});
