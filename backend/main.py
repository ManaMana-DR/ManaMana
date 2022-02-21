import asyncio
from typing import List, Tuple

import httpx as httpx
import requests
from numpy.random import choice
from pydantic import BaseModel, validator

from consts import FILTERS_TO_FIELD

NUMBER_OF_OPTIONS = 10


class Restaurant(BaseModel):
	restaurantId: int
	restaurantName: str
	restaurantLogoUrl: str
	isKosher: bool
	isNotKosher: bool
	isVegan: bool
	isGlutenFree: bool
	isOpenNow: bool
	isDeliveryEnabled: bool
	restaurantCuisineTypes: dict
	reviewsRank: int
	minimumPriceForOrder: int
	reviewsRankDecimal: float

	@validator('isNotKosher')
	def flip_value(cls, v):
		return not v


class Dish(BaseModel):
	dishId: str
	dishName: str
	dishDescription: str
	dishPrice: float
	categoryID: str
	dishImageUrl: str
	isPopularDish: bool
	dishPopularityScore: float
	categoryName: str


class SelectedDish(BaseModel):
	name: str
	description: str
	restaurantName: str
	orderUrl: str
	imageUrl: str
	price: str


async def get_random_dishes(filters, food_types) -> List[SelectedDish]:
	restaurants = get_restaurants()
	restaurants: List[Restaurant] = choose_restaurants(restaurants, filters, food_types)
	selected_dishes = []
	menus = await get_menus(restaurants)
	for restaurant, menu in menus:
		popular_dishes = [dish for dish in menu if dish.isPopularDish and dish.dishPrice > 30]
		if len(popular_dishes) > 0:
			selected_dish: Dish = choice(popular_dishes, 1)[0]
		else:
			main_dishes = [dish for dish in menu if dish.dishPrice > 30]
			selected_dish: Dish = choice(main_dishes, 1)[0]
		selected_dishes.append(SelectedDish(name=selected_dish.dishName, description=selected_dish.dishDescription,
		                                    restaurantName=restaurant.restaurantName,
		                                    orderUrl=get_order_url(restaurant, selected_dish),
		                                    imageUrl=selected_dish.dishImageUrl, price=selected_dish.dishPrice))
	return selected_dishes


def get_order_url(restaurant: Restaurant, dish: Dish):
	return f'https://www.10bis.co.il/next/restaurants/menu/delivery/{restaurant.restaurantId}/{restaurant.restaurantName.replace(" ", "-")}/dish/{dish.dishId}/'


def get_restaurants():
	params = {'culture': 'he-IL', 'uiCulture': 'he', 'deliveryMethod': 'delivery', 'addressId': '6692178',
	          'cityId': '24', 'cityName': '%D7%AA%D7%9C+%D7%90%D7%91%D7%99%D7%91-%D7%99%D7%A4%D7%95',
	          'streetId': '67386', 'streetName': '%D7%AA%D7%95%D7%A6%D7%A8%D7%AA+%D7%94%D7%90%D7%A8%D7%A5',
	          'houseNumber': '6', 'longitude': '34.796228', 'latitude': '32.0733094', 'isCompanyAddress': 'True',
	          'restaurantDeliversToAddress': 'false'}
	params_str = "&".join([f'{p1}={p2}' for p1, p2 in params.items()])
	response = requests.get(
		f'https://www.10bis.co.il/NextApi/searchRestaurants?{params_str}')

	return [Restaurant(**rest, isNotKosher=rest['isKosher']) for rest in response.json()['Data']['restaurantsList']]


async def get_menu_for_restaurant(client, restaurant: Restaurant) -> Tuple[Restaurant, List[Dish]]:
	response = await client.get(
		f'https://www.10bis.co.il/NextApi/GetRestaurantMenu?culture=he-IL&uiCulture=he&restaurantId={restaurant.restaurantId}&deliveryMethod=delivery')
	print(response)
	categories = response.json()['Data']['categoriesList']
	dishes = []
	for category in categories:
		dishes.extend([Dish(**dish, categoryName=category['categoryName']) for dish in category['dishList']])
	return restaurant, dishes


def choose_restaurants(restaurants: List[Restaurant], user_filters, user_food_types):
	if not restaurants:
		raise ValueError("Got 0 restaurants")
	restaurants = [rest for rest in restaurants if
	               is_restaurant_in_filters(rest, user_filters, user_food_types)]
	chosen_restaurants = choice(restaurants, NUMBER_OF_OPTIONS, p=get_probability(restaurants))
	return chosen_restaurants


async def get_menus(restaurants):
	async with httpx.AsyncClient() as client:
		menus = await asyncio.gather(*[get_menu_for_restaurant(client, rest) for rest in restaurants])
		return menus


def get_probability(restaurants: List[Restaurant]) -> List[float]:
	probability_sum = sum(rest.reviewsRankDecimal for rest in restaurants)
	return [rest.reviewsRankDecimal / probability_sum for rest in restaurants]


def is_restaurant_in_filters(restaurant: Restaurant, user_filters, user_food_types):
	# if not all([restaurant.isOpenNow, restaurant.isDeliveryEnabled]):
	# 	return False
	for _filter in user_filters:
		rest_key: str = FILTERS_TO_FIELD[_filter]
		if not restaurant.dict().get(rest_key):
			return False
	for user_food_type in user_food_types:
		if user_food_type in restaurant.restaurantCuisineTypes.keys():
			return True
	return False
