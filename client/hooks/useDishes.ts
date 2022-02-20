import { useEffect, useState } from 'react';
import axios from 'axios';
import { CuisineTypeIds, PreferencesType } from '../screens/FiltersScreen';

export interface IDish {
	id: string;
	name: string;
	image: string;
	price: number;
	description: string;
}

const mockData: IDish[] = [{
	id: '1',
	name: 'המלאזית',
	description: 'נודלס עם פסטו',
	image: '',
	price: 65
}, {
	id: '2',
	name: 'סינטה נודלס',
	description: 'נודלס עם בקר',
	image: '',
	price: 60
}, {
	id: '3',
	name: 'נודלס ירקות',
	description: 'נודלס עם ירקות',
	image: '',
	price: 55
}
];

async function getDishes(params: GetDishesParams): Promise<IDish[]> {
	try {
		const { data } = await axios.post<IDish[]>('https://e28b-82-166-197-220.ngrok.io/random-dishes', {
			userFilters: params.preferences,
			userFoodTypes: params.cuisineTypes
		});
		return data;
	} catch (e) {
		console.error('Failed to get dishes from th server', e);
		throw e;
	}
}

type GetDishesParams = { preferences: PreferencesType[], cuisineTypes: CuisineTypeIds[] };

export function useGetDishes(params: GetDishesParams) {
	const [dishes, setDishes] = useState<IDish[]>();
	const [error, setError] = useState<Error>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		getDishes(params).then((data) => {
			setDishes(data);
		}).catch((err) => {
			setError(err);
		}).finally(() => {
			setIsLoading(false);
		});
	}, []);

	return { isLoading, error, data: dishes };
}