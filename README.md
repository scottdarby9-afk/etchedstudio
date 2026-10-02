# Etched Laser Studio

A responsive, enquiry-led commercial website for the business side of Perfectly Etched. Static HTML, CSS and JavaScript, with no framework dependencies and no ecommerce.

## Run locally

Requires Node.js 20 or newer.

```sh
npm run dev
```

Open http://localhost:3000. Build the publishable site with `npm run build`; output is `dist/`.

## GitHub and Vercel

Import `scottdarby9-afk/etchedstudio` into Vercel. Framework: Other. Build command: `npm run build`. Output directory: `dist`. These settings are also in `vercel.json`. No environment variables or paid integrations are required by this implementation.

GitHub repository: https://github.com/scottdarby9-afk/etchedstudio

Vercel deployment is managed by the business owner. This project is ready to import; the enquiry email remains unconfigured.

## Connect enquiries

Edit `public/site-config.js` and set `enquiryEmail` to a confirmed business email address. Until then, the project brief can be downloaded or copied and clearly states that nothing has been sent.

When an email is configured, the final brief offers an email action that opens the visitor's email app. This is not a server-side submission service. For a future direct-send form, add a server-side endpoint with validation, abuse protection and a transactional email provider, then update the privacy copy. Do not put API keys in public files.

## Content and images

- Main content: `public/index.html`
- Brand colours, typography and responsive layouts: `public/styles.css`
- Product detail copy, gallery filters and project brief: `public/app.js`
- Contact email: `public/site-config.js`
- Images: `public/assets/signage.webp`, `counter.webp`, `materials.webp`

All three product images are AI-generated concept placeholders, not actual client work. This is disclosed in the gallery and product detail panels. Names, labels and QR-style patterns in images are illustrative. Replace with real photography and revise concept labels when available.

No invented testimonials, customer logos, project counts, pricing promises or fixed lead times are included. Exterior fabrication and installation are subject to discussion rather than guaranteed in-house capabilities.

## Privacy

No analytics, third-party font requests, cookies, browser storage or form backend. Brief values live in page memory until refresh/close. Copy/download and mailto actions only run on explicit clicks. Hosting may process ordinary access logs. Review and complete the business privacy notice when direct enquiry delivery is introduced.

## Accessibility

Semantic sections, skip link, native modal dialogs, visible focus, labelled fields, form validation, keyboard-accessible controls, reduced-motion support and responsive layouts. Custom scripts use `textContent` for visitor data, not HTML insertion.

## Private admin dashboard

Visit `/admin` for the dashboard and invoicing app. Both `/admin/*` and the old `/invoicing/*` paths are served through `api/admin.js`, which checks a signed, secure HttpOnly session cookie. Invoicing files live in `private/`, outside the static build. The public marketing website is unchanged.

In Vercel → Project Settings → Environment Variables, set `ADMIN_PASSWORD` to a unique strong password of at least 16 characters for Production (and Preview if needed), then redeploy. Never commit the password. The admin area returns a locked page until this value is configured. Sessions last 12 hours; changing the password invalidates all sessions. Login/logout POST requests require a matching Origin. Protected responses are not cached.

This is a single-admin login. Documents remain in browser storage with backup/restore. Signing out protects access to the application but does not erase browser-local documents. Use a trusted device and browser profile. Existing browser drafts use the same storage key and are retained on the same domain. Historical Vercel deployments made before this protection should be removed or protected separately if they remain publicly reachable.
