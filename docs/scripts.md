# npm scripts — what they do

This document explains common npm scripts found in package.json and what each typically does. Use `npm run <script>` to execute custom scripts (or `npm start` / `npm test` for lifecycle defaults).

## How to run
- `npm run <name>` — run a custom script.
- `npm start` — runs the `start` script (alias for `npm run start`).
- `npm test` — runs the `test` script.
- `npm run-script` — same as `npm run`.

## Typical scripts and purpose

- `start`
    - Runs the application in production (or program entry). Example: `node server.js`, `vite preview`.
- `dev`, `serve`, `start:dev`
    - Starts a development server with hot reload. Example: `vite`, `next dev`, `webpack serve`.
- `build`
    - Produces production-ready assets (bundling, transpiling, minifying). Example: `webpack --mode production`, `vite build`.
- `test`
    - Runs unit/integration tests. Example: `jest`, `vitest`, `mocha`.
- `lint`
    - Checks code style and possible errors. Example: `eslint src`.
- `lint:fix`
    - Runs lint with auto-fix. Example: `eslint src --fix`.
- `format`
    - Runs code formatter. Example: `prettier --write "src/**/*.{js,ts,md}"`.
- `type-check`
    - Runs TypeScript type checking. Example: `tsc --noEmit`.
- `watch`
    - Rebuilds on file changes for development. Example: `webpack --watch`.
- `clean`
    - Removes build artifacts. Example: `rimraf dist`.
- `prepare`
    - Lifecycle script run after `npm install` and before publishing; often used to build packages.
- `prepublishOnly`
    - Runs before `npm publish`; use to run tests/builds that must pass before publish.
- `postinstall`
    - Runs after install; used to build native dependencies or generate files.
- `precommit` / `commit`
    - Hooks used by tools like Husky. Example: run tests or lint-staged before commit.
- `release`
    - Automates version bumping, changelog, and publishing. Example: `semantic-release` or `standard-version`.
- `docs`
    - Generates project docs. Example: `typedoc` or `jsdoc`.

## Script composition and lifecycle
- Scripts can run other scripts: `"build:prod": "npm run build -- --mode production"`.
- Pre/post hooks: `prebuild` runs before `build`; `postbuild` runs after.
- Use `&&` to chain commands, `||` to fallback.
- For cross-platform env vars use `cross-env` or define OS-specific commands.

## Example package.json scripts
```json
{
    "scripts": {
        "dev": "vite",
        "start": "node server.js",
        "build": "vite build",
        "test": "vitest run",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "format": "prettier --write .",
        "clean": "rimraf dist",
        "type-check": "tsc --noEmit",
        "prepare": "npm run build"
    }
}
```