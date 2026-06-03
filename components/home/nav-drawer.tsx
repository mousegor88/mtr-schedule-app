import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeTheme } from '@/constants/home-theme';
import {
  NAV_DRAWER_FOOTER_URL,
  NAV_MENU_ITEMS,
  type NavMenuItemId,
} from '@/constants/nav-menu';

type NavDrawerProps = {
  visible: boolean;
  onClose: () => void;
  activeItemId: NavMenuItemId;
};

export function NavDrawer({ visible, onClose, activeItemId }: NavDrawerProps) {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.85, 320);
  const [networkExpanded, setNetworkExpanded] = useState(false);

  const handleItemPress = (id: NavMenuItemId, hasChevron?: boolean) => {
    if (hasChevron) {
      setNetworkExpanded((prev) => !prev);
      return;
    }
    // TODO: navigate when routes exist
    onClose();
  };

  const handleFooterPress = () => {
    void Linking.openURL(NAV_DRAWER_FOOTER_URL);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close menu" />
        <SafeAreaView style={[styles.panel, { width: panelWidth }]} edges={['top', 'bottom', 'right']}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Menu</Text>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel="Close menu">
              <MaterialIcons name="close" size={24} color={HomeTheme.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {NAV_MENU_ITEMS.map((item) => {
              const isActive = activeItemId === item.id;
              return (
                <View key={item.id}>
                  <Pressable
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleItemPress(item.id, item.hasChevron)}>
                    <MaterialIcons
                      name={item.icon}
                      size={22}
                      color={isActive ? HomeTheme.accent : HomeTheme.textPrimary}
                    />
                    <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                      {item.label}
                    </Text>
                    {item.hasChevron ? (
                      <MaterialIcons
                        name={networkExpanded ? 'expand-less' : 'expand-more'}
                        size={22}
                        color={HomeTheme.textMuted}
                      />
                    ) : null}
                  </Pressable>
                  {item.hasChevron && networkExpanded ? (
                    <Text style={styles.comingSoon}>Coming soon</Text>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={handleFooterPress}>
              <Text style={styles.footerButtonText}>Visit MTR Website</Text>
              <MaterialIcons name="open-in-new" size={18} color={HomeTheme.textPrimary} />
            </Pressable>
            <Text style={styles.copyright}>© 2026 MTR Schedule</Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: HomeTheme.drawerOverlay,
  },
  panel: {
    backgroundColor: HomeTheme.drawerBg,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: HomeTheme.border,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: HomeTheme.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  menuList: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 12,
    marginVertical: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: HomeTheme.drawerActiveBg,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: HomeTheme.textPrimary,
  },
  menuLabelActive: {
    color: HomeTheme.accent,
  },
  comingSoon: {
    marginLeft: 50,
    marginBottom: 8,
    fontSize: 13,
    color: HomeTheme.textMuted,
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: HomeTheme.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: HomeTheme.textPrimary,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: HomeTheme.textMuted,
  },
});
