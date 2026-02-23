# Dev

## Local development - relaxed CORS (developer only)

If you need to test cross-origin requests locally (for example when developing against a remote CMS or API), there is a convenience dev script that starts the Parcel dev server and opens a dedicated Chrome instance with web security disabled.

- Start the dev server and open Chrome:

```bash
npm run dev
```

- Notes & safety:
	- The launcher opens Chrome with `--disable-web-security` and a temporary profile directory (by default: `/tmp/wmca-chrome-dev`). This disables the browser's same-origin protections and should only be used for local development and testing.
	- Do NOT use this flag in CI or production.
	- To revert to a normal dev session, either close the Chrome window started by the script and open your regular browser, or run Parcel directly:

```bash
npx parcel src/index.html
```