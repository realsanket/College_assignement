docker build -t text-to-speech .
docker build -f Dockerfile.dev -t text-to-speech-dev .
docker run -it -p 3000:3000 -v $(pwd):/app text-to-speech-dev