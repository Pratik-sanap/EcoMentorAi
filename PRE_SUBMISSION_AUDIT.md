# Pre-Submission Repository Audit Checklist

Follow this comprehensive step-by-step checklist to ensure your EcoMentor AI project is clean, secure, under the 10 MB size limit, and ready for judges to evaluate.

---

## 1. Required `.gitignore`
Ensure your `.gitignore` file includes the following entries to prevent unnecessary or sensitive files from being pushed to GitHub. This is critical for keeping the repository size small.

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel
```

## 2. Files/Folders That Should NOT Be Committed
Double-check your repository (and `git status`) to ensure the following are **not** staged or tracked:
- [ ] `node_modules/` (This folder alone is often 100s of MBs).
- [ ] `.next/` or `build/` (Compiled application files).
- [ ] `.env` or `.env.local` containing actual API keys or secrets.
- [ ] `.DS_Store` (macOS hidden files).
- [ ] Large binary files (e.g., high-res PSDs, raw videos, uncompressed ZIP files).

## 3. Repository Size Reduction Checklist (< 10 MB Goal)
- [ ] **Verify `node_modules` is excluded:** Run `git status` to confirm.
- [ ] **Optimize Images:** Check the `public/` folder. Compress any large `.png` or `.jpg` files using tools like TinyPNG, or convert them to `.webp`. Ensure no single image exceeds ~500 KB.
- [ ] **Remove Unused Assets:** Delete any placeholder videos, audio files, or large mock datasets that are no longer used in the final build.
- [ ] **Clear Git Cache:** If you accidentally committed `node_modules` or a large file previously, it will still take up space in the `.git` history. If your repo size is over 10 MB on GitHub, you may need to run `git rm -r --cached .` followed by `git add .` and `git commit -m "Clear git cache"` (or use a tool like BFG Repo-Cleaner for deep history).

## 4. Security Checklist
- [ ] **No Hardcoded Keys:** Search your entire codebase (`Ctrl+Shift+F`) for strings like `sk-`, `AIza`, or `password`. Ensure no API keys or database URIs are hardcoded in the `.ts` or `.tsx` files.
- [ ] **Review `localStorage`:** Confirm that what you are storing in `localStorage` does not include highly sensitive real-world PII (which is fine for a demo, but good practice to verify).
- [ ] **Clean Console Logs:** Remove or comment out any `console.log()` statements that might leak internal state or data structure details.

## 5. Environment Variable Checklist
Since this application relies heavily on client-side state and you mentioned not needing external API keys for the AI Coach, you might not have environment variables. However, if you do:
- [ ] **Create `.env.example`:** If your app requires an `.env` file to run, create an `.env.example` file with dummy values (e.g., `NEXT_PUBLIC_API_URL=your_url_here`). Commit **this** file.
- [ ] **Ignore Real `.env`:** Ensure your actual `.env` file is listed in `.gitignore`.

## 6. Build Verification Checklist
Before submitting, you must ensure the code actually compiles for the judges.
- [ ] **Lint Check:** Run `npm run lint`. Fix any critical warnings or errors. Next.js builds will fail if there are strict linting errors.
- [ ] **Type Check:** If you have a typecheck script, run it. Otherwise, rely on the build step.
- [ ] **Production Build:** Run `npm run build`. This is the most crucial step. If this fails, the project cannot be easily deployed or evaluated.
- [ ] **Local Production Test:** Run `npm run start` after building to verify the production version of the app works flawlessly on `http://localhost:3000`.

## 7. Branch Verification Checklist
- [ ] **Single Branch:** Ensure you are currently on the `main` or `master` branch.
- [ ] **Merge Everything:** Merge any feature branches (like `feature/dashboard`) into `main`.
- [ ] **Clean Working Tree:** Run `git status`. It should say "nothing to commit, working tree clean".
- [ ] **Push to Remote:** Run `git push origin main` to ensure your local changes are synced to GitHub.

## 8. Final GitHub Submission Checklist
- [ ] **Public Repository:** Go to your GitHub repository Settings -> General. Scroll to the bottom and ensure the repository visibility is set to **Public**.
- [ ] **Check Repo Size:** On the main page of your GitHub repo, click on your Code tab and download the ZIP. Check the ZIP file size—it must be under 10 MB.
- [ ] **Verify README.md:** Ensure your professional README is visible on the repository home page and the formatting looks correct.
- [ ] **Verify DEMO_FLOW.md:** Ensure the demo script is easily accessible.
- [ ] **The "Clean Clone" Test:** To be 100% sure, create a new folder on your computer outside your project directory, run `git clone <your-repo-url>`, `npm install`, and `npm run dev`. If it runs without issues, you are ready to submit!
