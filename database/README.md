# Database Setup

## PostgreSQL Schema

Die Datenbank verwendet PostgreSQL und enthält folgende Tabellen:

### Users Table

```sql
- id (SERIAL PRIMARY KEY)
- nickname (VARCHAR(50) UNIQUE NOT NULL)
- email (VARCHAR(255) UNIQUE NOT NULL)
- password_hash (VARCHAR(255) NOT NULL)
- avatar_url (VARCHAR(500))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Setup

### 1. PostgreSQL installieren

Installieren Sie PostgreSQL von [postgresql.org](https://www.postgresql.org/download/)

### 2. Datenbank erstellen

```bash
# PostgreSQL Shell öffnen
psql -U postgres

# Datenbank erstellen
CREATE DATABASE drinking_leaderboard;

# Zum neuen DB connecten
\c drinking_leaderboard

# Schema laden
\i C:/Users/enzot/Drinking_Leaderboard/database/schema.sql
```

### 3. Environment Variables

Erstellen Sie eine `.env` Datei im Root-Verzeichnis:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/drinking_leaderboard
JWT_SECRET=your-secret-key-here-change-in-production
```

## Migrationen

Migrationen befinden sich im `migrations/` Ordner und können manuell ausgeführt werden:

```bash
psql -U postgres -d drinking_leaderboard -f database/migrations/001_create_users_table.sql
```

## Seed Data (Optional)

Für Testdaten können Sie später Seed-Scripts im `seeds/` Ordner hinzufügen.
