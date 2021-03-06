/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import FiltersScreen from '../screens/FiltersScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps, ScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import TinderDishes from '../screens/TinderDishes';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
			{/*<Stack.Screen name="Tinder" component={TinderDishes}*/}
			{/*              options={{ title: 'select a dish', headerShown: false }} />*/}
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen name="Modal" component={ModalScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator({ route }: ScreenProps) {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName="Filters"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint
			}}>
			<BottomTab.Screen
				name="Filters"
				component={FiltersScreen}
				options={{
					title: 'Filters',
					tabBarIcon: ({ color }) => <TabBarIcon name="filter" color={color} />
				}}
			/>
			<BottomTab.Screen
				name="Tinder"
				component={TinderDishes}
				initialParams={{ preferences: [], cuisineTypes: [] }}
				options={{
					title: 'Dishes',
					tabBarIcon: ({ color }) => <TabBarIcon name="coffee" color={color} />
				}}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
