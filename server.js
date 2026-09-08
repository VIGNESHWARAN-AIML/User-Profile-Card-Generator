const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const profilesFile = path.join(__dirname, "profiles.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readProfiles() {
  try {
    return JSON.parse(fs.readFileSync(profilesFile, "utf8"));
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
}

function clean(value = "") {
  return String(value).trim();
}

app.get("/api/profiles", (req, res) => {
  res.json(readProfiles());
});

app.post("/profile", (req, res) => {
  const name = clean(req.body.name);
  const bio = clean(req.body.bio);
  const skills = clean(req.body.skills);
  const github = clean(req.body.github);
  const linkedin = clean(req.body.linkedin);
  const portfolio = clean(req.body.portfolio);

  if (!name || !bio || !skills) {
    return res.status(400).send("Name, bio and skills are required.");
  }

  const profile = {
    id: Date.now().toString(),
    name,
    bio,
    skills: skills.split(",").map(s => s.trim()).filter(Boolean),
    github,
    linkedin,
    portfolio,
    createdAt: new Date().toISOString()
  };

  const profiles = readProfiles();
  profiles.unshift(profile);
  saveProfiles(profiles);

  res.redirect(`/profile/${profile.id}`);
});

app.get("/profile/:id", (req, res) => {
  const profile = readProfiles().find(p => p.id === req.params.id);

  if (!profile) {
    return res.status(404).send("Profile not found.");
  }

  const skillsHtml = profile.skills
    .map(skill => `<span class="skill">${escapeHtml(skill)}</span>`)
    .join("");

  const links = [
    profile.github ? `<a href="${safeUrl(profile.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : "",
    profile.linkedin ? `<a href="${safeUrl(profile.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : "",
    profile.portfolio ? `<a href="${safeUrl(profile.portfolio)}" target="_blank" rel="noopener">Portfolio ↗</a>` : ""
  ].filter(Boolean).join("");

  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(profile.name)} | Profile Card</title>
<link rel="stylesheet" href="/style.css">
</head>
<body class="result-page">
<div class="orb orb-one"></div><div class="orb orb-two"></div>
<main class="result-wrap">
  <div class="topbar">
    <a class="back-link" href="/">← Create another profile</a>
  </div>
  <article class="profile-card generated">
    <div class="avatar">${escapeHtml(profile.name.charAt(0).toUpperCase())}</div>
    <div class="profile-main">
      <span class="eyebrow">PROFILE GENERATED</span>
      <h1>${escapeHtml(profile.name)}</h1>
      <p class="bio">${escapeHtml(profile.bio)}</p>
      <div class="skills">${skillsHtml}</div>
      <div class="socials">${links || "<span class='no-links'>No social links added</span>"}</div>
    </div>
  </article>
  <p class="success-note">✓ Your profile has been processed and stored successfully.</p>
</main>
<script src="/script.js"></script>
</body>
</html>`);
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function safeUrl(value) {
  let url = value;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return escapeHtml(url);
}

app.listen(PORT, () => {
  console.log(`User Profile Card Generator running at http://localhost:${PORT}`);
});
