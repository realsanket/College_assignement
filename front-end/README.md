docker run -p 4200:80 -e API_ENDPOINT_URL=https://testsanket3103.cognitiveservices.azure.com/ -e API_KEY=6f37061cfd1d468f91e6b9b263396ab9 -e test=sarang -d college-front-end

 docker build -t college-front-end .
docker run -p 4200:80 -d college-front-end