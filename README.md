# Portfolio-AS



## 📝 Description

Portfolio-AS is a personal portfolio website designed to showcase my skills, projects, and experience. As a blank slate, this portfolio is built with scalability and customization in mind. While the tech stack is currently unlisted, the focus is on creating a clean, responsive, and engaging user experience to impress potential employers and collaborators. Key features will include a project gallery, a detailed resume section, and a contact form, all contributing to a strong professional online presence.

Live Preview : https://portfolio-as-azure.vercel.app/

## 📁 Project Structure

```
.
├── icons
│   ├── dashboard.svg
│   ├── icons8-backend-development-96.png
│   ├── icons8-database-100.png
│   ├── icons8-networking-100.png
│   └── tech/            (logos for Languages / Tools / OS)
├── img
│   ├── avatar.jpg
│   ├── og-image.jpg
│   ├── work0.jpg
│   ├── work1.jpg
│   ├── work2.jpg
│   └── work3.jpg
├── index.html
├── intro.css
├── intro.js
├── main.js
├── robots.txt
├── sitemap.xml
├── styles.css
├── vercel.json      (security headers: CSP, nosniff, referrer, framing)
├── workshop.css
└── workshop.js
```

## 🔒 Security headers

`vercel.json` sends a Content-Security-Policy that only allows the external
services the site uses (Google Fonts, ionicons on unpkg, GitHub API, Web3Forms,
hCaptcha, Spotify and Google Maps embeds). The two small inline `<script>`s in
`index.html` are allowed by their SHA-256 hash, so **if you edit either of them,
update the hashes** (otherwise the browser blocks that script). Print the new ones
with:

```bash
node -e "const c=require('crypto'),s=require('fs').readFileSync('index.html','utf8').split('\r\n').join('\n');for(const m of s.matchAll(/<script>([^]*?)<\/script>/g))for(const v of [m[1],m[1].split('\n').join('\r\n')])console.log('sha256-'+c.createHash('sha256').update(v).digest('base64'))"
```

and replace the four `'sha256-…'` values (keep the quotes) in both CSP entries of `vercel.json`.
A new external service (another embed, CDN or API) also has to be added to the
matching directive there.

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/A-S95/Portfolio-AS.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request
