import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import { COLORS } from '../constants';

import About from '../screens/About';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ReceiveContactsScreen from '../screens/ReceiveContacts';
import ShareContactsScreen from '../screens/ShareContacts';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

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
          tabBarIcon: ({ color }) => <TabBarIcon name="share-square-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="ReceiveContacts"
        component={ReceiveContactsScreen}
        options={({ navigation }: RootTabScreenProps<'ReceiveContacts'>) => ({
          title: 'Receive contacts',
          tabBarIcon: ({ color }) => <TabBarIcon name="qrcode" color={color} />,
          headerTitleStyle: {
            color: COLORS.text,
          },
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('About')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="ellipsis-v"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 24 }}
              />
            </Pressable>
          ),
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

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
