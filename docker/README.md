# Docker Setup for Windows 3.11 Portfolio

This folder contains all files related to Docker setup for the Windows 3.11-inspired portfolio project.

## Contents

- `Dockerfile`: Defines the image for the development environment.
- `docker-compose.yml`: Orchestrates services (e.g., application, database, etc.).
- `.env`: Contains environment variables for Docker configuration.

## How to Use

### Build and Run the Container

1. Build the Docker Image:

```bash
docker-compose build
```

2. Start the Docker Container:

```bash
docker-compose up
```

3. Stop the Container:

```bash
docker-compose down
```

## Use Environment Variables

You can configure custom settings, such as the port or environment mode. For example:

```makefile
PORT=3000
NODE_ENV=development
```

Using `.env` in `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - PORT=${PORT}
      - NODE_ENV=${NODE_ENV}
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**: If the port is already in use, change the PORT value in .env or stop any processes using the port:
    ```bash
    lsof -i :3000
    kill <process_id>
    ```
2. **Rebuilding After Changes**: If the Dockerfile or dependencies change, rebuild the image:
    ```bash
    docker-compose build --no-cache
    ```
