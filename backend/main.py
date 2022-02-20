from typing import List

import requests
from numpy.random import choice
from pydantic import BaseModel, validator

from consts import FILTERS_TO_FIELD

NUMBER_OF_OPTIONS = 10
USER_FILTERS = ['kosher', 'vegan']
USER_FOOD_TYPES = ['asianFusion', 'meatGrill', 'pizza']


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
	restaurant: Restaurant
	dish: Dish


def main():
	restaurants = get_restaurants()
	restaurants: List[Restaurant] = choose_restaurants(restaurants)
	selected_dishes = []
	for rest in restaurants:
		dishes = get_menu_for_restaurant(rest.restaurantId)
		popular_dishes = [dish for dish in dishes if dish.isPopularDish and dish.dishPrice > 30]
		if len(popular_dishes) > 0:
			selected_dish = choice(popular_dishes, 1)[0]
		else:
			main_dishes = [dish for dish in dishes if dish.dishPrice > 30]
			selected_dish = choice(main_dishes, 1)[0]
		selected_dishes.append(SelectedDish(restaurant=rest, dish=selected_dish))
	print([(dish.dish.dishName, dish.restaurant.restaurantName) for dish in selected_dishes])


def get_restaurants():
	response = requests.get(
		'https://www.10bis.co.il/NextApi/searchRestaurants?culture=he-IL&uiCulture=he&deliveryMethod=delivery&addressId=6692178&cityId=24&cityName=%D7%AA%D7%9C+%D7%90%D7%91%D7%99%D7%91-%D7%99%D7%A4%D7%95&streetId=67386&streetName=%D7%AA%D7%95%D7%A6%D7%A8%D7%AA+%D7%94%D7%90%D7%A8%D7%A5&houseNumber=6&longitude=34.796228&latitude=32.0733094&isCompanyAddress=true&restaurantDeliversToAddress=false')
	print(response)
	return [Restaurant(**rest, isNotKosher=rest['isKosher']) for rest in response.json()['Data']['restaurantsList']]


def get_menu_for_restaurant(restaurant_id: int):
	response = requests.get(
		f'https://www.10bis.co.il/NextApi/GetRestaurantMenu?culture=he-IL&uiCulture=he&restaurantId={restaurant_id}&deliveryMethod=delivery')
	print(response)
	categories = response.json()['Data']['categoriesList']
	dishes = []
	for category in categories:
		dishes.extend([Dish(**dish, categoryName=category['categoryName']) for dish in category['dishList']])
	return dishes


def choose_restaurants(restaurants: List[Restaurant]):
	restaurants = filter_restaurants(restaurants, USER_FILTERS, USER_FOOD_TYPES)
	chosen_restaurants = choice(restaurants, NUMBER_OF_OPTIONS, p=get_probability(restaurants))
	return chosen_restaurants


def get_probability(restaurants: List[Restaurant]) -> List[float]:
	probability_sum = sum(rest.reviewsRankDecimal for rest in restaurants)
	return [rest.reviewsRankDecimal / probability_sum for rest in restaurants]


def is_restaurant_in_filters(restaurant: Restaurant, user_filters, user_food_types):
	if not all([restaurant.isOpenNow, restaurant.isDeliveryEnabled]):
		return False
	for _filter in user_filters:
		rest_key: str = FILTERS_TO_FIELD[_filter]
		if not restaurant.dict().get(rest_key):
			return False
	for user_food_type in user_food_types:
		if user_food_type in restaurant.restaurantCuisineTypes.keys():
			return True
	return False


def filter_restaurants(restaurants, user_filters: List[str], user_food_types):
	return [rest for rest in restaurants if
	        is_restaurant_in_filters(rest, user_filters, user_food_types)]


main()
