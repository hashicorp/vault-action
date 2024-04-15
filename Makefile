.PHONY: local-test
local-test:
	docker compose down;  docker-compose up -d vault && act workflow_dispatch -j local-test -W .github/workflows/local-test.yaml
