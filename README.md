# Arjun's CTP 5 Prep

A 14-day study plan for the CTP 5 with concept lessons, topic quizzes, vocabulary flashcards,
a challenge round, a weak-spot drill, and two full-length hard practice tests.

All questions are original and modeled on the CTP 5 subtest types. They are not real ERB items,
so treat scores as study signals, not predictions.

## Put it online with GitHub Pages (no tools needed)

The `docs/` folder is already built, so you only need to upload it.

1. Create a new repository on GitHub (for example `arjun-ctp5-prep`). Public is simplest.
2. Upload everything in this folder to the repository (drag and drop works on the "Add file > Upload files" page).
   Make sure the `docs` folder comes along.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch **main** and folder **/docs**, then **Save**.
5. Wait a minute or two. The site will be at `https://YOUR-USERNAME.github.io/arjun-ctp5-prep/`.

Or from a terminal:

```bash
git init
git add .
git commit -m "CTP 5 prep app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/arjun-ctp5-prep.git
git push -u origin main
```

Then do steps 3 and 4 above.

Tip: a free GitHub Pages site is public. The content is only study material, but if you would
rather keep it private, host it from a private repo on a plan that supports private Pages,
or just open `docs/index.html` directly on your computer.

## Progress and devices

Progress (lessons learned, quiz and test scores, missed questions, flashcards) saves in the browser
on each device. To move to another device, open the **Review** tab, tap **Show backup code**,
copy it, and paste it into **Restore** on the other device.

## Changing things

Everything lives in `src/App.jsx`.

- **Test date and plan start:** `START` and `TEST_DATE` near the top of the plan section. The plan assumes the test is Thursday, Oct. 29, 2026.
- **Questions and lessons:** the `MOD_*` objects (lessons and topic quizzes), `TEST1` and `TEST2` (practice tests), and `WORDS` (flashcards).
- **Rebuild after editing:**

```bash
npm install
npm run build
```

This regenerates `docs/app.js` and `docs/index.html`. Commit and push, and the site updates.

## Project layout

```
index.html        page template
src/main.jsx      entry point
src/App.jsx       the whole app (data and screens)
build.mjs         build script (esbuild)
docs/             built site that GitHub Pages serves
```
