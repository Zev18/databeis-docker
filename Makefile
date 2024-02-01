prod:
	docker compose -f compose.prod.yaml build

dev:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down
