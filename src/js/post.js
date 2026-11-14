// On a post: opens an image's link (eleventy.config.js wraps each one) in a
// lightbox rather than leaving the page, and shows a footnote's text beside
// its reference while the pointer is over it or the reference has focus. The
// reference still jumps to the note when followed, which is how a touch screen
// reaches it.

const HIDE_DELAY_MS = 150;
const EDGE_REM = 1;

// Lightbox

const lightbox = document.createElement("dialog");
lightbox.className = "lightbox";
lightbox.innerHTML = '<button type="button" class="lightbox-close">Close</button><img alt="">';
const lightboxImage = lightbox.querySelector("img");
document.body.append(lightbox);

// Any click closes it: the image is all there is to look at.
lightbox.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("close", () => lightboxImage.removeAttribute("src"));

for (const link of document.querySelectorAll(".prose a.expand")) {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const image = link.querySelector("img");
    lightboxImage.src = link.href;
    lightboxImage.alt = image.alt;
    lightbox.setAttribute("aria-label", image.alt || "Image");
    lightbox.showModal();
  });
}

// Footnote previews

const preview = document.createElement("div");
preview.className = "footnote-preview";
preview.setAttribute("role", "tooltip");
preview.id = "footnote-preview";
preview.hidden = true;
document.body.append(preview);

let shownFor = null;
let hideTimer;

function show(ref) {
  clearTimeout(hideTimer);
  if (shownFor === ref) return;
  const note = document.querySelector(ref.hash);
  if (!note) return;
  const content = note.cloneNode(true);
  content.querySelectorAll(".footnote-backref").forEach((backref) => backref.remove());
  content.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  preview.replaceChildren(...content.childNodes);
  preview.hidden = false;
  shownFor = ref;
  ref.setAttribute("aria-describedby", preview.id);
  place(ref);
}

function hide() {
  clearTimeout(hideTimer);
  if (!shownFor) return;
  shownFor.removeAttribute("aria-describedby");
  shownFor = null;
  preview.hidden = true;
}

// Moving the mouse from the reference onto the preview keeps it, so a link in
// a note can be followed; from the keyboard, the reference leads to the note.
function hideSoon() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hide, HIDE_DELAY_MS);
}

// Above the reference, centred on it and kept on the screen; below it when
// there is no room above.
function place(ref) {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const edge = EDGE_REM * rem;
  const target = ref.getBoundingClientRect();
  const { width, height } = preview.getBoundingClientRect();
  const centred = target.left + target.width / 2 - width / 2;
  const left = Math.min(Math.max(centred, edge), document.documentElement.clientWidth - edge - width);
  const above = target.top - height - rem / 2;
  const top = above >= edge ? above : target.bottom + rem / 2;
  preview.style.setProperty("left", `${left + window.scrollX}px`);
  preview.style.setProperty("top", `${top + window.scrollY}px`);
}

for (const ref of document.querySelectorAll(".prose .footnote-ref a")) {
  ref.addEventListener("pointerenter", (event) => event.pointerType === "mouse" && show(ref));
  ref.addEventListener("pointerleave", (event) => event.pointerType === "mouse" && hideSoon());
  ref.addEventListener("focus", () => show(ref));
  ref.addEventListener("blur", hideSoon);
  ref.addEventListener("click", hide);
}

preview.addEventListener("pointerenter", () => clearTimeout(hideTimer));
preview.addEventListener("pointerleave", hideSoon);
addEventListener("keydown", (event) => event.key === "Escape" && hide());
addEventListener("resize", hide);
