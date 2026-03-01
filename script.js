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
    "assets/images/cutout-48.png"
  ];

  const state = {
    playing: false,
    muted: true,
    volume: 0.6,
    currentTime: 0,
    trackIndex: 0
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
    img.src = src;
    img.alt = "Artist cutout " + (index + 1);
    return img;
  }

  function layoutCutouts(layer, container) {
    const cutouts = Array.from(layer.querySelectorAll(".artist-cutout"));
    if (!cutouts.length) return;
    const osamaCutout = document.querySelector(".osama-cutout");
    let osamaTarget = null;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const content = document.querySelector("main.content-wrap");
    const contentRect = content ? content.getBoundingClientRect() : null;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = container.clientWidth;
    const containerHeight = Math.max(container.scrollHeight, window.innerHeight + 240);
    const baseTop = isMobile ? 12 : 24;
    const maxTop = containerHeight - (isMobile ? 100 : 140);
    const baseWidth = isMobile ? 47 : 105;
    const minGap = isMobile ? 18 : 26;
    const laneCount = isMobile ? 4 : 8;

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
      const lane = lanes.reduce(function (best, current) {
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
        img.style.left = Math.max(0, Math.round(currentLeft - (isMobile ? 22 : 42))) + "px";
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
        const currentLeft = parseFloat(img.style.left) || 0;
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

      if (img.src.indexOf("cutout-05.png") !== -1 || img.src.indexOf("cutout-07.png") !== -1) {
        const originalLeft = parseFloat(img.style.left) || 0;
        const originalTop = parseFloat(img.style.top) || 0;
        const finalWidth = parseFloat(img.style.width) || safeWidth;
        const clampedRatio = Math.max(0.9, Math.min(2.5, ratio));
        const finalHeight = finalWidth * clampedRatio;
        let stuckLeft = 0;
        let stuckTop = Math.max(0, Math.round(containerHeight - finalHeight));
        if (img.src.indexOf("cutout-05.png") !== -1) {
          osamaTarget = { left: originalLeft, top: originalTop };
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

      lane.nextTop = top + estHeight + minGap;
    });

    if (osamaCutout && osamaTarget) {
      const rightShift = isMobile ? 8 : 24;
      const downShift = isMobile ? 24 : 52;
      osamaCutout.style.left = Math.max(0, Math.round(osamaTarget.left + rightShift)) + "px";
      osamaCutout.style.top = Math.round(osamaTarget.top + downShift) + "px";
      osamaCutout.style.right = "auto";
      osamaCutout.style.bottom = "auto";
      if (typeof osamaCutout.playbackRate === "number") {
        osamaCutout.playbackRate = 0.65;
      }
    }
  }

  function setupCutouts() {
    const container = document.querySelector(".page-scroll");
    if (!container) return;

    const layer = document.createElement("div");
    layer.className = "artist-cutout-layer";

    CUTOUT_SOURCES.forEach(function (src, index) {
      const img = createCutoutImage(src, index);
      img.addEventListener("load", function () {
        layoutCutouts(layer, container);
      });
      layer.appendChild(img);
    });

    container.appendChild(layer);
    layoutCutouts(layer, container);

    window.addEventListener("resize", function () {
      layoutCutouts(layer, container);
    });
  }

  setupPlayer();
  setupCutouts();
})();
