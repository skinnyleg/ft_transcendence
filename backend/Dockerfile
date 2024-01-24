FROM node:latest

RUN apt-get update -y && apt-get install vim -y

COPY /trance-backend /home/backend

COPY /script.sh /home/backend/

WORKDIR /home/backend

RUN chmod +x script.sh

# RUN npm update

RUN npm i

# RUN npm run build

CMD [ "./script.sh" ]