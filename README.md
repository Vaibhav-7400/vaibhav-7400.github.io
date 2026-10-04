# Vaibhav Naik | Engineering Portfolio

Website: https://vaibhav-7400.github.io

A responsive static website for industrial, manufacturing, process, quality, and semiconductor engineering roles. HTML, CSS, and browser JavaScript; no framework, backend, or runtime dependencies.

## Edit the website

All profile information, project case studies, skills, and experience entries live in `content.json`. Edit that file, then run:

```powershell
node build.js
```

Node.js is needed only to regenerate pages. The generated website opens directly through `index.html`, and GitHub Pages serves it without running Node. Commit both content and generated pages after an update.

Add your actual `resume.pdf` beside `index.html` and run the build again to enable resume links. They stay hidden until the file exists. Add exact role titles, dates, and accomplishments under each experience entry in `content.json`; no unverified job details are included.

## Pages

- Homepage: Home, selected work, planned studies, experience, Rutgers nanofabrication training, skills, and contact.
- Three case studies link to existing semiconductor, SPC, and inventory projects.
- Five research scopes retain the originally requested project ideas, clearly labeled as planned.
- `404.html`, `robots.txt`, `sitemap.xml`, canonical links, social preview metadata, and profile structured data.

## Publish and update

The user site repository is `Vaibhav-7400.github.io`. GitHub Pages publishes the `main` branch from `/ (root)`. After editing and rebuilding, commit and push the generated files. The site is public.

```powershell
git add .
git commit -m "Update portfolio"
git push
```

If using a different repository or a custom domain, update `siteUrl` and rebuild first. Internal page and asset links are relative, so the portfolio also works under a repository subpath.

Official setup: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Project evidence

Project descriptions were checked against the owner's public repositories on October 4, 2026. Screenshots come from the SPC and inventory repositories. The wafer image is an illustrative graphic, not experimental data. Synthetic data, assumed parameters, projected savings, and pending studies are explicitly distinguished from real results. The scheduling repository currently contains a project outline, so its expected performance targets are not presented as achieved outcomes.

Contact uses a real email link; no form pretends to submit without a mail service. The page also includes a copy-email button, keyboard navigation, a skip link, responsive layouts, reduced-motion support, and a print stylesheet.
