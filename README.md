# Plant Disease Detection and Prevention API

A Node.js-based RESTful API for plant disease detection and prevention using machine learning, weather data, and community features.

## Features

- User authentication and profile management
- Plant disease detection using TensorFlow.js
- Weather-based disease alerts
- Community forum for discussions
- Treatment recommendations
- Detection history tracking

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- TensorFlow.js model for plant disease detection

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd plant-disease-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/plant_disease_db"
PORT=3000
JWT_SECRET="your-super-secret-jwt-key"
MODEL_PATH="./models/plant_disease_model"
WEATHER_API_KEY="your-weather-api-key"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Disease Detection
- `POST /api/detections/detect` - Upload image for disease detection
- `GET /api/detections/history` - Get detection history

### Forum
- `GET /api/forum/posts` - Get all forum posts
- `GET /api/forum/posts/:id` - Get specific post
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/replies` - Add reply to post
- `POST /api/forum/replies/:id/vote` - Vote on reply

### Weather Alerts
- `GET /api/weather/alerts` - Get weather-based disease alerts

## Model Training

The API uses a pre-trained TensorFlow.js model for plant disease detection. To train your own model:

1. Prepare your dataset of plant disease images
2. Use TensorFlow.js to train a model
3. Save the model in the specified `MODEL_PATH`
4. Update the model configuration in the detection service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 