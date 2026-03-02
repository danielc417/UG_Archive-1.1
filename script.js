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
    },
    {
      title: "BA$$",
      artist: "Che",
      src: "assets/audio/che-bass.mp3",
      cover: "assets/images/player-spin-che-bass.webp"
    }
  ];

  const STORAGE_KEY = "underground-mp3-player";
  const THEME_STORAGE_KEY = "underground-theme";
  const THEMES = {
    rose: {
      bg: "#875987",
      heading: "#ffc6ef",
      headerGlass: "rgba(255, 255, 255, 0.14)",
      cardGlass: "rgba(255, 255, 255, 0.12)",
      panelBorder: "rgba(255, 255, 255, 0.52)",
      panelGlow: "rgba(255, 255, 255, 0.48)",
      headingGlowSoft: "rgba(255, 176, 236, 0.48)",
      headingGlowStrong: "rgba(255, 136, 224, 0.36)"
    },
    midnight: {
      bg: "radial-gradient(circle at 18% 20%, #17002d 0, transparent 44%), radial-gradient(circle at 86% 18%, #070b2b 0, transparent 42%), #04050a",
      heading: "#9d00ff",
      headerGlass: "rgba(0, 0, 0, 0.88)",
      cardGlass: "rgba(0, 0, 0, 0.88)",
      panelBorder: "rgba(157, 0, 255, 0.95)",
      panelGlow: "rgba(157, 0, 255, 0.62)",
      headingGlowSoft: "rgba(157, 0, 255, 0.58)",
      headingGlowStrong: "rgba(157, 0, 255, 0.4)"
    }
  };
  const THEME_ORDER = ["midnight", "rose"];
  const MOBILE_BREAKPOINT_QUERY = "(max-width: 640px)";
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const LOW_POWER_MODE = window.matchMedia(REDUCED_MOTION_QUERY).matches || !!(connection && connection.saveData) || window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
  const CUTOUT_SOURCES = [
    "assets/images/osamason-cutout.png",
    "assets/images/cutout-01.png",
    "assets/images/cutout-02.png",
    "assets/images/cutout-03.png",
    "assets/images/cutout-04.png",
    "assets/images/cutout-05.png",
    "assets/images/cutout-06.png",
    "assets/images/cutout-07.png",
    "assets/images/cutout-08.png",
    "assets/images/cutout-09.png",
    "assets/images/cutout-10.png",
    "assets/images/cutout-11.png",
    "assets/images/cutout-12.png",
    "assets/images/cutout-13.png",
    "assets/images/cutout-14.png",
    "assets/images/cutout-15.png",
    "assets/images/cutout-16.png",
    "assets/images/cutout-17.png",
    "assets/images/cutout-18.png",
    "assets/images/cutout-19.png",
    "assets/images/cutout-20.png",
    "assets/images/cutout-21.png",
    "assets/images/cutout-22.png",
    "assets/images/cutout-23.png",
    "assets/images/cutout-24.png",
    "assets/images/cutout-25.png",
    "assets/images/cutout-26.png",
    "assets/images/cutout-27.png",
    "assets/images/cutout-28.png",
    "assets/images/cutout-29.png",
    "assets/images/cutout-30.png",
    "assets/images/cutout-31.png",
    "assets/images/cutout-32.png",
    "assets/images/cutout-33.png",
    "assets/images/cutout-34.png",
    "assets/images/cutout-35.png",
    "assets/images/cutout-36.png",
    "assets/images/cutout-37.png",
    "assets/images/cutout-38.png",
    "assets/images/cutout-39.png",
    "assets/images/cutout-40.png",
    "assets/images/cutout-41.png",
    "assets/images/cutout-42.png",
    "assets/images/cutout-43.png",
    "assets/images/cutout-44.png",
    "assets/images/cutout-45.png",
    "assets/images/cutout-46.png",
    "assets/images/cutout-47.png",
    "assets/images/cutout-48.png",
    "assets/images/cutout-49.png",
    "assets/images/cutout-50.png",
    "assets/images/cutout-51.png",
    "assets/images/cutout-52.png",
    "assets/images/cutout-53.png",
    "assets/images/cutout-54.png",
    "assets/images/cutout-55.png",
    "assets/images/cutout-56.png",
    "assets/images/cutout-57.png",
    "assets/images/cutout-58.png",
    "assets/images/cutout-59.png",
    "assets/images/cutout-60.png",
    "assets/images/cutout-61.png",
    "assets/images/cutout-62.png",
    "assets/images/cutout-63.png",
    "assets/images/cutout-64.png",
    "assets/images/cutout-65.png"
  ];
  const DEFAULT_TRACK_INDEX = Math.max(
    0,
    TRACKS.findIndex(function (track) {
      return track.title === "BA$$" && track.artist === "Che";
    })
  );

  const state = {
    playing: false,
    muted: true,
    volume: 0.6,
    currentTime: 0,
    trackIndex: DEFAULT_TRACK_INDEX
  };

  let lastSavedSecond = -1;

  function currentTrack() {
    return TRACKS[state.trackIndex] || TRACKS[0];
  }

  function loadState() {
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
  }

  function saveState(audio) {
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

  function createPlayerUI() {
    const ui = document.createElement("div");
    ui.className = "bg-player";
    ui.innerHTML = [
      '<button type="button" class="bg-nav bg-prev" aria-label="Previous track" title="Previous track">◀</button>',
      '<button type="button" class="bg-disc" aria-label="Play background music"><img class="bg-disc-art" src="" alt="Player artwork" /></button>',
      '<div class="bg-meta"><span class="bg-title"></span><span class="bg-artist"></span></div>',
      '<button type="button" class="bg-nav bg-next" aria-label="Next track" title="Next track">▶</button>',
      '<input class="bg-volume" type="range" min="0" max="1" step="0.01" aria-label="Volume" title="Volume" />'
    ].join("");
    return ui;
  }

  function createAudio() {
    const audio = new Audio();
    audio.src = currentTrack().src;
    audio.loop = false;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.volume = state.volume;
    audio.muted = state.muted;
    return audio;
  }

  function applyTheme(themeName) {
    const root = document.documentElement;
    const body = document.body;
    const theme = THEMES[themeName] || THEMES.rose;
    root.style.setProperty("--theme-bg", theme.bg);
    root.style.setProperty("--theme-heading", theme.heading);
    root.style.setProperty("--theme-header-glass", theme.headerGlass);
    root.style.setProperty("--theme-card-glass", theme.cardGlass);
    root.style.setProperty("--theme-panel-border", theme.panelBorder);
    root.style.setProperty("--theme-panel-glow", theme.panelGlow);
    root.style.setProperty("--theme-heading-glow-soft", theme.headingGlowSoft);
    root.style.setProperty("--theme-heading-glow-strong", theme.headingGlowStrong);
    if (body) body.setAttribute("data-theme", themeName);
  }

  function applyPerformanceProfile() {
    if (!document.body) return;
    document.body.classList.toggle("low-power", LOW_POWER_MODE);
  }

  function setupThemeSwitcher() {
    const dot = document.getElementById("theme-dot");
    let currentTheme = "midnight";

    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && THEMES[savedTheme]) {
        currentTheme = savedTheme;
      }
    } catch (_err) {
      // Ignore unavailable storage.
    }

    applyTheme(currentTheme);
    if (!dot) return;

    function paintDot(themeName) {
      const theme = THEMES[themeName] || THEMES.rose;
      dot.style.background = theme.bg;
      dot.style.borderColor = "rgba(255, 255, 255, 0.9)";
      dot.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.55)";
    }

    paintDot(currentTheme);

    dot.addEventListener("click", function () {
      const currentIndex = THEME_ORDER.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
      currentTheme = THEME_ORDER[nextIndex];
      applyTheme(currentTheme);
      paintDot(currentTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
      } catch (_err) {
        // Ignore unavailable storage.
      }
    });
  }

  function setupPlayer() {
    loadState();

    const audio = createAudio();
    const ui = createPlayerUI();
    const prevBtn = ui.querySelector(".bg-prev");
    const nextBtn = ui.querySelector(".bg-next");
    const playBtn = ui.querySelector(".bg-disc");
    const discArt = ui.querySelector(".bg-disc-art");
    const titleEl = ui.querySelector(".bg-title");
    const artistEl = ui.querySelector(".bg-artist");
    const volumeInput = ui.querySelector(".bg-volume");

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
      saveState(audio);
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

      saveState(audio);
    }

    async function changeTrack(delta) {
      state.playing = true;
      await playTrack(state.trackIndex + delta);
      saveState(audio);
    }

    playBtn.addEventListener("click", async function () {
      if (state.playing) {
        pauseAudio();
      } else {
        await startWithSound();
      }
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
      saveState(audio);
    });

    async function unlockOnFirstInteraction() {
      if (!state.playing) {
        await startWithSound();
        return;
      }

      state.muted = false;
      audio.muted = false;
      updateUI();
      saveState(audio);
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

    audio.addEventListener("timeupdate", function () {
      if (audio.currentTime <= 0) return;
      state.currentTime = audio.currentTime;

      const nowSecond = Math.floor(audio.currentTime);
      if (nowSecond !== lastSavedSecond) {
        lastSavedSecond = nowSecond;
        saveState(audio);
      }
    });

    audio.addEventListener("ended", function () {
      state.playing = true;
      playTrack(state.trackIndex + 1);
    });

    function persistBeforeLeave() {
      state.currentTime = audio.currentTime || state.currentTime;
      saveState(audio);
    }

    window.addEventListener("pagehide", persistBeforeLeave);
    window.addEventListener("beforeunload", persistBeforeLeave);
    document.body.appendChild(ui);
    updateUI();

    if (state.playing) {
      tryPlay();
    }
  }

  function createCutoutImage(src, index) {
    const img = document.createElement("img");
    img.className = "artist-cutout";
    if (LOW_POWER_MODE || index % 2 === 0) {
      img.classList.add("no-sway");
    }
    img.src = src;
    img.alt = "Artist cutout " + (index + 1);
    const sectionPhase = Math.min(3, Math.floor((index / Math.max(1, CUTOUT_SOURCES.length - 1)) * 4));
    const appearDelayMs = 700 + sectionPhase * 700 + (index % 4) * 70;
    img.style.setProperty("--appear-delay", appearDelayMs + "ms");
    return img;
  }

  function layoutCutouts(layer, container) {
    const cutouts = Array.from(layer.querySelectorAll(".artist-cutout"));
    if (!cutouts.length) return;
    const osamaCutout = document.querySelector(".osama-cutout");
    const nineCutout = document.querySelector(".nine-cutout");
    let cutout56 = null;
    let cutout59Target = null;
    let cutout57 = null;
    let cutout7Target = null;
    let cutout49 = null;
    let cutout64Target = null;
    let cutout3Target = null;
    let cutout48Target = null;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const content = document.querySelector("main.content-wrap");
    const contentRect = content ? content.getBoundingClientRect() : null;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = container.clientWidth;
    const containerHeight = Math.max(container.scrollHeight, window.innerHeight + 240);
    const baseTop = isMobile ? 12 : 24;
    const maxTop = containerHeight - (isMobile ? 100 : 140);
    const baseWidth = isMobile ? 47 : 105;
    const minGap = isMobile ? 22 : 26;
    const laneCount = isMobile ? 6 : 8;

    let safeLeft = Math.round(containerWidth * 0.23);
    let safeRight = Math.round(containerWidth * 0.77);
    if (contentRect) {
      safeLeft = Math.max(0, Math.round(contentRect.left - containerRect.left - 16));
      safeRight = Math.min(containerWidth, Math.round(contentRect.right - containerRect.left + 16));
    }

    const leftLanes = [];
    const rightLanes = [];
    const leftCount = Math.floor(laneCount / 2);
    const rightCount = laneCount - leftCount;
    const leftWidth = Math.max(40, safeLeft - 14);
    const rightStart = Math.min(containerWidth - 40, safeRight + 14);
    const rightWidth = Math.max(40, containerWidth - rightStart - 14);

    for (let i = 0; i < leftCount; i += 1) {
      leftLanes.push({
        side: "left",
        xBase: Math.round((i + 0.5) * (leftWidth / Math.max(1, leftCount))),
        nextTop: baseTop + i * (isMobile ? 22 : 28)
      });
    }
    for (let i = 0; i < rightCount; i += 1) {
      rightLanes.push({
        side: "right",
        xBase: Math.round(rightStart + (i + 0.5) * (rightWidth / Math.max(1, rightCount))),
        nextTop: baseTop + i * (isMobile ? 20 : 24)
      });
    }

    const lanes = leftLanes.concat(rightLanes);

    cutouts.forEach(function (img, index) {
      const width = baseWidth + ((index % 5) - 2) * (isMobile ? 2 : 4);
      const safeWidth = Math.max(26, width);
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalHeight / img.naturalWidth : 1.45;
      const estHeight = safeWidth * Math.max(0.9, Math.min(2.5, ratio));
      const lane = isMobile ? lanes[index % lanes.length] : lanes.reduce(function (best, current) {
        return current.nextTop < best.nextTop ? current : best;
      }, lanes[0]);

      let top = lane.nextTop;
      if (top > maxTop) {
        top = baseTop + (index % 12) * (isMobile ? 44 : 66);
      }

      const rotation = (lane.side === "left" ? -1 : 1) * (2 + (index % 4) * 2);
      const jitterX = ((index % 3) - 1) * (isMobile ? 3 : 6);

      img.style.top = Math.round(top) + "px";
      img.style.width = safeWidth + "px";
      img.style.left = "";
      img.style.right = "";
      img.style.setProperty("--cutout-rot", rotation + "deg");
      img.style.setProperty("--sway-dur", (1.5 + (index % 5) * 0.18).toFixed(2) + "s");
      img.style.setProperty("--sway-delay", (-0.15 * (index % 7)).toFixed(2) + "s");
      img.style.zIndex = String(110 + (index % 6));

      if (lane.side === "left") {
        const left = Math.max(6, lane.xBase + jitterX - safeWidth / 2);
        img.style.left = Math.round(left) + "px";
      } else {
        const left = Math.min(containerWidth - safeWidth - 6, lane.xBase + jitterX - safeWidth / 2);
        img.style.left = Math.round(left) + "px";
      }

      if (img.src.indexOf("cutout-01.png") !== -1) {
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.left = Math.round(currentLeft - (isMobile ? 8 : 28)) + "px";
      }

      if (img.src.indexOf("cutout-50.png") !== -1) {
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.left = Math.round(currentLeft - (isMobile ? 6 : 12)) + "px";
      }

      if (img.src.indexOf("cutout-55.png") !== -1) {
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.left = Math.round(currentLeft + (isMobile ? 10 : 18)) + "px";
      }

      if (img.src.indexOf("cutout-43.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.top = Math.round(currentTop + (isMobile ? 6 : 10)) + "px";
        img.style.left = Math.round(currentLeft + (isMobile ? 10 : 18)) + "px";
      }

      if (img.src.indexOf("cutout-26.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        img.style.top = Math.round(currentTop + (isMobile ? 12 : 32)) + "px";
        img.style.width = Math.round(safeWidth * 1.07) + "px";
        const currentRotation = rotation - (isMobile ? 8 : 12);
        img.style.setProperty("--cutout-rot", currentRotation + "deg");
      }

      if (img.src.indexOf("cutout-28.png") !== -1) {
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.left = Math.round(currentLeft + (isMobile ? 12 : 26)) + "px";
        img.style.width = Math.round(safeWidth * 1.1) + "px";
      }

      if (img.src.indexOf("cutout-19.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.top = Math.round(currentTop - (isMobile ? 16 : 28)) + "px";
        img.style.left = Math.round(currentLeft + (isMobile ? 8 : 16)) + "px";
        img.style.width = Math.round(safeWidth * 0.81) + "px";
      }

      if (img.src.indexOf("cutout-13.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        img.style.top = Math.round(currentTop - (isMobile ? 24 : 44)) + "px";
        img.style.width = Math.round(safeWidth * 1.5) + "px";
      }

      if (img.src.indexOf("cutout-07.png") !== -1) {
        img.style.width = Math.round(safeWidth * 1.25) + "px";
        const currentRotation = rotation + (isMobile ? 8 : 12);
        img.style.setProperty("--cutout-rot", currentRotation + "deg");
      }

      if (img.src.indexOf("cutout-12.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.top = Math.round(currentTop - (isMobile ? 16 : 30)) + "px";
        img.style.left = Math.round(currentLeft + (isMobile ? 10 : 20)) + "px";
        img.style.width = Math.round(safeWidth * 1.1) + "px";
      }

      if (img.src.indexOf("cutout-03.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.top = Math.round(currentTop - (isMobile ? 14 : 24)) + "px";
        img.style.left = Math.round(currentLeft + (isMobile ? 10 : 18)) + "px";
        const currentRotation = rotation + (isMobile ? 8 : 12);
        img.style.setProperty("--cutout-rot", currentRotation + "deg");
        cutout3Target = {
          left: parseFloat(img.style.left) || 0,
          top: parseFloat(img.style.top) || 0,
          width: parseFloat(img.style.width) || safeWidth
        };
      }

      if (img.src.indexOf("cutout-05.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.top = Math.round(currentTop + (isMobile ? 14 : 24)) + "px";
        img.style.left = Math.round(currentLeft + (isMobile ? 8 : 14)) + "px";
        img.style.width = Math.round(safeWidth * 1.1) + "px";
      }

      if (img.src.indexOf("cutout-17.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        const currentLeft = parseFloat(img.style.left) || 0;
        img.style.top = Math.round(currentTop - (isMobile ? 10 : 18)) + "px";
        img.style.left = Math.max(0, Math.round(currentLeft - (isMobile ? 36 : 82))) + "px";
        img.style.width = Math.round(safeWidth * 2.275) + "px";
        const currentRotation = rotation - (isMobile ? 8 : 12);
        img.style.setProperty("--cutout-rot", currentRotation + "deg");
      }

      if (img.src.indexOf("cutout-48.png") !== -1) {
        cutout48Target = {
          left: parseFloat(img.style.left) || 0,
          top: parseFloat(img.style.top) || 0
        };
      }

      if (img.src.indexOf("cutout-49.png") !== -1) {
        cutout49 = img;
      }

      if (img.src.indexOf("cutout-57.png") !== -1) {
        cutout57 = img;
      }

      if (img.src.indexOf("cutout-56.png") !== -1) {
        cutout56 = img;
      }

      if (img.src.indexOf("cutout-64.png") !== -1) {
        const currentTop = parseFloat(img.style.top) || 0;
        img.style.top = Math.round(currentTop - (isMobile ? 10 : 18)) + "px";
      }

      if (img.src.indexOf("cutout-64.png") !== -1) {
        cutout64Target = {
          left: parseFloat(img.style.left) || 0,
          top: parseFloat(img.style.top) || 0,
          width: parseFloat(img.style.width) || safeWidth,
          zIndex: parseInt(img.style.zIndex, 10) || 110
        };
      }

      if (img.src.indexOf("cutout-05.png") !== -1 || img.src.indexOf("cutout-07.png") !== -1) {
        const finalWidth = parseFloat(img.style.width) || safeWidth;
        const clampedRatio = Math.max(0.9, Math.min(2.5, ratio));
        const finalHeight = finalWidth * clampedRatio;
        let stuckLeft = 0;
        let stuckTop = Math.max(0, Math.round(containerHeight - finalHeight));
        if (img.src.indexOf("cutout-05.png") !== -1) {
          const liftAmount = isMobile ? 18 : 36;
          stuckTop = Math.max(0, stuckTop - liftAmount);
        }
        if (img.src.indexOf("cutout-07.png") !== -1) {
          const rightOffset = isMobile ? 36 : 84;
          const upOffset = isMobile ? 30 : 68;
          stuckLeft = rightOffset;
          stuckTop = Math.max(0, stuckTop - upOffset);
        }
        img.style.left = stuckLeft + "px";
        img.style.right = "";
        img.style.top = stuckTop + "px";
      }

      if (img.src.indexOf("cutout-07.png") !== -1) {
        cutout7Target = {
          left: parseFloat(img.style.left) || 0,
          top: parseFloat(img.style.top) || 0,
          width: parseFloat(img.style.width) || safeWidth,
          zIndex: parseInt(img.style.zIndex, 10) || 110
        };
      }

      if (img.src.indexOf("cutout-59.png") !== -1) {
        cutout59Target = {
          left: parseFloat(img.style.left) || 0,
          top: parseFloat(img.style.top) || 0,
          width: parseFloat(img.style.width) || safeWidth,
          zIndex: parseInt(img.style.zIndex, 10) || 110
        };
      }

      lane.nextTop = top + estHeight + minGap;
    });

    if (osamaCutout && cutout3Target) {
      const osamaWidth = osamaCutout.offsetWidth || (isMobile ? 120 : 190);
      const xOffset = isMobile ? -10 : -28;
      const yOffset = isMobile ? 56 : 92;
      const desiredLeft = cutout3Target.left + cutout3Target.width + xOffset;
      const desiredTop = cutout3Target.top + yOffset;
      const clampedLeft = Math.min(
        Math.max(0, Math.round(desiredLeft)),
        Math.max(0, Math.round(containerWidth - osamaWidth - 6))
      );
      const clampedTop = Math.max(0, Math.round(desiredTop));

      osamaCutout.style.left = clampedLeft + "px";
      osamaCutout.style.top = clampedTop + "px";
      osamaCutout.style.right = "auto";
      osamaCutout.style.bottom = "auto";
      if (typeof osamaCutout.playbackRate === "number") {
        osamaCutout.playbackRate = 1.12;
      }
    }

    if (nineCutout && cutout48Target) {
      const nineWidth = nineCutout.offsetWidth || (isMobile ? 110 : 180);
      const xGap = isMobile ? 8 : 12;
      const xRightNudge = isMobile ? 6 : 10;
      const yOffset = isMobile ? 26 : 44;
      const desiredLeft = cutout48Target.left - nineWidth - xGap + xRightNudge;
      const desiredTop = cutout48Target.top + yOffset;
      const clampedLeft = Math.max(0, Math.round(desiredLeft));
      const clampedTop = Math.max(0, Math.round(desiredTop));

      nineCutout.style.left = clampedLeft + "px";
      nineCutout.style.top = clampedTop + "px";
      nineCutout.style.right = "auto";
      nineCutout.style.bottom = "auto";
      nineCutout.style.position = "absolute";
    }

    if (cutout56 && cutout59Target) {
      const baseCutout56Width = parseFloat(cutout56.style.width) || (isMobile ? 47 : 105);
      const cutout56Width = Math.round(baseCutout56Width * 1.1);
      const xGap = isMobile ? 6 : 12;
      const xLeftNudge = isMobile ? 11 : 22;
      const yOffset = isMobile ? 2 : 4;
      const desiredLeft = cutout59Target.left + cutout59Target.width + xGap - xLeftNudge;
      const clampedLeft = Math.min(
        Math.max(0, Math.round(desiredLeft)),
        Math.max(0, Math.round(containerWidth - cutout56Width - 6))
      );
      const clampedTop = Math.max(0, Math.round(cutout59Target.top + yOffset));

      cutout56.style.width = cutout56Width + "px";
      cutout56.style.left = clampedLeft + "px";
      cutout56.style.top = clampedTop + "px";
      cutout56.style.right = "";
      cutout56.style.zIndex = String(cutout59Target.zIndex + 1);
    }

    if (cutout57 && cutout7Target) {
      const cutout57Width = parseFloat(cutout57.style.width) || (isMobile ? 47 : 105);
      const xGap = isMobile ? 6 : 12;
      const yOffset = isMobile ? 2 : 4;
      const desiredLeft = cutout7Target.left + cutout7Target.width + xGap;
      const clampedLeft = Math.min(
        Math.max(0, Math.round(desiredLeft)),
        Math.max(0, Math.round(containerWidth - cutout57Width - 6))
      );
      const clampedTop = Math.max(0, Math.round(cutout7Target.top + yOffset));

      cutout57.style.left = clampedLeft + "px";
      cutout57.style.top = clampedTop + "px";
      cutout57.style.right = "";
      cutout57.style.zIndex = String(cutout7Target.zIndex + 1);
    }

    if (cutout49 && cutout64Target) {
      const cutout49Width = parseFloat(cutout49.style.width) || (isMobile ? 47 : 105);
      const xGap = isMobile ? 8 : 14;
      const yOffset = isMobile ? 10 : 16;
      let desiredLeft = cutout64Target.left + cutout64Target.width + xGap;

      if (desiredLeft + cutout49Width > containerWidth - 6) {
        desiredLeft = cutout64Target.left - cutout49Width - xGap;
      }

      const clampedLeft = Math.min(
        Math.max(0, Math.round(desiredLeft)),
        Math.max(0, Math.round(containerWidth - cutout49Width - 6))
      );
      const clampedTop = Math.max(0, Math.round(cutout64Target.top + yOffset));

      cutout49.style.left = clampedLeft + "px";
      cutout49.style.top = clampedTop + "px";
      cutout49.style.right = "";
      cutout49.style.zIndex = String(cutout64Target.zIndex + 1);
    }
  }

  function setupCutouts() {
    const container = document.querySelector(".page-scroll");
    if (!container) return;

    const layer = document.createElement("div");
    layer.className = "artist-cutout-layer";

    const activeSources = LOW_POWER_MODE ? CUTOUT_SOURCES.filter(function (_src, index) {
      return index === 0 || index % 2 === 1;
    }).slice(0, 34) : CUTOUT_SOURCES;

    let layoutRaf = 0;
    function scheduleLayout() {
      if (layoutRaf) return;
      layoutRaf = window.requestAnimationFrame(function () {
        layoutRaf = 0;
        layoutCutouts(layer, container);
      });
    }

    activeSources.forEach(function (src, index) {
      const img = createCutoutImage(src, index);
      img.addEventListener("load", scheduleLayout);
      layer.appendChild(img);
    });

    container.appendChild(layer);
    scheduleLayout();

    window.addEventListener("resize", function () {
      scheduleLayout();
    });
  }

  function setupCutoutVideos() {
    const START_OFFSET = 0.08;
    const videos = Array.from(document.querySelectorAll(".osama-cutout, .nine-cutout"));
    videos.forEach(function (video) {
      function skipJitterFrames() {
        if (!Number.isFinite(video.duration) || video.duration <= START_OFFSET + 0.05) return;
        if (video.currentTime < START_OFFSET) {
          try {
            video.currentTime = START_OFFSET;
          } catch (_err) {
            // Ignore seek failures while media is not fully seekable yet.
          }
        }
      }

      video.addEventListener("loadedmetadata", skipJitterFrames, { once: true });
      video.addEventListener(
        "canplay",
        function () {
          skipJitterFrames();
          const playAttempt = video.play();
          if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(function () {
              // Ignore autoplay restrictions; video remains muted and user can still interact.
            });
          }
        },
        { once: true }
      );
    });
  }

  function setupBackgroundVideos() {
    const videos = Array.from(document.querySelectorAll(".bg-video-left, .bg-video-right"));
    if (!videos.length) return;

    const visibleState = new WeakMap();

    function syncPlayback(video) {
      const isVisible = visibleState.get(video) !== false;
      const shouldPlay = !document.hidden && isVisible;
      if (!shouldPlay) {
        video.pause();
        return;
      }

      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(function () {
          // Ignore autoplay restrictions on background ambience videos.
        });
      }
    }

    let observer = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visibleState.set(entry.target, entry.isIntersecting && entry.intersectionRatio > 0.01);
            syncPlayback(entry.target);
          });
        },
        { threshold: [0, 0.01, 0.1] }
      );
    }

    videos.forEach(function (video) {
      visibleState.set(video, true);
      video.addEventListener("loadedmetadata", function () {
        if (Number.isFinite(video.duration) && video.duration > 0.08 && video.currentTime < 0.04) {
          try {
            video.currentTime = 0.04;
          } catch (_err) {
            // Ignore seek failures before the stream is fully seekable.
          }
        }
      });
      video.addEventListener("canplay", function () {
        syncPlayback(video);
      });
      if (observer) observer.observe(video);
      syncPlayback(video);
    });

    document.addEventListener("visibilitychange", function () {
      videos.forEach(syncPlayback);
    });
  }

  function setupBouncingBgVideo() {
    const dvdVideo = document.querySelector(".bg-video-left");
    if (!dvdVideo) return;
    const pageScroll = document.querySelector(".page-scroll");

    let x = 0;
    let y = 0;
    let rafId = 0;
    const margin = 10;
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    let vx = isMobile ? 3.1 : 4.2;
    let vy = isMobile ? 2.5 : 3.4;
    const frameMs = LOW_POWER_MODE ? 1000 / 24 : 1000 / 30;
    let maxX = 0;
    let maxY = 0;
    let accumulator = 0;
    let lastTick = 0;
    let lastBoundsRefresh = 0;

    function refreshBounds() {
      const width = dvdVideo.offsetWidth || dvdVideo.getBoundingClientRect().width || 1;
      const height = dvdVideo.offsetHeight || dvdVideo.getBoundingClientRect().height || 1;
      const pageHeight = Math.max(
        pageScroll ? pageScroll.scrollHeight : 0,
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0
      );
      maxX = Math.max(0, window.innerWidth - width - margin * 2);
      maxY = Math.max(0, pageHeight - height - margin * 2);
      x = Math.min(Math.max(0, x), maxX);
      y = Math.min(Math.max(0, y), maxY);
    }

    function place() {
      dvdVideo.style.transform =
        "translate3d(" + Math.round(x + margin) + "px, " + Math.round(y + margin) + "px, 0)";
    }

    function step() {
      x += vx;
      y += vy;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      }

      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      }
    }

    function tick(now) {
      if (!lastTick) lastTick = now;
      const delta = Math.min(64, now - lastTick);
      lastTick = now;
      accumulator += delta;

      if (now - lastBoundsRefresh > 1000) {
        refreshBounds();
        lastBoundsRefresh = now;
      }

      while (accumulator >= frameMs) {
        step();
        accumulator -= frameMs;
      }

      place();
      rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (rafId) return;
      refreshBounds();
      if (x === 0 && y === 0) {
        x = Math.round(maxX * 0.12);
        y = Math.round(maxY * 0.28);
      }
      place();
      accumulator = 0;
      lastTick = 0;
      lastBoundsRefresh = performance.now();
      rafId = window.requestAnimationFrame(tick);
    }

    function stop() {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    window.addEventListener("resize", function () {
      refreshBounds();
      place();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    dvdVideo.addEventListener(
      "loadedmetadata",
      function () {
        refreshBounds();
        start();
      },
      { once: true }
    );
    start();
  }

  function setupBouncingLeaf() {
    const leafWrap = document.querySelector(".bg-leaf-left-wrap");
    if (!leafWrap) return;

    const pageScroll = document.querySelector(".page-scroll");
    const content = document.querySelector("main.content-wrap");
    let x = 0;
    let y = 0;
    let rafId = 0;
    const margin = 8;
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    let vx = isMobile ? 1 : 1.3;
    let vy = isMobile ? 0.8 : 1.05;
    const frameMs = LOW_POWER_MODE ? 1000 / 20 : 1000 / 28;
    let maxX = 0;
    let maxY = 0;
    let accumulator = 0;
    let lastTick = 0;
    let lastBoundsRefresh = 0;

    function refreshBounds() {
      const width = leafWrap.offsetWidth || leafWrap.getBoundingClientRect().width || 1;
      const height = leafWrap.offsetHeight || leafWrap.getBoundingClientRect().height || 1;
      const pageHeight = Math.max(
        pageScroll ? pageScroll.scrollHeight : 0,
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0
      );

      const contentRect = content ? content.getBoundingClientRect() : null;
      const leftLaneRightEdge = contentRect ? Math.round(contentRect.left - 24) : Math.round(window.innerWidth * 0.24);
      const maxXByViewport = Math.max(0, window.innerWidth - width - margin * 2);
      const maxXByLeftLane = Math.max(0, leftLaneRightEdge - width - margin);

      maxX = Math.min(maxXByViewport, maxXByLeftLane);
      maxY = Math.max(0, pageHeight - height - margin * 2);
      x = Math.min(Math.max(0, x), maxX);
      y = Math.min(Math.max(0, y), maxY);
    }

    function place() {
      leafWrap.style.transform =
        "translate3d(" + Math.round(x + margin) + "px, " + Math.round(y + margin) + "px, 0)";
    }

    function step() {
      x += vx;
      y += vy;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      }

      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      }
    }

    function tick(now) {
      if (!lastTick) lastTick = now;
      const delta = Math.min(64, now - lastTick);
      lastTick = now;
      accumulator += delta;

      if (now - lastBoundsRefresh > 1000) {
        refreshBounds();
        lastBoundsRefresh = now;
      }

      while (accumulator >= frameMs) {
        step();
        accumulator -= frameMs;
      }

      place();
      rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (rafId) return;
      refreshBounds();
      if (x === 0 && y === 0) {
        x = Math.round(maxX * 0.22);
        y = Math.round(maxY * 0.18);
      }
      place();
      accumulator = 0;
      lastTick = 0;
      lastBoundsRefresh = performance.now();
      rafId = window.requestAnimationFrame(tick);
    }

    function stop() {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    window.addEventListener("resize", function () {
      refreshBounds();
      place();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    start();
  }

  applyPerformanceProfile();
  setupBouncingBgVideo();
  setupBouncingLeaf();
  setupBackgroundVideos();
  setupThemeSwitcher();
  setupPlayer();
  setupCutoutVideos();
  setupCutouts();
})();
