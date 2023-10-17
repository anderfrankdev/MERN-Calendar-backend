FROM node:19-alpine3.15 as dev
EXPOSE 8080
WORKDIR /app
COPY package.json ./
RUN yarn install
CMD [ "npm","run","compile" ]
CMD [ "node","/dist/index.js" ]



FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile


FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN yarn compile

FROM node:19-alpine3.15 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --prod --frozen-lockfile


FROM node:19-alpine3.15 as prod
EXPOSE 8080
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
RUN mkdir src
RUN mkdir src/graphql
COPY src/graphql/schema.graphql ./src/graphql
ENV NODE_ENV=production
CMD [ "node","dist/index.js"]