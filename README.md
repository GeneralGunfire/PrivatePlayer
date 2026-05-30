# PrivatePlayer

A minimal personal music player website. Drop in your MP3s, list them, push to GitHub — done.

## How to add a track

1. Copy your `.mp3` file into the `/music` folder
2. Open `tracks.js` and add an entry:

```js
{ title: "My Recording", file: "music/my-recording.mp3" },
```

3. Commit and push → your site updates automatically

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Next track |
| `←` | Previous track |

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select your repo, leave all defaults, click **Deploy**
4. Done — your site is live at a `*.netlify.app` URL

## File structure

```
PrivatePlayer/
├── index.html       — the page
├── style.css        — styles
├── player.js        — player logic
├── tracks.js        — YOUR track list (edit this)
└── music/           — drop MP3s here
```
