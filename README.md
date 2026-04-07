# scalebox-fumadocs

Scalebox official documentation site built with [Fumadocs](https://fumadocs.dev) and Next.js.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation.

## Project Structure

```
scalebox-fumadocs/
├── content/                 # MDX documentation content
│   ├── en/                  # English docs
│   ├── zh-cn/                # Simplified Chinese docs
│   └── zh-tw/                # Traditional Chinese docs
├── app/                     # Next.js App Router
│   └── [lang]/              # Dynamic route for i18n
│       └── [[...slug]]/     # Documentation pages
├── source.config.ts         # Fumadocs MDX configuration
└── Dockerfile               # Container build configuration
```

## Documentation Structure

Each language version contains:

| Section | Description |
|---------|-------------|
| `cli/` | ScaleBox CLI installation and usage |
| `api/` | REST API reference and examples |
| `guides/` | Tutorials and how-to guides |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm types:check` | Run TypeScript type checking |
| `pnpm postinstall` | Generate MDX type definitions |

## Build Docker Image

```bash
docker build -t scalebox-fumadocs .
docker run -p 3000:3000 scalebox-fumadocs
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Fumadocs](https://fumadocs.dev) - Documentation framework
- [Fumadocs MDX](https://fumadocs.dev/docs/mdx) - MDX integration
