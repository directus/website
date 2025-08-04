#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Set defaults
NUXT_PUBLIC_SITE_URL=${NUXT_PUBLIC_SITE_URL:-http://localhost:3000}

# Check if API key is set
if [ -z "$TYPESENSE_INDEXING_API_KEY" ]; then
    echo "❌ Error: TYPESENSE_INDEXING_API_KEY environment variable is not set"
    echo "Please set it in your .env file or environment"
    exit 1
fi

# Get collection argument
COLLECTION=${1:-all}

# Validate collection argument
case $COLLECTION in
    all|extensions|integrations|templates)
        ;;
    *)
        echo "❌ Error: Invalid collection '$COLLECTION'"
        echo "Usage: $0 [all|extensions|integrations|templates]"
        echo "Examples:"
        echo "  $0 all          # Index all collections"
        echo "  $0 extensions   # Index extensions only"
        echo "  $0 integrations # Index integrations only"
        echo "  $0 templates    # Index templates only"
        exit 1
        ;;
esac

echo "🚀 Indexing $COLLECTION collection(s)..."
echo "📍 URL: $NUXT_PUBLIC_SITE_URL"
echo "🔑 API Key: ...${TYPESENSE_INDEXING_API_KEY: -4}"

curl -X POST "$NUXT_PUBLIC_SITE_URL/api/search/indexing/$COLLECTION" \
  -H "X-API-Key: $TYPESENSE_INDEXING_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}' \
  -w "\n📊 Response time: %{time_total}s\n"
