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

    function lockPlayerPosition() {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const offset = isMobile ? 10 : 12;
      ui.style.setProperty("position", "fixed", "important");
      ui.style.setProperty("top", offset + "px", "important");
      ui.style.setProperty("right", offset + "px", "important");
      ui.style.setProperty("left", "auto", "important");
      ui.style.setProperty("bottom", "auto", "important");
      ui.style.setProperty("transform", "none", "important");
      ui.style.setProperty("margin", "0", "important");
    }

    let lockRafId = 0;
    function tickPlayerLock() {
      lockPlayerPosition();
      lockRafId = window.requestAnimationFrame(tickPlayerLock);
    }

    window.addEventListener("pagehide", persistBeforeLeave);
    window.addEventListener("beforeunload", persistBeforeLeave);
    document.body.appendChild(ui);
    lockPlayerPosition();
    window.addEventListener("resize", lockPlayerPosition, { passive: true });
    window.addEventListener("scroll", lockPlayerPosition, { passive: true });
    document.addEventListener("scroll", lockPlayerPosition, { capture: true, passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", lockPlayerPosition, { passive: true });
      window.visualViewport.addEventListener("scroll", lockPlayerPosition, { passive: true });
    }
    lockRafId = window.requestAnimationFrame(tickPlayerLock);
    window.addEventListener(
      "pagehide",
      function () {
        if (lockRafId) window.cancelAnimationFrame(lockRafId);
      },
      { once: true }
    );
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

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const laneOffsets = isMobile ? [-34, -18, -34, -18] : [-210, -150, -210, -150];
    const laneSides = ["left", "left", "right", "right"];
    const baseTop = isMobile ? -14 : -44;
    const stepY = isMobile ? 52 : 84;
    const baseWidth = isMobile ? 34 : 76;
    const maxTop = Math.max(900, container.scrollHeight - (isMobile ? 100 : 140));

    cutouts.forEach(function (img, index) {
      const laneIndex = index % laneOffsets.length;
      const row = Math.floor(index / laneOffsets.length);
      const jitter = ((index % 3) - 1) * (isMobile ? 5 : 9);
      let top = baseTop + row * stepY + jitter;
      if (top > maxTop) {
        top = baseTop + (index % 18) * (isMobile ? 44 : 66);
      }

      const width = baseWidth + ((index % 5) - 2) * (isMobile ? 2 : 4);
      const rotation = (laneSides[laneIndex] === "left" ? -1 : 1) * (4 + (index % 4) * 2);

      img.style.top = Math.round(top) + "px";
      img.style.width = Math.max(26, width) + "px";
      img.style.left = "";
      img.style.right = "";
      img.style.transform = "rotate(" + rotation + "deg)";
      img.style.zIndex = String(110 + (index % 6));

      if (laneSides[laneIndex] === "left") {
        img.style.left = laneOffsets[laneIndex] + "px";
      } else {
        img.style.right = laneOffsets[laneIndex] + "px";
      }

      // Keep top-right area cleaner for the fixed music player.
      if (!isMobile && laneSides[laneIndex] === "right" && top < 130) {
        img.style.top = Math.round(top + 130) + "px";
      }
    });
  }

  function setupCutouts() {
    const container = document.querySelector("main.content-wrap");
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
