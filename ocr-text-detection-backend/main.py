from typing import Union, List
from fastapi import FastAPI, UploadFile, File
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from fastapi.middleware.cors import CORSMiddleware
import io
import os
origins = [
    "*",
]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

form_recognizer_endpoint = os.environ["FORM_RECOGNIZER_ENDPOINT"]
form_recognizer_key = os.environ["FORM_RECOGNIZER_KEY"]

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload/")
async def upload_image(file: UploadFile):

    # Create a DocumentAnalysisClient
    document_analysis_client = DocumentAnalysisClient(
        endpoint=form_recognizer_endpoint, credential=AzureKeyCredential(form_recognizer_key)
    )

    # Read the content of the uploaded image
    image_data = await file.read()

    # Analyze the content using the "prebuilt-read" model
    result = document_analysis_client.begin_analyze_document(
        model_id="prebuilt-read", document=image_data
    ).result()

    return {
        "filename": file.filename,
        "analysis_result": result.content
    }