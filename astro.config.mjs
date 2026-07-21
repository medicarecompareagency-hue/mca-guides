import { defineConfig } from 'astro/config';

// CHANGE THIS if you end up serving from a subdomain instead of /guides/.
// Subdirectory (best for SEO, needs Gallerez to set up the proxy):
export default defineConfig({
  site: 'https://www.medicarecompareagency.com',
  base: '/guides',
  // Astro's `base` only prefixes generated links - it does NOT nest the
  // built files. Without this, Vercel serves the pages at the root and
  // /guides 404s. outDir puts the files where `base` says they are.
  outDir: './dist/guides',
});

// Subdomain fallback - swap the block above for this if the proxy isn't possible:
// export default defineConfig({
//   site: 'https://blog.medicarecompareagency.com',
//   trailingSlash: 'never',
// });
