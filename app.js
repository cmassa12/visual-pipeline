(() => {
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 1600);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast("Copied");
    }
  }

  const copyMap = {
    invite: "invite-text",
    dean: "dean-text",
    student: "student-text",
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-copy");
      const id = copyMap[key];
      const node = id ? document.getElementById(id) : null;
      if (!node) return;
      copyText(node.textContent.trim());
    });
  });

  const storageKey = "visual-pipeline-checklist-v1";
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  })();

  document.querySelectorAll("#checklist input[data-key]").forEach((input) => {
    const key = input.getAttribute("data-key");
    if (saved[key]) input.checked = true;
    input.addEventListener("change", () => {
      const next = { ...saved };
      document.querySelectorAll("#checklist input[data-key]").forEach((el) => {
        next[el.getAttribute("data-key")] = el.checked;
      });
      localStorage.setItem(storageKey, JSON.stringify(next));
      Object.assign(saved, next);
    });
  });
})();
