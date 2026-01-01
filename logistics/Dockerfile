# --- Giai đoạn 1: Build React ---
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Lệnh build của Vite (tạo ra thư mục dist)
RUN npm run build

# --- Giai đoạn 2: Chạy Nginx ---
FROM nginx:alpine
# Copy file build từ giai đoạn 1 sang thư mục của Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copy file cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]