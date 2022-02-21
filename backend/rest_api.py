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


class Actions(str, Enum):
	next = "next"
	order = "order"


new = {
	"response_type": "ephemeral",
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Type:*\nPaid time off\n*When:*\nAug 10-Aug 13\n*Hours:* 16.0 (2 days)\n*Remaining balance:* 32.0 hours (4 days)\n*Comments:* \"Family in town, going camping!\""
			},
			"accessory": {
				"type": "image",
				"image_url": "https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png",
				"alt_text": "computer thumbnail"
			}
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
					"value": Actions.order
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


@app.post('/slack/random-dishes')
async def r(request: Request, text: str = Form(...), user_name: str = Form(...)):
	d = await request.form()
	dishes = get_random_dishes([], ['pizza'])
	return new


@app.post('/slack/interactive')
async def r(request: Request):
	d = await request.form()
	payload = json.loads(d['payload'])
	response_url = payload['response_url']
	action = payload['actions'][0]['value']

	if action == Actions.order:
		response_message = {
			"replace_original": "true",
			"text": "Thanks for your request, we'll process it and get back to you."
		}
	elif action == Actions.next:
		response_message = new

	response = requests.post(url=response_url, json=response_message)


@app.post("/random-dishes")
async def root(body: UserFilters):
	return await get_random_dishes(body.userFilters, body.userFoodTypes)


@app.get("/health")
async def health():
	return "OK"


if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8888)
