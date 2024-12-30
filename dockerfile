FROM node:18


WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g pm2


COPY . .

RUN npx prisma generate


COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
