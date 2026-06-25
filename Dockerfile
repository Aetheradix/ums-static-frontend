FROM docker.io/library/nginx:alpine
ARG CERT_FILE
ARG CERT_KEY_FILE
WORKDIR /app
COPY ./dist /usr/share/nginx/html
COPY $CERT_FILE /usr/share/nginx/certs/ums.crt
COPY $CERT_KEY_FILE /usr/share/nginx/certs/ums.key
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
