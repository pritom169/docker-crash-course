FROM node:23.11.0
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY ./app /home/app

CMD ["node", "/home/app/server.js"]