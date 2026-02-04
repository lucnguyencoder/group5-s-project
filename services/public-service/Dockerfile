FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV TZ=Asia/Ho_Chi_Minh

CMD ["npm", "start"]
