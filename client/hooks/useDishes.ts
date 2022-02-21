import { useEffect, useState } from 'react';
import axios from 'axios';
import { CuisineTypeIds, PreferencesType } from '../screens/FiltersScreen';

export interface IRestaurant {
	isDeliveryEnabled: boolean;
	isGlutenFree: boolean;
	isKosher: boolean;
	isNotKosher: boolean;
	isOpenNow: boolean;
	isVegan: boolean;
	minimumPriceForOrder: number;
	// restaurantCuisineTypes: { pizza: 'פיצה', pasta: 'פסטה', veganFood: 'אוכל טבעוני' };
	restaurantId: number;
	restaurantLogoUrl: string;
	restaurantName: string;
	reviewsRank: number;
	reviewsRankDecimal: number;
}

export interface IDish {
	categoryID: string;
	categoryName: string;
	dishDescription: string;
	dishId: string;
	dishImageUrl: string;
	dishName: string;
	dishPopularityScore: number;
	dishPrice: number;
	isPopularDish: boolean;
	restaurant: IRestaurant;
	isDeliveryEnabled: boolean;
	isGlutenFree: boolean;
	isKosher: boolean;
	isNotKosher: boolean;
	isOpenNow: boolean;
	isVegan: boolean;
	minimumPriceForOrder: number;
	// restaurantCuisineTypes: { pizza: 'פיצה', pasta: 'פסטה', veganFood: 'אוכל טבעוני' };
	restaurantLogoUrl: string;
	restaurantName: string;
	reviewsRank: number;
	reviewsRankDecimal: number;
}

export interface IResult {
	restaurant: IRestaurant;
	dish: IDish;
}

const URL = 'https://4812-82-166-197-220.ngrok.io/random-dishes';

async function getDishes(params: GetDishesParams): Promise<IResult[]> {
	try {
		const { data } = await axios.post<IResult[]>(URL, {
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
	const [dishes, setDishes] = useState<IResult[]>();
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