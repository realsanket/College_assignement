uvicorn main:app --reload
pip install -r requirements.txt
docker build -t ocr-text-detection-backend .
docker run -p 4201:80 -e FORM_RECOGNIZER_ENDPOINT="replace_your_endpoint" -e FORM_RECOGNIZER_KEY=Replace_your_key -it ocr-text-detection-backend 
