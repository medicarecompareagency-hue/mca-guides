# Setup

The project is already on your computer at:

```
C:\Users\dbuir\Downloads\Articles\mca-guides
```

No moving or downloading needed. Start here.

---

## 1. Open a NORMAL PowerShell window

Not admin. Click Start, type `powershell`, and click it — don't right-click,
don't "Run as administrator."

You'll know it's right because the prompt says `PS C:\Users\dbuir>` rather
than `PS C:\windows\system32>`.

## 2. Go to the folder

```powershell
cd C:\Users\dbuir\Downloads\Articles\mca-guides
```

Confirm you're in the right place:

```powershell
dir
```

You should see `package.json`, `src`, `scripts`, `README.md`. If you see
Windows system files instead, you're in the wrong folder — repeat step 1.

## 3. Install

```powershell
npm install
```

Takes a minute or two and prints a lot of text. Warnings are normal. As long
as it doesn't say `npm error`, it worked.

## 4. Look at it

```powershell
npm run dev
```

It'll print a local address — something like `http://localhost:4321/guides`.
Open that in your browser. You'll see all five articles, each on its own page.

Leave that window running while you look. Press `Ctrl+C` in PowerShell to
stop it.

---

## When you're ready to put it online

### Save it to GitHub

```powershell
git init
git add -A
git commit -m "Initial commit: guides site with five migrated articles"
```

Then create the repo at https://github.com/new — owner
`medicarecompareagency-hue`, name `mca-guides`, **Public**, and do NOT check
any of the "add a README / .gitignore / license" boxes. Then:

```powershell
git remote add origin https://github.com/medicarecompareagency-hue/mca-guides.git
git branch -M main
git push -u origin main
```

### Deploy it

```powershell
vercel
```

Accept the defaults — Vercel recognizes Astro on its own. Then:

```powershell
vercel --prod
```

Write down the URL it gives you (something like `mca-guides.vercel.app`).
You need it for the Gallerez brief.

### Send the brief

`docs\GALLEREZ-BRIEF.md` — paste your Vercel URL into the proxy config
block, then send it to them.

Their answer decides one thing: whether the articles live at
`medicarecompareagency.com/guides/` (better) or
`blog.medicarecompareagency.com` (still fine). If it's the subdomain, tell
me and I'll switch the config — it's a one-line change.

---

## Day-to-day, once it's live

Write a new article as a `.md` file in `src\content\articles\`, then:

```powershell
git add -A
git commit -m "Add: article title"
git push
```

Live in about a minute. See `README.md` for the article format.

---

## If something goes wrong

**"npm error EPERM" or paths showing `C:\windows\system32`** — you're in an
admin window or the wrong folder. Go back to step 1.

**"npm is not recognized"** — close PowerShell and reopen it.

**"cannot be loaded because running scripts is disabled"** — run this once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**Anything else** — paste the red text back to me.
