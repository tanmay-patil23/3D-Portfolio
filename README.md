# 3D Gen-Z Portfolio (Microsoft Fluent + Noomo Blob)

A high-end, responsive portfolio website blending Microsoft Fluent Design UI with Noomo Labs-inspired 3D blob animation.

## 📂 Project Structure
```
anime_portfolio_3d/
├── index.html        # Main page
├── css/
│   ├── styles.css    # Fluent theme & layout
│   └── 3d.css        # 3D hero canvas styles
├── js/
│   ├── app.js        # Dynamic data rendering
│   └── 3d-blob.js    # Three.js blob animation
├── assets/           # Images & icons
└── README.md         # This guide
```

## ✨ Features
- **3D Animated Hero Blob** using Three.js, inspired by Noomo Labs.
- **Microsoft Fluent Design** UI with acrylic cards, blur & depth.
- Fully responsive, smooth scroll, filterable project gallery.
- Easy data-driven content (edit arrays in `js/app.js`).

## 🛠️ Local Setup
1. **Download ZIP** → Unzip to `anime_portfolio_3d`.
2. Double-click `index.html` to preview (or use Live Server in VS Code).
3. Replace placeholder data:
   - `index.html` meta, name, avatar.
   - `js/app.js` arrays: `skills`, `projects`, `experience`, `certificates`.
   - Images in `assets/`.

## 🚀 Deploy to GitHub Pages (Free)
1. Create new public repo (e.g., `portfolio`).
2. Upload *contents* of `anime_portfolio_3d` via drag-and-drop or Git CLI:
   ```bash
   git init
   git remote add origin https://github.com/yourusername/portfolio.git
   git add .
   git commit -m "Initial portfolio"
   git push -u origin master
   ```
3. **Settings → Pages** → Source: `master` branch, `/root`.
4. Save → wait for green build. Your site:  
   `https://yourusername.github.io/portfolio`

## 🔄 Update & Maintain
- Edit locally → commit & push → Pages auto-updates.
- Optimize images (<300 KB) for speed.
- Add new projects via `projects` array.

---
© 2025 [Your Name]
