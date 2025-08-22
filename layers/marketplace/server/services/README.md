# Marketplace Indexing Services

This directory contains the refactored Typesense indexing services for the Directus marketplace, organized by collection/domain rather than technical concern.

## Architecture

### Domain Services

- **`extensions.ts`** - Extensions from marketplace registry (schema, fetching, indexing)
- **`integrations.ts`** - Integrations from marketing API (schema, fetching, indexing)  
- **`templates.ts`** - Templates from marketing API (schema, fetching, indexing)
- **`typesense.ts`** - Core Typesense client setup

### API Endpoints

- `POST /api/search/index-extensions` - Index extensions only
- `POST /api/search/index-integrations` - Index integrations only
- `POST /api/search/index-templates` - Index templates only
- `POST /api/search/index-all` - Index all collections

### Collections

1. **directus-extensions** - Extensions from marketplace registry
2. **directus-integrations** - Integrations from marketing API
3. **directus-templates** - Templates from marketing API

## Usage

### Index Everything
```bash
curl -X POST http://localhost:3000/api/search/index-all \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

### Index Extensions Only
```bash
curl -X POST http://localhost:3000/api/search/index-extensions \
  -H "Content-Type: application/json" \
  -d '{"recreate": true}'
```

### Options

- `recreate: true` - Delete and recreate the collection (fresh start)
- `recreate: false` - Update existing collection (default)

## Domain-Driven Organization

Each collection type owns its complete logic:

**Extensions Service:**
- `extensionsSchema` - Typesense collection schema
- `fetchExtensions()` - Data fetching from marketplace
- `indexExtensions()` - Complete indexing workflow

**Integrations Service:**
- `integrationsSchema` - Typesense collection schema  
- `fetchIntegrations()` - Data fetching from marketing API
- `indexIntegrations()` - Complete indexing workflow

**Templates Service:**
- `templatesSchema` - Typesense collection schema
- `fetchTemplates()` - Data fetching from marketing API
- `indexTemplates()` - Complete indexing workflow

## Benefits

1. **Domain-Driven** - Each collection owns all its logic
2. **Simple Functions** - No unnecessary classes or abstractions
3. **Clear Boundaries** - Easy to understand and modify
4. **Type Safety** - Full TypeScript support
5. **Extensible** - Easy to add new collection types