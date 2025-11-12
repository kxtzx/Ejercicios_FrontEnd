import { View } from '@/components/Themed';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import UserProfileDemo from '../../src/components/UserProfileDemo';

export default function TabOneScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
        </View>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <View style={styles.contentContainer}>
          <UserProfileDemo />
        </View>

        <View style={styles.footer}>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
