(function ExtractStems() {
  const buttonId = "extract-stems-btn";
  const serverUrl = "http://localhost:5000";

  function createButton() {
    if (!Spicetify?.Player || document.getElementById(buttonId)) {
      return;
    }

    const btn = document.createElement("button");
    btn.id = buttonId;
    btn.className = "control-button";
    btn.textContent = "Extraire les stems";
    btn.addEventListener("click", handleClick);

    const controls = document.querySelector(".main-nowPlayingBar-extraControls");
    if (controls) {
      controls.appendChild(btn);
    }
  }

  async function handleClick() {
    const track = Spicetify.Player.data?.item;
    if (!track) {
      Spicetify.showNotification("Aucun morceau en cours");
      return;
    }
    const title = track.name;
    const artist = track.artists?.[0]?.name || "";
    const query = encodeURIComponent(`${artist} - ${title}`);
    try {
      const res = await fetch(`${serverUrl}/process?track=${query}`);
      const data = await res.json();
      if (res.ok && data.url) {
        Spicetify.showNotification(`Stems prêts: ${data.url}`);
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (e) {
      console.error(e);
      Spicetify.showNotification("Serveur injoignable");
    }
  }

  createButton();
  setInterval(createButton, 2000);
})();
