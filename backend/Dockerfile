FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Use nodemon for development
CMD ["npm", "run", "dev"]