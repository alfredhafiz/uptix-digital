/**
 * Enhanced Cursor with Particle Trail Effects - Complete Rewrite
 * Features:
 * - 60fps smooth cursor tracking with RAF
 * - Light trail particle effects
 * - Emoji particles on click
 * - Interactive hover states
 * - GPU-accelerated animations
 * - Optimized for performance
 */

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  element: HTMLDivElement;
}

interface EmojiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  element: HTMLDivElement;
}

declare global {
  interface Window {
    __enhancedCursorCleanup?: () => void;
  }
}

export function initEnhancedCursor() {
  if (window.__enhancedCursorCleanup) {
    return window.__enhancedCursorCleanup;
  }

  // Skip on touch devices
  if (
    "ontouchstart" in window ||
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return undefined;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return undefined;
  }

  // Cursor state
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isHovering = false;
  let isTextMode = false;
  let isMouseVisible = true;
  let isModalOpen = false;
  let lastParticleX = mouseX;
  let lastParticleY = mouseY;

  // Particle arrays
  const trailParticles: TrailParticle[] = [];
  const emojiParticles: EmojiParticle[] = [];
  const MAX_TRAIL_PARTICLES = 36;
  const TRAIL_SPAWN_DISTANCE = 12;

  // Create cursor elements
  const cursorContainer = document.createElement("div");
  cursorContainer.id = "cursor-enhanced";
  cursorContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 2147483647;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `;

  // Main cursor dot
  const mainDot = document.createElement("div");
  mainDot.className = "cursor-dot";
  mainDot.style.cssText = `
    position: absolute;
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, hsl(210 90% 65%) 0%, hsl(255 88% 68%) 55%, hsl(322 85% 68%) 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(1);
    box-shadow:
      0 0 10px rgba(96, 165, 250, 0.9),
      0 0 20px rgba(59, 130, 246, 0.7),
      0 0 30px rgba(59, 130, 246, 0.5),
      inset -2px -2px 4px rgba(255, 255, 255, 0.4);
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.15s ease,
                height 0.15s ease;
    will-change: transform;
  `;

  // Glow ring
  const glowRing = document.createElement("div");
  glowRing.className = "cursor-ring";
  glowRing.style.cssText = `
    position: absolute;
    width: 32px;
    height: 32px;
    border: 2px solid rgba(129, 140, 248, 0.65);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(1);
    box-shadow:
      0 0 15px rgba(96, 165, 250, 0.4),
      0 0 25px rgba(167, 139, 250, 0.25),
      inset 0 0 15px rgba(96, 165, 250, 0.2);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  `;

  // Trail container
  const trailContainer = document.createElement("div");
  trailContainer.className = "cursor-trails";
  trailContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 99998;
  `;

  // Emoji container
  const emojiContainer = document.createElement("div");
  emojiContainer.className = "cursor-emojis";
  emojiContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 99997;
  `;

  cursorContainer.appendChild(glowRing);
  cursorContainer.appendChild(mainDot);
  document.body.appendChild(trailContainer);
  document.body.appendChild(emojiContainer);
  document.body.appendChild(cursorContainer);

  // Create trail particle
  function createTrailParticle(x: number, y: number) {
    if (trailParticles.length >= MAX_TRAIL_PARTICLES) {
      const oldest = trailParticles.shift();
      if (oldest) oldest.element.remove();
    }

    const particle = document.createElement("div");
    const hue = (Date.now() / 8) % 360;
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 6px;
      height: 6px;
      background: radial-gradient(circle, hsla(${hue}, 95%, 70%, 0.9) 0%, hsla(${(hue + 48) % 360}, 95%, 65%, 0.35) 70%, transparent 100%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 8px hsla(${hue}, 95%, 72%, 0.65);
      will-change: opacity, filter;
    `;
    trailContainer.appendChild(particle);

    trailParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      life: 1,
      maxLife: 1,
      element: particle,
    });
  }

  // Create emoji particle
  function createEmojiParticle(x: number, y: number) {
    const emojis = ["✨", "🌟", "💫", "⭐", "🎯", "🚀", "💎", "🔥"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const particle = document.createElement("div");
    particle.textContent = emoji;
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${Math.random() * 8 + 16}px;
      font-weight: bold;
      pointer-events: none;
      transform: translate(-50%, -50%);
      text-shadow:
        0 0 10px rgba(96, 165, 250, 0.9),
        0 0 20px rgba(59, 130, 246, 0.6);
      filter: drop-shadow(0 0 6px rgba(96, 165, 250, 0.7));
      will-change: transform, opacity;
    `;
    emojiContainer.appendChild(particle);

    emojiParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * -6 - 3,
      life: 1,
      element: particle,
    });
  }

  // Update trail particles
  function updateTrailParticles() {
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const p = trailParticles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravity
      p.life -= 0.015;

      const opacity = Math.max(0, p.life);
      const blur = (1 - p.life) * 2;

      p.element.style.left = p.x + "px";
      p.element.style.top = p.y + "px";
      p.element.style.opacity = String(opacity);
      p.element.style.filter = `blur(${blur}px)`;

      if (p.life <= 0) {
        p.element.remove();
        trailParticles.splice(i, 1);
      }
    }
  }

  // Update emoji particles
  function updateEmojiParticles() {
    for (let i = emojiParticles.length - 1; i >= 0; i--) {
      const p = emojiParticles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // Gravity
      p.life -= 0.02;

      const scale = Math.max(0, p.life);
      const opacity = Math.max(0, p.life * 0.9);

      p.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
      p.element.style.opacity = String(opacity);

      if (p.life <= 0) {
        p.element.remove();
        emojiParticles.splice(i, 1);
      }
    }
  }

  let rafId = 0;

  // Main animation loop
  function animate() {
    // Smooth cursor follow (lerp)
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    // Update cursor position
    cursorContainer.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    // Spawn trail particles based on movement distance
    const dx = mouseX - lastParticleX;
    const dy = mouseY - lastParticleY;
    const distanceSq = dx * dx + dy * dy;
    const effectiveSpawnDistance = isModalOpen
      ? 18
      : isTextMode
        ? 16
        : TRAIL_SPAWN_DISTANCE;

    if (
      !isTextMode &&
      distanceSq > effectiveSpawnDistance * effectiveSpawnDistance
    ) {
      createTrailParticle(mouseX, mouseY);
      lastParticleX = mouseX;
      lastParticleY = mouseY;
    }

    // Update particles
    updateTrailParticles();
    updateEmojiParticles();

    // Apply hover state
    const hue = (Date.now() / 18) % 360;

    if (!isMouseVisible) {
      cursorContainer.style.opacity = "0";
    } else {
      cursorContainer.style.opacity = "1";
    }

    if (isTextMode) {
      mainDot.style.transform = "translate(-50%, -50%) scale(1)";
      mainDot.style.width = "2px";
      mainDot.style.height = "22px";
      mainDot.style.borderRadius = "2px";
      mainDot.style.background =
        "linear-gradient(180deg, rgba(125, 211, 252, 0.95), rgba(216, 180, 254, 0.95))";
      mainDot.style.boxShadow =
        "0 0 14px rgba(125, 211, 252, 0.7), 0 0 24px rgba(216, 180, 254, 0.45)";

      glowRing.style.transform = "translate(-50%, -50%) scale(1)";
      glowRing.style.width = "14px";
      glowRing.style.height = "30px";
      glowRing.style.borderRadius = "10px";
      glowRing.style.borderColor = "rgba(125, 211, 252, 0.55)";
      glowRing.style.boxShadow =
        "0 0 16px rgba(125, 211, 252, 0.35), inset 0 0 12px rgba(192, 132, 252, 0.2)";
      glowRing.style.background = "transparent";
    } else if (isHovering) {
      mainDot.style.transform = "translate(-50%, -50%) scale(1.3)";
      mainDot.style.width = "16px";
      mainDot.style.height = "16px";
      mainDot.style.borderRadius = "50%";
      mainDot.style.background = `radial-gradient(circle, hsla(${hue}, 95%, 72%, 0.95) 0%, hsla(${(hue + 46) % 360}, 95%, 66%, 0.92) 50%, hsla(${(hue + 110) % 360}, 95%, 64%, 0.88) 100%)`;
      mainDot.style.boxShadow = `0 0 12px hsla(${hue}, 95%, 72%, 0.8), 0 0 24px hsla(${(hue + 110) % 360}, 95%, 66%, 0.55)`;
      glowRing.style.transform = "translate(-50%, -50%) scale(1.5)";
      glowRing.style.width = "32px";
      glowRing.style.height = "32px";
      glowRing.style.borderRadius = "50%";
      glowRing.style.borderColor = `hsla(${(hue + 24) % 360}, 95%, 70%, 0.85)`;
      glowRing.style.boxShadow = `
        0 0 20px hsla(${hue}, 95%, 70%, 0.7),
        0 0 42px hsla(${(hue + 110) % 360}, 95%, 66%, 0.55),
        inset 0 0 20px hsla(${(hue + 24) % 360}, 95%, 68%, 0.3)
      `;
      glowRing.style.background = `radial-gradient(circle, hsla(${hue}, 95%, 72%, 0.16) 0%, transparent 70%)`;
    } else {
      mainDot.style.transform = "translate(-50%, -50%) scale(1)";
      mainDot.style.width = "12px";
      mainDot.style.height = "12px";
      mainDot.style.borderRadius = "50%";
      mainDot.style.background = `radial-gradient(circle, hsla(${hue}, 95%, 72%, 0.95) 0%, hsla(${(hue + 48) % 360}, 95%, 66%, 0.9) 60%, hsla(${(hue + 108) % 360}, 95%, 64%, 0.85) 100%)`;
      mainDot.style.boxShadow = `0 0 10px hsla(${hue}, 95%, 72%, 0.82), 0 0 20px hsla(${(hue + 108) % 360}, 95%, 66%, 0.5)`;
      glowRing.style.transform = "translate(-50%, -50%) scale(1)";
      glowRing.style.width = "32px";
      glowRing.style.height = "32px";
      glowRing.style.borderRadius = "50%";
      glowRing.style.borderColor = `hsla(${(hue + 24) % 360}, 95%, 70%, 0.55)`;
      glowRing.style.boxShadow = `
        0 0 16px hsla(${hue}, 95%, 70%, 0.45),
        0 0 28px hsla(${(hue + 108) % 360}, 95%, 66%, 0.22),
        inset 0 0 14px hsla(${(hue + 24) % 360}, 95%, 68%, 0.22)
      `;
      glowRing.style.background = "transparent";
    }

    rafId = requestAnimationFrame(animate);
  }

  // Interactive elements selector
  const interactiveSelector =
    'a, button, [role="button"], .cursor-pointer, [onclick]';
  const textSelector =
    'input, textarea, [contenteditable="true"], [contenteditable=""], [role="textbox"], p, span, h1, h2, h3, h4, h5, h6, li, td, th, label';

  const detectModalOpen = () => {
    isModalOpen = !!document.querySelector(
      '[role="dialog"][data-state="open"], [data-state="open"][role="alertdialog"], [role="dialog"]',
    );
  };

  // Mouse move handler
  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseVisible = true;

    const target = e.target as HTMLElement;
    const textTarget = target?.closest(textSelector);
    const selection = window.getSelection();
    const hasSelectedText =
      !!selection &&
      !selection.isCollapsed &&
      selection.toString().trim().length > 0;

    isTextMode = !!textTarget || hasSelectedText;
  };
  document.addEventListener("mousemove", handleMouseMove, { passive: true });

  // Mouse enter/leave handlers
  const handleMouseEnter = () => {
    isMouseVisible = true;
  };
  document.addEventListener("mouseenter", handleMouseEnter);

  const handleMouseLeave = () => {
    isMouseVisible = false;
  };
  document.addEventListener("mouseleave", handleMouseLeave);

  // Hover detection
  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    isHovering = !!target.closest(interactiveSelector);
    isTextMode = !!target.closest(textSelector);
  };
  document.addEventListener("mouseover", handleMouseOver, { passive: true });

  const handleMouseOut = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(interactiveSelector);
    const related = (e as any).relatedTarget as HTMLElement;

    if (target && !related?.closest(interactiveSelector)) {
      isHovering = false;
    }

    if (target?.closest(textSelector) && !related?.closest(textSelector)) {
      const selection = window.getSelection();
      isTextMode =
        !!selection &&
        !selection.isCollapsed &&
        selection.toString().trim().length > 0;
    }
  };
  document.addEventListener("mouseout", handleMouseOut, { passive: true });

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (
      selection &&
      !selection.isCollapsed &&
      selection.toString().trim().length > 0
    ) {
      isTextMode = true;
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    isTextMode = !!active?.closest(textSelector);
  };
  document.addEventListener("selectionchange", handleSelectionChange);

  // Click handler
  const handleMouseDown = () => {
    if (!isTextMode) {
      createEmojiParticle(mouseX, mouseY);
    }
    mainDot.style.transform = "translate(-50%, -50%) scale(0.85)";
    glowRing.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.3 : 0.85})`;

    setTimeout(() => {
      mainDot.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.3 : 1})`;
      glowRing.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
    }, 150);
  };
  document.addEventListener("mousedown", handleMouseDown, { passive: true });

  const observer = new MutationObserver(() => {
    detectModalOpen();
    if (isModalOpen) {
      isMouseVisible = true;
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-state", "role"],
  });
  detectModalOpen();

  // Start animation loop
  rafId = requestAnimationFrame(animate);

  const cleanup = () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseenter", handleMouseEnter);
    document.removeEventListener("mouseleave", handleMouseLeave);
    document.removeEventListener("mouseover", handleMouseOver);
    document.removeEventListener("mouseout", handleMouseOut);
    document.removeEventListener("selectionchange", handleSelectionChange);
    document.removeEventListener("mousedown", handleMouseDown);
    observer.disconnect();

    trailParticles.forEach((particle) => particle.element.remove());
    emojiParticles.forEach((particle) => particle.element.remove());
    cursorContainer.remove();
    trailContainer.remove();
    emojiContainer.remove();
    window.__enhancedCursorCleanup = undefined;
  };

  window.__enhancedCursorCleanup = cleanup;
  return cleanup;
}
