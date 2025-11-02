# Jejak Buku Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Docker Setup (Recommended)

The easiest way to run the frontend is using Docker Compose from the root directory:

```sh
cd ..
docker-compose up --build frontend
```

The frontend will be accessible at `http://localhost:4200`.

**Docker Configuration:**
- Base Image: `node:20-alpine`
- Working Directory: `/app`
- Exposed Port: `4200`
- Volume Mount: `./frontend:/app` (for hot-reloading)
- Environment: Development mode with API proxy to backend

To run both frontend and backend together:
```sh
docker-compose up --build
```

## Development server

### Localhost (private, only on your PC)

```bash
npm run start:localhost
```
or
```bash
ng serve --host localhost
```
- Open your browser at [http://localhost:4200](http://localhost:4200).

### Network (accessible from your phone or other devices on your WiFi)

```bash
npm run start:network
```
or
```bash
ng serve --host 0.0.0.0
```
- Find your PC's IP address (e.g., `192.168.1.10` from `ipconfig` on Windows).
- On your phone or another device (connected to the same WiFi), open:
  `http://<your-pc-ip>:4200`
  Example: `http://192.168.1.10:4200`

## API Backend

- Make sure your backend is running and accessible (see backend README).
- If your backend is on a different host/port, update your API URLs in the Angular service or use environments.
- **For development:**
  The frontend uses a proxy (`proxy.conf.json`) so you can use `/api` as the base URL in `environment.ts`.
- **For production:**
  Update `apiUrl` in `src/environments/environment.prod.ts` to your PC's IP (e.g., `http://192.168.1.10:5000/api`) so other devices can access the backend.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

To preview the production build locally:

```sh
npx serve dist/frontend --single
```

## Running unit tests

```bash
ng test
```

## Running end-to-end tests

```bash
ng e2e
```

## Checking test coverage

```sh
ng test --code-coverage
```

## Docker Commands

| Command                | Description                                 |
|------------------------|---------------------------------------------|
| `docker-compose up --build frontend` | Build and start frontend container |
| `docker-compose down`  | Stop all containers                         |
| `docker-compose logs -f frontend` | View frontend logs              |
| `docker-compose exec frontend sh` | Access frontend container shell |
| `docker-compose restart frontend` | Restart frontend container      |

## Developer Notes

- **Switch between localhost and network easily** using the scripts above.
- **For PWA/offline testing:**
  - Use network mode and access from your phone for a real mobile experience.
- **If you get CORS errors:**
  - Make sure your backend allows requests from your frontend's origin.
- **Update `environment.prod.ts`** with your own backend IP address for production use.

## Useful Commands

| Command                | Description                                 |
|------------------------|---------------------------------------------|
| `docker-compose up --build frontend` | Run frontend with Docker       |
| `npm run start:localhost` | Run frontend on localhost only           |
| `npm run start:network`   | Run frontend on all network interfaces   |
| `ng build`                | Build the frontend for production        |
| `ng test`                 | Run unit tests                           |
| `npx serve dist/frontend --single` | Preview production build locally        |
| `ng test --code-coverage`          | Check test coverage                    |


---

For more information on using the Angular CLI, see the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
