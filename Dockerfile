FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

RUN git clone https://github.com/randware/website .

RUN npm install

RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["node", "build"]
