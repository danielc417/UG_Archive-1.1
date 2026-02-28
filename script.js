(function () {
  const TRACKS = [
    {
      title: "Racks Blue",
      artist: "Nine Vicious",
      src: "assets/audio/racks-blue-nine-vicious.mp3",
      cover: "assets/images/player-spin.jpg"
    },
    {
      title: "Nun 4 No Schmuck",
      artist: "Glokk40Spaz",
      src: "assets/audio/nun-4-no-schmuck-glokk40spaz.mp3",
      cover: "assets/images/player-spin-glokk40spaz.jpg"
    },
    {
      title: "Project Pat",
      artist: "Nettspend",
      src: "assets/audio/project-pat-nettspend.mp3",
      cover: "assets/images/player-spin-projectpat.jpg"
    }
  ];
  const STORAGE_KEY = "underground-mp3-player";

  const state = {
    playing: false,
    muted: true,
    volume: 0.6,
    currentTime: 0,
    trackIndex: 0
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (typeof saved.playing === "boolean") state.playing = saved.playing;
    if (typeof saved.muted === "boolean") state.muted = saved.muted;
    if (typeof saved.volume === "number") state.volume = Math.max(0, Math.min(1, saved.volume));
    if (typeof saved.currentTime === "number" && saved.currentTime >= 0) state.currentTime = saved.currentTime;
    if (typeof saved.trackIndex === "number" && saved.trackIndex >= 0) {
      state.trackIndex = saved.trackIndex % TRACKS.length;
    }
  } catch (_err) {
    // Ignore invalid local storage.
  }

  function currentTrack() {
    return TRACKS[state.trackIndex] || TRACKS[0];
  }

  const audio = document.createElement("audio");
  audio.src = currentTrack().src;
  audio.loop = false;
  audio.preload = "auto";
  audio.autoplay = true;
  audio.volume = state.volume;
  audio.muted = state.muted;

  const cornerWrap = document.createElement("div");
  cornerWrap.className = "home-corner-wrap";
  const cornerImg = document.createElement("img");
  cornerImg.className = "home-corner-photo";
  cornerImg.src = "assets/images/cutout-49.png";
  cornerImg.alt = "cutout 49";
  cornerImg.onerror = function () { this.style.display = "none"; };
  cornerWrap.appendChild(cornerImg);

  const ui = document.createElement("div");
  ui.className = "bg-player";
  ui.innerHTML = [
    '<button type="button" class="bg-nav bg-prev" aria-label="Previous track" title="Previous track">◀</button>',
    '<button type="button" class="bg-disc" aria-label="Play background music"><img class="bg-disc-art" src="" alt="Player artwork" /></button>',
    '<div class="bg-meta"><span class="bg-title"></span><span class="bg-artist"></span></div>',
    '<button type="button" class="bg-nav bg-next" aria-label="Next track" title="Next track">▶</button>',
    '<input class="bg-volume" type="range" min="0" max="1" step="0.01" aria-label="Volume" title="Volume" />'
  ].join("");

  const prevBtn = ui.querySelector(".bg-prev");
  const nextBtn = ui.querySelector(".bg-next");
  const playBtn = ui.querySelector(".bg-disc");
  const discArt = ui.querySelector(".bg-disc-art");
  const titleEl = ui.querySelector(".bg-title");
  const artistEl = ui.querySelector(".bg-artist");
  const volumeInput = ui.querySelector(".bg-volume");
  let lastSavedSecond = -1;

  const cutoutLayer = document.createElement("div");
  cutoutLayer.className = "artist-cutout-layer";
  cutoutLayer.innerHTML = [
    '<img class="artist-cutout cutout-a" src="assets/images/cutout-01.png" alt="Artist cutout 1" />',
    '<img class="artist-cutout cutout-b" src="assets/images/cutout-02.png" alt="Artist cutout 2" />',
    '<img class="artist-cutout cutout-c" src="assets/images/cutout-03.png" alt="Artist cutout 3" />',
    '<img class="artist-cutout cutout-d" src="assets/images/cutout-04.png" alt="Artist cutout 4" />',
    '<img class="artist-cutout cutout-e" src="assets/images/cutout-05.png" alt="Artist cutout 5" />',
    '<img class="artist-cutout cutout-f" src="assets/images/cutout-06.png" alt="Artist cutout 6" />',
    '<img class="artist-cutout cutout-g" src="assets/images/cutout-07.png" alt="Artist cutout 7" />',
    '<img class="artist-cutout cutout-h" src="assets/images/osamason-cutout.png" alt="OsamaSon cutout" />',
    '<img class="artist-cutout cutout-i" src="assets/images/cutout-08.png" alt="Artist cutout 8" />',
    '<img class="artist-cutout cutout-j" src="assets/images/cutout-09.png" alt="Artist cutout 9" />',
    '<img class="artist-cutout cutout-k" src="assets/images/cutout-10.png" alt="Artist cutout 10" />',
    '<img class="artist-cutout cutout-l" src="assets/images/cutout-11.png" alt="Artist cutout 11" />',
    '<img class="artist-cutout cutout-m" src="assets/images/cutout-12.png" alt="Artist cutout 12" />',
    '<img class="artist-cutout cutout-n" src="assets/images/cutout-13.png" alt="Artist cutout 13" />',
    '<img class="artist-cutout cutout-o" src="assets/images/cutout-14.png" alt="Artist cutout 14" />',
    '<img class="artist-cutout cutout-p" src="assets/images/cutout-15.png" alt="Artist cutout 15" />',
    '<img class="artist-cutout cutout-q" src="assets/images/cutout-16.png" alt="Artist cutout 16" />',
    '<img class="artist-cutout cutout-r" src="assets/images/cutout-17.png" alt="Artist cutout 17" />',
    '<img class="artist-cutout cutout-s" src="assets/images/cutout-18.png" alt="Artist cutout 18" />'
  ].join("");

  const EXTRA_CUTOUT_START = 19;
  const EXTRA_CUTOUT_END = 48;
  for (let i = EXTRA_CUTOUT_START; i <= EXTRA_CUTOUT_END; i += 1) {
    const num = String(i).padStart(2, "0");
    const img = document.createElement("img");
    img.className = "artist-cutout cutout-extra";
    img.src = "assets/images/cutout-" + num + ".png";
    img.alt = "Artist cutout " + i;
    cutoutLayer.appendChild(img);
  }

  Array.from(cutoutLayer.querySelectorAll(".artist-cutout")).forEach(function (img) {
    img.addEventListener("load", layoutExtraCutouts);
  });

  function layoutExtraCutouts() {
    const cutouts = Array.from(cutoutLayer.querySelectorAll(".artist-cutout"));
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const container = document.querySelector("main.content-wrap");
    const containerHeight = container ? container.offsetHeight : (isMobile ? 1500 : 2000);
    const topStart = isMobile ? -14 : -56;
    const maxTop = Math.max(900, containerHeight - (isMobile ? 160 : 220));
    const laneConfig = isMobile
      ? [
          { side: "left", offset: -90 },
          { side: "left", offset: -58 },
          { side: "right", offset: -90 },
          { side: "right", offset: -58 }
        ]
      : [
          { side: "left", offset: -352 },
          { side: "left", offset: -296 },
          { side: "left", offset: -240 },
          { side: "right", offset: -352 },
          { side: "right", offset: -296 },
          { side: "right", offset: -240 }
        ];
    const lanes = laneConfig.map(function (lane, idx) {
      return {
        side: lane.side,
        offset: lane.offset,
        nextTop: topStart + (idx % 3) * (isMobile ? 12 : 18)
      };
    });
    const baseWidth = isMobile ? 28 : 62;
    const widthStep = isMobile ? 3 : 5;
    const minGap = isMobile ? 12 : 18;
    const topJitter = isMobile ? 10 : 14;

    cutouts.forEach(function (img, idx) {
      img.style.display = "";
      const lane = lanes.reduce(function (best, current) {
        return current.nextTop < best.nextTop ? current : best;
      }, lanes[0]);

      const width = baseWidth + (idx % 7) * widthStep;
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalHeight / img.naturalWidth : 1.45;
      const clampedRatio = Math.max(0.9, Math.min(2.4, ratio));
      const estimatedHeight = width * clampedRatio;
      let top = lane.nextTop + ((idx % 2) * topJitter - topJitter / 2);

      // Wrap long lanes upward to keep spacing balanced on very long pages.
      if (top > maxTop) {
        top = topStart + (idx % 9) * (isMobile ? 34 : 44);
      }

      const rotationBase = 3 + (idx % 4) * (isMobile ? 1.5 : 2);
      const rotation = (lane.side === "left" ? -1 : 1) * rotationBase;

      img.style.top = Math.round(top) + "px";
      img.style.left = "";
      img.style.right = "";
      img.style.width = width + "px";
      img.style.transform = "rotate(" + rotation + "deg)";
      img.style.zIndex = String(108 + (idx % 10));

      if (lane.side === "left") {
        img.style.left = lane.offset + "px";
      } else {
        img.style.right = lane.offset + "px";
      }

      lane.nextTop = top + estimatedHeight + minGap;
    });

    // Keep the top-right music control area cleaner.
    cutouts.forEach(function (img) {
      const top = parseFloat(img.style.top) || 0;
      if (!isMobile && img.style.right && top < 116) {
        img.style.top = top + 120 + "px";
      }
    });
  }

  function saveState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        playing: state.playing,
        muted: state.muted,
        volume: state.volume,
        currentTime: audio.currentTime || state.currentTime,
        trackIndex: state.trackIndex
      })
    );
  }

  function applyTrackMeta() {
    const track = currentTrack();
    discArt.src = track.cover;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    playBtn.title = track.title + " - " + track.artist;
  }

  function updateUI() {
    ui.classList.toggle("is-playing", state.playing);
    playBtn.setAttribute("aria-label", state.playing ? "Pause background music" : "Play background music");
    volumeInput.value = String(state.volume);
    applyTrackMeta();
  }

  async function tryPlay() {
    try {
      await audio.play();
      state.playing = true;
    } catch (_err) {
      state.playing = false;
    }
    updateUI();
  }

  function pauseAudio() {
    audio.pause();
    state.playing = false;
    updateUI();
  }

  async function startWithSound() {
    state.muted = false;
    audio.muted = false;
    await tryPlay();
    saveState();
  }

  async function playTrack(index) {
    state.trackIndex = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    state.currentTime = 0;
    const track = currentTrack();
    audio.src = track.src;
    audio.currentTime = 0;
    applyTrackMeta();
    if (state.playing) {
      await tryPlay();
    } else {
      updateUI();
    }
    saveState();
  }

  async function changeTrack(delta) {
    state.playing = true;
    await playTrack(state.trackIndex + delta);
    saveState();
  }

  playBtn.addEventListener("click", async function () {
    if (state.playing) {
      pauseAudio();
      return;
    }

    await startWithSound();
  });

  prevBtn.addEventListener("click", async function () {
    await changeTrack(-1);
  });

  nextBtn.addEventListener("click", async function () {
    await changeTrack(1);
  });

  volumeInput.addEventListener("input", function () {
    const nextVolume = Number(volumeInput.value);
    state.volume = Number.isFinite(nextVolume) ? Math.max(0, Math.min(1, nextVolume)) : state.volume;
    audio.volume = state.volume;
    saveState();
  });

  // First user interaction anywhere enables sound and keeps playback going.
  async function unlockOnFirstInteraction() {
    if (!state.playing) {
      await startWithSound();
      return;
    }

    state.muted = false;
    audio.muted = false;
    updateUI();
    saveState();
  }

  ["pointerdown", "touchstart", "keydown"].forEach(function (eventName) {
    document.addEventListener(eventName, unlockOnFirstInteraction, { once: true });
  });

  audio.addEventListener("loadedmetadata", function () {
    if (state.currentTime > 0 && Number.isFinite(audio.duration)) {
      const safeTime = Math.min(state.currentTime, Math.max(0, audio.duration - 0.5));
      audio.currentTime = safeTime;
    }
  });

  audio.addEventListener("ended", function () {
    state.playing = true;
    playTrack(state.trackIndex + 1);
  });

  audio.addEventListener("timeupdate", function () {
    if (audio.currentTime > 0) {
      state.currentTime = audio.currentTime;
      // Persist progress roughly every second.
      const nowSecond = Math.floor(audio.currentTime);
      if (nowSecond !== lastSavedSecond) {
        lastSavedSecond = nowSecond;
        saveState();
      }
    }
  });

  function persistBeforeLeave() {
    state.currentTime = audio.currentTime || state.currentTime;
    saveState();
  }

  window.addEventListener("pagehide", persistBeforeLeave);
  window.addEventListener("beforeunload", persistBeforeLeave);

  function isInternalHtmlLink(anchor) {
    if (!anchor) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return false;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return url.pathname.endsWith(".html") || url.pathname === window.location.pathname;
  }

  function swapPageContent(nextDoc) {
    const currentPlayer = ui;
    const nodes = [];

    Array.from(nextDoc.body.children).forEach(function (node) {
      const tag = node.tagName.toLowerCase();
      if (tag === "script") return;
      if (node.classList && node.classList.contains("home-corner-wrap")) return;
      nodes.push(node.cloneNode(true));
    });

    document.body.innerHTML = "";
    document.body.appendChild(cornerWrap);
    nodes.forEach(function (node) {
      document.body.appendChild(node);
    });
    document.body.appendChild(currentPlayer);
    placeCutoutOnPage();
    updateUI();
    window.scrollTo(0, 0);
  }

  async function navigateWithoutReload(url, push) {
    try {
      persistBeforeLeave();
      const res = await fetch(url.toString(), { credentials: "same-origin" });
      if (!res.ok) return;
      const html = await res.text();
      const parser = new DOMParser();
      const nextDoc = parser.parseFromString(html, "text/html");
      document.title = nextDoc.title || document.title;
      swapPageContent(nextDoc);
      if (push) {
        history.pushState({ path: url.pathname }, "", url.pathname);
      }
    } catch (_err) {
      // If fetch navigation fails, allow normal behavior next click.
    }
  }

  document.addEventListener("click", function (event) {
    const anchor = event.target.closest("a");
    if (!isInternalHtmlLink(anchor)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const url = new URL(anchor.href, window.location.href);
    navigateWithoutReload(url, true);
  });

  window.addEventListener("popstate", function () {
    const url = new URL(window.location.href);
    navigateWithoutReload(url, false);
  });

  function isHomePath(pathname) {
    const path = (pathname || "").toLowerCase();
    return path === "/" || path.endsWith("/index.html") || path.endsWith("/");
  }

  function placeCutoutOnPage() {
    const shouldShow = isHomePath(window.location.pathname);
    const container = document.querySelector("main.content-wrap");

    if (!shouldShow || !container) {
      if (cutoutLayer.parentNode) {
        cutoutLayer.parentNode.removeChild(cutoutLayer);
      }
      return;
    }

    if (cutoutLayer.parentNode !== container) {
      container.appendChild(cutoutLayer);
    }
    layoutExtraCutouts();
  }

  window.addEventListener("resize", layoutExtraCutouts);

  document.body.appendChild(cornerWrap);
  document.body.appendChild(ui);
  placeCutoutOnPage();
  updateUI();
  if (state.playing) {
    tryPlay();
  }
})();
