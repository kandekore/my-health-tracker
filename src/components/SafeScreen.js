import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

/**
 * Wraps a screen in a SafeAreaView honoring the top edge by default.
 * Bottom edge is handled by the tab bar on iOS, so we leave it off unless asked.
 * Pass edges={['top','bottom']} for modal/stack screens without a tab bar.
 */
export default function SafeScreen({ children, edges = ['top'], style }) {
  return (
    <SafeAreaView edges={edges} style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
});
