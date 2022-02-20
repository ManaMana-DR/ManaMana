import { useEffect, useState } from 'react';
import axios from 'axios';

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

async function getDishes(): Promise<IDish[]> {
	return Promise.resolve(mockData);
	try {
		const { data } = await axios.get<IDish[]>('/api/dishes');
		return data;
	} catch (e) {
		console.error('Failed to get dishes from th server', e);
		throw e;
	}
}

export function useGetDishes() {
	const [dishes, setDishes] = useState<IDish[]>();
	const [error, setError] = useState<Error>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		getDishes().then((data) => {
			setDishes(data);
		}).catch((err) => {
			setError(err);
		}).finally(() => {
			setIsLoading(false);
		});
	}, []);

	return { isLoading, error, data: dishes };
}