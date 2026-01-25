## Environment Variables

- `REACT_APP_API_URL`: The base URL for the backend API (e.g., http://localhost:5000/api)

## Docker Usage

1. Build the Docker image:
   ```sh
   docker build -t grocery-tracker-frontend .
   ```
2. Run the container:
   ```sh
   docker run -p 80:80 --env-file .env grocery-tracker-frontend
   ```

## Backend API

The frontend expects a backend API with endpoints like:
- `GET    /api/groceries` — List all groceries
- `POST   /api/groceries` — Add a grocery
- `PUT    /api/groceries/:id` — Update a grocery
- `DELETE /api/groceries/:id` — Delete a grocery

Set `REACT_APP_API_URL` to your backend's base URL.
