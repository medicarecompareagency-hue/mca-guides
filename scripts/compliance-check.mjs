// Pre-publish compliance and SEO gate. Runs in CI on every push.
// If this fails, the deploy fails. That is the point.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'src/content/articles';
const errors = [];
const warnings = [];

// Words that create compliance exposure in Medicare marketing.
const BANNED = [
  { re: /\b(best|top|#1|number one|cheapest|lowest cost)\b/i,
    why: 'superlative claim about plans needs a source or must be removed' },
  { re: /\b(act now|limited time|don'?t miss out|hurry|last chance)\b/i,
    why: 'urgency language is not permitted in Medicare marketing' },
  { re: /\b(medicare|cms) (endorses|approved us|recommends us)\b/i,
    why: 'implies government endorsement' },
  { re: /\bfree\s+(gift|meal|prize)\b/i,
    why: 'prohibited inducement' },
];

const files = (await readdir(DIR)).filter((f) => f.endsWith('.md'));

if (files.length === 0) errors.push('No articles found in ' + DIR);

for (const file of files) {
  const raw = await readFile(join(DIR, file), 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  const tag = `${file}:`;

  if (!fm) { errors.push(`${tag} no frontmatter block`); continue; }
  const front = fm[1];
  const body = raw.slice(fm[0].length);

  // Compliance review must be explicitly affirmed
  if (!/^reviewedForCompliance:\s*true\s*$/m.test(front)) {
    errors.push(`${tag} reviewedForCompliance is not true`);
  }

  // Required SEO fields - these are what the old /news page was missing
  for (const field of ['title', 'description', 'targetKeyword', 'publishDate']) {
    const m = front.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
    if (!m || !m[1].replace(/["']/g, '').trim()) {
      errors.push(`${tag} ${field} is missing or empty`);
    }
  }

  // Google truncates long titles and descriptions
  const title = front.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? '';
  if (title.length > 65) {
    warnings.push(`${tag} title is ${title.length} chars, Google truncates near 60-65`);
  }
  const desc = front.match(/^description:\s*"?(.*?)"?\s*$/m)?.[1] ?? '';
  if (desc.length > 165) {
    warnings.push(`${tag} description is ${desc.length} chars, aim for under 165`);
  }
  if (desc && desc.length < 70) {
    warnings.push(`${tag} description is only ${desc.length} chars, aim for 70+`);
  }

  // Banned language
  for (const { re, why } of BANNED) {
    const hit = body.match(re);
    if (hit) errors.push(`${tag} found "${hit[0]}" - ${why}`);
  }

  // Leftover template scaffolding
  if (/\{\{|TODO|FIXME|Lorem ipsum/i.test(body)) {
    errors.push(`${tag} unfilled placeholder or TODO left in body`);
  }
}

if (warnings.length) {
  console.log('\nWarnings (not blocking):');
  warnings.forEach((w) => console.log('  ! ' + w));
}

if (errors.length) {
  console.error('\nCompliance check FAILED:\n');
  errors.forEach((e) => console.error('  x ' + e));
  console.error(`\n${errors.length} problem(s). Deploy blocked.\n`);
  process.exit(1);
}

console.log(`\nCompliance check passed. ${files.length} article(s) clean.\n`);
