db-generate:
	alembic revision --autogenerate

db-head:
	alembic upgrade head

db-upgrade:
	alembic upgrade +1

db-downgrade:
	alembic downgrade -1

api-dev:
	uvicorn api.main:app --reload

web-dev:
	cd web && npm run dev

compile-requirements:
	uv pip compile pyproject.toml -o requirements.txt

vercel-deploy:
	vercel deploy --prod
	cd web && vercel deploy --prod

vercel-deploy-api:
	vercel deploy --prod

vercel-deploy-web:
	cd web && vercel deploy --prod