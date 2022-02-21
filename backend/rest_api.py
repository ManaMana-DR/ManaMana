from typing import List

import uvicorn as uvicorn
from fastapi import FastAPI, Form
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from backend.main import get_random_dishes

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


# @app.get('/')
# def home():
# 	...


@app.post('/slack/random-dishes')
async def r(text: str = Form(...), user_name: str = Form(...)):
	return {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "We found *205 Hotels* in New Orleans, LA from *12/14 to 12/17*"
				},
				"accessory": {
					"type": "overflow",
					"options": [
						{
							"text": {
								"type": "plain_text",
								"emoji": True,
								"text": "Option One"
							},
							"value": "value-0"
						},
						{
							"text": {
								"type": "plain_text",
								"emoji": True,
								"text": "Option Two"
							},
							"value": "value-1"
						},
						{
							"text": {
								"type": "plain_text",
								"emoji": True,
								"text": "Option Three"
							},
							"value": "value-2"
						},
						{
							"text": {
								"type": "plain_text",
								"emoji": True,
								"text": "Option Four"
							},
							"value": "value-3"
						}
					]
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "*<fakeLink.toHotelPage.com|Windsor Court Hotel>*\n★★★★★\n$340 per night\nRated: 9.4 - Excellent"
				},
				"accessory": {
					"type": "image",
					"image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgent_1.png",
					"alt_text": "Windsor Court Hotel thumbnail"
				}
			},
			{
				"type": "context",
				"elements": [
					{
						"type": "image",
						"image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png",
						"alt_text": "Location Pin Icon"
					},
					{
						"type": "plain_text",
						"emoji": True,
						"text": "Location: Central Business District"
					}
				]
			},
			{
				"type": "divider"
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "*<fakeLink.toHotelPage.com|The Ritz-Carlton New Orleans>*\n★★★★★\n$340 per night\nRated: 9.1 - Excellent"
				},
				"accessory": {
					"type": "image",
					"image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgent_2.png",
					"alt_text": "Ritz-Carlton New Orleans thumbnail"
				}
			},
			{
				"type": "context",
				"elements": [
					{
						"type": "image",
						"image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png",
						"alt_text": "Location Pin Icon"
					},
					{
						"type": "plain_text",
						"emoji": True,
						"text": "Location: French Quarter"
					}
				]
			},
			{
				"type": "divider"
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "*<fakeLink.toHotelPage.com|Omni Royal Orleans Hotel>*\n★★★★★\n$419 per night\nRated: 8.8 - Excellent"
				},
				"accessory": {
					"type": "image",
					"image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgent_3.png",
					"alt_text": "Omni Royal Orleans Hotel thumbnail"
				}
			},
			{
				"type": "context",
				"elements": [
					{
						"type": "image",
						"image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png",
						"alt_text": "Location Pin Icon"
					},
					{
						"type": "plain_text",
						"emoji": True,
						"text": "Location: French Quarter"
					}
				]
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
							"text": "Next 2 Results"
						},
						"value": "click_me_123"
					}
				]
			}
		]
	}


@app.post("/random-dishes")
async def root(body: UserFilters):
	return await get_random_dishes(body.userFilters, body.userFoodTypes)


@app.get("/health")
async def health():
	return "OK"


if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8888)
