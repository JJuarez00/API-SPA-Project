# Videogame-SPA
A Single Page Application (SPA) built with React and Vite for browsing videogame-related data. The app includes authentication (JWT) and protected routes, plus examples of making API requests using three different approaches: `XMLHttpRequest`, `Axios`, and `fetch`.

## Features
### Authentication
- User signup, login, and logout
- JWT-based authentication
- Protected routes using an auth guard

### Publishers
- View a list of publishers
- View publisher details
- Browse videogames by publisher using nested routes
- API calls implemented with XMLHttpRequest

### Categories
- View categories and category details
- API calls implemented with Axios

### Platforms
- Full CRUD functionality (create, read, update, delete)
- API calls implemented with fetch
- Authenticated requests handled through a custom hook
- Forms managed with react-hook-form

### UI
- Styled with Bootstrap and React-Bootstrap

## Tech Stack
- React (Vite)
- react-router-dom
- bootstrap
- react-bootstrap
- axios
- react-hook-form

## Custom Hooks and Services

- `useAuth.jsx`: Manages authentication state, login, logout, and JWT storage.
- `useXmlHttp.jsx`: Demonstrates API calls using XMLHttpRequest.
- `useAxios.jsx`: Handles API calls using Axios.
- `useFetch.jsx`: Wrapper around fetch for authenticated API requests.