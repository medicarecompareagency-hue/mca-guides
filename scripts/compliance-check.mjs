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

  // ---- Fact-verification gate -------------------------------------------
  // Articles publish automatically, so nothing downstream re-reads them.
  // These rules exist because an unsourced dollar figure in Medicare
  // marketing is the failure mode that actually hurts a reader.

  // Any article stating dollar amounts must cite where they came from.
  const hasDollarFigures = /\$[\d,]+(\.\d{2})?/.test(body);
  const hasSourceLine = /^\*?Sources?:/mi.test(body) ||
                        /\*Sources?:/i.test(body);
  if (hasDollarFigures && !hasSourceLine) {
    errors.push(`${tag} states dollar figures but has no Sources line - ` +
      `every published figure needs a traceable primary source`);
  }

  // Sources must be primary. Secondary aggregators are fine as corroboration
  // but cannot be the only thing standing behind a number.
  if (hasDollarFigures && hasSourceLine) {
    const primary = /(medicare\.gov|cms\.gov|ssa\.gov|irs\.gov|medicaid\.gov)/i;
    if (!primary.test(body)) {
      errors.push(`${tag} cites sources but none are primary ` +
        `(medicare.gov, cms.gov, ssa.gov, irs.gov, medicaid.gov)`);
    }
  }

  // Future-year figures are the highest-risk claim an automated writer can
  // make, because CMS publishes them late and a plausible guess looks
  // identical to a real number.
  const thisYear = new Date().getFullYear();
  const futureYear = new RegExp(`\\b(${thisYear + 1}|${thisYear + 2})\\b`);
  if (futureYear.test(body) && /\$[\d,]+/.test(body)) {
    const m = body.match(futureYear);
    if (!new RegExp(`${m[0]}[^.]{0,400}(medicare\\.gov|cms\\.gov|ssa\\.gov)`, 'i').test(body)
        && !new RegExp(`(medicare\\.gov|cms\\.gov|ssa\\.gov)[^.]{0,400}${m[0]}`, 'i').test(body)) {
      warnings.push(`${tag} references ${m[0]} alongside dollar figures - ` +
        `confirm CMS has actually published those numbers`);
    }
  }

  // Hedging language signals the writer wasn't sure. Readers act on this
  // content; "approximately $1,736" means somebody guessed.
  const hedges = body.match(/\b(approximately|roughly|around|about)\s+\$[\d,]+/gi);
  if (hedges) {
    errors.push(`${tag} hedged dollar figure "${hedges[0]}" - ` +
      `look up the exact number or remove the claim`);
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
