
FROM node:16 as build
WORKDIR /app


COPY package.json ./

COPY public public
COPY src src 


RUN npm install --force
RUN npm run build

# production environment
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]