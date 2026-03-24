# Backend

Dieser Ordner enthält die Backend-Logik der Drinking Leaderboard Anwendung.

## Struktur

Hier können Sie folgende Komponenten platzieren:

- API-Endpunkte
- Server-Logik
- Business-Logik
- Middleware
- Authentication/Authorization

## Entwicklung

### Setup

```bash
npm install
```

### Tests

```bash
# Unit + Integration + Coverage
npm run test

# CI mode
npm run test:ci
```

Die Backend-Tests umfassen:

- User-Endpoint Tests (Supertest)
- Drink-Endpoint Tests (Supertest)
- Leaderboard-Endpoint Tests (Supertest)
- Database-nahe Model-Tests (gemockte DB-Queries)
- Service-Unit-Tests fuer Leaderboard-Logik

Coverage-Gate ist auf mindestens 70% global gesetzt.
