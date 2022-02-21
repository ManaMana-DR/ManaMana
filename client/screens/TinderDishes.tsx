import { Text, View } from '../components/Themed';
import { TinderProps } from '../types';
import { useGetDishes } from '../hooks/useDishes';
import { useEffect } from 'react';


export default function TinderDishes({ route, navigation }: TinderProps) {
	const { preferences, cuisineTypes } = route.params;
	const { data, isLoading, error } = useGetDishes({ cuisineTypes, preferences });

	useEffect(() => {
		if (error) {
			navigation.navigate('NotFound');
		}
	}, [error]);

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (data) {
		return (
			<View>
				<Text>Dishes:</Text>
				{data.map((item, index) =>
					<Text key={index}>dish name: {item.dish.dishName}</Text>
				)}
			</View>
		);
	}

	return null;
}