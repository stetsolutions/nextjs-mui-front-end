FROM node:lts-alpine as base
RUN mkdir -p /usr/src/app 
RUN chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY --chown=node:node . .
USER node

FROM base as dev
ENV NODE_ENV=development
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base as prod
ENV NODE_ENV=production
RUN npm ci --production
RUN npm run build
EXPOSE 80
CMD ["npm", "start"]