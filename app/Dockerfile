# Install dependencies only when needed
FROM ubuntu:20.04 AS deps

RUN apt update
RUN apt upgrade
RUN apt install nodejs -y
RUN apt install npm -y

RUN npm install --global yarn

# PDF support deps
RUN apt install graphicsmagick -y
RUN apt install ghostscript -y

# PPT support deps
# RUN apt install libreoffice-dev -y
# RUN apt install imagemagick -y
# RUN apt install poppler-utils -y

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "next", "dev"]