FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]
