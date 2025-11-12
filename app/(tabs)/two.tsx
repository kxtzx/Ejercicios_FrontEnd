import React from 'react';
import { View } from 'react-native';
import UserProfileDemo from '../../src/components/UserProfileDemo';

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <UserProfileDemo />
    </View>
  );
}
