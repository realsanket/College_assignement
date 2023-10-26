from typing import Union, List
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import httpx
from uuid import uuid4
from pydantic import BaseModel
import os
# Your Microsoft Translator API configuration

# read key from env variable
key = os.environ.get('TRANSLATOR_TEXT_SUBSCRIPTION_KEY')
# read endpoint from env variable
endpoint = os.environ.get('TRANSLATOR_TEXT_ENDPOINT')
# read location from env variable
location = os.environ.get('TRANSLATOR_TEXT_LOCATION')


origins = [
    "*"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranslationRequest(BaseModel):
    text: str
    to: str


@app.post("/translate")
async def translate_text(request: TranslationRequest):
    constructed_url = f"{endpoint}/translate"

    params = {
        'api-version': '3.0',
        'from': "en",
        'to': request.to
    }

    headers = {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,  # Location if required
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid4())
    }

    body = [{'text': request.text}]

    async with httpx.AsyncClient() as client:
        response = await client.post(constructed_url, params=params, headers=headers, json=body)
        translation = response.json()
        return translation


@app.get("/")
def read_root():
    return {"Hello": "sa"}
