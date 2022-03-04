import * as React from 'react';
import { ColorSchemeName, Pressable, ViewStyle } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import About from '../screens/About';
import { COLORS } from '../constants';
import LinkingConfiguration from './LinkingConfiguration';
import ReceiveContactsScreen from '../screens/ReceiveContacts';
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../types/navigation';
import ShareContactsScreen from '../screens/ShareContacts';

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomBarIcon(
  color: string,
  name: React.ComponentProps<typeof FontAwesome>['name'],
): React.ReactElement {
  return (
    <FontAwesome
      color={color}
      name={name}
      size={30}
      style={{ marginBottom: -3 }}
    />
  );
}

function HeaderRight(
  props: RootTabScreenProps<'ReceiveContacts'>,
): React.ReactElement {
  const { navigation } = props;
  return (
    <Pressable
      onPress={(): void => navigation.navigate('About')}
      style={({ pressed }): ViewStyle => ({
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <FontAwesome
        color={COLORS.text}
        name="ellipsis-v"
        size={24}
        style={{ marginRight: 24 }}
      />
    </Pressable>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="ShareContacts"
      screenOptions={{
        tabBarActiveTintColor: COLORS.accent,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="ShareContacts"
        component={ShareContactsScreen}
        options={{
          title: 'Share contacts',
          headerTitleStyle: {
            color: COLORS.text,
          },
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          tabBarIcon: ({ color }) => BottomBarIcon(color, 'share-square-o'),
        }}
      />
      <BottomTab.Screen
        component={ReceiveContactsScreen}
        name="ReceiveContacts"
        options={(props: RootTabScreenProps<'ReceiveContacts'>) => ({
          headerRight: () => HeaderRight(props),
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTitleStyle: {
            color: COLORS.text,
          },
          tabBarIcon: ({ color }) => BottomBarIcon(color, 'qrcode'),
          title: 'Receive contacts',
        })}
      />
    </BottomTab.Navigator>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={BottomTabNavigator}
        name="Root"
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          component={About}
          name="About"
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default function Navigation(
  { colorScheme }: { colorScheme: ColorSchemeName },
) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
