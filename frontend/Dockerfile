FROM node:latest

RUN apt-get update -y && apt-get install vim -y

COPY /trance-frontend /home/frontend

WORKDIR /home/frontend

RUN npm i

# RUN npm run build

# CMD [ "npm", "run", "start" ]
CMD [ "npm", "run", "dev" ]
