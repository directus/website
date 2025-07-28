# Directus Website

The official Directus website - a sophisticated marketing site built with Nuxt 3, TypeScript, and a block-based CMS architecture powered by Directus headless CMS.

🌐 **Live Site:** [directus.io](https://directus.io)
🏗️ **Built with:** Nuxt 3, TypeScript, Vue 3, Tailwind CSS
📱 **Features:** SSG, Visual Editing, Analytics, Marketplace Search

## Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 8.15.0 (package manager is enforced)

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting & formatting
pnpm lint
pnpm format

# Bundle analysis
pnpm analyze
```

## Architecture

### Technology Stack

- **🚀 Nuxt** - Vue.js framework with SSR/SSG capabilities
- **📘 TypeScript** - Strict typing with full type checking enabled
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📦 Directus SDK** - Headless CMS integration with custom schema
- **📊 PostHog** - Analytics and feature flags (custom module)
- **🔍 Typesense** - Search functionality for marketplace
- **🖼️ Nuxt Image** - Optimized image handling with multiple providers

### Key Features

#### Block-Based CMS System
Dynamic content management with reusable blocks:
- **PageBuilder.vue** - Core component that renders sections containing blocks
- **PageSection.vue** - Handles section-level styling and spacing
- **Block Components** - Located in `components/Block/`, each block type has its own component

#### Directus Integration
- **Schema Types** - Comprehensive TypeScript definitions in `types/schema/`
- **Rate Limiting** - Built-in API throttling (10 requests per 500ms)
- **Visual Editing** - Live preview and editing capabilities

#### Marketplace
- **Typesense Integration** - Fast search for extensions, integrations, and templates
- **Domain Services** - Organized by collection type in `layers/marketplace/`
- **Indexing API** - Secure endpoints for content indexing

### Directory Structure

```
├── components/          # Vue components (Base, Block, Nav, etc.)
├── composables/         # Reusable Vue composition functions
├── layouts/            # Page layouts (default, blank, tv)
├── pages/              # File-based routing with dynamic content
├── plugins/            # Nuxt plugins (Directus, PostHog, etc.)
├── middleware/         # Route middleware
├── server/             # Server-side API endpoints
├── types/schema/       # TypeScript definitions for Directus schema
├── layers/marketplace/ # Marketplace functionality (Nuxt layer)
├── modules/            # Custom Nuxt modules
└── scripts/           # Utility scripts
```

## Environment Variables

### Required

```bash
# CMS Integration
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TV_URL=https://your-directus-tv-instance.com

# Site Configuration
NUXT_PUBLIC_SITE_URL=https://directus.io
NUXT_PUBLIC_ENABLE_VISUAL_EDITING=true

# Analytics
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
POSTHOG_API_KEY=your-posthog-key
POSTHOG_API_HOST=https://app.posthog.com
```

### Marketplace (Optional)

```bash
# Marketplace Registry
DIRECTUS_MARKETPLACE_REGISTRY_URL=https://registry.directus.io
DIRECTUS_MARKETPLACE_REGISTRY_TOKEN=your-registry-token

# Search (Typesense)
TYPESENSE_URL=https://your-typesense-cluster.com
TYPESENSE_PUBLIC_API_KEY=your-public-key
TYPESENSE_PRIVATE_API_KEY=your-private-key

# Indexing Security
TYPESENSE_INDEXING_API_KEY=$(openssl rand -hex 32)
```

## Marketplace Indexing

The marketplace search uses Typesense for indexing extensions, integrations, and templates.

### Setup

1. **Set Environment Variables**

Create a `.env` file:

```bash
# Generate a secure API key
TYPESENSE_INDEXING_API_KEY=$(openssl rand -hex 32)
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. **For Production (Netlify)**

Add these environment variables to your site settings:
- `TYPESENSE_INDEXING_API_KEY` - Your generated API key
- `NUXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://directus.io`)

### Usage

With the dev server running, use these npm scripts:

```bash
# Index all collections
pnpm run index:all

# Index specific collections
pnpm run index:extensions
pnpm run index:integrations
pnpm run index:templates
```

### API Endpoints

- `POST /api/search/indexing/all` - Index all collections
- `POST /api/search/indexing/extensions` - Index extensions only
- `POST /api/search/indexing/integrations` - Index integrations only
- `POST /api/search/indexing/templates` - Index templates only

All endpoints require the `X-API-Key` header with your `TYPESENSE_INDEXING_API_KEY`.

### Troubleshooting

**"Invalid or missing API key"**
- Make sure `TYPESENSE_INDEXING_API_KEY` is set in your `.env` file
- Check that you're passing the key in the `X-API-Key` header

**"TYPESENSE_INDEXING_API_KEY not configured"**
- The environment variable isn't set on the server
- Add it to your deployment environment variables

**Connection errors**
- Make sure the dev server is running
- Check that `NUXT_PUBLIC_SITE_URL` points to the correct URL

## Deployment

### Netlify (Current)

The site is deployed on Netlify with automatic builds from the main branch.

**Build Settings:**
- **Build Command:** `pnpm build`
- **Publish Directory:** `.output/public`
- **Node Version:** 20+

**Environment Variables:** Set all required environment variables in Netlify's site settings.

### Performance Optimizations

- **Static Site Generation** - Pre-rendered pages for optimal performance
- **Image Optimization** - Multiple providers (Directus, Directus TV)
- **Build Cache** - Shared prerender data and build caching enabled
- **Bundle Analysis** - Use `pnpm analyze` to monitor bundle size

## Content Management

### Block System

The website uses a sophisticated block-based content system:

1. **Content Editors** create pages using blocks in Directus
2. **PageBuilder.vue** dynamically renders these blocks
3. **Block Components** in `components/Block/` handle each block type
4. **TypeScript Types** ensure type safety across the entire system

### Content Types

- **Pages** - Dynamic pages with blocks (`pages/[...permalink].vue`)
- **Blog Posts** - Articles and announcements (`pages/blog/[slug].vue`)
- **Features** - Product feature pages (`pages/features/[slug].vue`)
- **Team** - Team member profiles (`pages/team/[slug].vue`)
- **Case Studies** - Customer success stories (`pages/case-studies/[slug].vue`)
- **TV** - Video content and shows (`pages/tv/`)

### Visual Editing

Content editors can use Directus Visual Editor for:
- **Live Preview** - See changes in real-time
- **Block-level Editing** - Edit content directly on the page
- **Modal Interface** - Rich editing experience

## Development Notes

### Custom Modules

- **PostHog Module** (`modules/posthog/`) - Analytics with feature flags
- **Prerender Module** (`modules/prerender.ts`) - Static site generation config
- **Redirects Module** (`modules/redirects.ts`) - URL redirect handling
