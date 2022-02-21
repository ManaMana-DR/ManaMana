import { Text, View } from '../components/Themed';
import { TinderProps } from '../types';
import { useGetDishes } from '../hooks/useDishes';


export default function TinderDishes({ route }: TinderProps) {
	const { preferences, cuisineTypes } = route.params;
	useGetDishes({ cuisineTypes, preferences })
	return <View>
		<Text>test</Text>
	</View>
}