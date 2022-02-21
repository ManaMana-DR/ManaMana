import json
from enum import Enum
from typing import List

import requests
import uvicorn as uvicorn
from fastapi import FastAPI, Form
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette import status
from starlette.background import BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from backend.main import get_random_dishes, SelectedDish

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
	print(f"{request}: {exc_str}")
	content = {'status_code': 10422, 'message': exc_str, 'data': None}
	return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class UserFilters(BaseModel):
	userFilters: List[str]
	userFoodTypes: List[str]


class Actions(str, Enum):
	next = "next"
	order = "order"


def build_message(dish: SelectedDish):
	return {
		"replace_original": True,
		"response_type": "ephemeral",
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "*Your Dish:*\n"
					        f"{dish.name} from {dish.restaurantName}\n"
					        f"{dish.description}\n\n"
					        f"*Price:* {dish.price}\n"
				},
				"accessory": {
					"type": "image",
					"image_url": dish.imageUrl,
					"alt_text": "computer thumbnail"
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "actions",
				"elements": [
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"emoji": True,
							"text": "Order"
						},
						"style": "primary",
						"url": dish.orderUrl,
						"value": dish.orderUrl,
						"action_id": "button-action"
					},
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"emoji": True,
							"text": "Next"
						},
						"style": "danger",
						"value": Actions.next
					}
				]
			}
		]
	}


async def _run_in_bg(response_url: str):
	dishes = await get_random_dishes([], ['soup'], 1)
	response_message = build_message(dishes[0])
	response = requests.post(url=response_url, json=response_message)


@app.post('/slack/random-dishes')
async def r(background_tasks: BackgroundTasks, response_url: str = Form(...)):
	background_tasks.add_task(_run_in_bg, response_url)
	return {
		"replace_original": "true",
		"text": "Preparing"
	}


@app.post('/slack/interactive')
async def r(request: Request):
	d = await request.form()
	payload = json.loads(d['payload'])
	response_url = payload['response_url']
	action = payload['actions'][0]['value']

	if action == Actions.next:
		dishes = await get_random_dishes([], ['soup'], 1)
		dish = dishes[0]
		response_message = build_message(dish)
		response = requests.post(url=response_url, json=response_message)


@app.post("/random-dishes")
async def root(body: UserFilters):
	return await get_random_dishes(body.userFilters, body.userFoodTypes)


@app.get("/health")
async def health():
	return "OK"


if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8888)
