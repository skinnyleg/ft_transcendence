FROM node:latest

COPY /trance-frontend /home/frontend

WORKDIR /home/frontend

# RUN npm update

RUN npm i

RUN npm run build

CMD [ "npm", "run", "start" ]
# CMD [ "npm", "run", "dev" ]