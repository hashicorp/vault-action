.PHONY: clean
clean:
	rm -rf .build

.PHONY: local-test
local-test: clean
	docker compose down;  docker compose up --detach vault && \
	act workflow_dispatch --job local-test --workflows .github/workflows/local-test.yaml

.PHONY: test-basic
test-basic: clean
	docker compose down; docker compose up --detach vault && \
	npm run test:integration:basic

.PHONY: test-e2e
test-e2e: clean
	docker compose down; docker compose up --detach vault && \
	act workflow_dispatch --job e2e --workflows .github/workflows/build.yml

.PHONY: test-e2e-tls
test-e2e-tls: clean
	./scripts/gen-tls-certs.sh
	docker compose down; docker compose up --detach vault-tls && \
	act workflow_dispatch --job e2e-tls --workflows .github/workflows/build.yml --env-file .build/e2e-tls.env

.PHONY: test-enterprise
test-enterprise: clean
	docker compose down; docker compose up --detach vault-enterprise && \
	act workflow_dispatch --job integrationEnterprise --workflows .github/workflows/build.yml

.PHONY: test-all
test-all: clean
	npm ci && npm run build && npm run test
	$(MAKE) test-basic
	$(MAKE) test-e2e
	$(MAKE) test-e2e-tls
	# VAULT_LICENSE_CI must be set to run enterprise tests
	@if [ -n "$(VAULT_LICENSE_CI)" ]; then \
		$(MAKE) test-enterprise; \
	else \
		echo "Skipping enterprise tests: VAULT_LICENSE_CI not set"; \
	fi
