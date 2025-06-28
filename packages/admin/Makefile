prepare:
	cd backend && pdm install
	pnpm install --ignore-scripts

install: prepare install-backend
	pnpm install

install-backend:
	cd backend && pdm install

dev:
	pnpm dev

serve:
	pnpm run serve

clean:
	rm -rf node_modules .venv backend/.venv backend/__pycache__ backend/.pytest_cache backend/.pdm-backend logs dist build test-results playwright-report blob-report
	cd backend && pdm run clean || true

build:
	pnpm build
	cd backend && pdm build

format:
	pnpm format || pnpm run format
	cd backend && pdm run format || true

lint:
	pnpm lint || pnpm run lint
	cd backend && pdm run lint || true

test:
	pnpm test || pnpm run test
	cd backend && pdm run test || true

test-e2e:
	pnpm run test:e2e || true
	cd backend && pdm run test:e2e || true

docker-build:
	docker build -t $(DOCKER_IMAGE) .

docker-push:
	docker push $(DOCKER_IMAGE)
