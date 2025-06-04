# Ecomlyx - SaaS Website Builder Platform

A modern SaaS platform for building and managing websites, built with Next.js, Chakra UI, Docker, and Prisma.

## Quick Start (Local Development)

1. Copy env file:
   cp .env.example .env.local

2. Start all services:
   make dev

3. Run DB migrations:
   make migrate

4. Visit your app:
   http://localhost:3000

5. Access phpMyAdmin:
   http://localhost:8081

## Common Commands

| Task                | Command                                      |
|---------------------|----------------------------------------------|
| Start dev           | make dev                                     |
| DB migrate          | make migrate                                 |
| Run tests           | make test                                    |
| Stop all            | make down                                    |
| Access app          | http://localhost:3000                        |
| Access phpMyAdmin   | http://localhost:8081                        |

## Makefile Usage

- `make dev` - Start all dev services with Docker
- `make migrate` - Run DB migrations
- `make test` - Run tests in Docker
- `make down` - Stop all services

## Troubleshooting & FAQ

- **Q: My app can't connect to the database?**
  - A: Make sure the `mysql` service is running (`make dev`) and your `DATABASE_URL` points to the correct host/user/password.
- **Q: How do I reset the database?**
  - A: Run `docker compose exec app npx prisma migrate reset --force` (this will erase all data).
- **Q: How do I update dependencies?**
  - A: Run `npm install` in your project root.
- **Q: How do I run a shell in the app container?**
  - A: `docker compose exec app sh`

## Features

- 🚀 Next.js 14 with App Router
- 🎨 Chakra UI for beautiful, accessible components
- 🐳 Docker for containerized development and deployment
- 🔐 Prisma for type-safe database access
- 🌐 WordPress integration for content management
- 📊 Analytics and monitoring
- 🔄 CI/CD with GitHub Actions
- ☁️ Google Cloud deployment ready

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git
- Google Cloud account (for deployment)

## Development

### Project Structure

```
ecomlyx/
├── src/                    # Source code
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions and services
│   └── styles/           # Global styles
├── prisma/                # Database schema and migrations
├── public/               # Static assets
└── docker/              # Docker configuration files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run dev:docker` - Start all dev services with Docker
- `npm run test:docker` - Run tests in Docker

## Docker Development

The project includes two Docker configurations:

- `docker-compose.dev.yml` - Development environment
- `docker-compose.yml` - Production environment

To start the development environment:

```bash
make dev
```

## Deployment

### Google Cloud Deployment

1. **Set up Google Cloud project**
   ```bash
   gcloud init
   ```

2. **Deploy to Cloud Run**
   ```bash
   ./deploy.sh
   ```

### Environment Variables

Required environment variables:

```env
DATABASE_URL=
NEXT_PUBLIC_API_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 