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
  const SMALL_SCREEN_BREAKPOINT_QUERY = "(max-width: 900px)";
  const TABLET_BREAKPOINT_QUERY = "(max-width: 1024px)";
  const COMPACT_BREAKPOINT_QUERY = "(max-width: 1366px)";
  const TOUCH_POINTER_QUERY = "(pointer: coarse)";
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
  const UNIVERSAL_RENDER_MODE = false;
  const UNIVERSAL_CUTOUT_LIMIT = 28;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const hardwareThreads = navigator.hardwareConcurrency || 0;
  const deviceMemory = navigator.deviceMemory || 0;
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isAppleTouchDevice =
    /iP(hone|od|ad)/i.test(userAgent) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isIOSSafari =
    isAppleTouchDevice && /WebKit/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|GSA/i.test(userAgent);
  const isIPhoneSafari = isIOSSafari && /iPhone/i.test(userAgent);
  let lowPowerMode = false;

  function shouldUseLowPowerMode() {
    if (UNIVERSAL_RENDER_MODE) return false;
    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const mobileViewport = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    const touchTabletViewport =
      window.matchMedia(TABLET_BREAKPOINT_QUERY).matches && window.matchMedia(TOUCH_POINTER_QUERY).matches;
    const weakHardware = (deviceMemory > 0 && deviceMemory <= 4) || (hardwareThreads > 0 && hardwareThreads <= 4);
    const constrainedDesktop = weakHardware && window.matchMedia(COMPACT_BREAKPOINT_QUERY).matches;
    return prefersReducedMotion || !!(connection && connection.saveData) || mobileViewport || touchTabletViewport || constrainedDesktop;
  }

  function getViewportProfile() {
    if (UNIVERSAL_RENDER_MODE) {
      return {
        isMobile: false,
        isTablet: false,
        isCompact: false,
        isTouch: false,
        lowPowerMode: false
      };
    }

    const isMobile = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    const isTablet = !isMobile && window.matchMedia(TABLET_BREAKPOINT_QUERY).matches;
    const isCompact = window.matchMedia(COMPACT_BREAKPOINT_QUERY).matches;
    const isTouch = window.matchMedia(TOUCH_POINTER_QUERY).matches;
    return {
      isMobile: isMobile,
      isTablet: isTablet,
      isCompact: isCompact,
      isTouch: isTouch,
      lowPowerMode: shouldUseLowPowerMode()
    };
  }
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

  function syncViewportHeightVar() {
    const root = document.documentElement;
    if (!root) return;
    root.style.setProperty("--app-vh", window.innerHeight * 0.01 + "px");
  }

  function applyIOSVideoHints(video) {
    if (!video || !isIOSSafari) return;
    video.playsInline = true;
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("disableremoteplayback", "");
    if (isIPhoneSafari) {
      video.preload = "metadata";
    }
    if ("disablePictureInPicture" in video) {
      video.disablePictureInPicture = true;
    }
    if ("disableRemotePlayback" in video) {
      video.disableRemotePlayback = true;
    }
  }

  function applyPerformanceProfile() {
    if (!document.body) return;
    const profile = getViewportProfile();
    lowPowerMode = profile.lowPowerMode;
    document.body.classList.toggle("low-power", profile.lowPowerMode);
    document.body.classList.toggle("mobile-layout", profile.isMobile);
    document.body.classList.toggle("tablet-layout", profile.isTablet);
    document.body.classList.toggle("compact-layout", profile.isCompact);
    document.body.classList.toggle("touch-device", profile.isTouch);
    document.body.classList.toggle("universal-render", UNIVERSAL_RENDER_MODE);
    document.body.classList.toggle("ios-safari", UNIVERSAL_RENDER_MODE ? false : isIOSSafari);
    document.body.classList.toggle("iphone-safari", UNIVERSAL_RENDER_MODE ? false : isIPhoneSafari);
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
    img.className = "artist-cutout cutout";
    if (lowPowerMode || index % 2 === 0) {
      img.classList.add("no-sway");
    }
    img.src = src;
    img.alt = "Artist cutout " + (index + 1);
    const sectionPhase = Math.min(3, Math.floor((index / Math.max(1, CUTOUT_SOURCES.length - 1)) * 4));
    const appearDelayMs = 700 + sectionPhase * 700 + (index % 4) * 70;
    img.style.setProperty("--appear-delay", appearDelayMs + "ms");
    return img;
  }

  function setupCutouts() {
    const leftColumn = document.getElementById("cutout-column-left");
    const rightColumn = document.getElementById("cutout-column-right");
    if (!leftColumn || !rightColumn) return;

    leftColumn.innerHTML = "";
    rightColumn.innerHTML = "";

    const isSmallScreen = window.matchMedia("(max-width: 900px)").matches;
    const maxCutouts = isSmallScreen ? 16 : 28;
    const activeSources = CUTOUT_SOURCES.slice(0, maxCutouts);

    activeSources.forEach(function (src, index) {
      const img = createCutoutImage(src, index);
      img.classList.remove("no-sway");
      img.style.removeProperty("--cutout-rot");
      img.style.removeProperty("--sway-dur");
      img.style.removeProperty("--sway-delay");
      if (index % 2 === 0) {
        leftColumn.appendChild(img);
      } else {
        rightColumn.appendChild(img);
      }
    });
  }

  function setupResponsiveStars() {
    const mobileStarsQuery = window.matchMedia("(max-width: 900px)");
    function applyStarsMode() {
      if (!document.body) return;
      document.body.classList.toggle("reduced-stars", mobileStarsQuery.matches);
    }
    applyStarsMode();
    if (typeof mobileStarsQuery.addEventListener === "function") {
      mobileStarsQuery.addEventListener("change", applyStarsMode);
    } else if (typeof mobileStarsQuery.addListener === "function") {
      mobileStarsQuery.addListener(applyStarsMode);
    }
  }

  function setupCutoutVideos() {
    const START_OFFSET = 0.08;
    const videos = Array.from(document.querySelectorAll(".osama-cutout, .nine-cutout"));
    videos.forEach(function (video) {
      applyIOSVideoHints(video);
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
    const keepSingleVideo = UNIVERSAL_RENDER_MODE ? false : isIPhoneSafari;

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
      applyIOSVideoHints(video);
      if (keepSingleVideo && video.classList.contains("bg-video-right")) {
        visibleState.set(video, false);
        video.pause();
        video.style.display = "none";
        return;
      }
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
    if (lowPowerMode) {
      dvdVideo.style.transform = "";
      dvdVideo.style.willChange = "auto";
      return;
    }
    const pageScroll = document.querySelector(".page-scroll");

    let x = 0;
    let y = 0;
    let rafId = 0;
    const margin = 10;
    const profile = getViewportProfile();
    const isMobile = profile.isMobile;
    let vx = isMobile ? 3.1 : 4.2;
    let vy = isMobile ? 2.5 : 3.4;
    const frameMs = lowPowerMode ? 1000 / 24 : 1000 / 30;
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
    if (lowPowerMode) {
      leafWrap.style.transform = "";
      leafWrap.style.willChange = "auto";
      return;
    }

    const pageScroll = document.querySelector(".page-scroll");
    const content = document.querySelector("main.content-wrap");
    let x = 0;
    let y = 0;
    let rafId = 0;
    const margin = 8;
    const profile = getViewportProfile();
    const isMobile = profile.isMobile;
    let vx = isMobile ? 1 : 1.3;
    let vy = isMobile ? 0.8 : 1.05;
    const frameMs = lowPowerMode ? 1000 / 20 : 1000 / 28;
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
  syncViewportHeightVar();
  window.addEventListener("resize", applyPerformanceProfile);
  window.addEventListener("orientationchange", applyPerformanceProfile);
  window.addEventListener("resize", syncViewportHeightVar);
  window.addEventListener("orientationchange", syncViewportHeightVar);
  window.addEventListener("pageshow", syncViewportHeightVar);
  window.addEventListener("resize", setupCutouts);
  window.addEventListener("orientationchange", setupCutouts);
  setupBouncingBgVideo();
  setupBouncingLeaf();
  setupBackgroundVideos();
  setupResponsiveStars();
  setupThemeSwitcher();
  setupPlayer();
  setupCutoutVideos();
  setupCutouts();
})();
