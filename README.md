# Sharad Rangaraju · Portfolio

Static Astro site for a 3D anime artist portfolio. Plain CSS, self-hosted fonts, no framework runtime.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the built site
```

## Before launch: fill in the placeholders

Every placeholder is marked `TODO` or is lorem ipsum. List them with:

```sh
grep -rn "TODO\|Lorem" src
```

- `src/data/site.ts`: tagline, bio, skills/tools, X profile URL. Each has an example in a comment.
- `src/content/projects/*.md`: year, tools, alt text, award names, and the write-up.
- `src/content/projects/game-jam-winner.md`: the real itch.io URL and both award names.

## Project structure

```
src/
  content.config.ts        project frontmatter schema
  content/projects/*.md    one file per project
  data/site.ts             site-wide copy (name, bio, links)
  styles/global.css        design tokens (colors, fonts, spacing) on :root
  layouts/BaseLayout.astro
  components/              Header, Footer, ProjectCard, PreviewMedia, Laurels…
  pages/index.astro        home page
  pages/work/[slug].astro  project detail page
public/projects/<slug>/    media for each project
```

## Adding a project

1. Make a folder for its media: `public/projects/my-new-project/`.
2. Add a poster still (`poster.jpg`, ~1280×720) and, optionally, a preview loop and breakdown images.
3. Create `src/content/projects/my-new-project.md`. The filename becomes the URL: `/work/my-new-project/`.

```md
---
title: My New Project
number: 4                      # order on the page and the "04 /" label
category: 3D animation         # or "Lighting & compositing" or "Game development"
year: 2026
tools: [Blender]
poster: /projects/my-new-project/poster.jpg
posterAlt: Describe what's in the frame
preview:                       # all optional; video is preferred over gif
  webm: /projects/my-new-project/preview.webm
  mp4: /projects/my-new-project/preview.mp4
  # gif: /projects/my-new-project/preview.gif
previewFit: contain            # optional: letterbox instead of crop (vertical / non-16:9 clips)
previewBackdrop: "#000"        # optional: letterbox bar color, match the clip's background
previewFps: 24                 # optional (default 24): lets arrow keys on the scrubber step one frame
fullVideoUrl: https://youtu.be/VIDEO_ID   # optional, YouTube or Vimeo (unlisted is fine)
featured: false                # true = full-width card
awards:                        # optional, real awards only
  - title: 1st Place
    event: Some Jam 2026
breakdownImages:               # optional; the Breakdown section only appears when this is set
  - src: /projects/my-new-project/breakdown-01.jpg
    alt: Wireframe view of the character
    caption: Wireframe
itchUrl: https://you.itch.io/game   # optional
---

## Goal
…

## What I learned
…

## Time spent
…
```

The home grid shows non-featured projects two per row, then the featured project(s) at full width. With no `fullVideoUrl`, the project page shows the preview clip with a scrubber (play/pause, drag to seek, arrow keys step frames), or the poster/gif if there's no video.

### Preview loops

Raw clips live in `vidsRaw/` (git-ignored). Short, muted, looping, ~720p, a few MB at most. Video is much smaller than gif for the same clip, so use video when you can. Example with ffmpeg (`-g 12` puts a keyframe every half second so scrubbing stays smooth):

```sh
ffmpeg -i render.mov -t 6 -vf "scale=1280:-2,fps=24" -g 12 -an -c:v libvpx-vp9 -b:v 0 -crf 36 preview.webm
ffmpeg -i render.mov -t 6 -vf "scale=1280:-2,fps=24" -g 12 -an -c:v libx264 -crf 25 -preset slow -movflags +faststart -pix_fmt yuv420p preview.mp4
```

Grab a poster frame (here at 3s) with:

```sh
ffmpeg -ss 3 -i preview.mp4 -frames:v 1 -q:v 3 poster.jpg
```

Videos load lazily and only play while on screen. Viewers with "reduce motion" turned on see the poster instead, for gifs too.

## Deploying to Vercel

1. Push the repo to GitHub.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repo. Vercel detects Astro automatically (build `npm run build`, output `dist`).
3. Deploy. Every push to `main` redeploys.

Once you have a domain, set `site: 'https://your-domain'` in `astro.config.mjs` for absolute URLs.

## Later: React / 3D hero

The hero has an empty `.hero__ambient` layer in `src/pages/index.astro` for ambient motion. To add a React Three Fiber scene:

```sh
npx astro add react
npm install three @react-three/fiber
```

Then render your component inside `.hero__ambient` with `client:visible`, and skip it when `prefers-reduced-motion` is set.
