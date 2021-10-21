FROM node:12.18.1

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]

EXPOSE 8080

HEALTHCHECK --interval=5m --timeout=2s --start-period=30s CMD npm health-check