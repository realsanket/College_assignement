FROM python:3.9
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN pip install fastapi uvicorn
COPY ./ /code/app
ENTRYPOINT [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80" ]
