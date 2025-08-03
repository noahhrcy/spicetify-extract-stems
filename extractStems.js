(function ExtractStems() {
  const buttonId = "main-nowPlayingBar-right";
  const serverUrl = "http://localhost:5000";
  const fallbackUrl = "https://raw.githubusercontent.com/noahhrcy/stem-extraction-server/main/how_to_install.txt"; // 🔁 à personnaliser

  function createButton() {
    if (!Spicetify?.Player || document.getElementById(buttonId)) return;

    const btn = document.createElement("button");
    btn.id = buttonId;
    btn.className = "control-button";
    btn.textContent = "Extraire les stems";
    btn.addEventListener("click", handleClick);

    const controls = document.querySelector(".main-nowPlayingBar-extraControls");
    if (controls) controls.appendChild(btn);
  }

  async function handleClick() {
    const btn = document.getElementById(buttonId);
    const track = Spicetify.Player.data?.item;

    if (!track) {
      Spicetify.showNotification("Aucun morceau en cours");
      return;
    }

    const title = track.name;
    const artist = track.artists?.[0]?.name || "";
    const query = encodeURIComponent(`${artist} - ${title}`);

    try {
      const res = await fetch(`${serverUrl}/process?track=${query}`, { timeout: 4000 });
      const data = await res.json();

      if (res.ok && data.url) {
        Spicetify.showNotification(`Stems prêts: ${data.url}`);
        window.open(`${serverUrl}${data.url}`, "_blank");
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (e) {
      console.warn("Serveur non accessible :", e);
      Spicetify.showNotification("Serveur local injoignable. Clique pour l'installer.");
      if (btn) {
        btn.textContent = "Installer le serveur Demucs 🛠️";
        btn.onclick = () => window.open(fallbackUrl, "_blank");
      }
    }
  }

  createButton();
  setInterval(createButton, 2000);
})();
