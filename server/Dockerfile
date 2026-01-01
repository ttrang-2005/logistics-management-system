# Sử dụng Node.js bản nhẹ
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package để cài thư viện trước (tối ưu cache)
COPY package*.json ./
RUN npm install

# Copy toàn bộ code server vào
COPY . .

# Mở cổng 8081
EXPOSE 8081

# Chạy server
CMD ["node", "index.js"]