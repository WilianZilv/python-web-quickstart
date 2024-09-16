db-generate:
	alembic revision --autogenerate

db-head:
	alembic upgrade head

db-upgrade:
	alembic upgrade +1

db-downgrade:
	alembic downgrade -1

dev-api:
	uvicorn api.main:app --reload

compile-requirements:
	uv pip compile pyproject.toml -o requirements.txt

vercel-deploy:
	vercel deploy --prod
	cd web && vercel deploy --prod