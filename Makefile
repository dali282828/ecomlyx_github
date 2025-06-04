dev:
	docker compose -f docker-compose.dev.yml up --build

migrate:
	docker compose exec app npx prisma migrate dev

test:
	docker compose exec app npm run test

down:
	docker compose down 