FROM mhart/alpine-node:6.5

MAINTAINER Graham Taylor <gtayzlor@gmail.com>

RUN apk add --update make gcc g++ python
RUN npm install -g gulp

WORKDIR /src
ADD . .

RUN npm install

EXPOSE 5000
EXPOSE 8000
CMD ["gulp", "serve"]
