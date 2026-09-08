const form = document.getElementById("profileForm");

if (form) {
  const name = document.getElementById("name");
  const bio = document.getElementById("bio");
  const skills = document.getElementById("skills");
  const github = document.getElementById("github");
  const linkedin = document.getElementById("linkedin");
  const avatar = document.getElementById("previewAvatar");
  const previewName = document.getElementById("previewName");
  const previewBio = document.getElementById("previewBio");
  const previewSkills = document.getElementById("previewSkills");
  const previewSocials = document.getElementById("previewSocials");

  function updatePreview() {
    const currentName = name.value.trim() || "Your Name";
    previewName.textContent = currentName;
    avatar.textContent = currentName.charAt(0).toUpperCase() || "V";
    previewBio.textContent = bio.value.trim() || "Your short professional bio will appear here.";

    const list = skills.value.split(",").map(s => s.trim()).filter(Boolean);
    previewSkills.innerHTML = "";
    (list.length ? list : ["Your Skill", "Another Skill"]).slice(0, 8).forEach(skill => {
      const item = document.createElement("span");
      item.className = "skill";
      item.textContent = skill;
      previewSkills.appendChild(item);
    });

    previewSocials.innerHTML = "";
    const links = [
      ["GitHub", github.value.trim()],
      ["LinkedIn", linkedin.value.trim()]
    ];
    links.forEach(([label, value]) => {
      const item = document.createElement("span");
      item.className = value ? "muted-link" : "muted-link";
      item.textContent = label;
      previewSocials.appendChild(item);
    });
  }

  [name, bio, skills, github, linkedin].forEach(input => {
    input.addEventListener("input", updatePreview);
  });

  form.addEventListener("submit", () => {
    const button = form.querySelector(".generate-btn");
    button.innerHTML = "Generating Profile <span>...</span>";
    button.disabled = true;
  });

  updatePreview();
}
