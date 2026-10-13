# My Family Spring

Client review preview for Family Spring's planned Google Ads landing page and thank-you page.

The preview includes the Warm & personal and Clear & practical design options. It does not collect or submit patient information. OnceHub, advertising tags, and analytics are not installed.

- [Client review](https://family-spring-review.pages.dev/)
- [Thank-you preview](https://family-spring-review.pages.dev/thank-you/)

## Local preview

```sh
python3 -m http.server 8780 --bind 127.0.0.1 --directory preview
```

Open `http://127.0.0.1:8780/` for the landing page or `/thank-you/` for the confirmation preview. The review toolbar switches designs and viewport modes. The chosen design is preserved in the URL (`?design=warm` or `?design=practical`).

## Cloudflare deployment

The `family-spring-review` Pages project is a dedicated design review site. Deploy only the `preview/` directory:

```sh
wrangler pages deploy preview --project-name family-spring-review --branch main
```

Authentication comes from the local Wrangler login or Cloudflare environment credentials. Never commit credentials.

All preview responses include `noindex` instructions. The site is publicly viewable by link; noindex is not access control.

## Files

- `preview/`: self-contained static review site with local image assets.
- `design-reference/exported-mockups.html`: original standalone export for reference, excluded from deployment.
- `wrangler.jsonc`: Cloudflare Pages configuration.

Mica Gonzalez, PhD; Sam Himelstein, PhD; and Morgan Hong, LMFT are shown using the photos and credentials supplied by Marvin. The intake form, Berkeley photograph, and final privacy notice remain placeholders. The San Rafael photography and logo come from the client-provided asset folder.

Both pages provide explicit Family Spring browser titles, Open Graph metadata, and social card titles. Crawlers may read this metadata; the noindex meta tags and response headers remain in place.
