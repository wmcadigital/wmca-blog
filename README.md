# WMCA Blog

Ensure you have LTS versions of node and npm installed.

To run locally execute the following at the root of the project:
```
npm run dev
```

To build assets for production, run the following at the root of the project:
```
npm run build
```

Serving the build from a CDN
---------------------------

If you upload the build output to a CDN or serve it from a subpath (for example `https://cdn.example.com/site/`), you must ensure the bundled HTML references the assets with a relative public path so they resolve correctly under the CDN path.

This repo includes a convenience build command that produces a `build/` folder suitable for uploading to a CDN:

```bash
npm run build:cdn
```

What it does:
- outputs files to `build/` (instead of the default `dist/`) so you can upload the entire folder
- sets Parcel's `--public-url ./` so asset references are relative and will work from a subpath on the CDN
