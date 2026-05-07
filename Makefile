.PHONY: clean
clean:
	rm -rf .build

.PHONY: local-test
local-test: clean
	docker compose down --volumes; docker compose up --wait vault && \
	act workflow_dispatch --job local-test --workflows .github/workflows/local-test.yaml

.PHONY: test-npm
test-npm:
	npm ci && npm run build && npm run test

.PHONY: test-basic
test-basic: clean
	docker compose down --volumes; docker compose up --wait vault && \
	npm run test:integration:basic

.PHONY: test-e2e
test-e2e: clean
	docker compose down --volumes; docker compose up --wait vault && \
	act workflow_dispatch --job e2e --workflows .github/workflows/build.yml

.PHONY: test-e2e-tls
test-e2e-tls: clean
	./scripts/gen-tls-certs.sh
	docker compose down --volumes; docker compose up --wait vault-tls && \
	act workflow_dispatch --job e2e-tls --workflows .github/workflows/build.yml --env-file .build/e2e-tls.env

.PHONY: test-enterprise
test-enterprise: clean
	@if [ -z "$(VAULT_LICENSE_CI)" ]; then \
		echo "Skipping enterprise tests: VAULT_LICENSE_CI not set"; \
	else \
		docker compose down --volumes; docker compose up --wait vault-enterprise && \
		act workflow_dispatch --job integrationEnterprise --workflows .github/workflows/build.yml; \
	fi

.PHONY: test-all
test-all: clean test-npm test-basic test-e2e test-e2e-tls test-enterprise
