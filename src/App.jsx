import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Moon, Sun, Sparkles, Heart, Lock, Plus, Trash2, Edit3,
  Check, X, Music, StickyNote, Image as ImageIcon, Quote, Clock,
  Settings, Palette, Type, Layout, BookOpen, Sparkle, Wand2,
  Calendar, Target, Film, ShoppingBag, Save, Feather, Compass,
  CloudMoon, Zap, Flower2, Gem, Flame, Leaf, KeyRound,
  BookMarked, Stars, GripVertical, Type as TypeIcon, AlignLeft,
  Star, ChevronDown, Paintbrush, Eye, LogOut, Mail
} from "lucide-react";
import { auth, watchUser, signUp, signIn, signInGoogle, logOut, loadState, saveState } from "./firebase";

/* ============================================================
   ✦ ARRIÈRE-PLANS ANIMÉS (catalogue, choisissables par section)
   ============================================================ */
const BACKDROPS = {
  none:        { name: "Aucun", emoji: "○" },
  fullMoon:    { name: "Nuit de pleine lune", emoji: "🌕" },
  starry:      { name: "Ciel étoilé", emoji: "✦" },
  cottage:     { name: "Prairie cottagecore", emoji: "🌼" },
  petals:      { name: "Pluie de pétales", emoji: "🌸" },
  bows:        { name: "Nœuds coquette", emoji: "🎀" },
  vines:       { name: "Lierres & lucioles", emoji: "🌿" },
  dust:        { name: "Poussière dorée", emoji: "✨" },
  rain:        { name: "Pluie douce", emoji: "🌧️" },
  forest:      { name: "Forêt brumeuse", emoji: "🌲" },
  aurora:      { name: "Aurore boréale", emoji: "🌌" },
  dreamy:      { name: "Rêve Y2K", emoji: "💗" },
  embers:      { name: "Braises de feu", emoji: "🔥" },
  snow:        { name: "Neige feutrée", emoji: "❄️" },
  butterflies: { name: "Papillons", emoji: "🦋" },
  hearts:      { name: "Cœurs flottants", emoji: "🩷" },
  sparkstars:  { name: "Étoiles filantes", emoji: "🌠" },
  fireflies:   { name: "Lucioles d'été", emoji: "🪲" },
  bubbles:     { name: "Bulles douces", emoji: "🫧" },
  cherry:      { name: "Cerisiers en fleur", emoji: "🌸" },
  leaves:      { name: "Feuilles d'automne", emoji: "🍂" },
  music:       { name: "Notes de musique", emoji: "🎵" },
  candles:     { name: "Bougies vacillantes", emoji: "🕯️" },
  cosmic:      { name: "Galaxie cosmique", emoji: "🪐" },
  ocean:       { name: "Vagues océan", emoji: "🌊" },
  rainbow:     { name: "Brume arc-en-ciel", emoji: "🌈" },
  moths:       { name: "Phalènes de nuit", emoji: "🦋" },
  glitter:     { name: "Paillettes Y2K", emoji: "💖" },
};

/* ============================================================
   ✦ THÈMES (palettes)
   ============================================================ */
const THEMES = {
  myUniverse: {
    name: "✿ My Universe (rose poudré)", icon: Heart,
    vars: { "--bg":"#f5ebe4","--bg2":"#ecd9d2","--surface":"rgba(255,253,250,0.55)","--surface2":"rgba(218,201,200,0.4)","--border":"rgba(160,110,100,0.22)","--text":"#3d2a26","--muted":"#8a6b65","--primary":"#c89a92","--accent":"#a8b5a0","--ink":"#403e3e","--paper":"#fafaf6","--rose":"#dac9c8","--sage":"#d0d4c6","--glow":"200,154,146" },
    backdrop: "petals", universe: "soft",
  },
  sage: {
    name: "✿ Sauge & Crème", icon: Leaf,
    vars: { "--bg":"#eef0e8","--bg2":"#dde3d4","--surface":"rgba(255,255,255,0.55)","--surface2":"rgba(208,212,198,0.45)","--border":"rgba(100,120,90,0.22)","--text":"#3a4035","--muted":"#7a8a72","--primary":"#9fb89a","--accent":"#c4a896","--ink":"#2c322a","--paper":"#f6f8ef","--rose":"#e8d8d2","--sage":"#bfc9b0","--glow":"159,184,154" },
    backdrop: "cottage", universe: "soft",
  },
  coquette: {
    name: "✿ Coquette Lait", icon: Flower2,
    vars: { "--bg":"#fff5f7","--bg2":"#fde4eb","--surface":"rgba(255,255,255,0.7)","--surface2":"rgba(248,210,220,0.45)","--border":"rgba(200,120,150,0.28)","--text":"#5a2a3a","--muted":"#a37286","--primary":"#e89bb5","--accent":"#c46b8b","--ink":"#3a1a26","--paper":"#fffafc","--rose":"#f5cdd8","--sage":"#e0d5c8","--glow":"232,155,181" },
    backdrop: "bows", universe: "soft",
  },
  blueDream: {
    name: "✿ Bleu nuit doux (journal)", icon: Moon,
    vars: { "--bg":"#3a4d6b","--bg2":"#2d3e58","--surface":"rgba(255,255,255,0.08)","--surface2":"rgba(255,255,255,0.05)","--border":"rgba(255,255,255,0.2)","--text":"#eef2fa","--muted":"#a8b8d4","--primary":"#f0a8c8","--accent":"#8ad0e8","--ink":"#eef2fa","--paper":"#3a4d6b","--rose":"#f0a8c8","--sage":"#a0d8b0","--glow":"240,168,200" },
    backdrop: "starry", universe: "soft",
  },
  witchPurple: {
    name: "☾ Witch Purple", icon: Moon,
    vars: { "--bg":"#1a0d24","--bg2":"#2a1638","--surface":"rgba(120,70,180,0.10)","--surface2":"rgba(60,30,90,0.5)","--border":"rgba(180,140,220,0.28)","--text":"#ede0f5","--muted":"#b39ac8","--primary":"#a875d4","--accent":"#e0c97a","--ink":"#3a1f4e","--paper":"#f5e9d4","--rose":"#7a3a8a","--sage":"#5a7050","--glow":"168,117,212" },
    backdrop: "fullMoon", universe: "witch",
  },
  witchTavern: {
    name: "☾ Witch's Tavern", icon: BookMarked,
    vars: { "--bg":"#0d1410","--bg2":"#1a2418","--surface":"rgba(90,70,40,0.15)","--border":"rgba(180,150,90,0.3)","--surface2":"rgba(40,55,35,0.5)","--text":"#f0e4c8","--muted":"#a59172","--primary":"#c9a26a","--accent":"#9fb89a","--ink":"#2a1f10","--paper":"#e8dcc0","--rose":"#a06850","--sage":"#7a8a6a","--glow":"201,162,106" },
    backdrop: "vines", universe: "witch",
  },
  darkAcademia: {
    name: "☾ Dark Academia", icon: BookOpen,
    vars: { "--bg":"#1a0d0d","--bg2":"#2a1414","--surface":"rgba(180,140,90,0.08)","--border":"rgba(180,140,90,0.28)","--surface2":"rgba(60,30,30,0.5)","--text":"#f0e0c8","--muted":"#b59878","--primary":"#8a1c1c","--accent":"#c9a26a","--ink":"#2a1010","--paper":"#e8d8b8","--rose":"#8a1c1c","--sage":"#7a6a4a","--glow":"201,162,106" },
    backdrop: "embers", universe: "witch",
  },
  dreamY2K: {
    name: "☾ Dream Y2K (rêves)", icon: CloudMoon,
    vars: { "--bg":"#3a2a5e","--bg2":"#5a3a8a","--surface":"rgba(255,255,255,0.12)","--surface2":"rgba(180,140,220,0.2)","--border":"rgba(255,200,240,0.4)","--text":"#fbeaff","--muted":"#d4b0e8","--primary":"#ff9ed8","--accent":"#9ae8ff","--ink":"#fbeaff","--paper":"#5a3a8a","--rose":"#ff9ed8","--sage":"#9ae8c8","--glow":"255,158,216" },
    backdrop: "dreamy", universe: "witch",
  },

  /* ===== Nouveaux thèmes SOFT (Yasmine) ===== */
  peach: {
    name: "✿ Pêche & Abricot", icon: Flower2,
    vars: { "--bg":"#fff1e8","--bg2":"#ffe0cc","--surface":"rgba(255,255,255,0.6)","--surface2":"rgba(255,210,180,0.4)","--border":"rgba(220,140,100,0.28)","--text":"#5a3526","--muted":"#a8755a","--primary":"#f0a878","--accent":"#e88a9a","--ink":"#4a2818","--paper":"#fffaf5","--rose":"#f5c5a8","--sage":"#d8c8a0","--glow":"240,168,120" },
    backdrop: "petals", universe: "soft",
  },
  lavender: {
    name: "✿ Lavande Douce", icon: Flower2,
    vars: { "--bg":"#f3eefa","--bg2":"#e6dcf5","--surface":"rgba(255,255,255,0.6)","--surface2":"rgba(210,190,235,0.4)","--border":"rgba(150,120,200,0.26)","--text":"#3e2f55","--muted":"#8a72a8","--primary":"#b39ad8","--accent":"#d8a8c8","--ink":"#2e1f42","--paper":"#faf7fe","--rose":"#e0c8e8","--sage":"#c8c0e0","--glow":"179,154,216" },
    backdrop: "butterflies", universe: "soft",
  },
  mint: {
    name: "✿ Menthe Fraîche", icon: Leaf,
    vars: { "--bg":"#e8f5ef","--bg2":"#d4ece0","--surface":"rgba(255,255,255,0.6)","--surface2":"rgba(180,225,205,0.4)","--border":"rgba(90,170,140,0.26)","--text":"#274039","--muted":"#5f8a7a","--primary":"#7ac8a8","--accent":"#e8b8a0","--ink":"#1a322a","--paper":"#f4fbf7","--rose":"#e8cdc8","--sage":"#a8d8c0","--glow":"122,200,168" },
    backdrop: "cottage", universe: "soft",
  },
  butter: {
    name: "✿ Beurre & Vanille", icon: Sun,
    vars: { "--bg":"#fdf6e3","--bg2":"#f8ecca","--surface":"rgba(255,255,255,0.6)","--surface2":"rgba(245,225,165,0.4)","--border":"rgba(200,170,90,0.26)","--text":"#4a3f1e","--muted":"#9a8550","--primary":"#e8c870","--accent":"#c8a878","--ink":"#3a3010","--paper":"#fffdf2","--rose":"#f0dca8","--sage":"#d8d0a0","--glow":"232,200,112" },
    backdrop: "dust", universe: "soft",
  },
  cherry: {
    name: "✿ Cerise & Crème", icon: Heart,
    vars: { "--bg":"#fdeef0","--bg2":"#fad6dd","--surface":"rgba(255,255,255,0.65)","--surface2":"rgba(245,190,200,0.4)","--border":"rgba(200,90,110,0.28)","--text":"#5a2530","--muted":"#a86875","--primary":"#e87a90","--accent":"#c85a6a","--ink":"#42161e","--paper":"#fffafb","--rose":"#f5b8c2","--sage":"#e0cdc0","--glow":"232,122,144" },
    backdrop: "petals", universe: "soft",
  },
  sky: {
    name: "✿ Ciel & Coton", icon: CloudMoon,
    vars: { "--bg":"#eef5fb","--bg2":"#d8e8f5","--surface":"rgba(255,255,255,0.6)","--surface2":"rgba(190,220,245,0.4)","--border":"rgba(100,150,200,0.26)","--text":"#27384a","--muted":"#6a85a0","--primary":"#8ac0e8","--accent":"#e8b8c8","--ink":"#1a2838","--paper":"#f6fafe","--rose":"#e8cdd8","--sage":"#bcd4e8","--glow":"138,192,232" },
    backdrop: "snow", universe: "soft",
  },
  terracotta: {
    name: "✿ Terracotta Bohème", icon: Sun,
    vars: { "--bg":"#f7ece2","--bg2":"#ecd4c0","--surface":"rgba(255,255,255,0.55)","--surface2":"rgba(220,180,150,0.4)","--border":"rgba(180,110,70,0.28)","--text":"#4e2f1e","--muted":"#9a6f50","--primary":"#c87a52","--accent":"#9aa878","--ink":"#3a2014","--paper":"#fcf6ef","--rose":"#e0b095","--sage":"#bcc09a","--glow":"200,122,82" },
    backdrop: "aurora", universe: "soft",
  },

  /* ===== Nouveaux thèmes WITCH (Yasmeen) ===== */
  bloodMoon: {
    name: "☾ Lune de Sang", icon: Moon,
    vars: { "--bg":"#1a0808","--bg2":"#2e0f0f","--surface":"rgba(180,40,40,0.10)","--surface2":"rgba(80,20,20,0.5)","--border":"rgba(200,80,80,0.3)","--text":"#f5d8d0","--muted":"#c08a82","--primary":"#c0392b","--accent":"#e0a060","--ink":"#3a1010","--paper":"#e8d0c0","--rose":"#8a2a2a","--sage":"#6a5040","--glow":"192,57,43" },
    backdrop: "embers", universe: "witch",
  },
  forestWitch: {
    name: "☾ Sorcière des Bois", icon: Leaf,
    vars: { "--bg":"#0f1a12","--bg2":"#18281c","--surface":"rgba(80,140,90,0.10)","--surface2":"rgba(30,55,38,0.5)","--border":"rgba(120,180,120,0.28)","--text":"#dceadc","--muted":"#88a888","--primary":"#6a9a5a","--accent":"#c8a86a","--ink":"#15281a","--paper":"#e0e8d4","--rose":"#7a8a5a","--sage":"#5a7a4a","--glow":"106,154,90" },
    backdrop: "forest", universe: "witch",
  },
  cosmicWitch: {
    name: "☾ Sorcière Cosmique", icon: Stars,
    vars: { "--bg":"#0a0e2a","--bg2":"#141a44","--surface":"rgba(120,140,255,0.10)","--surface2":"rgba(40,50,110,0.5)","--border":"rgba(140,160,255,0.3)","--text":"#e0e6ff","--muted":"#9aa8d8","--primary":"#7a8aff","--accent":"#e0c060","--ink":"#1a2050","--paper":"#dce0f5","--rose":"#6a5aaa","--sage":"#5a6a9a","--glow":"122,138,255" },
    backdrop: "aurora", universe: "witch",
  },
  oceanWitch: {
    name: "☾ Sorcière des Mers", icon: CloudMoon,
    vars: { "--bg":"#06181f","--bg2":"#0d2a34","--surface":"rgba(60,160,180,0.10)","--surface2":"rgba(20,60,72,0.5)","--border":"rgba(90,190,210,0.3)","--text":"#d4eef2","--muted":"#7aaeba","--primary":"#3aa0b8","--accent":"#c8b07a","--ink":"#0a2832","--paper":"#d0e8ec","--rose":"#5a8a9a","--sage":"#4a8070","--glow":"58,160,184" },
    backdrop: "rain", universe: "witch",
  },
  noir: {
    name: "☾ Noir & Argent", icon: Moon,
    vars: { "--bg":"#101012","--bg2":"#1c1c20","--surface":"rgba(200,200,210,0.07)","--surface2":"rgba(50,50,58,0.5)","--border":"rgba(180,180,200,0.25)","--text":"#e8e8ee","--muted":"#9a9aa8","--primary":"#b0b0c0","--accent":"#c8a86a","--ink":"#28282e","--paper":"#dcdce2","--rose":"#8a8a9a","--sage":"#6a6a7a","--glow":"176,176,192" },
    backdrop: "starry", universe: "witch",
  },
  emerald: {
    name: "☾ Émeraude Mystique", icon: Gem,
    vars: { "--bg":"#0a1a14","--bg2":"#0f2a20","--surface":"rgba(40,180,120,0.10)","--surface2":"rgba(20,60,45,0.5)","--border":"rgba(80,200,140,0.3)","--text":"#d4f0e2","--muted":"#7ab89a","--primary":"#2aa878","--accent":"#d4b860","--ink":"#0a2818","--paper":"#d0ecde","--rose":"#5a9a7a","--sage":"#4a8060","--glow":"42,168,120" },
    backdrop: "vines", universe: "witch",
  },
  rosewitch: {
    name: "☾ Sorcière Rose Antique", icon: Flower2,
    vars: { "--bg":"#1f0f18","--bg2":"#331826","--surface":"rgba(200,100,150,0.10)","--surface2":"rgba(80,40,60,0.5)","--border":"rgba(220,140,180,0.3)","--text":"#f5dce8","--muted":"#c890aa","--primary":"#c0608a","--accent":"#e0b070","--ink":"#3a1828","--paper":"#ecd0dc","--rose":"#a04a6a","--sage":"#7a5a6a","--glow":"192,96,138" },
    backdrop: "petals", universe: "witch",
  },
};

const FONTS = {
  serif: { name: "Chic Serif", stack: '"Cormorant Garamond", Georgia, serif' },
  display: { name: "Display Ornée", stack: '"Cinzel", serif' },
  script: { name: "Manuscrit", stack: '"Dancing Script", cursive' },
  fraunces: { name: "Fraunces Soft", stack: '"Fraunces", serif' },
  y2k: { name: "Y2K Futur", stack: '"Major Mono Display", monospace' },
  gothic: { name: "Gothique", stack: '"UnifrakturCook", serif' },
  cute: { name: "Mignon arrondi", stack: '"Caveat", cursive' },
  // ✦ nouvelles polices aesthetic
  playfair: { name: "Playfair élégant", stack: '"Playfair Display", serif' },
  cormorantUp: { name: "Cormorant Majuscules", stack: '"Cormorant SC", serif' },
  ebGaramond: { name: "Garamond classique", stack: '"EB Garamond", serif' },
  italiana: { name: "Italiana chic", stack: '"Italiana", serif' },
  marcellus: { name: "Marcellus raffiné", stack: '"Marcellus", serif' },
  cinzelDeco: { name: "Cinzel Décoratif", stack: '"Cinzel Decorative", serif' },
  greatVibes: { name: "Calligraphie", stack: '"Great Vibes", cursive' },
  parisienne: { name: "Parisienne", stack: '"Parisienne", cursive' },
  sacramento: { name: "Sacramento fin", stack: '"Sacramento", cursive' },
  pinyon: { name: "Pinyon royal", stack: '"Pinyon Script", cursive' },
  homemade: { name: "Écriture main", stack: '"Homemade Apple", cursive' },
  shadows: { name: "Crayon doux", stack: '"Shadows Into Light", cursive' },
  gloock: { name: "Gloock moderne", stack: '"Gloock", serif' },
  spaceMono: { name: "Mono futur", stack: '"Space Mono", monospace' },
  pixelify: { name: "Pixel Y2K", stack: '"Pixelify Sans", monospace' },
  monoton: { name: "Néon rétro", stack: '"Monoton", cursive' },
  yeseva: { name: "Yeseva doux", stack: '"Yeseva One", serif' },
  amatic: { name: "Amatic fin", stack: '"Amatic SC", cursive' },
};

/* ============================================================
   ✦ FOND ANIMÉ — moteur complet
   ============================================================ */
function Backdrop({ kind }) {
  if (!kind || kind === "none") return null;

  // helpers de génération
  const dots = (n, fn) => Array.from({ length: n }).map((_, i) => fn(i));

  // ----- FOND CUSTOM GÉNÉRÉ ({gen:true, particle, count, motion, color, size, glow}) -----
  if (typeof kind === "object" && kind.gen) {
    const { particle="✨", count=20, motion="float", color="", size=20, glow=false } = kind;
    const isEmoji = !/^#|rgb/.test(particle) && particle.length<=3 && !["dot","circle","star"].includes(particle);
    const anim = { float:"floatY", fall:"fall", rise:"emberRise", cross:"flyAcross", twinkle:"twinkle", sway:"sway" }[motion] || "floatY";
    const startStyle = (i)=> {
      const base = { animationDelay:`${Math.random()* (motion==="cross"?6: motion==="fall"||motion==="rise"?10:4)}s`, animationDuration:`${(motion==="twinkle"?2:8)+Math.random()*8}s` };
      if (motion==="fall") return { ...base, top:"-5%", left:`${Math.random()*100}%` };
      if (motion==="rise") return { ...base, bottom:"-5%", left:`${Math.random()*100}%` };
      if (motion==="cross") return { ...base, top:`${Math.random()*80}%`, left:"-5%" };
      return { ...base, top:`${Math.random()*100}%`, left:`${Math.random()*100}%` };
    };
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(Math.min(80,count), i=>(
          isEmoji
            ? <span key={i} className="absolute" style={{ ...startStyle(i), fontSize:`${size*0.7+Math.random()*size*0.6}px`, opacity:0.6, animationName:anim, animationTimingFunction:"linear", animationIterationCount:"infinite", filter:glow?`drop-shadow(0 0 6px ${color||"#fff"})`:"none" }}>{particle}</span>
            : <span key={i} className="absolute rounded-full" style={{ ...startStyle(i), width:`${size*0.2+Math.random()*size*0.2}px`, height:`${size*0.2+Math.random()*size*0.2}px`, background:color||"#ffffff", opacity:0.5, animationName:anim, animationTimingFunction:"linear", animationIterationCount:"infinite", boxShadow:glow?`0 0 8px 2px ${color||"#fff"}`:"none" }}/>
        ))}
      </div>
    );
  }

  if (kind === "fullMoon") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute rounded-full" style={{
          top:"8%", right:"12%", width:"120px", height:"120px",
          background:"radial-gradient(circle at 35% 35%, #fff, #e8e0c8 60%, #c8bfa0)",
          boxShadow:"0 0 80px 30px rgba(255,250,220,0.4)",
          animation:"floatY 12s ease-in-out infinite"
        }}/>
        {dots(70, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${1+Math.random()*2}px`, height:`${1+Math.random()*2}px`,
            background:"#fff", opacity:0.2+Math.random()*0.6,
            boxShadow:"0 0 6px #fff",
            animation:`twinkle ${2+Math.random()*4}s ease-in-out infinite`,
            animationDelay:`${Math.random()*3}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "starry") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(90, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${1+Math.random()*3}px`, height:`${1+Math.random()*3}px`,
            background:"var(--accent)", opacity:0.3+Math.random()*0.6,
            boxShadow:`0 0 ${4+Math.random()*8}px var(--accent)`,
            animation:`twinkle ${2+Math.random()*4}s ease-in-out infinite`,
            animationDelay:`${Math.random()*3}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "cottage") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{
          background:"linear-gradient(transparent, rgba(150,180,120,0.25))"
        }}/>
        {dots(16, i=>(
          <span key={i} className="absolute" style={{
            bottom:`${Math.random()*18}%`, left:`${Math.random()*100}%`,
            fontSize:`${14+Math.random()*14}px`, opacity:0.5,
            animation:`sway ${3+Math.random()*3}s ease-in-out infinite`,
            animationDelay:`${Math.random()*2}s`, transformOrigin:"bottom center"
          }}>{["🌼","🌿","🌾","🌷","🍄"][i%5]}</span>
        ))}
        {dots(6, i=>(
          <span key={"b"+i} className="absolute" style={{
            top:`${20+Math.random()*40}%`, left:`-5%`, fontSize:"18px", opacity:0.6,
            animation:`flyAcross ${18+Math.random()*12}s linear infinite`,
            animationDelay:`${i*3}s`
          }}>🦋</span>
        ))}
      </div>
    );
  }

  if (kind === "petals") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(16, i=>(
          <span key={i} className="absolute" style={{
            top:"-5%", left:`${Math.random()*100}%`,
            fontSize:`${14+Math.random()*16}px`, opacity:0.4,
            animation:`fall ${18+Math.random()*14}s linear infinite`,
            animationDelay:`${Math.random()*15}s`
          }}>{["🌸","🌷","✿","❀","🌹"][i%5]}</span>
        ))}
      </div>
    );
  }

  if (kind === "bows") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(18, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            fontSize:`${10+Math.random()*18}px`, opacity:0.3,
            animation:`floatY ${8+Math.random()*8}s ease-in-out infinite`,
            animationDelay:`${Math.random()*4}s`
          }}>{["🎀","♡","✿"][i%3]}</span>
        ))}
      </div>
    );
  }

  if (kind === "vines") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(12, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            fontSize:`${18+Math.random()*14}px`, opacity:0.22,
            animation:`floatY ${10+Math.random()*8}s ease-in-out infinite`,
            animationDelay:`${Math.random()*5}s`
          }}>{["🌿","🍃","🌱"][i%3]}</span>
        ))}
        {dots(25, i=>(
          <span key={"f"+i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:"3px", height:"3px", background:"#e0ff90", opacity:0.6,
            boxShadow:"0 0 8px #c8ff80",
            animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`,
            animationDelay:`${Math.random()*3}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "dust") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(45, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${2+Math.random()*2}px`, height:`${2+Math.random()*2}px`,
            background:"var(--accent)", opacity:0.25,
            animation:`floatY ${10+Math.random()*10}s ease-in-out infinite`,
            animationDelay:`${Math.random()*5}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "rain") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(40, i=>(
          <span key={i} className="absolute" style={{
            top:"-10%", left:`${Math.random()*100}%`,
            width:"1px", height:`${10+Math.random()*20}px`,
            background:"linear-gradient(transparent, rgba(180,210,255,0.5))",
            animation:`rainFall ${0.6+Math.random()*0.8}s linear infinite`,
            animationDelay:`${Math.random()*2}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "forest") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0" style={{
          background:"radial-gradient(ellipse at 50% 120%, rgba(80,120,80,0.3), transparent 70%)"
        }}/>
        {dots(20, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${4+Math.random()*6}px`, height:`${4+Math.random()*6}px`,
            background:"rgba(200,255,200,0.4)", filter:"blur(2px)",
            animation:`floatY ${8+Math.random()*8}s ease-in-out infinite`,
            animationDelay:`${Math.random()*4}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "aurora") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-x-0 top-0 h-1/2" style={{
          background:"linear-gradient(120deg, rgba(120,255,200,0.15), rgba(140,160,255,0.15), rgba(255,140,220,0.12))",
          filter:"blur(40px)", animation:"auroraShift 12s ease-in-out infinite"
        }}/>
        {dots(50, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:"2px", height:"2px", background:"#fff", opacity:0.4,
            animation:`twinkle ${3+Math.random()*3}s ease-in-out infinite`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "dreamy") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0" style={{
          background:"linear-gradient(135deg, rgba(255,180,230,0.2), rgba(150,200,255,0.2), rgba(200,160,255,0.2))",
          backgroundSize:"200% 200%", animation:"holoShift 10s ease infinite"
        }}/>
        {dots(30, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            fontSize:`${10+Math.random()*16}px`, opacity:0.4,
            animation:`floatY ${6+Math.random()*6}s ease-in-out infinite`,
            animationDelay:`${Math.random()*3}s`
          }}>{["💗","✦","☆","🦋","🌙","💜"][i%6]}</span>
        ))}
      </div>
    );
  }

  if (kind === "embers") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(30, i=>(
          <span key={i} className="absolute rounded-full" style={{
            bottom:"-5%", left:`${Math.random()*100}%`,
            width:`${2+Math.random()*3}px`, height:`${2+Math.random()*3}px`,
            background:"#ff9a3c", opacity:0.6, boxShadow:"0 0 6px #ff6a1c",
            animation:`emberRise ${4+Math.random()*5}s linear infinite`,
            animationDelay:`${Math.random()*4}s`
          }}/>
        ))}
      </div>
    );
  }

  if (kind === "snow") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(40, i=>(
          <span key={i} className="absolute" style={{
            top:"-5%", left:`${Math.random()*100}%`,
            fontSize:`${6+Math.random()*10}px`, opacity:0.6, color:"#fff",
            animation:`fall ${8+Math.random()*8}s linear infinite`,
            animationDelay:`${Math.random()*8}s`
          }}>❄</span>
        ))}
      </div>
    );
  }

  if (kind === "butterflies") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(10, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*80}%`, left:`-5%`, fontSize:`${16+Math.random()*12}px`, opacity:0.7,
            animation:`flyAcross ${14+Math.random()*12}s linear infinite`,
            animationDelay:`${i*2}s`
          }}>🦋</span>
        ))}
      </div>
    );
  }

  if (kind === "hearts") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(16, i=>(
          <span key={i} className="absolute" style={{
            bottom:"-5%", left:`${Math.random()*100}%`, fontSize:`${12+Math.random()*16}px`, opacity:0.5,
            animation:`emberRise ${8+Math.random()*8}s linear infinite`, animationDelay:`${Math.random()*6}s`
          }}>{["🩷","💗","💕","🤍","♡"][i%5]}</span>
        ))}
      </div>
    );
  }
  if (kind === "sparkstars") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(40, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, width:"2px", height:"2px",
            background:"#fff", opacity:0.5, animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`
          }}/>
        ))}
        {dots(5, i=>(
          <span key={"s"+i} className="absolute" style={{
            top:`${Math.random()*40}%`, left:`-10%`, fontSize:"20px", opacity:0.9,
            animation:`flyAcross ${5+Math.random()*5}s linear infinite`, animationDelay:`${i*3}s`
          }}>🌠</span>
        ))}
      </div>
    );
  }
  if (kind === "fireflies") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(28, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${3+Math.random()*3}px`, height:`${3+Math.random()*3}px`,
            background:"#eaff80", boxShadow:"0 0 10px 2px #d0ff60", opacity:0.8,
            animation:`floatY ${6+Math.random()*6}s ease-in-out infinite, twinkle ${2+Math.random()*2}s ease-in-out infinite`,
            animationDelay:`${Math.random()*4}s`
          }}/>
        ))}
      </div>
    );
  }
  if (kind === "bubbles") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(20, i=>{const sz=8+Math.random()*30; return (
          <span key={i} className="absolute rounded-full" style={{
            bottom:"-10%", left:`${Math.random()*100}%`, width:`${sz}px`, height:`${sz}px`,
            background:"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
            border:"1px solid rgba(255,255,255,0.3)", opacity:0.5,
            animation:`emberRise ${10+Math.random()*10}s linear infinite`, animationDelay:`${Math.random()*8}s`
          }}/>
        );})}
      </div>
    );
  }
  if (kind === "cherry") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(18, i=>(
          <span key={i} className="absolute" style={{
            top:"-5%", left:`${Math.random()*100}%`, fontSize:`${12+Math.random()*14}px`, opacity:0.6,
            animation:`fall ${14+Math.random()*12}s linear infinite`, animationDelay:`${Math.random()*12}s`
          }}>{["🌸","🌸","🌷","❀"][i%4]}</span>
        ))}
      </div>
    );
  }
  if (kind === "leaves") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(16, i=>(
          <span key={i} className="absolute" style={{
            top:"-5%", left:`${Math.random()*100}%`, fontSize:`${14+Math.random()*14}px`, opacity:0.6,
            animation:`fall ${12+Math.random()*10}s linear infinite`, animationDelay:`${Math.random()*10}s`
          }}>{["🍂","🍁","🍃"][i%3]}</span>
        ))}
      </div>
    );
  }
  if (kind === "music") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(16, i=>(
          <span key={i} className="absolute" style={{
            bottom:"-5%", left:`${Math.random()*100}%`, fontSize:`${14+Math.random()*14}px`, opacity:0.4,
            color:"var(--accent)",
            animation:`emberRise ${9+Math.random()*7}s linear infinite`, animationDelay:`${Math.random()*6}s`
          }}>{["♪","♫","🎵","🎶"][i%4]}</span>
        ))}
      </div>
    );
  }
  if (kind === "candles") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 50% 100%, rgba(255,180,80,0.12), transparent 60%)"}}/>
        {dots(20, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${3+Math.random()*3}px`, height:`${4+Math.random()*4}px`,
            background:"#ffb84d", boxShadow:"0 0 8px 2px #ff9a3c", opacity:0.7,
            animation:`floatY ${5+Math.random()*4}s ease-in-out infinite, twinkle ${1.5+Math.random()*2}s ease-in-out infinite`,
            animationDelay:`${Math.random()*3}s`
          }}/>
        ))}
      </div>
    );
  }
  if (kind === "cosmic") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 70% 30%, rgba(140,100,220,0.18), transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(80,140,220,0.15), transparent 55%)"}}/>
        {dots(70, i=>(
          <span key={i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            width:`${1+Math.random()*2}px`, height:`${1+Math.random()*2}px`,
            background:"#fff", opacity:0.3+Math.random()*0.5,
            animation:`twinkle ${2+Math.random()*4}s ease-in-out infinite`, animationDelay:`${Math.random()*3}s`
          }}/>
        ))}
      </div>
    );
  }
  if (kind === "ocean") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-x-0 bottom-0 h-1/3" style={{
          background:"linear-gradient(transparent, rgba(80,160,200,0.2))",
          animation:"auroraShift 8s ease-in-out infinite"
        }}/>
        {dots(20, i=>(
          <span key={i} className="absolute rounded-full" style={{
            bottom:`${Math.random()*30}%`, left:`${Math.random()*100}%`,
            width:`${4+Math.random()*6}px`, height:`${4+Math.random()*6}px`,
            background:"rgba(200,240,255,0.4)", filter:"blur(1px)",
            animation:`floatY ${6+Math.random()*5}s ease-in-out infinite`, animationDelay:`${Math.random()*4}s`
          }}/>
        ))}
      </div>
    );
  }
  if (kind === "rainbow") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0" style={{
          background:"linear-gradient(120deg, rgba(255,150,200,0.12), rgba(255,220,150,0.12), rgba(150,255,200,0.12), rgba(150,200,255,0.12), rgba(220,150,255,0.12))",
          backgroundSize:"300% 300%", animation:"holoShift 12s ease infinite"
        }}/>
        {dots(20, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, fontSize:`${8+Math.random()*12}px`, opacity:0.4,
            animation:`floatY ${6+Math.random()*6}s ease-in-out infinite`, animationDelay:`${Math.random()*3}s`
          }}>{["✦","☆","✧"][i%3]}</span>
        ))}
      </div>
    );
  }
  if (kind === "moths") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(8, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*80}%`, left:`-5%`, fontSize:`${16+Math.random()*12}px`, opacity:0.4,
            filter:"grayscale(1) brightness(1.4)",
            animation:`flyAcross ${14+Math.random()*12}s linear infinite`, animationDelay:`${i*2}s`
          }}>🦋</span>
        ))}
        {dots(20, i=>(
          <span key={"d"+i} className="absolute rounded-full" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, width:"2px", height:"2px",
            background:"#e8e8d0", opacity:0.4, animation:`twinkle ${3+Math.random()*3}s ease-in-out infinite`
          }}/>
        ))}
      </div>
    );
  }
  if (kind === "glitter") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dots(45, i=>(
          <span key={i} className="absolute" style={{
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
            fontSize:`${8+Math.random()*12}px`, opacity:0.5,
            animation:`twinkle ${1.5+Math.random()*2.5}s ease-in-out infinite`, animationDelay:`${Math.random()*3}s`
          }}>{["✨","💖","⭐","💗","✦"][i%5]}</span>
        ))}
      </div>
    );
  }

  return null;
}

/* ============================================================
   ✦ DONNÉES MAGIQUES (rituels, conseils, etc.)
   ============================================================ */
const WITCH_RITUALS = [
  { title:"Bain lunaire purifiant", ingredients:"sel rose, pétales de rose, romarin, 3 gouttes de lavande", steps:"Bain tiède, verse les ingrédients en cercle. Visualise une lumière dorée. 20 min. Imagine ce qui ne te sert plus s'écouler avec l'eau." },
  { title:"Manifestation à la cannelle", ingredients:"bougie blanche, cannelle, papier, stylo doré", steps:"Écris ton intention au présent. Saupoudre de cannelle. Plie 3 fois vers toi. Brûle le papier à la bougie. Laisse-la se consumer." },
  { title:"Eau de lune", ingredients:"bocal en verre, eau filtrée, un cristal", steps:"Veille de pleine lune : remplis le bocal, expose-le à la lune. Récupère avant le soleil. Bois ou bénis des objets avec." },
  { title:"Sel noir de protection", ingredients:"sel, cendres de sauge, poivre noir, charbon", steps:"Mélange en visualisant une bulle protectrice. Saupoudre devant la porte et aux fenêtres." },
  { title:"Rituel du miroir", ingredients:"miroir, bougie rose, ton souffle", steps:"Regarde-toi 5 min sans détourner. Murmure 7 fois : 'je te vois, je t'aime, je te choisis'. Souffle la bougie." },
  { title:"Spell jar d'intention", ingredients:"petit bocal, 3 herbes, un cristal, papier, cire", steps:"Écris ton intention, glisse-la avec les herbes et le cristal. Scelle avec la cire d'une bougie de la bonne couleur." },
  { title:"Smudge matinal", ingredients:"sauge blanche ou palo santo, coquillage, plume", steps:"Ouvre les fenêtres. Cercles horaires dans chaque pièce, insiste sur les coins. 'Que toute énergie qui ne me sert plus parte.'" },
  { title:"Café-intention", ingredients:"café, miel, cannelle", steps:"Tiens la tasse à deux mains. Dis ton intention. Remue 3 fois horaire pour attirer. Bois lentement." },
  { title:"Magie des nœuds", ingredients:"ruban, ton intention", steps:"9 nœuds, à chacun : 'avec ce nœud je scelle [intention], qu'il en soit ainsi'. Porte ou enterre le ruban." },
  { title:"Ancrage forestier", ingredients:"pieds nus, terre, un arbre", steps:"Marche pieds nus 10 min. Adosse-toi à un arbre. Visualise tes racines. Demande conseil — la 1ère pensée est la réponse." },
  { title:"Spell de glow up", ingredients:"miel, bougie rose, miroir, pétales", steps:"Touche tes joues, front, lèvres avec du miel. 7 affirmations de beauté face au miroir. Rince après 5 min." },
  { title:"Carte d'oracle quotidienne", ingredients:"ton jeu de tarot/oracle", steps:"Mélange : 'que dois-je savoir ?'. Tire une carte. Note. Observe les synchronicités." },
  { title:"Feu de libération", ingredients:"papier, bougie, bol résistant", steps:"Écris ce que tu libères. Lis à voix haute. Brûle. Regarde les cendres : c'est parti." },
  { title:"Bath spell amour-propre", ingredients:"lait, miel, pétales, sel rose", steps:"Verse dans un bain chaud. 'Je suis aimée, enveloppée, sacrée.' Sors sans rincer, sèche au tapotement." },
  { title:"Tea spell de clarté", ingredients:"thé menthe/camomille, miel", steps:"Énonce ta question pendant que l'eau bout. Verse en spirale. Remue 7 fois avec le miel. Bois en silence." },
];

const WITCH_TIPS = [
  "Lundi est le jour de la Lune — rêves, intuition, eau de lune.",
  "Mardi (Mars) — courage, action, libérer la colère.",
  "Mercredi (Mercure) — communication, écriture, voyage.",
  "Jeudi (Jupiter) — abondance, chance, prospérité.",
  "Vendredi (Vénus) — amour, beauté, art, sensualité.",
  "Samedi (Saturne) — protection, structure, banishing.",
  "Dimanche (Soleil) — succès, vitalité, créativité.",
  "Le quartz rose t'aide à t'aimer toi-même en premier.",
  "Brûle la sauge dans le sens horaire pour purifier.",
  "Une bougie blanche remplace n'importe quelle couleur.",
  "Intentions en lune croissante, lâcher-prise en décroissante.",
  "Améthyste sous l'oreiller = sommeil protégé.",
  "Le sel absorbe les énergies — change-le chaque pleine lune.",
  "11:11, 22:22, 333 : des clins d'œil de l'univers.",
];

const QUOTES_MOI = [
  "Tu es ton propre chef-d'œuvre.",
  "Doucement, avec amour, comme une fleur qui s'ouvre.",
  "Ce que tu cherches te cherche aussi.",
  "Sois la fille de tes rêves — elle est fière de toi.",
  "Repose-toi, tu ne dois rien prouver aujourd'hui.",
  "L'élégance, c'est savoir ralentir.",
  "Plante des graines même quand le ciel est gris.",
];

const QUOTES_WITCH = [
  "La magie n'est pas dans les outils. Elle est en toi.",
  "Comme en haut, ainsi en bas.",
  "Tu es la sorcière que tes ancêtres ont protégée.",
  "Le silence est l'incantation la plus puissante.",
  "Là où l'attention va, l'énergie suit.",
  "Bénie sois-tu, et bénie soit ta puissance tranquille.",
];

const CRYSTALS = [
  { name:"Quartz rose", use:"amour de soi, douceur, cœur", color:"rose pâle" },
  { name:"Améthyste", use:"intuition, sommeil, protection psychique", color:"violet" },
  { name:"Citrine", use:"abondance, joie, manifestation", color:"jaune doré" },
  { name:"Obsidienne noire", use:"ancrage, ombre, protection puissante", color:"noir brillant" },
  { name:"Sélénite", use:"purifie les autres cristaux, lien lunaire", color:"blanc nacré" },
  { name:"Labradorite", use:"magie, transformation, protection", color:"gris-bleu irisé" },
  { name:"Aigue-marine", use:"communication, vérité, courage", color:"bleu pâle" },
  { name:"Pierre de lune", use:"féminin sacré, cycles, divination", color:"blanc opalescent" },
];

const HERBS = [
  { name:"Lavande", use:"paix, sommeil, amour doux" },
  { name:"Romarin", use:"mémoire, protection, purification" },
  { name:"Sauge blanche", use:"purification, sagesse" },
  { name:"Cannelle", use:"manifestation rapide, passion, abondance" },
  { name:"Basilic", use:"prospérité, protection du foyer" },
  { name:"Menthe", use:"argent, clarté, énergie" },
  { name:"Camomille", use:"calme, attraction de la chance" },
  { name:"Roses séchées", use:"amour, divination, beauté" },
];

const SHIFTING_METHODS = [
  { name:"Méthode Raven", desc:"En étoile, compte 1 à 100 avec des affirmations entre chaque chiffre." },
  { name:"Méthode Sunni", desc:"Sur le dos, visualise 9 marches vers ta DR. '+10' à chaque marche." },
  { name:"Méthode du miroir", desc:"Imagine ton reflet comme ton toi de la DR. Tends la main, traverse." },
  { name:"Méthode Julia", desc:"'Je suis [nom DR]' jusqu'à le ressentir vrai, en boucle jusqu'au sommeil." },
  { name:"Pillow Method", desc:"Script sous l'oreiller, affirmations en t'endormant." },
  { name:"Train Method", desc:"Visualise un train. Monte. Le voyage = ton sommeil. Arrivée = ta DR." },
];

const AFFIRMATIONS_DAILY = [
  "Je suis exactement là où je dois être.",
  "Mon corps est sacré, mon esprit est puissant.",
  "Tout ce qui m'est destiné me trouve.",
  "Je manifeste sans effort.",
  "Je suis l'autrice de ma réalité.",
  "Ma douceur est ma force.",
  "L'univers conspire pour mon bien.",
];

const MOON_INFLUENCE = {
  0:{name:"Nouvelle Lune",color:"noir",energy:"Plantation des graines. Pose ton intention."},
  1:{name:"Croissant Croissant",color:"argent",energy:"Premiers pas, action douce, affirmations."},
  2:{name:"Premier Quartier",color:"blanc",energy:"Décision, surmonter les obstacles."},
  3:{name:"Gibbeuse Croissante",color:"or pâle",energy:"Ajustement, raffiner l'intention."},
  4:{name:"Pleine Lune",color:"or",energy:"Apogée. Charger les cristaux, manifester, libérer."},
  5:{name:"Gibbeuse Décroissante",color:"ambre",energy:"Gratitude, partage, transmettre."},
  6:{name:"Dernier Quartier",color:"gris-bleu",energy:"Libération, lâcher-prise, pardon."},
  7:{name:"Croissant Décroissant",color:"indigo",energy:"Repos, introspection, préparer le cycle."},
};

/* ============================================================
   ✦ HELPERS
   ============================================================ */
const uid = () => Math.random().toString(36).slice(2, 9);

function moonPhase(date = new Date()) {
  const lp = 2551443;
  const newMoon = new Date(1970,0,7,20,35,0).getTime()/1000;
  const phase = ((date.getTime()/1000 - newMoon) % lp) / lp;
  const idx = Math.floor(phase*8+0.5)%8;
  const ageDays = Math.floor(phase*29.53);
  const illum = Math.round((1-Math.cos(phase*2*Math.PI))/2*100);
  return { phase, ...MOON_INFLUENCE[idx], idx, ageDays, illum };
}

function pickByDate(arr, salt="", date=new Date()) {
  const d = date.toISOString().slice(0,10)+salt;
  let h=0; for (const c of d) h=(h*31+c.charCodeAt(0))>>>0;
  return arr[h%arr.length];
}

function dayOfWeekTip() {
  const day = new Date().getDay();
  return WITCH_TIPS[day===0?6:day-1];
}

/* ============================================================
   ✦ HORLOGE LUNAIRE
   ============================================================ */
function MoonClock({ compact }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setNow(new Date()), 1000); return ()=>clearInterval(t); }, []);
  const h = now.getHours()%12, m = now.getMinutes(), s = now.getSeconds();
  const hDeg = h*30 + m*0.5, mDeg = m*6 + s*0.1, sDeg = s*6;
  const moon = moonPhase(now);
  const shadowOffset = Math.cos(moon.phase * 2 * Math.PI) * 60;
  const size = compact ? "w-32 h-32" : "w-44 h-44";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${size}`}>
        <svg viewBox="0 0 200 200" className="absolute inset-0">
          <defs>
            <radialGradient id="moonGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2"/>
            </radialGradient>
            <clipPath id="moonClip"><circle cx="100" cy="100" r="92"/></clipPath>
          </defs>
          <circle cx="100" cy="100" r="92" fill="url(#moonGrad)" stroke="var(--border)" strokeWidth="1.5"/>
          <g clipPath="url(#moonClip)"><circle cx={100+shadowOffset} cy="100" r="92" fill="var(--bg)" opacity="0.85"/></g>
          {Array.from({length:12}).map((_,i)=>{
            const a=(i*30-90)*Math.PI/180;
            return <line key={i} x1={100+Math.cos(a)*82} y1={100+Math.sin(a)*82} x2={100+Math.cos(a)*88} y2={100+Math.sin(a)*88} stroke="var(--text)" strokeWidth="1" opacity="0.6"/>;
          })}
          <g transform={`rotate(${hDeg} 100 100)`}><line x1="100" y1="100" x2="100" y2="55" stroke="var(--text)" strokeWidth="3" strokeLinecap="round"/></g>
          <g transform={`rotate(${mDeg} 100 100)`}><line x1="100" y1="100" x2="100" y2="35" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/></g>
          <g transform={`rotate(${sDeg} 100 100)`}><line x1="100" y1="100" x2="100" y2="30" stroke="var(--primary)" strokeWidth="1" strokeLinecap="round"/></g>
          <circle cx="100" cy="100" r="4" fill="var(--primary)"/>
        </svg>
      </div>
      <div className="text-center">
        <div className="font-mono text-lg" style={{color:"var(--text)"}}>
          {String(now.getHours()).padStart(2,"0")}:{String(now.getMinutes()).padStart(2,"0")}:{String(now.getSeconds()).padStart(2,"0")}
        </div>
        <div className="text-xs italic mt-1" style={{color:"var(--muted)"}}>{moon.name} · {moon.illum}%</div>
      </div>
    </div>
  );
}

/* ============================================================
   ✦ PINTEREST — embed officiel d'une épingle
   ============================================================ */
let _pinScriptLoaded = false;
function loadPinterestScript() {
  return new Promise((resolve)=>{
    if (_pinScriptLoaded && window.PinUtils) return resolve();
    const existing = document.getElementById("pinit-js");
    if (existing) { _pinScriptLoaded = true; return resolve(); }
    const s = document.createElement("script");
    s.id = "pinit-js"; s.async = true; s.defer = true;
    s.src = "https://assets.pinterest.com/js/pinit.js";
    s.setAttribute("data-pin-build", "doBuild");
    s.onload = ()=>{ _pinScriptLoaded = true; resolve(); };
    document.body.appendChild(s);
  });
}

function PinterestPin({ url, size="medium", boardCols=3, boardRows=2 }) {
  const ref = useRef(null);
  const isDirectImg = /i\.pinimg\.com|\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url||"");
  // un tableau = pinterest.com/user/board (au moins 2 segments après .com, pas /pin/)
  const isBoard = /pinterest\.[a-z.]+\/[^/]+\/[^/]+/i.test(url||"") && !/\/pin\//i.test(url||"");
  useEffect(()=>{
    if (isDirectImg || !url) return;
    let cancelled = false;
    loadPinterestScript().then(()=>{
      if (cancelled) return;
      if (window.PinUtils && window.PinUtils.build) {
        try { window.PinUtils.build(); } catch(e){}
      }
    });
    return ()=>{ cancelled = true; };
  }, [url, isDirectImg]);

  if (!url) return <div className="text-xs italic" style={{color:"var(--muted)"}}>colle un lien Pinterest ↓</div>;
  if (isDirectImg) return <img src={url} alt="" className="w-full rounded-xl object-cover" style={{border:"3px solid #fff"}}/>;
  if (isBoard) return (
    <div ref={ref} className="flex justify-center" key={url}>
      <a data-pin-do="embedBoard" data-pin-board-width="400" data-pin-scale-height={String(boardRows*200)} data-pin-scale-width={String(boardCols*40)} href={url}>tableau Pinterest</a>
    </div>
  );
  return (
    <div ref={ref} className="flex justify-center" key={url}>
      <a data-pin-do="embedPin" data-pin-width={size} href={url}>épingle Pinterest</a>
    </div>
  );
}

/* ============================================================
   ✦ WIDGETS
   ============================================================ */
// Widget flottant : déplaçable (⠿) et redimensionnable (↘) dans la zone de la section
function Widget({ widget, onUpdate, onDelete }) {
  const Icon = { gif:ImageIcon, image:ImageIcon, quote:Quote, sticky:StickyNote, playlist:Music, clock:Clock, pinterest:ImageIcon }[widget.type] || Sparkles;
  const ref = useRef(null);
  const drag = useRef(null);

  const startMove = (e) => {
    e.preventDefault();
    const parent = ref.current.parentElement.getBoundingClientRect();
    drag.current = { kind:"move", px:e.clientX, py:e.clientY, x:widget.x||4, y:widget.y||4, pw:parent.width, ph:parent.height };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
  };
  const startResize = (e) => {
    e.preventDefault(); e.stopPropagation();
    const parent = ref.current.parentElement.getBoundingClientRect();
    drag.current = { kind:"resize", px:e.clientX, w:widget.w||24, pw:parent.width };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
  };
  const onMove = (e) => {
    const d = drag.current; if(!d) return;
    if (d.kind==="move") {
      const dx=(e.clientX-d.px)/d.pw*100, dy=(e.clientY-d.py)/d.ph*100;
      onUpdate({ ...widget, x: Math.max(0,Math.min(88,d.x+dx)), y: Math.max(0,Math.min(95,d.y+dy)) });
    } else {
      const dx=(e.clientX-d.px)/d.pw*100;
      onUpdate({ ...widget, w: Math.max(14,Math.min(80,d.w+dx)) });
    }
  };
  const onUp = () => { drag.current=null; window.removeEventListener("pointermove",onMove); window.removeEventListener("pointerup",onUp); };

  return (
    <div ref={ref} className="absolute group pointer-events-auto" style={{ left:`${widget.x||4}%`, top:`${widget.y||4}%`, width:`${widget.w||24}%`, minWidth:"150px", zIndex:2 }}>
      <div className="relative rounded-2xl p-4 backdrop-blur-md" style={{ background:"var(--surface)", border:"1px solid var(--border)", boxShadow:`0 8px 32px rgba(var(--glow),0.12)` }}>
        {/* poignée + suppr */}
        <div className="absolute -top-3 -left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition z-10">
          <button onPointerDown={startMove} className="p-1.5 rounded-full cursor-move" style={{background:"var(--primary)", color:"var(--bg)"}}><GripVertical size={12}/></button>
          <button onClick={onDelete} className="p-1.5 rounded-full" style={{background:"var(--surface2)", color:"var(--text)", border:"1px solid var(--border)"}}><X size={12}/></button>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}><Icon size={11}/> {widget.type}</div>

        {widget.type==="clock" && <MoonClock compact/>}
        {widget.type==="quote" && (
          <textarea value={widget.content} onChange={e=>onUpdate({...widget, content:e.target.value})} placeholder="Ta citation..."
            className="w-full bg-transparent outline-none italic text-lg resize-none" style={{color:"var(--text)", fontFamily:"var(--font-display)"}} rows={3}/>
        )}
        {widget.type==="sticky" && (
          <textarea value={widget.content} onChange={e=>onUpdate({...widget, content:e.target.value})} placeholder="Note rapide..." rows={4}
            className="w-full bg-transparent outline-none resize-none" style={{color:"var(--text)"}}/>)}
        {(widget.type==="gif"||widget.type==="image") && (<>
          {widget.content ? <img src={widget.content} alt="" className="w-full rounded-xl object-cover" style={{border:"3px solid #fff"}}/> :
            <div className="aspect-video rounded-xl flex items-center justify-center text-xs" style={{background:"rgba(255,255,255,0.06)", color:"var(--muted)"}}>colle une URL ou choisis ↓</div>}
          <input value={widget.content||""} onChange={e=>onUpdate({...widget, content:e.target.value})} placeholder={widget.type==="gif"?"URL du gif":"URL de l'image"}
            className="mt-2 w-full bg-transparent text-xs outline-none border-b py-1" style={{borderColor:"var(--border)", color:"var(--text)"}}/>
          {widget.type==="image" && (
            <label className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] cursor-pointer" style={{background:"var(--primary)", color:"var(--bg)"}}>
              🖼️ depuis ma galerie
              <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
                const f=e.target.files?.[0]; if(!f) return;
                const r=new FileReader();
                r.onload=()=>{ const img=new Image(); img.onload=()=>{ const max=1000; let{width:w,height:h}=img; if(w>max||h>max){const s=max/Math.max(w,h);w=Math.round(w*s);h=Math.round(h*s);} const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h); onUpdate({...widget, content:c.toDataURL("image/jpeg",0.8)}); }; img.onerror=()=>onUpdate({...widget, content:r.result}); img.src=r.result; };
                r.readAsDataURL(f); e.target.value="";
              }}/>
            </label>
          )}</>)}
        {widget.type==="playlist" && (<>
          {widget.content?.includes("spotify")
            ? <VinylPlayer link={widget.content} label="ma playlist"/>
            : <div className="text-xs italic" style={{color:"var(--muted)"}}>{widget.content ? <a href={widget.content} target="_blank" rel="noreferrer" className="underline">Ouvrir le lien</a> : "Colle un lien Spotify ↓"}</div>}
          <input value={widget.content||""} onChange={e=>onUpdate({...widget, content:e.target.value})} placeholder="lien Spotify / SoundCloud"
            className="mt-2 w-full bg-transparent text-xs outline-none border-b py-1" style={{borderColor:"var(--border)", color:"var(--text)"}}/></>)}
        {widget.type==="pinterest" && (<>
          <PinterestPin url={widget.content}/>
          <input value={widget.content||""} onChange={e=>onUpdate({...widget, content:e.target.value})} placeholder="lien épingle Pinterest"
            className="mt-2 w-full bg-transparent text-xs outline-none border-b py-1" style={{borderColor:"var(--border)", color:"var(--text)"}}/>
          <p className="text-[9px] italic mt-1" style={{color:"var(--muted)"}}>colle le lien d'une épingle (pinterest.com/pin/...) ou l'adresse d'image</p></>)}

        <button onPointerDown={startResize} className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize" style={{background:"var(--accent)", border:"1px solid var(--bg)"}}/>
      </div>
    </div>
  );
}

/* ============================================================
   ✦ TÂCHES
   ============================================================ */
function TaskList({ scope, tasks, setTasks, soft=true }) {
  const [text, setText] = useState("");
  const list = tasks.filter(t=>t.scope===scope);
  const add = () => { if(!text.trim()) return; setTasks([...tasks,{id:uid(),scope,text:text.trim(),done:false,created:Date.now()}]); setText(""); };
  const toggle = id => setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done,justDone:!t.done}:t));
  const remove = id => setTasks(tasks.filter(t=>t.id!==id));
  const reschedule = id => setTasks(tasks.map(t=>t.id===id?{...t,created:Date.now()}:t));
  const ageDays = (t) => t.created ? (Date.now()-t.created)/86400000 : 0;
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="+ ajouter une tâche..."
          className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        <button onClick={add} className="px-3 rounded-lg transition hover:scale-105" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={16}/></button>
      </div>
      <ul className="space-y-1.5">
        {list.map(t=>{
          const cursed = !t.done && ageDays(t) >= 3;
          return (
          <li key={t.id} className="group flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative overflow-hidden" style={{background:"var(--surface)", border:cursed?"1px solid rgba(150,140,180,0.5)":"1px solid var(--border)"}}>
            {cursed && <span className="absolute top-0 right-0 text-sm opacity-40 pointer-events-none select-none" title="tâche ensorcelée">🕸️</span>}
            <button onClick={()=>toggle(t.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${t.justDone?"animate-ping-once":""}`}
              style={{borderColor:"var(--primary)", background:t.done?"var(--primary)":"transparent"}}>{t.done && <Check size={12} style={{color:"var(--bg)"}}/>}</button>
            <span className={`flex-1 text-sm transition ${t.done?"line-through opacity-50":""}`} style={{color:"var(--text)", filter:cursed?"blur(0.5px) grayscale(0.4)":"none", opacity:cursed?0.7:1}}>{t.text}{cursed && <em className="block text-[10px] not-italic" style={{color:"#9a8ab0"}}>✦ ensorcelée depuis {Math.floor(ageDays(t))}j — brise le sort !</em>}</span>
            {cursed && <button onClick={()=>reschedule(t.id)} title="reprogrammer (briser le sort)" className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--surface2)", color:"var(--accent)"}}>↻</button>}
            <button onClick={()=>remove(t.id)} className="opacity-0 group-hover:opacity-100 transition"><X size={14} style={{color:"var(--muted)"}}/></button>
          </li>
        );})}
        {list.length===0 && <li className="text-xs italic px-3 py-4 text-center" style={{color:"var(--muted)"}}>{soft?"Vide... Quelle douceur t'attend ?":"Rien encore. Pose ta première intention."}</li>}
      </ul>
    </div>
  );
}

/* ============================================================
   ✦ JOURNAL — VERROU PIN
   ============================================================ */
function JournalLock({ children, pin, setPin }) {
  const [unlocked, setUnlocked] = useState(false);
  const [entered, setEntered] = useState("");
  const [shake, setShake] = useState(false);
  const [settingNew, setSettingNew] = useState(!pin);
  const submit = () => {
    if (settingNew) { if (entered.length===4){ setPin(entered); setSettingNew(false); setEntered("");} return; }
    if (entered===pin){ setUnlocked(true); setEntered("");} else { setShake(true); setTimeout(()=>setShake(false),500); setEntered(""); }
  };
  if (unlocked) return (
    <div>
      <button onClick={()=>setUnlocked(false)} className="mb-4 flex items-center gap-2 text-xs" style={{color:"var(--muted)"}}><Lock size={12}/> verrouiller à nouveau</button>
      {children}
    </div>
  );
  return (
    <div className={`max-w-sm mx-auto mt-12 ${shake?"animate-shake":""}`}>
      <div className="rounded-3xl p-8 text-center backdrop-blur-lg" style={{background:"var(--surface)", border:"1px solid var(--border)", boxShadow:`0 20px 60px rgba(var(--glow),0.15)`}}>
        <div className="inline-block p-4 rounded-full mb-4" style={{background:"rgba(var(--glow),0.12)"}}><KeyRound size={28} style={{color:"var(--primary)"}}/></div>
        <h3 className="text-xl mb-1" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>{settingNew?"Créer ton code":"Journal Scellé"}</h3>
        <p className="text-xs mb-6" style={{color:"var(--muted)"}}>{settingNew?"Choisis un code à 4 chiffres":"Saisis ton code à 4 chiffres"}</p>
        <div className="flex justify-center gap-3 mb-6">
          {[0,1,2,3].map(i=>(
            <div key={i} className="w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-mono transition-all"
              style={{border:`2px solid ${entered.length>i?"var(--primary)":"var(--border)"}`, background:entered.length>i?"rgba(var(--glow),0.1)":"transparent", color:"var(--text)"}}>{entered[i]?"●":""}</div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} onClick={()=>entered.length<4&&setEntered(entered+n)} className="py-3 rounded-xl text-lg transition hover:scale-95"
              style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>{n}</button>
          ))}
          <button onClick={()=>setEntered(entered.slice(0,-1))} className="py-3 rounded-xl transition hover:scale-95" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)"}}>←</button>
          <button onClick={()=>entered.length<4&&setEntered(entered+"0")} className="py-3 rounded-xl text-lg transition hover:scale-95" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>0</button>
          <button onClick={submit} disabled={entered.length!==4} className="py-3 rounded-xl transition hover:scale-95 disabled:opacity-30" style={{background:"var(--primary)", color:"var(--bg)"}}><Check size={18} className="mx-auto"/></button>
        </div>
        {!settingNew && pin && <button onClick={()=>{setSettingNew(true); setEntered("");}} className="mt-4 text-xs underline" style={{color:"var(--muted)"}}>changer le code</button>}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ JOURNAL SCRAPBOOK — carnet avec blocs (image 1)
   ============================================================ */
const STICKERS = ["✦","🌸","🦋","💗","⭐","🌙","🍃","☁️","🎀","💫","🌷","🤍","✨","🌿","💐"];

const HEALING_QUESTIONS = [
  "Quelle partie de toi as-tu peur de montrer aux autres, et pourquoi ?",
  "Qu'est-ce que tu te reproches encore, et que pourrais-tu enfin te pardonner ?",
  "De quoi as-tu vraiment besoin en ce moment, que tu n'oses pas demander ?",
  "Quelle émotion évites-tu de ressentir, et que cherche-t-elle à te dire ?",
  "Quand t'es-tu sentie pleinement toi-même pour la dernière fois ?",
  "Quelle croyance sur toi-même as-tu héritée, qui n'est peut-être pas vraie ?",
  "À qui ou à quoi as-tu du mal à dire non, et pourquoi ?",
  "Qu'est-ce qui te ferait te sentir en sécurité, là, maintenant ?",
  "Quel rêve as-tu mis de côté par peur du regard des autres ?",
  "Comment parlerais-tu à ton enfant intérieur aujourd'hui ?",
  "Qu'est-ce que tu fais pour les autres mais jamais pour toi ?",
  "Quelle est la chose que tu attends des autres, et que tu pourrais t'offrir toi-même ?",
  "De quoi es-tu fière cette semaine, même quelque chose de tout petit ?",
  "Quelle peur t'empêche d'avancer, et qu'y a-t-il derrière elle ?",
];

/* ============================================================
   ✦ RICHNOTE — note avec formatage par sélection (taille, couleur, gras...)
   ============================================================ */
const NOTE_PAPERS = {
  white:   { name:"Blanc",     bg:"#fdfcf8", ink:"#2a2a2a", lines:"rgba(120,120,150,0.18)" },
  cream:   { name:"Crème",     bg:"#f5ecd8", ink:"#4a3a28", lines:"rgba(150,120,80,0.2)" },
  yellow:  { name:"Jaune",     bg:"#fdf3c0", ink:"#4a3a10", lines:"rgba(150,130,60,0.25)" },
  pink:    { name:"Rose",      bg:"#fbe0ec", ink:"#7a2a4a", lines:"rgba(180,100,140,0.2)" },
  black:   { name:"Noir",      bg:"#1a1a1e", ink:"#f0ece0", lines:"rgba(200,200,220,0.12)" },
  night:   { name:"Nuit",      bg:"linear-gradient(180deg,#16162e,#0d0d20)", ink:"#d8d8f5", lines:"rgba(160,160,220,0.15)" },
  kraft:   { name:"Kraft",     bg:"#c9a878", ink:"#3a2a18", lines:"rgba(80,60,40,0.25)" },
  manuscript:{ name:"Manuscrit",bg:"#e8dcc0", ink:"#3a2818", lines:"rgba(120,90,50,0.3)" },
  torn:    { name:"Déchiré",   bg:"#f0e8d8", ink:"#3a3228", lines:"rgba(120,110,90,0.2)" },
  grid:    { name:"Quadrillé", bg:"#f8f8f4", ink:"#2a2a3a", lines:"rgba(120,140,180,0.2)", grid:true },
};
const NOTE_FONTS = {
  caveat:{name:"Manuscrit doux",stack:'"Caveat",cursive'},
  dancing:{name:"Élégant",stack:'"Dancing Script",cursive'},
  greatvibes:{name:"Calligraphie",stack:'"Great Vibes",cursive'},
  parisienne:{name:"Parisienne",stack:'"Parisienne",cursive'},
  sacramento:{name:"Délicat",stack:'"Sacramento",cursive'},
  pinyon:{name:"Royal",stack:'"Pinyon Script",cursive'},
  homemade:{name:"Crayon",stack:'"Homemade Apple",cursive'},
  shadows:{name:"Feutre",stack:'"Shadows Into Light",cursive'},
  amatic:{name:"Fin & haut (Coquette)",stack:'"Amatic SC",cursive'},
  playfair:{name:"Magazine",stack:'"Playfair Display",serif'},
  cormorant:{name:"Classique",stack:'"Cormorant Garamond",serif'},
  cormorantsc:{name:"Petites capitales",stack:'"Cormorant SC",serif'},
  italiana:{name:"Couture",stack:'"Italiana",serif'},
  marcellus:{name:"Antique",stack:'"Marcellus",serif'},
  fraunces:{name:"Vintage",stack:'"Fraunces",serif'},
  yeseva:{name:"Romantique",stack:'"Yeseva One",serif'},
  gloock:{name:"Éditorial",stack:'"Gloock",serif'},
  cinzel:{name:"Gravé",stack:'"Cinzel",serif'},
  cinzeldeco:{name:"Grimoire orné",stack:'"Cinzel Decorative",serif'},
  gothic:{name:"Gothique (sorcière)",stack:'"UnifrakturCook",cursive'},
  monoton:{name:"Néon Y2K",stack:'"Monoton",cursive'},
  majormono:{name:"Mono chic",stack:'"Major Mono Display",monospace'},
  spacemono:{name:"Rétro mono",stack:'"Space Mono",monospace'},
  vt:{name:"Pixel rétro",stack:'"VT323",monospace'},
  pixel:{name:"Pixel Y2K",stack:'"Pixelify Sans",sans-serif'},
  sans:{name:"Minimaliste",stack:'system-ui,sans-serif'},
};
const NOTE_COLORS = ["#2a2a2a","#7a2a4a","#2a4a7a","#2a6a4a","#8a5a10","#6a2a8a","#c0392b","#d4a017","#f0ece0","#ff9ed8"];
const NOTE_HILITES = ["#fff3a0","#ffd0e0","#c0f0d0","#c0e0ff","#e0d0ff","#ffe0c0"];

/* sticker déplaçable (image ou note) posé sur le papier */
function FloatingSticker({ st, onChange, onDelete }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const start = (e) => {
    if (st.locked) return;
    if (e.target.closest(".st-edit")) return;
    const pt = e.touches ? e.touches[0] : e;
    drag.current = { sx:pt.clientX, sy:pt.clientY, ox:st.x, oy:st.y };
    const move = (ev) => { const p=ev.touches?ev.touches[0]:ev; onChange({ ...st, x: drag.current.ox+(p.clientX-drag.current.sx), y: drag.current.oy+(p.clientY-drag.current.sy) }); };
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
  };
  useEffect(()=>{ if(st.kind==="note" && ref.current && ref.current.innerHTML!==(st.html||"")) ref.current.innerHTML = st.html||""; }, [st.id]);
  return (
    <div className="absolute group" style={{ left:st.x, top:st.y, width:st.w||(st.kind==="img"?160:180), zIndex:st.z||20 }}>
      <div onMouseDown={start} onTouchStart={start} className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition" style={{cursor:st.locked?"default":"move"}}>
        {!st.locked && <span className="text-[8px] mr-auto px-1 rounded" style={{background:"var(--primary)", color:"var(--bg)"}}>⠿</span>}
        <button onClick={()=>onChange({...st, locked:!st.locked})} title="figer" className="text-[10px] px-1 rounded" style={{background:"var(--surface2)"}}>{st.locked?"🔒":"🔓"}</button>
        <button onClick={onDelete} className="px-1 rounded" style={{background:"var(--surface2)", color:"var(--muted)"}}><X size={11}/></button>
      </div>
      {st.kind==="img"
        ? <img src={st.src} alt="" className="w-full rounded-lg" style={{boxShadow:"0 2px 10px rgba(0,0,0,0.25)", border:"3px solid #fff"}}/>
        : <div ref={ref} contentEditable suppressContentEditableWarning onInput={()=>onChange({...st, html:ref.current.innerHTML})}
            className="st-edit richnote p-2 rounded-lg outline-none text-sm" style={{ background:st.bg||"rgba(255,247,200,0.95)", color:"#3a3228", minHeight:"40px", fontFamily:'"Caveat",cursive', fontSize:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}/>}
    </div>
  );
}

function RichNote({ page, updatePage, compact=false }) {
  const ref = useRef(null);
  const savedSel = useRef(null);
  const paper = NOTE_PAPERS[page.paper||"white"] || NOTE_PAPERS.white;
  const nf = NOTE_FONTS[page.noteFont||"caveat"] || NOTE_FONTS.caveat;
  const bgImage = paper.grid
    ? `repeating-linear-gradient(${paper.lines} 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, ${paper.lines} 0 1px, transparent 1px 28px)`
    : `repeating-linear-gradient(transparent, transparent 31px, ${paper.lines} 32px)`;
  const torn = page.paper==="torn";

  useEffect(()=>{
    if (ref.current && ref.current.innerHTML !== (page.html||"")) {
      ref.current.innerHTML = page.html || (page.body ? page.body.replace(/\n/g,"<br>") : "");
    }
  }, [page.id]);

  const saveSel = () => { const s=window.getSelection(); if(s&&s.rangeCount&&ref.current?.contains(s.anchorNode)) savedSel.current=s.getRangeAt(0).cloneRange(); };
  const ensureSel = () => {
    const s = window.getSelection();
    if (s && s.rangeCount && !s.isCollapsed && ref.current?.contains(s.anchorNode)) return s;
    if (savedSel.current) { try { s.removeAllRanges(); s.addRange(savedSel.current); } catch {} }
    return window.getSelection();
  };
  const commit = () => { if(ref.current) updatePage({ html: ref.current.innerHTML }); };
  const exec = (cmd, val=null) => {
    const sel = ensureSel();
    if (!sel || sel.rangeCount===0) return;
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(cmd, false, val);
    commit();
  };
  const wrapStyle = (styleProp, value, extra={}) => {
    const sel = ensureSel();
    if (!sel || sel.rangeCount===0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const frag = range.extractContents();
    if (frag.querySelectorAll) {
      frag.querySelectorAll("[style]").forEach(el=>{ el.style[styleProp]=""; if(extra.also) el.style[extra.also]=""; if(!el.getAttribute("style")) el.removeAttribute("style"); });
    }
    const span = document.createElement("span");
    span.style[styleProp] = value;
    if (extra.also) span.style[extra.also] = extra.alsoVal;
    span.appendChild(frag);
    range.insertNode(span);
    const nr = document.createRange(); nr.selectNodeContents(span);
    sel.removeAllRanges(); sel.addRange(nr); savedSel.current = nr.cloneRange();
    commit();
  };
  const setSize = (px) => wrapStyle("fontSize", px+"px", {also:"lineHeight", alsoVal:"1.4"});
  const setFontFam = (stack) => wrapStyle("fontFamily", stack);

  // insérer un widget (image ou audio) à la position du curseur
  const insertHTML = (html) => {
    ref.current?.focus();
    const sel = window.getSelection();
    if (savedSel.current && ref.current?.contains(savedSel.current.startContainer)) { sel.removeAllRanges(); sel.addRange(savedSel.current); }
    document.execCommand("insertHTML", false, html + "<br>");
    commit();
  };
  const insertImage = async (file) => {
    const d = await fileToCompressedDataUrl(file, 1000, 0.8);
    insertHTML(`<img src="${d}" style="max-width:100%;border-radius:12px;margin:8px 0;display:block;" />`);
  };
  const insertImageUrl = () => { const u=prompt("URL de l'image :"); if(u) insertHTML(`<img src="${u}" style="max-width:100%;border-radius:12px;margin:8px 0;display:block;" />`); };
  const insertAudio = () => {
    const u = prompt("Lien audio (Spotify, SoundCloud, ou .mp3) :"); if(!u) return;
    if (u.includes("spotify.com")) {
      const e = spotifyEmbedUrl(u);
      insertHTML(`<iframe src="${e}" width="100%" height="80" frameborder="0" allow="encrypted-media" style="border-radius:10px;margin:8px 0;"></iframe>`);
    } else if (u.includes("soundcloud.com")) {
      insertHTML(`<iframe width="100%" height="120" frameborder="0" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(u)}" style="border-radius:10px;margin:8px 0;"></iframe>`);
    } else {
      insertHTML(`<audio controls src="${u}" style="width:100%;margin:8px 0;"></audio>`);
    }
  };

  const SIZES = [{l:"Titre",px:34},{l:"S-titre",px:27},{l:"Normal",px:21},{l:"Petit",px:17},{l:"Mini",px:14}];

  // stickers flottants déplaçables
  const stickers = page.stickers || [];
  const addSticker = (st) => updatePage({ stickers:[...stickers, st] });
  const updSticker = (s) => updatePage({ stickers: stickers.map(x=>x.id===s.id?s:x) });
  const delSticker = (id) => updatePage({ stickers: stickers.filter(x=>x.id!==id) });
  const addImgStickerFile = async (file) => { const src=await fileToCompressedDataUrl(file,900,0.8); addSticker({ id:uid(), kind:"img", src, x:40, y:60, w:160, z:20+stickers.length }); };
  const addImgStickerUrl = () => { const u=prompt("URL de l'image à poser :"); if(u) addSticker({ id:uid(), kind:"img", src:u, x:40, y:60, w:160, z:20+stickers.length }); };
  const addNoteSticker = () => addSticker({ id:uid(), kind:"note", html:"", x:50, y:50, w:180, z:20+stickers.length });

  return (
    <div>
      {/* barre d'outils */}
      <div className="flex flex-wrap items-center gap-2 mb-3 p-3 rounded-xl" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <p className="w-full text-[10px] italic" style={{color:"var(--muted)"}}>✦ Sélectionne du texte pour le styliser · insère images & audio où tu veux</p>

        <select defaultValue="" onMouseDown={saveSel} onChange={e=>{ const k=e.target.value; if(!k) return; if(k==="_all"){ updatePage({noteFont: page._lastPick||"caveat"}); } else { setFontFam(NOTE_FONTS[k].stack); updatePage({_lastPick:k}); } e.target.value=""; }} className="text-xs px-2 py-1.5 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)", maxWidth:"150px"}}>
          <option value="" style={{background:"var(--bg2)"}}>✦ police… (20+)</option>
          {Object.entries(NOTE_FONTS).map(([k,f])=>(<option key={k} value={k} style={{background:"var(--bg2)"}}>{f.name}</option>))}
          <option value="_all" style={{background:"var(--bg2)"}}>— toute la page —</option>
        </select>

        <div className="flex items-center gap-1">
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("bold")} className="w-7 h-7 rounded text-sm font-bold" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>B</button>
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("italic")} className="w-7 h-7 rounded text-sm italic" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>I</button>
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("underline")} className="w-7 h-7 rounded text-sm underline" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>U</button>
        </div>

        {/* alignement */}
        <div className="flex items-center gap-1">
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("justifyLeft")} className="w-7 h-7 rounded text-xs" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>⬅</button>
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("justifyCenter")} className="w-7 h-7 rounded text-xs" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>↔</button>
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("justifyRight")} className="w-7 h-7 rounded text-xs" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>➡</button>
        </div>

        <div className="flex items-center gap-1">
          {SIZES.map(s=>(
            <button key={s.px} onMouseDown={e=>e.preventDefault()} onClick={()=>setSize(s.px)} title={s.l} className="px-2 h-7 rounded text-[10px]" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>{s.l}</button>
          ))}
        </div>

        {/* couleur texte */}
        <div className="flex items-center gap-1">
          <span className="text-[9px]" style={{color:"var(--muted)"}}>A</span>
          {NOTE_COLORS.map(c=>(<button key={c} onMouseDown={e=>e.preventDefault()} onClick={()=>exec("foreColor", c)} className="w-5 h-5 rounded" style={{background:c, border:"1px solid var(--border)"}}/>))}
          <label className="w-5 h-5 rounded cursor-pointer overflow-hidden relative" style={{border:"1px solid var(--border)"}}>
            <span className="absolute inset-0 flex items-center justify-center text-[9px]" style={{background:"conic-gradient(red,orange,yellow,green,blue,violet,red)"}}>🎨</span>
            <input type="color" onMouseDown={saveSel} onChange={e=>exec("foreColor", e.target.value)} className="opacity-0 w-full h-full cursor-pointer"/>
          </label>
        </div>

        {/* surlignage */}
        <div className="flex items-center gap-1">
          <span className="text-[9px]" style={{color:"var(--muted)"}}>🖊</span>
          {NOTE_HILITES.map(c=>(<button key={c} onMouseDown={e=>e.preventDefault()} onClick={()=>exec("hiliteColor", c)} className="w-5 h-5 rounded" style={{background:c, border:"1px solid var(--border)"}}/>))}
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>exec("hiliteColor","transparent")} title="retirer surlignage" className="w-5 h-5 rounded text-[9px] flex items-center justify-center" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--muted)"}}>⊘</button>
        </div>

        {/* widgets insérables */}
        <div className="flex items-center gap-1">
          <label onMouseDown={saveSel} className="px-2 h-7 rounded text-[10px] cursor-pointer flex items-center" style={{background:"var(--primary)", color:"var(--bg)"}} title="image depuis galerie">🖼️
            <input type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) insertImage(f); e.target.value=""; }}/>
          </label>
          <button onMouseDown={saveSel} onClick={insertImageUrl} className="px-2 h-7 rounded text-[10px]" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}} title="image par URL">🔗</button>
          <button onMouseDown={saveSel} onClick={insertAudio} className="px-2 h-7 rounded text-[10px]" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}} title="audio / voice claim">🎵</button>
        </div>

        {/* éléments flottants déplaçables */}
        <div className="flex items-center gap-1">
          <span className="text-[9px]" style={{color:"var(--muted)"}}>flottant:</span>
          <label className="px-2 h-7 rounded text-[10px] cursor-pointer flex items-center" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}} title="image déplaçable (galerie)">🖼️↗
            <input type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) addImgStickerFile(f); e.target.value=""; }}/>
          </label>
          <button onClick={addImgStickerUrl} className="px-2 h-7 rounded text-[10px]" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}} title="image déplaçable (URL)">🔗↗</button>
          <button onClick={addNoteSticker} className="px-2 h-7 rounded text-[10px]" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}} title="note déplaçable">📝↗</button>
        </div>

        {/* papier / fond de bloc (toujours visible) */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[9px]" style={{color:"var(--muted)"}}>📄</span>
          {Object.entries(NOTE_PAPERS).map(([k,p])=>(
            <button key={k} onClick={()=>updatePage({paper:k})} title={p.name} className="w-5 h-5 rounded" style={{background:p.bg, border:`2px solid ${(page.paper||(compact?"none":"white"))===k?"var(--primary)":"var(--border)"}`}}/>
          ))}
          {compact && <button onClick={()=>updatePage({paper:"none"})} title="transparent" className="w-5 h-5 rounded text-[8px] flex items-center justify-center" style={{background:"var(--surface2)", border:`2px solid ${(page.paper||"none")==="none"?"var(--primary)":"var(--border)"}`, color:"var(--muted)"}}>⊘</button>}
        </div>
      </div>

      {/* la feuille éditable */}
      {compact ? (
        (page.paper && page.paper!=="none") ? (
          <div className="rounded-2xl p-5 relative" style={{
            background: paper.bg, backgroundImage:bgImage,
            border:"1px solid var(--border)", minHeight:"260px",
            clipPath: torn ? "polygon(0 1%, 4% 0, 8% 1.5%, 14% 0.3%, 20% 1.8%, 27% 0.4%, 34% 1.6%, 42% 0.3%, 50% 1.7%, 58% 0.4%, 66% 1.6%, 74% 0.3%, 82% 1.7%, 90% 0.4%, 96% 1.6%, 100% 0.5%, 100% 99%, 95% 100%, 88% 98.6%, 80% 100%, 72% 98.7%, 64% 100%, 56% 98.6%, 48% 100%, 40% 98.7%, 32% 100%, 24% 98.6%, 16% 100%, 8% 98.7%, 3% 100%, 0 99%)" : "none"
          }}>
            <div ref={ref} contentEditable suppressContentEditableWarning
              onInput={commit} onKeyUp={saveSel} onMouseUp={saveSel}
              data-ph="Écris ici... détails, anecdotes, dialogues, intentions..."
              className="richnote w-full bg-transparent outline-none"
              style={{ minHeight:"230px", lineHeight:"1.6", fontFamily:nf.stack, fontSize:"17px", color:paper.ink }}/>
            {stickers.map(st=>(<FloatingSticker key={st.id} st={st} onChange={updSticker} onDelete={()=>delSticker(st.id)}/>))}
          </div>
        ) : (
          <div className="relative">
            <div ref={ref} contentEditable suppressContentEditableWarning
              onInput={commit} onKeyUp={saveSel} onMouseUp={saveSel}
              data-ph="Écris ici... détails, anecdotes, dialogues, intentions..."
              className="richnote w-full bg-transparent outline-none"
              style={{ minHeight:"300px", lineHeight:"1.6", fontFamily:nf.stack, fontSize:"17px", color:"var(--text)" }}/>
            {stickers.map(st=>(<FloatingSticker key={st.id} st={st} onChange={updSticker} onDelete={()=>delSticker(st.id)}/>))}
          </div>
        )
      ) : (
      <div className="rounded-2xl p-8 relative" style={{
        background: paper.bg, backgroundImage:bgImage,
        border:"1px solid var(--border)", boxShadow:"inset 0 0 60px rgba(0,0,0,0.06)", minHeight:"clamp(420px,60vh,640px)",
        clipPath: torn ? "polygon(0 1%, 4% 0, 8% 1.5%, 14% 0.3%, 20% 1.8%, 27% 0.4%, 34% 1.6%, 42% 0.3%, 50% 1.7%, 58% 0.4%, 66% 1.6%, 74% 0.3%, 82% 1.7%, 90% 0.4%, 96% 1.6%, 100% 0.5%, 100% 99%, 95% 100%, 88% 98.6%, 80% 100%, 72% 98.7%, 64% 100%, 56% 98.6%, 48% 100%, 40% 98.7%, 32% 100%, 24% 98.6%, 16% 100%, 8% 98.7%, 3% 100%, 0 99%)" : "none"
      }}>
        <div ref={ref} contentEditable suppressContentEditableWarning
          onInput={commit} onKeyUp={saveSel} onMouseUp={saveSel}
          data-ph="Cher journal,&#10;Aujourd'hui..."
          className="richnote w-full bg-transparent outline-none"
          style={{ minHeight:"400px", lineHeight:"1.5", fontFamily:nf.stack, fontSize:"21px", color:paper.ink }}/>
      </div>
      )}
    </div>
  );
}

// helper global : compresse un fichier image en dataURL
function fileToCompressedDataUrl(file, max=1000, quality=0.8) {
  return new Promise((resolve)=>{
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        let {width:w, height:h} = img;
        if (w>max || h>max) { const s=max/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s); }
        const c = document.createElement("canvas"); c.width=w; c.height=h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(r.result);
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
/* ============================================================
   ✦ VINYL PLAYER — tourne-disque + lecteur Spotify
   ============================================================ */
function spotifyEmbedUrl(link) {
  if (!link) return null;
  if (!link.includes("spotify")) return null;
  return link
    .replace("/intl-fr/","/").replace("/intl-en/","/")
    .replace("/track/","/embed/track/")
    .replace("/playlist/","/embed/playlist/")
    .replace("/album/","/embed/album/")
    .replace("/artist/","/embed/artist/")
    .split("?")[0];
}
function VinylPlayer({ link, cover, label="ma playlist", onChangeLink }) {
  const [spinning, setSpinning] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(link||"");
  const embed = spotifyEmbedUrl(link);

  // si pas de lien (et qu'on peut en saisir un) → champ de saisie
  if ((!embed || editing) && onChangeLink) {
    return (
      <div className="rounded-2xl p-4 my-4" style={{background:"var(--surface)", border:"1px dashed var(--accent)"}}>
        <p className="text-xs mb-2" style={{color:"var(--accent)", fontFamily:'"Dancing Script",cursive', fontSize:"16px"}}>🎶 Ajoute ta playlist Spotify</p>
        <div className="flex gap-2">
          <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="colle le lien Spotify (playlist, album, titre)..."
            className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <button onClick={()=>{ onChangeLink(draft.trim()); setEditing(false); }} disabled={!draft.trim()} className="px-3 rounded-lg text-sm disabled:opacity-40" style={{background:"var(--primary)", color:"var(--bg)"}}>✦</button>
          {editing && <button onClick={()=>{ setDraft(link||""); setEditing(false); }} className="px-3 rounded-lg text-xs" style={{background:"var(--surface2)", color:"var(--text)"}}>annuler</button>}
        </div>
        <p className="text-[10px] italic mt-2" style={{color:"var(--muted)"}}>Ensuite, ton vinyle apparaîtra et tournera avec ta musique 🪩</p>
      </div>
    );
  }
  if (!embed) return null;

  return (
    <div className="rounded-2xl p-4 my-4" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
      <div className="flex items-center gap-4">
        {/* platine vinyle */}
        <button onClick={()=>{ setSpinning(s=>!s); setShowPlayer(true); }} className="relative flex-shrink-0" style={{width:"90px", height:"90px"}} title={spinning?"pause visuelle":"faire tourner"}>
          <div className="absolute inset-0 rounded-full" style={{
            background: cover
              ? `radial-gradient(circle at 50% 50%, transparent 26%, rgba(0,0,0,0.15) 27%), url(${cover}) center/cover`
              : "repeating-radial-gradient(circle at 50% 50%, #1a1a1e 0px, #1a1a1e 2px, #2a2a30 3px, #1a1a1e 4px)",
            boxShadow:"0 4px 14px rgba(0,0,0,0.4)",
            animation: spinning ? "spin 3s linear infinite" : "none"
          }}>
            <div className="absolute rounded-full" style={{inset:"34%", background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <div className="rounded-full" style={{width:"6px", height:"6px", background:"var(--bg)"}}/>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{background:"linear-gradient(135deg, rgba(255,255,255,0.18), transparent 50%)"}}/>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)", fontSize:"18px"}}>♫ {label}</p>
            {onChangeLink && <button onClick={()=>{ setDraft(link||""); setEditing(true); }} title="modifier la playlist" style={{color:"var(--muted)"}}>✏️</button>}
          </div>
          <p className="text-[11px] italic mb-2" style={{color:"var(--muted)"}}>{spinning?"ça tourne... 🎶":"touche le vinyle pour lancer"}</p>
          <button onClick={()=>{ setSpinning(s=>!s); setShowPlayer(true); }} className="px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>
            {spinning ? "⏸ pause" : "▶ lancer"}
          </button>
        </div>
      </div>

      {showPlayer && (
        <div className="mt-3 rounded-xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
          <iframe title="vinyl-spotify" src={embed+"?utm_source=nyx"} width="100%" height="152" frameBorder="0" allow="autoplay; encrypted-media" loading="lazy"/>
        </div>
      )}
      {!showPlayer && <p className="text-[10px] italic mt-2" style={{color:"var(--muted)"}}>💡 le lecteur Spotify s'ouvre au clic (pause, suivant, volume dedans)</p>}
    </div>
  );
}

// petit champ image : URL + bouton galerie
function ImgPicker({ value, onChange, placeholder="URL image", small=false }) {
  return (
    <div className="flex gap-1 items-center">
      <input value={value && value.startsWith("data:") ? "" : (value||"")} onChange={e=>onChange(e.target.value)}
        placeholder={value && value.startsWith("data:") ? "✓ image galerie" : placeholder}
        className={`flex-1 bg-transparent outline-none ${small?"text-[9px]":"text-xs"}`} style={{color:"var(--text)", borderBottom:"1px solid var(--border)", padding:"2px 0"}}/>
      <label className={`cursor-pointer rounded-full flex-shrink-0 flex items-center justify-center ${small?"px-1.5 py-0.5 text-[9px]":"px-2 py-1 text-[10px]"}`} style={{background:"var(--primary)", color:"var(--bg)"}}>
        🖼️
        <input type="file" accept="image/*" className="hidden" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await fileToCompressedDataUrl(f); onChange(d); e.target.value=""; }}/>
      </label>
    </div>
  );
}

function ScrapbookEditor({ pages, setPages }) {
  const [activePage, setActivePage] = useState(pages[0]?.id || null);
  const [choosing, setChoosing] = useState(false); // affiche le choix de format
  const current = pages.find(p=>p.id===activePage);
  const healingQ = pickByDate(HEALING_QUESTIONS, "heal");

  const newPage = (format) => {
    const p = { id:uid(), format, title:"Nouvelle page", date:new Date().toISOString().slice(0,10), blocks:[], body:"" };
    setPages([p, ...pages]); setActivePage(p.id); setChoosing(false);
  };
  const updatePage = (patch) => setPages(pages.map(p=>p.id===activePage?{...p,...patch}:p));
  const delPage = (id) => { const np=pages.filter(p=>p.id!==id); setPages(np); if(activePage===id) setActivePage(np[0]?.id||null); };

  const addBlock = (type) => {
    const base = { id:uid(), type, x: 8+Math.random()*8, y: 8+Math.random()*8, w: type==="title"?70:46, rot: (Math.random()*6-3) };
    const content = type==="title" ? "Un titre joli ♡" : type==="text" ? "Écris ici ton souvenir..." : "";
    updatePage({ blocks:[...current.blocks, {...base, content}] });
  };
  const updateBlock = (bid, patch) => updatePage({ blocks: current.blocks.map(b=>b.id===bid?{...b,...patch}:b) });
  const delBlock = (bid) => updatePage({ blocks: current.blocks.filter(b=>b.id!==bid) });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>✦ Mon journal intime ✦</h3>
        <button onClick={()=>setChoosing(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/> Nouvelle page</button>
      </div>

      {/* Question de guérison du jour */}
      <div className="rounded-2xl p-4 mb-5" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>🪞 Question de guérison du jour</p>
        <p className="text-lg mb-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}>{healingQ}</p>
        <button onClick={()=>{ const p={id:uid(), format:"note", title:"Réflexion", date:new Date().toISOString().slice(0,10), blocks:[], body:`🪞 ${healingQ}\n\n`}; setPages([p,...pages]); setActivePage(p.id); }}
          className="text-xs px-3 py-1.5 rounded-full" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ écrire ma réponse</button>
      </div>

      {/* MODALE choix de format */}
      {choosing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)"}} onClick={()=>setChoosing(false)}>
          <div onClick={e=>e.stopPropagation()} className="rounded-3xl p-8 max-w-lg w-full animate-fade-up" style={{background:"var(--bg2)", border:"1px solid var(--primary)"}}>
            <h3 className="text-2xl mb-1 text-center" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>Quel format de page ?</h3>
            <p className="text-xs italic text-center mb-6" style={{color:"var(--muted)"}}>Choisis l'ambiance de ta nouvelle page</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={()=>newPage("scrapbook")} className="rounded-2xl p-5 text-center transition hover:scale-105" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-lg" style={{fontFamily:'"Dancing Script", cursive', color:"var(--primary)"}}>Format scrapbook</p>
                <p className="text-xs mt-1" style={{color:"var(--muted)"}}>Collage libre : images, gifs, musique, stickers, textes déplaçables</p>
              </button>
              <button onClick={()=>newPage("note")} className="rounded-2xl p-5 text-center transition hover:scale-105" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <div className="text-4xl mb-2">📝</div>
                <p className="text-lg" style={{fontFamily:'"Dancing Script", cursive', color:"var(--primary)"}}>Format note</p>
                <p className="text-xs mt-1" style={{color:"var(--muted)"}}>Page d'écriture simple, comme un vrai journal intime</p>
              </button>
            </div>
            <button onClick={()=>setChoosing(false)} className="mt-5 w-full py-2 rounded-lg text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)"}}>Annuler</button>
          </div>
        </div>
      )}

      {/* sélecteur de pages */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {pages.map(p=>(
          <button key={p.id} onClick={()=>setActivePage(p.id)} className="flex-shrink-0 px-3 py-2 rounded-xl text-xs transition"
            style={{background:activePage===p.id?"var(--primary)":"var(--surface)", color:activePage===p.id?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>
            {p.format==="note"?"📝":"🖼️"} {p.title} <span className="opacity-60">· {p.date}</span>
          </button>
        ))}
        {pages.length===0 && <p className="text-xs italic" style={{color:"var(--muted)"}}>Crée ta première page ✦</p>}
      </div>

      {current && (<>
        {/* barre d'outils */}
        <div className="flex flex-wrap items-center gap-2 mb-3 p-3 rounded-xl" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <input value={current.title} onChange={e=>updatePage({title:e.target.value})} className="bg-transparent outline-none text-lg flex-1 min-w-[120px]"
            style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}/>
          <input type="date" value={current.date} onChange={e=>updatePage({date:e.target.value})} className="bg-transparent outline-none text-xs" style={{color:"var(--muted)"}}/>
          {current.format!=="note" && (
            <div className="flex gap-1">
              {[{t:"title",i:TypeIcon,l:"Titre"},{t:"text",i:AlignLeft,l:"Texte"},{t:"image",i:ImageIcon,l:"Image"},{t:"gif",i:Sparkles,l:"Gif"},{t:"pinterest",i:ImageIcon,l:"📌"},{t:"music",i:Music,l:"Musique"},{t:"divider",i:Sparkle,l:"Séparateur"},{t:"sticker",i:Star,l:"Sticker"}].map(b=>{const I=b.i;return(
                <button key={b.t} onClick={()=>addBlock(b.t)} title={b.l} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition hover:scale-105"
                  style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}><Plus size={10}/><I size={12}/></button>
              )})}
            </div>
          )}
          <button onClick={()=>delPage(current.id)} className="px-2 py-1.5 rounded-lg text-xs" style={{color:"var(--muted)"}}><Trash2 size={12}/></button>
        </div>

        {/* FORMAT SCRAPBOOK */}
        {current.format!=="note" && (<>
          <div className="relative rounded-2xl overflow-hidden" style={{
            minHeight:"clamp(420px,60vh,640px)", background:`var(--paper)`,
            backgroundImage:`radial-gradient(rgba(120,120,120,0.18) 1px, transparent 1px)`,
            backgroundSize:"22px 22px", border:"1px solid var(--border)", boxShadow:"inset 0 0 60px rgba(0,0,0,0.06)"
          }}>
            {current.blocks.length===0 && (
              <p className="absolute inset-0 flex items-center justify-center text-sm italic" style={{color:"var(--muted)"}}>
                Page vide. Ajoute un titre, du texte, des images, des gifs, de la musique ✦
              </p>
            )}
            {current.blocks.map(b=>(<ScrapBlock key={b.id} block={b} onChange={p=>updateBlock(b.id,p)} onDelete={()=>delBlock(b.id)}/>))}
          </div>
          <p className="text-xs italic mt-2" style={{color:"var(--muted)"}}>
            Astuce : attrape ⠿ pour déplacer un bloc. Tire le coin ↘ pour redimensionner.
          </p>
        </>)}

        {/* FORMAT NOTE */}
        {current.format==="note" && (()=>{
          const paper = NOTE_PAPERS[current.paper||"white"] || NOTE_PAPERS.white;
          const addImg = () => updatePage({ images:[...(current.images||[]), ""] });
          const updImg = (i,v) => updatePage({ images:(current.images||[]).map((x,j)=>j===i?v:x) });
          const delImg = (i) => updatePage({ images:(current.images||[]).filter((_,j)=>j!==i) });
          const addFromGallery = (e) => {
            const files = Array.from(e.target.files||[]);
            if (!files.length) return;
            const compress = (file) => new Promise(res=>{
              const r = new FileReader();
              r.onload = () => {
                const img = new Image();
                img.onload = () => {
                  const max = 900; let {width:w, height:h} = img;
                  if (w>max || h>max) { const s=max/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s); }
                  const c = document.createElement("canvas"); c.width=w; c.height=h;
                  c.getContext("2d").drawImage(img,0,0,w,h);
                  res(c.toDataURL("image/jpeg", 0.78));
                };
                img.onerror = () => res(r.result);
                img.src = r.result;
              };
              r.readAsDataURL(file);
            });
            Promise.all(files.map(compress)).then(imgs=>{
              updatePage({ images:[...(current.images||[]), ...imgs] });
            });
            e.target.value="";
          };
          return (
          <div>
            <RichNote page={current} updatePage={updatePage}/>

            {/* images */}
            <div className="rounded-2xl p-4 mt-3" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              {(current.images||[]).length>0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {(current.images||[]).map((img,i)=>(
                    <div key={i} className="group relative rounded-lg overflow-hidden" style={{border:"1px solid var(--border)"}}>
                      {img ? <img src={img} alt="" className="w-full object-cover" style={{maxHeight:"160px"}}/> : <div className="p-2"><input autoFocus value={img} onChange={e=>updImg(i,e.target.value)} placeholder="coller URL image..." className="w-full text-[11px] bg-transparent outline-none" style={{color:"var(--text)"}}/></div>}
                      <button onClick={()=>delImg(i)} className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100" style={{background:"rgba(0,0,0,0.6)", color:"#fff"}}><X size={12}/></button>
                      {img && !img.startsWith("data:") && <input value={img} onChange={e=>updImg(i,e.target.value)} className="w-full text-[9px] px-1 py-0.5 outline-none" style={{background:"var(--surface2)", color:"var(--text)"}}/>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <button onClick={addImg} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--surface2)", color:"var(--text)", border:"1px dashed var(--border)"}}>
                  🔗 par URL
                </button>
                <label className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs cursor-pointer" style={{background:"var(--primary)", color:"var(--bg)"}}>
                  🖼️ depuis ma galerie
                  <input type="file" accept="image/*" multiple onChange={addFromGallery} className="hidden"/>
                </label>
              </div>
            </div>
          </div>
          );
        })()}
      </>)}
    </div>
  );
}

function ScrapBlock({ block, onChange, onDelete }) {
  const ref = useRef(null);
  const drag = useRef(null);

  const onPointerDownMove = (e) => {
    e.preventDefault();
    const parent = ref.current.parentElement.getBoundingClientRect();
    drag.current = { kind:"move", px:e.clientX, py:e.clientY, x:block.x, y:block.y, pw:parent.width, ph:parent.height };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const onPointerDownResize = (e) => {
    e.preventDefault(); e.stopPropagation();
    const parent = ref.current.parentElement.getBoundingClientRect();
    drag.current = { kind:"resize", px:e.clientX, w:block.w, pw:parent.width };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const onMove = (e) => {
    const d = drag.current; if(!d) return;
    if (d.kind==="move") {
      const dx=(e.clientX-d.px)/d.pw*100, dy=(e.clientY-d.py)/d.ph*100;
      onChange({ x: Math.max(0,Math.min(92,d.x+dx)), y: Math.max(0,Math.min(95,d.y+dy)) });
    } else {
      const dx=(e.clientX-d.px)/d.pw*100;
      onChange({ w: Math.max(15,Math.min(95,d.w+dx)) });
    }
  };
  const onUp = () => { drag.current=null; window.removeEventListener("pointermove",onMove); window.removeEventListener("pointerup",onUp); };

  return (
    <div ref={ref} className="absolute group" style={{ left:`${block.x}%`, top:`${block.y}%`, width:`${block.w}%`, transform:`rotate(${block.rot||0}deg)` }}>
      <div className="relative rounded-lg" style={{ background: block.type==="text"||block.type==="title" ? "transparent" : "rgba(255,255,255,0.05)" }}>
        {/* handle + delete */}
        <div className="absolute -top-3 -left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition z-10">
          <button onPointerDown={onPointerDownMove} className="p-1 rounded-full cursor-move" style={{background:"var(--primary)", color:"var(--bg)"}}><GripVertical size={11}/></button>
          <button onClick={onDelete} className="p-1 rounded-full" style={{background:"var(--surface2)", color:"var(--text)", border:"1px solid var(--border)"}}><X size={11}/></button>
        </div>

        {block.type==="title" && (
          <textarea value={block.content} onChange={e=>onChange({content:e.target.value})} rows={1}
            className="w-full bg-transparent outline-none resize-none text-center" style={{fontFamily:'"Dancing Script", cursive', fontSize:"clamp(22px,4vw,40px)", color:"var(--primary)", lineHeight:1.1}}/>
        )}
        {block.type==="text" && (
          <textarea value={block.content} onChange={e=>onChange({content:e.target.value})} rows={4}
            className="w-full bg-transparent outline-none resize-none p-2" style={{fontFamily:'"Caveat", cursive', fontSize:"18px", color:"var(--ink)", lineHeight:1.4}}/>
        )}
        {(block.type==="image"||block.type==="gif") && (
          <div>
            {block.content ? <img src={block.content} alt="" className="w-full rounded-lg" style={{boxShadow:"0 4px 16px rgba(0,0,0,0.2)", border:"4px solid #fff"}}/> :
              <div className="aspect-video rounded-lg flex items-center justify-center text-xs" style={{background:"rgba(255,255,255,0.5)", border:"4px solid #fff", color:"#888"}}>colle une URL ou choisis ↓</div>}
            <input value={block.content||""} onChange={e=>onChange({content:e.target.value})} placeholder={block.type==="gif"?"URL du gif":"URL de l'image"}
              className="mt-1 w-full bg-transparent text-[10px] outline-none border-b py-0.5" style={{borderColor:"var(--border)", color:"var(--ink)"}}/>
            {block.type==="image" && (
              <label className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] cursor-pointer" style={{background:"var(--primary)", color:"var(--bg)"}}>
                🖼️ galerie
                <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
                  const f=e.target.files?.[0]; if(!f) return;
                  const r=new FileReader();
                  r.onload=()=>{ const img=new Image(); img.onload=()=>{ const max=1000; let{width:w,height:h}=img; if(w>max||h>max){const s=max/Math.max(w,h);w=Math.round(w*s);h=Math.round(h*s);} const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h); onChange({content:c.toDataURL("image/jpeg",0.8)}); }; img.onerror=()=>onChange({content:r.result}); img.src=r.result; };
                  r.readAsDataURL(f); e.target.value="";
                }}/>
              </label>
            )}
          </div>
        )}
        {block.type==="music" && (
          <div className="rounded-lg p-2" style={{background:"rgba(255,255,255,0.6)", border:"1px solid var(--border)"}}>
            {block.content?.includes("spotify") ?
              <iframe src={block.content.replace("/track/","/embed/track/").replace("/playlist/","/embed/playlist/")} width="100%" height="80" frameBorder="0" allow="encrypted-media" className="rounded"/> :
              <div className="flex items-center gap-2 text-xs" style={{color:"var(--ink)"}}><Music size={14}/>{block.content?<a href={block.content} target="_blank" rel="noreferrer" className="underline">écouter</a>:"colle un lien Spotify ↓"}</div>}
            <input value={block.content||""} onChange={e=>onChange({content:e.target.value})} placeholder="lien Spotify/SoundCloud"
              className="mt-1 w-full bg-transparent text-[10px] outline-none border-b py-0.5" style={{borderColor:"var(--border)", color:"var(--ink)"}}/>
          </div>
        )}
        {block.type==="pinterest" && (
          <div className="rounded-lg p-1" style={{background:"rgba(255,255,255,0.6)", border:"1px solid var(--border)"}}>
            <PinterestPin url={block.content}/>
            <input value={block.content||""} onChange={e=>onChange({content:e.target.value})} placeholder="lien épingle Pinterest"
              className="mt-1 w-full bg-transparent text-[10px] outline-none border-b py-0.5" style={{borderColor:"var(--border)", color:"var(--ink)"}}/>
          </div>
        )}
        {block.type==="divider" && (
          <div className="w-full text-center select-none" style={{fontSize:"20px", letterSpacing:"4px", color:"var(--accent)"}}>
            {(()=>{ const styles={knots:"⋆ ❀ ⋆ ❀ ⋆ ❀ ⋆ ❀ ⋆", stars:"✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦", barbed:"┄┅✕┄┅✕┄┅✕┄┅", ivy:"❧ ⟡ ❧ ⟡ ❧ ⟡ ❧"}; return styles[block.divStyle||"stars"]; })()}
            <div className="flex justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
              {[["knots","❀"],["stars","✦"],["barbed","✕"],["ivy","❧"]].map(([k,e])=>(
                <button key={k} onClick={()=>onChange({divStyle:k})} className="text-xs px-1.5 py-0.5 rounded" style={{background:block.divStyle===k?"var(--primary)":"var(--surface2)", color:block.divStyle===k?"var(--bg)":"var(--text)"}}>{e}</button>
              ))}
            </div>
          </div>
        )}
        {block.type==="sticker" && (
          <div className="flex flex-col items-center">
            <span style={{fontSize:"clamp(28px,6vw,54px)"}}>{block.content||"✦"}</span>
            <div className="flex flex-wrap gap-0.5 justify-center mt-1 opacity-0 group-hover:opacity-100 transition max-w-[160px]">
              {STICKERS.map(s=>(<button key={s} onClick={()=>onChange({content:s})} className="text-sm hover:scale-125 transition">{s}</button>))}
            </div>
          </div>
        )}

        {/* resize handle */}
        {block.type!=="sticker" && block.type!=="title" && (
          <button onPointerDown={onPointerDownResize} className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize"
            style={{background:"var(--accent)", border:"1px solid var(--bg)"}}/>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ CARD LIST générique
   ============================================================ */
/* ============================================================
   ✦ PASSIONS — fiche auto-remplie depuis un lien (Wikipedia)
   ============================================================ */
async function fetchFromLink(url) {
  // Wikipedia : API REST avec CORS ouvert → titre, résumé, image
  try {
    const wiki = url.match(/https?:\/\/([a-z]{2})\.(?:m\.)?wikipedia\.org\/wiki\/([^?#]+)/i);
    if (wiki) {
      const lang = wiki[1];
      const title = decodeURIComponent(wiki[2]);
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`);
      if (res.ok) {
        const d = await res.json();
        return {
          title: d.title || title.replace(/_/g," "),
          note: d.extract || "",
          image: d.thumbnail?.source || d.originalimage?.source || "",
          ok: true,
        };
      }
    }
  } catch (e) { /* CORS ou réseau */ }
  return { ok:false };
}

// Recherche par titre via API gratuites ouvertes (sans clé). Renvoie une liste de résultats.
async function searchByTitle(query, kind="all") {
  const q = encodeURIComponent(query.trim());
  if (!q) return [];
  const results = [];
  // 1) Anime/manga — Jikan (MyAnimeList)
  if (kind==="all" || kind==="anime" || kind==="manga") {
    try {
      const type = kind==="manga" ? "manga" : "anime";
      const r = await fetch(`https://api.jikan.moe/v4/${type}?q=${q}&limit=6&sfw`);
      if (r.ok) { const d = await r.json();
        (d.data||[]).forEach(a=>results.push({
          title:a.title, image:a.images?.jpg?.image_url||"",
          note:(a.synopsis||"").slice(0,300), type:type==="manga"?"manga":"anime",
          epTotal:a.episodes||a.chapters||"", source:"MyAnimeList"
        }));
      }
    } catch(e){}
  }
  // 2) Films/séries/musique — iTunes Search
  if (kind==="all" || kind==="film" || kind==="serie" || kind==="kdrama") {
    try {
      const media = "all";
      const r = await fetch(`https://itunes.apple.com/search?term=${q}&media=${media}&limit=6`);
      if (r.ok) { const d = await r.json();
        (d.results||[]).forEach(m=>{
          if(!m.trackName && !m.collectionName) return;
          results.push({
            title:m.trackName||m.collectionName,
            image:(m.artworkUrl100||"").replace("100x100","400x400"),
            note:(m.longDescription||m.shortDescription||m.collectionName||"").slice(0,300),
            type:m.kind==="feature-movie"?"film":m.kind==="tv-episode"?"série":m.primaryGenreName||"film",
            source:"iTunes"
          });
        });
      }
    } catch(e){}
  }
  // 3) Livres — OpenLibrary
  if (kind==="all" || kind==="livre") {
    try {
      const r = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=6`);
      if (r.ok) { const d = await r.json();
        (d.docs||[]).slice(0,6).forEach(b=>results.push({
          title:b.title + (b.author_name?` — ${b.author_name[0]}`:""),
          image:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`:"",
          note:b.first_sentence?(Array.isArray(b.first_sentence)?b.first_sentence[0]:b.first_sentence):"",
          type:"livre", source:"OpenLibrary"
        }));
      }
    } catch(e){}
  }
  return results.filter(r=>r.title);
}

function PassionsList({ items, setItems, onMakeDR, decor=[], roomProgress=null }) {
  const [openId, setOpenId] = useState(null);
  const [linkInput, setLinkInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [zoom, setZoom] = useState(null); // "library" | "tv" | null
  const [searchQ, setSearchQ] = useState("");
  const [searchRes, setSearchRes] = useState(null);
  const [searching, setSearching] = useState(false);
  const open = items.find(i=>i.id===openId);
  useEffect(()=>{ if(openId) window.scrollTo({top:0, behavior:"smooth"}); }, [openId]);

  const runSearch = async (kind="all") => {
    if(!searchQ.trim()) return;
    setSearching(true); setSearchRes(null);
    const r = await searchByTitle(searchQ, kind);
    setSearching(false); setSearchRes(r);
  };
  const addFromResult = (res) => {
    const it = {id:uid(), created:new Date().toISOString().slice(0,10), title:res.title, type:res.type||"", status:"à voir", rating:"", note:res.note||"", image:res.image||"", link:"", myReview:"", epTotal:res.epTotal||""};
    setItems([it, ...items]); setSearchRes(null); setSearchQ(""); setOpenId(it.id);
  };

  const addFromLink = async () => {
    if (!linkInput.trim()) return;
    setLoading(true); setMsg("");
    const data = await fetchFromLink(linkInput.trim());
    setLoading(false);
    const it = {
      id: uid(), created: new Date().toISOString().slice(0,10),
      title: data.ok ? data.title : "",
      type: "", status: "à voir", rating: "",
      note: data.ok ? data.note : "",
      image: data.ok ? data.image : "",
      link: linkInput.trim(),
      myReview: "",
    };
    setItems([it, ...items]);
    setLinkInput("");
    setOpenId(it.id);
    if (!data.ok) setMsg("Lien ajouté. Le remplissage auto marche surtout avec Wikipedia — pour les autres sites, complète à la main 🌙");
  };
  const addBlank = () => { const it = {id:uid(), created:new Date().toISOString().slice(0,10), title:"", type:"", status:"à voir", rating:"", note:"", image:"", link:"", myReview:""}; setItems([it,...items]); setOpenId(it.id); };
  const update = (id,patch)=>setItems(items.map(i=>i.id===id?{...i,...patch}:i));
  const del = (id)=>{ if(confirm("Supprimer cette fiche ?")){ setItems(items.filter(i=>i.id!==id)); setOpenId(null); } };
  const refetch = async (it) => {
    if(!it.link) return;
    setLoading(true);
    const data = await fetchFromLink(it.link);
    setLoading(false);
    if (data.ok) update(it.id, { title: it.title||data.title, note: data.note, image: it.image||data.image });
    else setMsg("Remplissage auto indisponible pour ce lien (essaie un lien Wikipedia).");
  };

  /* ---- PAGE DÉTAIL ---- */
  if (open) return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={()=>setOpenId(null)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour</button>
        <button onClick={()=>del(open.id)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}><Trash2 size={12} className="inline mr-1"/>supprimer</button>
        {open.link && <button onClick={()=>refetch(open)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--accent)"}}>{loading?"⏳":"↻"} re-remplir depuis le lien</button>}
        {onMakeDR && <button onClick={()=>{ if(confirm("Créer une DR shifting à partir de cette œuvre ?")) onMakeDR(open); }} className="px-3 py-2 rounded-full text-sm" style={{background:"linear-gradient(180deg,#a875d4,#7a3a8a)", color:"#fff"}}>🌀 Transformer en DR</button>}
      </div>
      <div className="rounded-3xl overflow-hidden" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div className="md:flex">
          <div className="md:w-1/3 p-5">
            {open.image
              ? <img src={open.image} alt="" className="w-full rounded-xl object-cover" style={{maxHeight:"360px"}}/>
              : <div className="w-full rounded-xl flex items-center justify-center text-5xl" style={{aspectRatio:"3/4", background:"var(--surface2)"}}>🎬</div>}
            <div className="mt-2"><ImgPicker value={open.image} onChange={v=>update(open.id,{image:v})} placeholder="URL couverture"/></div>
          </div>
          <div className="md:w-2/3 p-5 space-y-3">
            <input value={open.title||""} onChange={e=>update(open.id,{title:e.target.value})} placeholder="Titre"
              className="w-full text-3xl bg-transparent outline-none" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}/>
            <div className="grid grid-cols-3 gap-2">
              <input value={open.type||""} onChange={e=>update(open.id,{type:e.target.value})} placeholder="Type (film, anime...)" className="text-sm px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
              <select value={open.status||""} onChange={e=>update(open.id,{status:e.target.value})} className="text-sm px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}>
                <option style={{background:"var(--bg2)"}} value="à voir">à voir</option>
                <option style={{background:"var(--bg2)"}} value="en cours">en cours</option>
                <option style={{background:"var(--bg2)"}} value="terminé">terminé</option>
                <option style={{background:"var(--bg2)"}} value="favori">favori ⭐</option>
              </select>
              <input value={open.rating||""} onChange={e=>update(open.id,{rating:e.target.value})} placeholder="Note /10" className="text-sm px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
            </div>
            {/* Watchlist Pro : progression épisodes */}
            <div className="rounded-xl p-3" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs" style={{color:"var(--muted)"}}>Épisode</span>
                <input type="number" value={open.epCur||""} onChange={e=>update(open.id,{epCur:e.target.value, lastWatch:Date.now()})} placeholder="5" className="w-16 text-sm px-2 py-1 rounded bg-transparent outline-none text-center" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
                <span className="text-xs" style={{color:"var(--muted)"}}>sur</span>
                <input type="number" value={open.epTotal||""} onChange={e=>update(open.id,{epTotal:e.target.value})} placeholder="16" className="w-16 text-sm px-2 py-1 rounded bg-transparent outline-none text-center" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
              </div>
              {open.epCur && open.epTotal && (<>
                <div className="h-2 rounded-full overflow-hidden" style={{background:"var(--surface)"}}>
                  <div className="h-full rounded-full" style={{width:`${Math.min(100,Math.round(open.epCur/open.epTotal*100))}%`, background:"var(--primary)"}}/>
                </div>
                <p className="text-[10px] mt-1" style={{color:"var(--muted)"}}>{Math.round(open.epCur/open.epTotal*100)}% · reste {Math.max(0,open.epTotal-open.epCur)} épisodes
                  {open.lastWatch && (Date.now()-open.lastWatch)/86400000>=7 && open.epCur<open.epTotal && <span style={{color:"#e8a85a"}}> · ⚠️ pas regardé depuis +1 semaine</span>}
                </p>
              </>)}
            </div>
            <input value={open.link||""} onChange={e=>update(open.id,{link:e.target.value})} placeholder="Lien (Wikipedia...)" className="w-full text-xs px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--accent)"}}/>
            <div>
              <label className="text-xs uppercase tracking-widest" style={{color:"var(--muted)"}}>Résumé (auto)</label>
              <textarea value={open.note||""} onChange={e=>update(open.id,{note:e.target.value})} rows={4} placeholder="Résumé récupéré depuis le lien..." className="mt-1 w-full px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest" style={{color:"var(--accent)"}}>★ Mon avis</label>
              <textarea value={open.myReview||""} onChange={e=>update(open.id,{myReview:e.target.value})} rows={6} placeholder="Ce que j'en ai pensé..." className="mt-1 w-full px-3 py-3 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)", fontFamily:'"Caveat", cursive', fontSize:"18px", lineHeight:"28px"}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---- PIÈCE COZY ---- */
  const isBook = (i) => /livre|manga|roman|bd|comic|bouquin|webtoon/i.test(i.type||"");
  const works = items.filter(i=>i.id!=="_bingo");
  const books = works.filter(isBook);
  const screens = works.filter(i=>!isBook(i));
  const favs = works.filter(i=>i.status==="favori");

  // ambiance heure (fenêtre)
  const hr = new Date().getHours();
  const night = hr<7 || hr>=20;
  const dusk = hr>=18 && hr<20;

  // vue zoomée bibliothèque
  if (zoom==="library") return (
    <div className="animate-fade-up">
      <button onClick={()=>setZoom(null)} className="mb-4 px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour à la pièce</button>
      <h3 className="text-2xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>📚 Ma bibliothèque</h3>
      <p className="text-xs italic mb-4" style={{color:"var(--muted)"}}>Touche un livre pour l'ouvrir</p>
      <div className="rounded-2xl p-3 mb-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
        <p className="text-[11px] mb-2" style={{color:"var(--accent)"}}>🔎 Cherche un livre par titre</p>
        <div className="flex gap-2">
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runSearch("livre")} placeholder="ex: L'Assassin Royal, Mistborn..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <button onClick={()=>runSearch("livre")} disabled={searching} className="px-4 rounded-lg text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>{searching?"⏳":"🔎"}</button>
        </div>
        {searchRes && (
          <div className="mt-3">
            {searchRes.length===0 && <p className="text-xs italic" style={{color:"var(--muted)"}}>Aucun résultat. Essaie un autre titre, ou ajoute à la main avec +.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {searchRes.map((r,i)=>(
                <button key={i} onClick={()=>addFromResult(r)} className="text-left rounded-xl overflow-hidden transition hover:scale-105" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
                  <div style={{aspectRatio:"2/3", background: r.image?`url(${r.image}) center/cover`:"var(--surface)"}}>{!r.image && <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>}</div>
                  <div className="p-1.5"><p className="text-[10px] leading-tight line-clamp-2" style={{color:"var(--text)"}}>{r.title}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mb-4">
        <input value={linkInput} onChange={e=>setLinkInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFromLink()} placeholder="ou coller un lien Wikipedia..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        <button onClick={addFromLink} disabled={loading} className="px-3 rounded-lg text-sm" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>{loading?"⏳":"✦"}</button>
        <button onClick={()=>{ addBlank(); }} title="ajouter à la main" className="px-3 rounded-lg text-sm" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}><Plus size={14}/></button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
        {books.map(i=>(
          <button key={i.id} onClick={()=>setOpenId(i.id)} className="group text-left transition hover:scale-105">
            <div className="rounded-md overflow-hidden shadow-lg" style={{aspectRatio:"2/3", background:"var(--surface2)", borderLeft:"3px solid rgba(0,0,0,0.3)"}}>
              {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>}
            </div>
            <p className="text-[10px] mt-1 truncate" style={{color:"var(--text)"}}>{i.status==="favori"&&"⭐ "}{i.title||"?"}</p>
          </button>
        ))}
        {books.length===0 && <p className="col-span-full italic text-sm py-6" style={{color:"var(--muted)"}}>Aucun livre. Ajoute-en un (type : livre, manga, roman...) ✦</p>}
      </div>
    </div>
  );

  // vue zoomée télé
  if (zoom==="tv") return (
    <div className="animate-fade-up">
      <button onClick={()=>setZoom(null)} className="mb-4 px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour à la pièce</button>
      <h3 className="text-2xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>📺 Mon espace visionnage</h3>
      <p className="text-xs italic mb-4" style={{color:"var(--muted)"}}>Animes · Films · Séries · K-Dramas</p>
      {/* recherche par titre */}
      <div className="rounded-2xl p-3 mb-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
        <p className="text-[11px] mb-2" style={{color:"var(--accent)"}}>🔎 Cherche par titre (anime, film, série, k-drama...)</p>
        <div className="flex gap-2">
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runSearch("all")} placeholder="ex: Jujutsu Kaisen, Goblin, Your Name..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <button onClick={()=>runSearch("all")} disabled={searching} className="px-4 rounded-lg text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>{searching?"⏳":"🔎"}</button>
        </div>
        {searchRes && (
          <div className="mt-3">
            {searchRes.length===0 && <p className="text-xs italic" style={{color:"var(--muted)"}}>Aucun résultat. Essaie un autre titre, ou ajoute à la main avec +.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {searchRes.map((r,i)=>(
                <button key={i} onClick={()=>addFromResult(r)} className="text-left rounded-xl overflow-hidden transition hover:scale-105" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
                  <div style={{aspectRatio:"3/4", background: r.image?`url(${r.image}) center/cover`:"var(--surface)"}}>{!r.image && <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>}</div>
                  <div className="p-1.5">
                    <p className="text-[10px] leading-tight line-clamp-2" style={{color:"var(--text)"}}>{r.title}</p>
                    <p className="text-[8px]" style={{color:"var(--muted)"}}>{r.source}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* lien wiki + manuel */}
      <div className="flex gap-2 mb-4">
        <input value={linkInput} onChange={e=>setLinkInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFromLink()} placeholder="ou coller un lien Wikipedia..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        <button onClick={addFromLink} disabled={loading} className="px-3 rounded-lg text-sm" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>{loading?"⏳":"✦"}</button>
        <button onClick={()=>{ addBlank(); }} title="ajouter à la main" className="px-3 rounded-lg text-sm" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}><Plus size={14}/></button>
      </div>
      {msg && <p className="text-xs mb-3" style={{color:"var(--accent)"}}>{msg}</p>}

      {/* BINGO de visionnage */}
      {(()=>{
        const bingo = items.find(i=>i.id==="_bingo") || {id:"_bingo", checks:{}};
        const CHALLENGES = ["Un classique","Pleurer devant","Une nuit blanche","Recommandé par un ami","Sous-titré VO","Un film d'animation","Une romance","Un thriller","Sorti cette année","Plus de 3 saisons","Un coup de cœur","Un truc bizarre"];
        const checks = bingo.checks||{};
        const toggle = (idx)=>{ const nc={...checks,[idx]:!checks[idx]}; const others=items.filter(i=>i.id!=="_bingo"); setItems([{id:"_bingo",checks:nc},...others]); };
        const done = Object.values(checks).filter(Boolean).length;
        return (
          <div className="rounded-2xl p-4 mb-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🎬 Bingo de visionnage</h4>
              <span className="text-xs" style={{color:"var(--muted)"}}>{done}/12</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {CHALLENGES.map((c,idx)=>(
                <button key={idx} onClick={()=>toggle(idx)} className="rounded-lg p-2 text-[10px] leading-tight text-center transition" style={{background:checks[idx]?"var(--primary)":"var(--surface2)", color:checks[idx]?"var(--bg)":"var(--text)", border:"1px solid var(--border)", minHeight:"48px"}}>
                  {checks[idx]?"✓ ":""}{c}
                </button>
              ))}
            </div>
            {done===12 && <p className="text-center text-xs mt-2" style={{color:"var(--accent)"}}>✦ Bingo complet ! Quelle cinéphile 🌙</p>}
          </div>
        );
      })()}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {screens.map(i=>(
          <button key={i.id} onClick={()=>setOpenId(i.id)} className="group text-left rounded-2xl overflow-hidden transition hover:scale-[1.02]" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <div className="relative" style={{aspectRatio:"3/4"}}>
              {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-4xl" style={{background:"var(--surface2)"}}>🎬</div>}
              {i.status && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px]" style={{background:"rgba(0,0,0,0.5)", color:"#fff", backdropFilter:"blur(4px)"}}>{i.status==="favori"?"⭐ favori":i.status}</span>}
            </div>
            <div className="p-3">
              <h4 className="text-lg leading-tight" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>{i.title||"Sans titre"}</h4>
              {i.epCur && i.epTotal && (
                <div className="mt-1.5">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{background:"var(--surface2)"}}><div className="h-full" style={{width:`${Math.min(100,Math.round(i.epCur/i.epTotal*100))}%`, background:"var(--primary)"}}/></div>
                  <p className="text-[9px] mt-0.5" style={{color:"var(--muted)"}}>ep {i.epCur}/{i.epTotal}{i.lastWatch && (Date.now()-i.lastWatch)/86400000>=7 && i.epCur<i.epTotal && " ⚠️"}</p>
                </div>
              )}
            </div>
          </button>
        ))}
        {screens.length===0 && <p className="col-span-full italic text-sm py-6" style={{color:"var(--muted)"}}>Aucun contenu vidéo encore ✦</p>}
      </div>
    </div>
  );

  // ----- LA PIÈCE -----
  return (
    <div className="animate-fade-up">
      {roomProgress}
      <div className="text-center mb-4">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🏠 Mon petit cocon</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Touche la bibliothèque ou la télé pour explorer</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden mx-auto" style={{maxWidth:"720px", aspectRatio:"4/3", background:"linear-gradient(180deg, var(--surface2) 0%, var(--bg2) 70%)", border:"1px solid var(--border)", boxShadow:"inset 0 0 50px rgba(0,0,0,0.2)"}}>
        <RoomDecor unlocked={decor}/>

        {/* ---- MUR DU FOND : fenêtre centrée en haut ---- */}
        <div className="absolute overflow-hidden" style={{top:"8%", left:"50%", transform:"translateX(-50%)", width:"24%", aspectRatio:"3/4", borderRadius:"50% 50% 6px 6px", border:"5px solid var(--accent)", background: night?"linear-gradient(180deg,#0a1230,#1a2350)":dusk?"linear-gradient(180deg,#e88ab0,#ffd9a0)":"linear-gradient(180deg,#9ad0f0,#dff2ff)"}}>
          {night && Array.from({length:12}).map((_,i)=>(<span key={i} className="absolute rounded-full" style={{top:`${Math.random()*65}%`,left:`${Math.random()*100}%`,width:"2px",height:"2px",background:"#fff",opacity:0.8,animation:`twinkle ${2+Math.random()*2}s ease-in-out infinite`}}/>))}
          {night
            ? <div className="absolute rounded-full" style={{top:"14%",right:"18%",width:"18px",height:"18px",background:"radial-gradient(circle at 35% 35%,#fff,#e8e0c0)",boxShadow:"0 0 12px #fff8e0"}}/>
            : <div className="absolute rounded-full" style={{top:"16%",right:"20%",width:"20px",height:"20px",background:"radial-gradient(circle,#fff6c0,#ffd860)",boxShadow:"0 0 16px #ffe080"}}/>}
          {Array.from({length:3}).map((_,i)=>(<span key={"f"+i} className="absolute" style={{top:`${45+Math.random()*35}%`,left:`${10+Math.random()*70}%`,fontSize:"10px",opacity:0.85,animation:`floatY ${3+Math.random()*2}s ease-in-out infinite`,animationDelay:`${Math.random()*2}s`}}>{night?"✨":"🦋"}</span>))}
        </div>
        {/* rebord de fenêtre */}
        <div className="absolute" style={{top:"calc(8% + 0px)", left:"50%", transform:"translateX(-50%)", width:"27%", height:"3px", background:"transparent"}}/>

        {/* ---- SOL ---- */}
        <div className="absolute bottom-0 inset-x-0" style={{height:"16%", background:"var(--surface)", borderTop:"2px solid var(--border)"}}/>
        {/* tapis */}
        <div className="absolute rounded-[50%]" style={{left:"50%", bottom:"3%", transform:"translateX(-50%)", width:"40%", height:"9%", background:"var(--accent)", opacity:0.25}}/>
        {/* plante */}
        <span className="absolute" style={{left:"48%", bottom:"15%", transform:"translateX(-50%)", fontSize:"26px"}}>🪴</span>

        {/* ---- BIBLIOTHÈQUE (gauche) ---- */}
        <div className="absolute" style={{left:"5%", top:"30%", width:"28%", bottom:"16%"}}>
          {/* figurines posées sur le dessus */}
          <div className="absolute inset-x-0 flex justify-center gap-3" style={{top:"-22px"}}>
            {favs.filter(isBook).slice(0,3).map((f,i)=>(<span key={f.id} title={f.title} style={{fontSize:"17px", filter:"drop-shadow(0 0 4px var(--accent))"}}>{["🔮","🧚","💎"][i%3]}</span>))}
          </div>
          <button onClick={()=>setZoom("library")} className="w-full h-full transition hover:brightness-110 relative" style={{borderRadius:"6px", background:"linear-gradient(180deg, var(--primary), var(--surface2))", border:"3px solid var(--accent)", boxShadow:"0 6px 14px rgba(0,0,0,0.3)", padding:"6px"}}>
            <div className="w-full h-full flex flex-col gap-[3px]">
              {[0,1,2,3].map(shelf=>(
                <div key={shelf} className="flex-1 flex items-end justify-start gap-[2px] px-1" style={{borderBottom:"3px solid rgba(0,0,0,0.35)"}}>
                  {books.slice(shelf*4, shelf*4+4).map(b=>(
                    <div key={b.id} title={b.title} style={{width:"20%", height:`${72+(b.title?.length%3)*9}%`, background:b.image?`url(${b.image}) center/cover`:`hsl(${(b.title||"x").charCodeAt(0)*7%360},45%,58%)`, borderRadius:"1px 1px 0 0", borderTop:"2px solid rgba(255,255,255,0.25)"}}/>
                  ))}
                </div>
              ))}
            </div>
          </button>
          <p className="text-center text-[11px] mt-1" style={{color:"var(--text)", fontFamily:'"Dancing Script",cursive'}}>📚 {books.length} livres</p>
        </div>

        {/* ---- COIN TÉLÉ (droite) ---- */}
        <div className="absolute" style={{right:"5%", top:"34%", width:"30%", bottom:"16%"}}>
          {/* figurines au-dessus de la télé */}
          <div className="absolute inset-x-0 flex justify-center gap-3" style={{top:"-22px"}}>
            {favs.filter(i=>!isBook(i)).slice(0,4).map((f,i)=>(<span key={f.id} title={f.title} style={{fontSize:"16px", filter:"drop-shadow(0 0 4px var(--accent))"}}>{["⭐","🌟","💫","✨"][i%4]}</span>))}
          </div>
          <button onClick={()=>setZoom("tv")} className="w-full h-full transition hover:brightness-110 flex flex-col" style={{background:"transparent", border:"none"}}>
            {/* poste TV */}
            <div style={{flex:"1.6", borderRadius:"10px", background:"linear-gradient(180deg, var(--surface), var(--surface2))", border:"4px solid var(--accent)", padding:"7%"}}>
              <div className="w-full h-full rounded flex items-center justify-center relative overflow-hidden" style={{background: night?"linear-gradient(135deg,#1a1030,#2a1850)":"linear-gradient(135deg,#3a5a8a,#5a8ac0)"}}>
                <span className="text-2xl" style={{animation:"twinkle 3s ease-in-out infinite"}}>📺</span>
                <div className="absolute inset-0" style={{background:"repeating-linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06) 2px,transparent 2px,transparent 4px)"}}/>
              </div>
            </div>
            {/* meuble + cassettes */}
            <div style={{flex:"0.8", marginTop:"4px", borderRadius:"6px", background:"var(--primary)", border:"2px solid var(--accent)"}}>
              <div className="flex items-center justify-center gap-[3px] h-full px-2">
                {screens.slice(0,6).map(s=>(<div key={s.id} title={s.title} style={{width:"13%", height:"55%", background:s.image?`url(${s.image}) center/cover`:"var(--surface2)", borderRadius:"1px", border:"1px solid rgba(0,0,0,0.3)"}}/>))}
              </div>
            </div>
          </button>
          <p className="text-center text-[11px] mt-1" style={{color:"var(--text)", fontFamily:'"Dancing Script",cursive'}}>📺 {screens.length} à regarder</p>
        </div>

      </div>

      <p className="text-center text-[11px] italic mt-3" style={{color:"var(--muted)"}}>💡 Astuce : change le thème de cette page (bouton 🎨) pour redécorer la pièce — Dark Academia, Cyber Y2K, Fairy...</p>
    </div>
  );
}

function CardList({ items, setItems, title, fields }) {
  const [openId, setOpenId] = useState(null); // null = liste, id = page ouverte
  const blank = useMemo(()=>Object.fromEntries(fields.map(f=>[f.k,""])), [fields]);
  const open = items.find(i=>i.id===openId);

  const addNew = () => { const it = {id:uid(), ...blank, created:new Date().toISOString().slice(0,10)}; setItems([it,...items]); setOpenId(it.id); };
  const updateItem = (id, patch) => setItems(items.map(i=>i.id===id?{...i,...patch}:i));
  const delItem = (id) => { if(confirm("Supprimer cette entrée ?")){ setItems(items.filter(i=>i.id!==id)); setOpenId(null); } };

  // construire un court résumé : 1er champ multi/texte non-vide, tronqué
  const summaryOf = (it) => {
    const sumField = fields.find(f=>f.multi && it[f.k]) || fields.find(f=>!["image"].includes(f.k) && f.k!==fields[0].k && it[f.k]);
    const txt = sumField ? String(it[sumField.k]) : "";
    return txt.length>90 ? txt.slice(0,90).trim()+"…" : txt;
  };

  /* ---- PAGE DÉTAIL (tout le texte, éditable) ---- */
  if (open) return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={()=>setOpenId(null)} className="flex items-center gap-1 px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour à la liste</button>
        <button onClick={()=>delItem(open.id)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}><Trash2 size={12} className="inline mr-1"/>supprimer</button>
      </div>
      <div className="rounded-3xl p-5 sm:p-8" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        {open.image!==undefined && fields.some(f=>f.k==="image") && (
          <div className="mb-5">
            {open.image && <img src={open.image} alt="" className="w-full rounded-2xl mb-2 max-h-72 object-cover"/>}
            <input value={open.image||""} onChange={e=>updateItem(open.id,{image:e.target.value})} placeholder="URL image"
              className="w-full text-xs px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          </div>
        )}
        {fields.filter(f=>f.k!=="image").map((f,idx)=>(
          <div key={f.k} className="mb-5">
            <label className="text-xs uppercase tracking-widest block mb-1" style={{color:"var(--muted)"}}>{f.label}</label>
            {f.multi ? (
              <textarea value={open[f.k]||""} onChange={e=>updateItem(open.id,{[f.k]:e.target.value})}
                rows={f.big?14:5} placeholder="Écris ici..."
                className="w-full px-4 py-3 rounded-xl bg-transparent outline-none leading-relaxed"
                style={{ border:"1px solid var(--border)", color:"var(--text)",
                  fontFamily: f.big?'"Caveat", cursive':"inherit", fontSize: f.big?"19px":"15px",
                  lineHeight: f.big?"30px":"1.6" }}/>
            ) : (
              <input value={open[f.k]||""} onChange={e=>updateItem(open.id,{[f.k]:e.target.value})}
                className={idx===0?"w-full px-4 py-3 rounded-xl bg-transparent outline-none text-2xl":"w-full px-4 py-2 rounded-xl bg-transparent outline-none"}
                style={{border:"1px solid var(--border)", color:"var(--text)", fontFamily:idx===0?'"Dancing Script", cursive':"inherit"}}
                placeholder={idx===0?"Titre...":""}/>
            )}
          </div>
        ))}
        <p className="text-xs italic" style={{color:"var(--muted)"}}>✦ Tout se sauvegarde automatiquement. Touche « retour » pour revenir à tes notes.</p>
      </div>
    </div>
  );

  /* ---- LISTE (cartes résumées) ---- */
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>{title}</h3>
        <button onClick={addNew} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/> Ajouter</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(i=>(
          <button key={i.id} onClick={()=>setOpenId(i.id)} className="group text-left rounded-2xl p-5 transition-all hover:scale-[1.02]" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            {i.image && <img src={i.image} alt="" className="w-full rounded-lg mb-3 max-h-40 object-cover"/>}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xl" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>{i[fields[0].k]||"Sans titre"}</h4>
              <span className="text-xs flex-shrink-0 mt-1" style={{color:"var(--muted)"}}>{i.created||""}</span>
            </div>
            {summaryOf(i) && <p className="text-sm mt-2 leading-snug" style={{color:"var(--muted)", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden"}}>{summaryOf(i)}</p>}
            <span className="inline-flex items-center gap-1 text-xs mt-3" style={{color:"var(--primary)"}}><Edit3 size={11}/> ouvrir & écrire</span>
          </button>
        ))}
        {items.length===0 && <p className="col-span-2 text-center italic py-12" style={{color:"var(--muted)"}}>Rien ici. Ajoute ta première entrée ✦</p>}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ TRACKERS
   ============================================================ */
function HabitsTracker({ habits, setHabits }) {
  const [newName, setNewName] = useState("");
  const days = Array.from({length:7}).map((_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return d.toISOString().slice(0,10); });
  const dayLabels=["L","M","M","J","V","S","D"];
  const toggle=(hId,day)=>setHabits(habits.map(h=>{ if(h.id!==hId) return h; const nd={...h.days}; nd[day]=!nd[day]; return {...h,days:nd}; }));
  return (
    <div>
      <h3 className="text-3xl mb-6" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>✿ Habitudes du soft life ✿</h3>
      <div className="rounded-2xl p-6 overflow-x-auto" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div className="flex gap-2 mb-4">
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="+ ajouter une habitude" className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <button onClick={()=>{if(!newName)return; setHabits([...habits,{id:uid(),name:newName,days:{}}]); setNewName("");}} className="px-3 rounded-lg" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={16}/></button>
        </div>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left pb-2">Habitude</th>{days.map((d,i)=>(<th key={d} className="pb-2 text-center text-xs" style={{color:"var(--muted)"}}>{dayLabels[i]}</th>))}<th></th></tr></thead>
          <tbody>{habits.map(h=>{ const streak=days.filter(d=>h.days[d]).length; return (
            <tr key={h.id} className="border-t" style={{borderColor:"var(--border)"}}>
              <td className="py-2" style={{color:"var(--text)"}}>{h.name}</td>
              {days.map(d=>(<td key={d} className="text-center"><button onClick={()=>toggle(h.id,d)} className="w-7 h-7 rounded-full transition hover:scale-110" style={{background:h.days[d]?"var(--primary)":"transparent", border:`1px solid ${h.days[d]?"var(--primary)":"var(--border)"}`, color:"var(--bg)"}}>{h.days[d]?"✓":""}</button></td>))}
              <td className="text-right"><span className="text-xs mr-2" style={{color:"var(--accent)"}}>{streak}/7</span><button onClick={()=>setHabits(habits.filter(x=>x.id!==h.id))}><Trash2 size={12} style={{color:"var(--muted)"}}/></button></td>
            </tr>
          );})}</tbody>
        </table>
      </div>
    </div>
  );
}

function GratitudeJournal({ entries, setEntries }) {
  const [today, setToday] = useState(["","",""]);
  const todayStr = new Date().toISOString().slice(0,10);
  const existing = entries.find(e=>e.date===todayStr);
  useEffect(()=>{ if(existing) setToday(existing.items); }, [existing?.date]);
  const save=()=>{ const others=entries.filter(e=>e.date!==todayStr); setEntries([{date:todayStr,items:today},...others]); };
  return (
    <div>
      <h3 className="text-3xl mb-6" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>✿ Gratitude journal ✿</h3>
      <div className="rounded-2xl p-6 mb-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <p className="text-sm italic mb-4" style={{color:"var(--muted)"}}>Aujourd'hui, je suis reconnaissante pour...</p>
        {[0,1,2].map(i=>(<input key={i} value={today[i]} onChange={e=>{const n=[...today]; n[i]=e.target.value; setToday(n);}} placeholder={`${i+1}. `} className="w-full px-3 py-2 mb-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>))}
        <button onClick={save} className="mt-2 px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{background:"var(--primary)", color:"var(--bg)"}}><Save size={14}/>Enregistrer aujourd'hui</button>
      </div>
      <h4 className="text-lg mb-3" style={{color:"var(--text)", fontFamily:'"Dancing Script", cursive'}}>Historique</h4>
      <div className="space-y-2">
        {entries.slice(0,30).map(e=>(
          <div key={e.date} className="rounded-xl p-3 text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>{e.date}</p>
            {e.items.filter(Boolean).map((it,i)=>(<p key={i} style={{color:"var(--text)"}}>✿ {it}</p>))}
          </div>
        ))}
        {entries.length===0 && <p className="text-xs italic text-center py-4" style={{color:"var(--muted)"}}>Commence par les 3 cases en haut.</p>}
      </div>
    </div>
  );
}

function MoodTracker({ log, setLog }) {
  const moods=[{e:"😊",l:"Heureuse"},{e:"😍",l:"Amoureuse"},{e:"🥰",l:"Câline"},{e:"✨",l:"Inspirée"},{e:"🌸",l:"Sereine"},{e:"😴",l:"Fatiguée"},{e:"🤍",l:"Mélancolique"},{e:"🔥",l:"Énervée"},{e:"😭",l:"Triste"},{e:"🌙",l:"Rêveuse"}];
  const todayStr=new Date().toISOString().slice(0,10);
  const today=log.find(l=>l.date===todayStr);
  const setMood=(m)=>setLog([{date:todayStr,mood:m.e,label:m.l,note:today?.note||""},...log.filter(l=>l.date!==todayStr)]);
  const setNote=(n)=>{ if(!today) return; setLog([{...today,note:n},...log.filter(l=>l.date!==todayStr)]); };
  return (
    <div>
      <h3 className="text-3xl mb-6" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>✿ Mood tracker ✿</h3>
      <div className="rounded-2xl p-6 mb-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <p className="text-sm italic mb-4" style={{color:"var(--muted)"}}>Quelle est ton ambiance aujourd'hui ?</p>
        <div className="grid grid-cols-5 gap-2 mb-4">{moods.map(m=>(
          <button key={m.e} onClick={()=>setMood(m)} className="aspect-square rounded-xl flex flex-col items-center justify-center transition hover:scale-110" style={{background:today?.mood===m.e?"rgba(var(--glow),0.2)":"var(--surface2)", border:`1px solid ${today?.mood===m.e?"var(--primary)":"var(--border)"}`}}>
            <span className="text-2xl">{m.e}</span><span className="text-[10px]" style={{color:"var(--text)"}}>{m.l}</span></button>
        ))}</div>
        <textarea value={today?.note||""} onChange={e=>setNote(e.target.value)} placeholder="Pourquoi je me sens comme ça ?" rows={3} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
      </div>
      <h4 className="text-lg mb-3" style={{color:"var(--text)", fontFamily:'"Dancing Script", cursive'}}>Mes 14 derniers jours</h4>
      <div className="grid grid-cols-7 gap-1">{Array.from({length:14}).map((_,i)=>{ const d=new Date(); d.setDate(d.getDate()-13+i); const dStr=d.toISOString().slice(0,10); const entry=log.find(l=>l.date===dStr); return (
        <div key={dStr} className="aspect-square rounded-lg flex items-center justify-center text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)"}} title={dStr}>{entry?.mood||<span style={{color:"var(--muted)"}}>·</span>}</div>
      );})}</div>
    </div>
  );
}

/* ============================================================
   ✦ DÉCO
   ============================================================ */
function SoftBrandBanner({ subtitle }) {
  return (
    <div className="mb-10 rounded-2xl overflow-hidden" style={{background:`linear-gradient(135deg, var(--rose) 0%, var(--paper) 50%, var(--sage) 100%)`, border:"1px solid var(--border)"}}>
      <div className="px-8 py-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-5xl leading-none" style={{fontFamily:"var(--font-display)", color:"var(--ink)"}}>My <em style={{fontFamily:'"Dancing Script", cursive', fontWeight:400}}>Universe</em></h2>
          <p className="text-xs italic mt-2 tracking-wide" style={{color:"var(--ink)"}}>— {subtitle}</p>
        </div>
      </div>
      <div className="h-2" style={{background:"var(--rose)"}}/>
    </div>
  );
}
function WoodPlank({ children, className="", st={} }) {
  const bg = st.bg || "linear-gradient(180deg, var(--surface2), var(--primary))";
  const border = st.border || "2px solid var(--accent)";
  const color = st.color || "var(--text)";
  const radius = st.radius!==undefined ? st.radius : 8;
  return (
    <div className={`relative inline-block px-6 py-3 ${className}`} style={{background:bg, border, boxShadow:"inset 0 0 20px rgba(0,0,0,0.25), 0 4px 0 rgba(0,0,0,0.3)", borderRadius:`${radius}px`, fontFamily:'"Dancing Script", cursive'}}>
      <span className="text-xl" style={{color, textShadow:"1px 1px 2px rgba(0,0,0,0.5)"}}>✦ {children} ✦</span>
    </div>
  );
}
function Garland() {
  return (
    <div className="flex justify-center my-6 opacity-70 text-2xl select-none">
      {Array.from({length:14}).map((_,i)=>(<span key={i} className="inline-block" style={{transform:`rotate(${(i%2?5:-5)}deg)`}}>{i%3===0?"🌹":i%3===1?"🌿":"🍃"}</span>))}
    </div>
  );
}

/* ============================================================
   ✦ DASHBOARD (personnalisation maximale)
   ============================================================ */
const COLOR_KEYS = [
  { k:"--bg", l:"Fond principal" },
  { k:"--bg2", l:"Fond secondaire" },
  { k:"--text", l:"Texte" },
  { k:"--primary", l:"Couleur principale" },
  { k:"--accent", l:"Accent" },
  { k:"--border", l:"Bordures" },
];

/* ============================================================
   ✦ GÉNÉRATEUR DE THÈMES (texte + image)
   ============================================================ */
function hexToRgb(h){ h=h.replace("#",""); if(h.length===3)h=h.split("").map(c=>c+c).join(""); const n=parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function rgbToHex(r,g,b){ return "#"+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,"0")).join(""); }
function lighten(hex,amt){ const [r,g,b]=hexToRgb(hex); return rgbToHex(r+(255-r)*amt, g+(255-g)*amt, b+(255-b)*amt); }
function darken(hex,amt){ const [r,g,b]=hexToRgb(hex); return rgbToHex(r*(1-amt), g*(1-amt), b*(1-amt)); }
function luminance(hex){ const [r,g,b]=hexToRgb(hex); return (0.299*r+0.587*g+0.114*b)/255; }

// construit un thème complet à partir d'une couleur principale + ambiance claire/sombre
function buildTheme(name, primary, accent, dark, backdrop="dreamy") {
  const bg = dark ? darken(primary,0.82) : lighten(primary,0.9);
  const bg2 = dark ? darken(primary,0.7) : lighten(primary,0.8);
  const text = dark ? lighten(primary,0.85) : darken(primary,0.7);
  const muted = dark ? lighten(primary,0.5) : darken(primary,0.35);
  const surface = dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)";
  const surface2 = dark ? darken(primary,0.55) : lighten(primary,0.65);
  const border = dark ? "rgba(255,255,255,0.18)" : darken(primary,0.1);
  const [pr,pg,pb]=hexToRgb(primary);
  return {
    name, icon: dark ? Moon : Sparkles,
    vars: {
      "--bg":bg, "--bg2":bg2, "--surface":surface, "--surface2":surface2, "--border":border,
      "--text":text, "--muted":muted, "--primary":primary, "--accent":accent, "--ink":text,
      "--paper":bg2, "--rose":accent, "--sage":lighten(accent,0.2), "--glow":`${pr},${pg},${pb}`,
    },
    backdrop, universe: dark?"witch":"soft", custom:true,
  };
}

// texte → couleurs (mots-clés)
function themeFromText(txt) {
  const t = txt.toLowerCase();
  const map = [
    {k:["rose","pink","coquette","tendre"], p:"#e08aa8", a:"#f0c0d0", dark:false, bd:"petals"},
    {k:["bleu","blue","océan","mer","ocean","ciel"], p:"#5a9ad0", a:"#a0d0e8", dark:false, bd:"ocean"},
    {k:["vert","green","forêt","forest","nature","sauge"], p:"#6a9a6a", a:"#b0d0a0", dark:false, bd:"forest"},
    {k:["violet","purple","sorcière","witch","magie","mystique"], p:"#9a6ad0", a:"#c0a0e8", dark:true, bd:"aurora"},
    {k:["noir","dark","sombre","gothique","nuit","night"], p:"#6a6a8a", a:"#c8a86a", dark:true, bd:"starry"},
    {k:["or","gold","doré","royal","luxe"], p:"#c8a martin04a", a:"#e8d49a", dark:true, bd:"dust"},
    {k:["rouge","red","feu","fire","passion","sang"], p:"#c85a5a", a:"#e8a060", dark:true, bd:"embers"},
    {k:["pêche","peach","abricot","orange","corail"], p:"#e89a6a", a:"#f0c0a0", dark:false, bd:"dust"},
    {k:["lavande","lavender","lilas"], p:"#b39ad8", a:"#d8c0e8", dark:false, bd:"butterflies"},
    {k:["menthe","mint","turquoise","emeraude","emerald"], p:"#5ac0a0", a:"#a0e8d0", dark:false, bd:"bubbles"},
    {k:["cosmos","galaxie","cosmic","étoile","star","espace"], p:"#7a7ad0", a:"#e0c060", dark:true, bd:"cosmic"},
    {k:["fée","fairy","féerique","y2k","glitter"], p:"#e0a0d8", a:"#a0e0d0", dark:false, bd:"glitter"},
    {k:["jaune","yellow","soleil","sun","beurre","vanille"], p:"#e8c860", a:"#f0e0a0", dark:false, bd:"dust"},
  ];
  let found = null;
  for (const m of map) if (m.k.some(w=>t.includes(w))) { found = m; break; }
  if (!found) found = { p:"#a875d4", a:"#e0c97a", dark:t.includes("sombre")||t.includes("dark"), bd:"dreamy" };
  // fix coquille gold
  if (found.p.includes("martin")) found.p = "#c8a04a";
  const isDark = t.includes("sombre")||t.includes("dark")||t.includes("nuit")||t.includes("noir") ? true : found.dark;
  return buildTheme("✨ "+(txt.slice(0,18)||"Mon thème"), found.p, found.a, isDark, found.bd);
}

// image → couleurs dominantes via canvas
function themeFromImage(imgUrl, name) {
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = ()=>{
      try {
        const c = document.createElement("canvas");
        const s = 60; c.width=s; c.height=s;
        const ctx = c.getContext("2d");
        ctx.drawImage(img,0,0,s,s);
        const data = ctx.getImageData(0,0,s,s).data;
        let r=0,g=0,b=0,n=0; const buckets={};
        for(let i=0;i<data.length;i+=4){
          const R=data[i],G=data[i+1],B=data[i+2];
          r+=R;g+=G;b+=B;n++;
          const key=`${Math.round(R/40)}-${Math.round(G/40)}-${Math.round(B/40)}`;
          buckets[key]=buckets[key]||{c:0,R:0,G:0,B:0};
          buckets[key].c++; buckets[key].R+=R; buckets[key].G+=G; buckets[key].B+=B;
        }
        const avgLum=(0.299*r+0.587*g+0.114*b)/n/255;
        // couleur dominante la plus saturée
        const sorted=Object.values(buckets).sort((a,b)=>b.c-a.c).slice(0,5);
        const dom=sorted[0];
        const primary=rgbToHex(dom.R/dom.c, dom.G/dom.c, dom.B/dom.c);
        const acc=sorted[1]||dom;
        const accent=rgbToHex(acc.R/acc.c, acc.G/acc.c, acc.B/acc.c);
        resolve(buildTheme(name||"✨ Thème image", primary, accent, avgLum<0.45, "dreamy"));
      } catch(e){ reject(e); }
    };
    img.onerror = ()=>reject(new Error("image"));
    img.src = imgUrl;
  });
}

function ThemeGenerator({ customThemes, setCustomThemes, setTheme }) {
  const [mode, setMode] = useState("text"); // text | image
  const [txt, setTxt] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const genText = () => {
    if (!txt.trim()) return;
    setErr(""); setPreview(themeFromText(txt.trim()));
  };
  const genImage = async (url) => {
    setErr(""); setBusy(true);
    try { const th = await themeFromImage(url, "✨ "+(txt.trim()||"Thème image")); setPreview(th); }
    catch(e){ setErr("Image impossible à lire (essaie une autre URL ou un upload)"); }
    setBusy(false);
  };
  const onFile = (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ()=>{ setImgUrl(r.result); genImage(r.result); };
    r.readAsDataURL(f);
  };
  const save = () => {
    if (!preview) return;
    const key = "custom_"+uid();
    setCustomThemes({ ...customThemes, [key]: preview });
    setTheme(key);
    setPreview(null); setTxt(""); setImgUrl("");
  };

  return (
    <section className="mb-8 rounded-2xl p-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
      <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-2" style={{color:"var(--accent)"}}><Wand2 size={14}/> Générateur de thème</h3>
      <p className="text-[11px] italic mb-3" style={{color:"var(--muted)"}}>Décris une ambiance OU envoie une image. Le thème généré sera gardé avec les autres.</p>

      <div className="flex gap-2 mb-3">
        <button onClick={()=>setMode("text")} className="flex-1 py-1.5 rounded-lg text-xs" style={{background:mode==="text"?"var(--primary)":"var(--surface2)", color:mode==="text"?"var(--bg)":"var(--text)"}}>✍️ Par texte</button>
        <button onClick={()=>setMode("image")} className="flex-1 py-1.5 rounded-lg text-xs" style={{background:mode==="image"?"var(--primary)":"var(--surface2)", color:mode==="image"?"var(--bg)":"var(--text)"}}>🖼️ Par image</button>
      </div>

      {mode==="text" ? (
        <div className="flex gap-2">
          <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&genText()} placeholder="ex: cottage rose et doux, sorcière sombre..."
            className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <button onClick={genText} className="px-3 rounded-lg text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>✦</button>
        </div>
      ) : (
        <div className="space-y-2">
          <input value={imgUrl} onChange={e=>setImgUrl(e.target.value)} placeholder="colle une URL d'image"
            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <div className="flex gap-2">
            <button onClick={()=>imgUrl&&genImage(imgUrl)} disabled={busy||!imgUrl} className="flex-1 py-2 rounded-lg text-xs disabled:opacity-40" style={{background:"var(--primary)", color:"var(--bg)"}}>{busy?"...":"depuis l'URL"}</button>
            <label className="flex-1 py-2 rounded-lg text-xs text-center cursor-pointer" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>
              uploader<input type="file" accept="image/*" onChange={onFile} className="hidden"/>
            </label>
          </div>
        </div>
      )}
      {err && <p className="text-xs mt-2" style={{color:"#c89a9a"}}>{err}</p>}

      {preview && (
        <div className="mt-3 rounded-xl p-3 animate-fade-up" style={{background:preview.vars["--bg"], border:`1px solid ${preview.vars["--border"]}`}}>
          <p className="text-xs mb-2" style={{color:preview.vars["--text"]}}>Aperçu : {preview.name}</p>
          <div className="flex gap-1 mb-3">
            {["--bg","--surface2","--primary","--accent","--text"].map(k=>(<span key={k} style={{width:"26px",height:"26px",borderRadius:"6px",background:preview.vars[k],border:"1px solid rgba(128,128,128,0.3)"}}/>))}
          </div>
          <input value={preview.name.replace("✨ ","")} onChange={e=>setPreview({...preview, name:"✨ "+e.target.value})} className="w-full text-xs px-2 py-1 mb-2 rounded bg-transparent outline-none" style={{border:`1px solid ${preview.vars["--border"]}`, color:preview.vars["--text"]}}/>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-2 rounded-lg text-xs" style={{background:preview.vars["--primary"], color:preview.vars["--bg"]}}>✦ enregistrer & appliquer</button>
            <button onClick={()=>setPreview(null)} className="px-3 py-2 rounded-lg text-xs" style={{background:"transparent", border:`1px solid ${preview.vars["--border"]}`, color:preview.vars["--text"]}}>annuler</button>
          </div>
        </div>
      )}
    </section>
  );
}

function BackdropGenerator({ customBackdrops, setCustomBackdrops, onApply }) {
  const [cfg, setCfg] = useState({ name:"Mon fond", particle:"✨", count:24, motion:"float", color:"#ffd0ee", size:20, glow:true });
  const [showPreview, setShowPreview] = useState(false);
  const particleChoices = ["✨","🌸","🩷","⭐","🦋","🍂","🌙","💫","❄️","🌺","🔮","🍄","💗","🕯️","🌿","💧","dot"];
  const motions = [{k:"float",l:"flotte"},{k:"fall",l:"tombe"},{k:"rise",l:"monte"},{k:"cross",l:"traverse"},{k:"twinkle",l:"scintille"},{k:"sway",l:"ondule"}];

  const save = () => {
    const key = "bg_"+uid();
    setCustomBackdrops({ ...customBackdrops, [key]: { gen:true, ...cfg } });
    onApply(key);
  };

  return (
    <section className="mb-6 rounded-2xl p-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
      <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-2" style={{color:"var(--accent)"}}><Wand2 size={14}/> Générateur de fond animé</h3>

      {/* particule */}
      <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Particule</label>
      <div className="flex flex-wrap gap-1 mb-3 mt-1">
        {particleChoices.map(p=>(
          <button key={p} onClick={()=>setCfg({...cfg, particle:p})} className="w-8 h-8 rounded-lg text-sm flex items-center justify-center" style={{background:cfg.particle===p?"var(--primary)":"var(--surface2)", border:"1px solid var(--border)", color:cfg.particle===p?"var(--bg)":"var(--text)"}}>{p==="dot"?"●":p}</button>
        ))}
      </div>

      {/* mouvement */}
      <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Mouvement</label>
      <div className="flex flex-wrap gap-1 mb-3 mt-1">
        {motions.map(m=>(
          <button key={m.k} onClick={()=>setCfg({...cfg, motion:m.k})} className="px-2.5 py-1 rounded-full text-xs" style={{background:cfg.motion===m.k?"var(--primary)":"var(--surface2)", border:"1px solid var(--border)", color:cfg.motion===m.k?"var(--bg)":"var(--text)"}}>{m.l}</button>
        ))}
      </div>

      {/* densité + taille + couleur + glow */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <label style={{color:"var(--muted)"}}>Densité : {cfg.count}
          <input type="range" min="6" max="80" value={cfg.count} onChange={e=>setCfg({...cfg, count:parseInt(e.target.value)})} className="w-full"/>
        </label>
        <label style={{color:"var(--muted)"}}>Taille : {cfg.size}
          <input type="range" min="8" max="48" value={cfg.size} onChange={e=>setCfg({...cfg, size:parseInt(e.target.value)})} className="w-full"/>
        </label>
        <label className="flex items-center gap-2" style={{color:"var(--muted)"}}>Couleur
          <input type="color" value={cfg.color} onChange={e=>setCfg({...cfg, color:e.target.value})} className="w-7 h-7 rounded cursor-pointer bg-transparent"/>
        </label>
        <label className="flex items-center gap-2" style={{color:"var(--muted)"}}>
          <input type="checkbox" checked={cfg.glow} onChange={e=>setCfg({...cfg, glow:e.target.checked})}/> lueur ✨
        </label>
      </div>

      <input value={cfg.name} onChange={e=>setCfg({...cfg, name:e.target.value})} placeholder="nom du fond" className="w-full text-xs px-2 py-1.5 mb-2 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>

      <div className="flex gap-2">
        <button onClick={()=>setShowPreview(true)} className="flex-1 py-2 rounded-lg text-xs" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>👁️ aperçu</button>
        <button onClick={save} className="flex-1 py-2 rounded-lg text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ enregistrer & appliquer</button>
      </div>

      {/* aperçu plein écran */}
      {showPreview && (
        <div className="fixed inset-0 z-[80]" style={{background:"var(--bg)"}}>
          <Backdrop kind={{ gen:true, ...cfg }}/>
          <button onClick={()=>setShowPreview(false)} className="absolute top-4 right-4 z-10 px-4 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>fermer l'aperçu</button>
          <p className="absolute bottom-6 inset-x-0 text-center text-sm italic" style={{color:"var(--muted)"}}>aperçu de « {cfg.name} »</p>
        </div>
      )}
    </section>
  );
}

function ControlPanel({ open, onClose, ctx }) {
  const {
    theme, setTheme, font, setFont, sections, setSections,
    activeSection, activeSub, subTabsFor,
    overrides, setOverrides,
    customRituals, setCustomRituals, customTips, setCustomTips, customAffirm, setCustomAffirm,
    ALL_THEMES, customThemes, setCustomThemes,
    customBackdrops, setCustomBackdrops
  } = ctx;
  const [tab, setTab] = useState("look");
  const [newSection, setNewSection] = useState("");
  const [newRitual, setNewRitual] = useState({title:"",ingredients:"",steps:""});
  const [newTip, setNewTip] = useState("");
  const [newAffirm, setNewAffirm] = useState("");
  // cible de personnalisation : section entière OU sous-section précise
  const [scopeSel, setScopeSel] = useState("section"); // "section" | "sub"
  const targetKey = scopeSel==="section" ? `sec:${activeSection}` : `sub:${activeSection}:${activeSub}`;
  const ov = overrides[targetKey] || {};

  const setOv = (patch) => setOverrides({ ...overrides, [targetKey]: { ...ov, ...patch } });
  const resetOv = () => { const c={...overrides}; delete c[targetKey]; setOverrides(c); };

  const subs = subTabsFor(activeSection);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${open?"pointer-events-auto":"pointer-events-none"}`}>
      <div onClick={onClose} className={`absolute inset-0 transition-opacity ${open?"opacity-100":"opacity-0"}`} style={{background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)"}}/>
      <aside className={`absolute right-0 top-0 bottom-0 w-full sm:max-w-md overflow-y-auto transition-transform duration-500 ${open?"translate-x-0":"translate-x-full"}`} style={{background:"var(--bg2)", borderLeft:"1px solid var(--border)"}}>
        <div className="sticky top-0 z-10 px-4 sm:px-6 pt-6 pb-3 backdrop-blur-md" style={{background:"var(--bg2)", paddingTop:"calc(env(safe-area-inset-top) + 1.5rem)"}}>
          <div className="flex justify-between items-center mb-4 gap-3">
            <h2 className="text-2xl flex items-center gap-2 min-w-0" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}><Settings size={20}/> Dashboard</h2>
            <button onClick={onClose} aria-label="Fermer"
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-105 active:scale-95"
              style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>
              <X size={22}/>
            </button>
          </div>
          <div className="flex gap-1 text-xs flex-wrap">
            {[{k:"look",l:"Thème"},{k:"custom",l:"Couleurs & Fond"},{k:"sections",l:"Sections"},{k:"content",l:"Contenu witch"}].map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)} className="px-3 py-1.5 rounded-full transition" style={{background:tab===t.k?"var(--primary)":"transparent", color:tab===t.k?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{t.l}</button>
            ))}
          </div>
        </div>

        <div className="p-6 pt-2">
          {tab==="look" && (<>
            <section className="mb-8">
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}><Palette size={14}/> Thème global</h3>
              <div className="grid grid-cols-2 gap-2">{Object.entries(ALL_THEMES).map(([k,t])=>{ const I=t.icon||Sparkles; return (
                <button key={k} onClick={()=>setTheme(k)} className="p-3 rounded-xl text-left transition-all relative group" style={{background:"var(--surface)", border:`1px solid ${theme===k?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                  <I size={16} className="mb-1"/><div className="text-xs">{t.name}</div>
                  {t.custom && <button onClick={(e)=>{ e.stopPropagation(); if(confirm("Supprimer ce thème généré ?")){ const c={...customThemes}; delete c[k]; setCustomThemes(c); } }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={12}/></button>}
                </button>
              );})}</div>
            </section>

            {/* GÉNÉRATEUR DE THÈME */}
            <ThemeGenerator customThemes={customThemes} setCustomThemes={setCustomThemes} setTheme={setTheme}/>

            <section className="mb-8">
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}><Type size={14}/> Police</h3>
              <select value={font} onChange={e=>setFont(e.target.value)} className="w-full p-3 rounded-xl bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}>
                {Object.entries(FONTS).map(([k,f])=>(<option key={k} value={k} style={{background:"var(--bg2)", fontFamily:f.stack}}>{f.name}</option>))}</select>
            </section>
          </>)}

          {tab==="custom" && (<>
            <p className="text-xs italic mb-4" style={{color:"var(--muted)"}}>
              Personnalise les couleurs ET le fond animé d'une section entière, ou d'une seule sous-section. Tu es actuellement sur : <strong style={{color:"var(--text)"}}>{activeSection} → {activeSub}</strong>
            </p>
            <div className="flex gap-2 mb-5">
              <button onClick={()=>setScopeSel("section")} className="flex-1 px-3 py-2 rounded-lg text-xs" style={{background:scopeSel==="section"?"var(--primary)":"var(--surface)", color:scopeSel==="section"?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>Toute la section "{activeSection}"</button>
              <button onClick={()=>setScopeSel("sub")} className="flex-1 px-3 py-2 rounded-lg text-xs" style={{background:scopeSel==="sub"?"var(--primary)":"var(--surface)", color:scopeSel==="sub"?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>Sous-section "{activeSub}"</button>
            </div>

            <section className="mb-6">
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}><Eye size={14}/> Arrière-plan animé</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BACKDROPS).map(([k,b])=>(
                  <button key={k} onClick={()=>setOv({backdrop:k})} className="p-2 rounded-xl text-center transition" style={{background:(ov.backdrop||"")===k?"rgba(var(--glow),0.2)":"var(--surface)", border:`1px solid ${(ov.backdrop||"")===k?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                    <div className="text-xl">{b.emoji}</div><div className="text-[9px] leading-tight mt-1">{b.name}</div></button>
                ))}
                {Object.entries(customBackdrops).map(([k,b])=>(
                  <button key={k} onClick={()=>setOv({backdrop:k})} className="p-2 rounded-xl text-center transition relative group" style={{background:(ov.backdrop||"")===k?"rgba(var(--glow),0.2)":"var(--surface)", border:`1px solid ${(ov.backdrop||"")===k?"var(--primary)":"var(--accent)"}`, color:"var(--text)"}}>
                    <div className="text-xl">{b.particle}</div><div className="text-[9px] leading-tight mt-1">{b.name}</div>
                    <span onClick={(e)=>{ e.stopPropagation(); if(confirm("Supprimer ce fond ?")){ const c={...customBackdrops}; delete c[k]; setCustomBackdrops(c); } }} className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={10}/></span>
                  </button>
                ))}
              </div>
            </section>

            {/* GÉNÉRATEUR DE FOND */}
            <BackdropGenerator customBackdrops={customBackdrops} setCustomBackdrops={setCustomBackdrops} onApply={(k)=>setOv({backdrop:k})}/>


            <section className="mb-6">
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}><Paintbrush size={14}/> Couleurs</h3>
              {COLOR_KEYS.map(c=>{
                const cur = (ov.colors&&ov.colors[c.k]) || rgbFromVar(c.k, theme);
                return (
                  <div key={c.k} className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{color:"var(--text)"}}>{c.l}</span>
                    <input type="color" value={toHex(cur)} onChange={e=>setOv({colors:{...(ov.colors||{}), [c.k]:e.target.value}})}
                      className="w-12 h-8 rounded cursor-pointer bg-transparent" style={{border:"1px solid var(--border)"}}/>
                  </div>
                );
              })}
            </section>

            <button onClick={resetOv} className="w-full py-2 rounded-lg text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)"}}>
              ↺ Réinitialiser cette {scopeSel==="section"?"section":"sous-section"}
            </button>
          </>)}

          {tab==="sections" && (
            <section>
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}><Layout size={14}/> Mes deux grandes sections</h3>
              <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Renomme-les comme tu veux (ex : Yasmine, Yasmeen).</p>
              <ul className="space-y-1 mb-6">{sections.filter(s=>!s.custom).map(s=>(
                <li key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                  <span className="text-xs" style={{color:"var(--muted)"}}>{s.id==="witch"?"☾":"✿"}</span>
                  <input value={s.name} onChange={e=>setSections(sections.map(x=>x.id===s.id?{...x,name:e.target.value}:x))} className="bg-transparent outline-none flex-1 text-sm" style={{color:"var(--text)"}}/>
                </li>
              ))}</ul>

              <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}><Layout size={14}/> Sections custom</h3>
              <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Ajoute tes propres coins. Ex : "Lecture", "Yoga"...</p>
              <div className="flex gap-2 mb-3">
                <input value={newSection} onChange={e=>setNewSection(e.target.value)} placeholder="nom du coin..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
                <button onClick={()=>{ if(!newSection.trim()) return; setSections([...sections,{id:uid(),name:newSection.trim(),custom:true}]); setNewSection(""); }} className="px-3 rounded-lg" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={16}/></button>
              </div>
              <ul className="space-y-1">{sections.filter(s=>s.custom).map(s=>(
                <li key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                  <input value={s.name} onChange={e=>setSections(sections.map(x=>x.id===s.id?{...x,name:e.target.value}:x))} className="bg-transparent outline-none flex-1 text-sm" style={{color:"var(--text)"}}/>
                  <button onClick={()=>setSections(sections.filter(x=>x.id!==s.id))}><Trash2 size={14} style={{color:"var(--muted)"}}/></button>
                </li>
              ))}</ul>
            </section>
          )}

          {tab==="content" && (<>
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Ajouter un rituel custom</h3>
              <input placeholder="Titre" value={newRitual.title} onChange={e=>setNewRitual({...newRitual,title:e.target.value})} className="w-full px-3 py-2 mb-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
              <input placeholder="Ingrédients" value={newRitual.ingredients} onChange={e=>setNewRitual({...newRitual,ingredients:e.target.value})} className="w-full px-3 py-2 mb-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
              <textarea placeholder="Étapes" rows={3} value={newRitual.steps} onChange={e=>setNewRitual({...newRitual,steps:e.target.value})} className="w-full px-3 py-2 mb-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
              <button onClick={()=>{ if(!newRitual.title) return; setCustomRituals([...customRituals,{...newRitual,id:uid()}]); setNewRitual({title:"",ingredients:"",steps:""}); }} className="w-full py-2 rounded-lg text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>+ Ajouter au pool</button>
              {customRituals.length>0 && <ul className="mt-3 space-y-1 text-xs">{customRituals.map(r=>(<li key={r.id} className="flex justify-between px-2 py-1 rounded" style={{background:"var(--surface)"}}><span style={{color:"var(--text)"}}>{r.title}</span><button onClick={()=>setCustomRituals(customRituals.filter(x=>x.id!==r.id))}><X size={12} style={{color:"var(--muted)"}}/></button></li>))}</ul>}
            </section>
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Mes conseils witch</h3>
              <div className="flex gap-2 mb-2"><input value={newTip} onChange={e=>setNewTip(e.target.value)} placeholder="un conseil..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/><button onClick={()=>{ if(!newTip) return; setCustomTips([...customTips,{id:uid(),text:newTip}]); setNewTip(""); }} className="px-3 rounded-lg" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/></button></div>
              <ul className="space-y-1 text-xs">{customTips.map(t=>(<li key={t.id} className="flex justify-between px-2 py-1 rounded" style={{background:"var(--surface)"}}><span style={{color:"var(--text)"}}>{t.text}</span><button onClick={()=>setCustomTips(customTips.filter(x=>x.id!==t.id))}><X size={12} style={{color:"var(--muted)"}}/></button></li>))}</ul>
            </section>
            <section>
              <h3 className="text-sm uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Mes affirmations</h3>
              <div className="flex gap-2 mb-2"><input value={newAffirm} onChange={e=>setNewAffirm(e.target.value)} placeholder="je suis..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/><button onClick={()=>{ if(!newAffirm) return; setCustomAffirm([...customAffirm,{id:uid(),text:newAffirm}]); setNewAffirm(""); }} className="px-3 rounded-lg" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/></button></div>
              <ul className="space-y-1 text-xs">{customAffirm.map(t=>(<li key={t.id} className="flex justify-between px-2 py-1 rounded" style={{background:"var(--surface)"}}><span style={{color:"var(--text)"}}>{t.text}</span><button onClick={()=>setCustomAffirm(customAffirm.filter(x=>x.id!==t.id))}><X size={12} style={{color:"var(--muted)"}}/></button></li>))}</ul>
            </section>
          </>)}

          <button onClick={onClose} className="w-full mt-8 mb-4 py-3 rounded-2xl text-sm transition hover:scale-95"
            style={{background:"var(--primary)", color:"var(--bg)", paddingBottom:"calc(0.75rem + env(safe-area-inset-bottom))"}}>
            ✦ Terminer
          </button>
        </div>
      </aside>
    </div>
  );
}

/* helpers couleur */
function toHex(c){
  if(!c) return "#888888";
  if(c.startsWith("#")) return c.length===4 ? "#"+[...c.slice(1)].map(x=>x+x).join("") : c;
  const m=c.match(/rgba?\(([^)]+)\)/); if(!m) return "#888888";
  const [r,g,b]=m[1].split(",").map(x=>parseInt(x.trim()));
  return "#"+[r,g,b].map(x=>(x||0).toString(16).padStart(2,"0")).join("");
}
function rgbFromVar(key, theme){ return THEMES[theme]?.vars[key] || "#888888"; }

/* ============================================================
   ✦ SECTION RÊVES — ambiance dreamy Y2K (image 2)
   ============================================================ */
function dreamAnalysis(d) {
  const lucid = d.lucid;
  if (d.drTag==="dr") return lucid
    ? "✦ Rêve lucide DANS ta DR — c'est énorme ! Tu as gardé conscience pendant que tu y étais. Au réveil, écris vite chaque détail : ton cerveau vient de tracer le chemin vers ta réalité désirée."
    : "✦ Tu as frôlé ta DR cette nuit. Même sans lucidité, ton subconscient s'aligne. Relis ton script avant de dormir pour renforcer le pont.";
  if (d.drTag==="symptom") return "🌀 Symptôme de shifting détecté. Sensations de flottement, voix, vibrations, ou décor familier de ta DR = ton énergie se synchronise. Continue tes méthodes, tu te rapproches.";
  if (d.drTag==="premonition") return "🔮 Tu ressens une prémonition. Note la date et les détails précis. Reviens-y dans quelques semaines pour voir si ça se réalise — tiens un registre de tes synchronicités.";
  return "";
}

function DreamJournal({ entries, setEntries }) {
  const [editing, setEditing] = useState(null);
  const blank = { id:null, date:new Date().toISOString().slice(0,10), title:"", lucid:false, mood:"", symbols:"", content:"", drTag:"none" };
  const [draft, setDraft] = useState(blank);
  const save=()=>{ if(draft.id) setEntries(entries.map(e=>e.id===draft.id?draft:e)); else setEntries([{...draft,id:uid()},...entries]); setEditing(null); setDraft(blank); };

  return (
    <div className="rounded-3xl overflow-hidden" style={{
      border:"3px solid #c8a0e8",
      boxShadow:"0 0 40px rgba(200,160,255,0.4)",
      background:"linear-gradient(160deg, #4a3a7a 0%, #6a4a9a 40%, #8a5ab0 100%)"
    }}>
      {/* bandeau holographique */}
      <div className="relative px-6 py-5 text-center" style={{
        background:"linear-gradient(90deg, #b8a0e8, #e8a0d8, #a0d0e8, #b8a0e8)",
        backgroundSize:"300% 100%", animation:"holoShift 8s ease infinite",
        borderBottom:"2px solid #fff"
      }}>
        <h2 className="text-4xl" style={{fontFamily:'"Dancing Script", cursive', color:"#fff", textShadow:"2px 2px 0 #c060c0, 0 0 12px #fff"}}>
          ☁ Dream Journal ☁
        </h2>
        <p className="text-xs italic mt-1" style={{color:"#fff", textShadow:"1px 1px 2px #8040a0"}}>logs of my past dreams...</p>
        {/* étoiles scintillantes dans le bandeau */}
        {Array.from({length:12}).map((_,i)=>(
          <span key={i} className="absolute text-xs" style={{top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, color:"#fff", opacity:0.8, animation:`twinkle ${1.5+Math.random()*2}s ease-in-out infinite`}}>✦</span>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-0">
        {/* sidebar gauche */}
        <div className="md:col-span-1 p-4 space-y-3" style={{background:"rgba(40,20,70,0.6)", borderBottom:"1px solid rgba(255,255,255,0.2)"}}>
          <div className="rounded-lg p-3 text-[11px] leading-relaxed" style={{background:"rgba(60,40,90,0.6)", border:"1px solid #c8a0e8", color:"#e0d0f5"}}>
            Ici se logent les récits de tes rêves passés. Le symbole ✦ marque un rêve dont tu te souviens peu — note quand même, ton inconscient parle.
          </div>
          <button onClick={()=>{ setDraft(blank); setEditing("new"); }} className="w-full rounded-full px-4 py-2 text-sm font-bold" style={{background:"linear-gradient(180deg, #ff9ed8, #d870b0)", border:"1px solid #fff", color:"#fff", textShadow:"1px 1px 2px #a040a0"}}>
            + nouveau rêve
          </button>
        </div>

        {/* zone entries */}
        <div className="md:col-span-3 p-5">
          <div className="rounded-lg px-4 py-2 mb-4 inline-block" style={{background:"linear-gradient(180deg, #8a6ac0, #6a4a9a)", border:"1px solid #c8a0e8", color:"#fff", fontFamily:'"VT323", monospace', fontSize:"18px", textShadow:"1px 1px 2px #000"}}>
            ▸ entries...
          </div>

          {editing && (
            <div className="rounded-xl p-4 mb-4" style={{background:"rgba(255,255,255,0.12)", border:"2px solid #ff9ed8", backdropFilter:"blur(8px)"}}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="date" value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})} className="px-3 py-2 rounded bg-transparent outline-none text-sm" style={{border:"1px solid rgba(255,255,255,0.3)", color:"#fff"}}/>
                <input placeholder="Titre du rêve" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} className="px-3 py-2 rounded bg-transparent outline-none text-sm" style={{border:"1px solid rgba(255,255,255,0.3)", color:"#fff"}}/>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <label className="flex items-center gap-2 text-sm" style={{color:"#fff"}}><input type="checkbox" checked={draft.lucid} onChange={e=>setDraft({...draft,lucid:e.target.checked})}/> rêve lucide ✦</label>
                <input placeholder="émotion dominante" value={draft.mood} onChange={e=>setDraft({...draft,mood:e.target.value})} className="px-3 py-2 rounded bg-transparent outline-none text-sm" style={{border:"1px solid rgba(255,255,255,0.3)", color:"#fff"}}/>
              </div>
              <input placeholder="symboles présents (eau, chat, vol...)" value={draft.symbols} onChange={e=>setDraft({...draft,symbols:e.target.value})} className="w-full px-3 py-2 mb-2 rounded bg-transparent outline-none text-sm" style={{border:"1px solid rgba(255,255,255,0.3)", color:"#fff"}}/>
              <textarea placeholder="Raconte ton rêve..." rows={5} value={draft.content} onChange={e=>setDraft({...draft,content:e.target.value})} className="w-full px-3 py-2 mb-2 rounded bg-transparent outline-none text-sm" style={{border:"1px solid rgba(255,255,255,0.3)", color:"#fff"}}/>
              <label className="text-[11px] block mb-1" style={{color:"#e0d0f5"}}>🌀 Dream Linker — ce rêve est :</label>
              <select value={draft.drTag||"none"} onChange={e=>setDraft({...draft,drTag:e.target.value})} className="w-full px-3 py-2 mb-2 rounded bg-transparent outline-none text-sm" style={{border:"1px solid rgba(255,255,255,0.3)", color:"#fff"}}>
                <option style={{background:"#4a3a7a"}} value="none">un rêve normal</option>
                <option style={{background:"#4a3a7a"}} value="dr">✦ un rêve de ma DR</option>
                <option style={{background:"#4a3a7a"}} value="symptom">🌀 un symptôme de shifting</option>
                <option style={{background:"#4a3a7a"}} value="premonition">🔮 une prémonition</option>
              </select>
              {draft.drTag && draft.drTag!=="none" && (
                <div className="rounded-lg p-3 mb-2 text-[11px] leading-relaxed" style={{background:"rgba(255,158,216,0.15)", border:"1px solid #ff9ed8", color:"#fff"}}>
                  {dreamAnalysis(draft)}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={save} className="px-4 py-2 rounded text-sm" style={{background:"linear-gradient(180deg, #ff9ed8, #d870b0)", color:"#fff"}}>Enregistrer</button>
                <button onClick={()=>setEditing(null)} className="px-4 py-2 rounded text-sm" style={{background:"rgba(255,255,255,0.15)", color:"#fff"}}>Annuler</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {entries.map(e=>(
              <article key={e.id} onClick={()=>{ setDraft(e); setEditing(e.id); }} className="group rounded-xl p-4 cursor-pointer transition hover:scale-[1.01]" style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,200,240,0.3)", backdropFilter:"blur(6px)"}}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg" style={{fontFamily:'"VT323", monospace', color:"#ff9ed8", textShadow:"0 0 6px rgba(255,158,216,0.6)"}}>
                    {e.lucid && "✦ "}{e.title || "Rêve sans titre"}
                  </h3>
                  <span className="text-xs" style={{color:"#c8a0e8"}}>{e.date}</span>
                </div>
                {(e.mood||e.symbols) && <p className="text-[11px] mb-2" style={{color:"#d4b0e8"}}>{e.mood && `💭 ${e.mood}`}{e.mood&&e.symbols&&" · "}{e.symbols && `🔮 ${e.symbols}`}</p>}
                {e.drTag && e.drTag!=="none" && <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mb-2" style={{background:"rgba(255,158,216,0.25)", color:"#ffd0ee"}}>{e.drTag==="dr"?"✦ rêve de DR":e.drTag==="symptom"?"🌀 symptôme shifting":"🔮 prémonition"}</span>}
                <p className="text-sm leading-snug" style={{color:"#eaddf5", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden"}}>{e.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-flex items-center gap-1 text-xs" style={{color:"#ff9ed8"}}>✦ ouvrir & lire</span>
                  <button onClick={(ev)=>{ ev.stopPropagation(); if(confirm("Supprimer ce rêve ?")) setEntries(entries.filter(x=>x.id!==e.id)); }} className="text-xs opacity-0 group-hover:opacity-100 transition" style={{color:"#c8a0e8"}}><Trash2 size={12}/></button>
                </div>
              </article>
            ))}
            {entries.length===0 && !editing && <p className="text-center italic py-12 text-sm" style={{color:"#c8a0e8"}}>Aucun rêve noté. Clique sur "+ nouveau rêve" ☁</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ✦ APP
   ============================================================ */
const SUBTABS = {
  moi: [
    {k:"dashboard",label:"Mon Univers",icon:Heart},
    {k:"tasks",label:"To-do",icon:Check},
    {k:"habits",label:"Habitudes",icon:Star},
    {k:"goals",label:"Objectifs",icon:Target},
    {k:"passions",label:"Passions",icon:Film},
    {k:"wishlist",label:"Wishlist",icon:ShoppingBag},
    {k:"gratitude",label:"Gratitude",icon:Sparkles},
    {k:"mood",label:"Mood",icon:Sun},
    {k:"cycle",label:"Cycle",icon:Moon},
    {k:"comfort",label:"Comfort",icon:Heart},
    {k:"outfits",label:"Tenues",icon:Sparkle},
    {k:"ost",label:"OST 2026",icon:Music},
    {k:"journal",label:"Journal secret",icon:Lock},
  ],
  witch: [
    {k:"tavern",label:"Tavern",icon:BookMarked},
    {k:"mood",label:"Chaudron d'humeur",icon:Flame},
    {k:"moon",label:"La Lune",icon:Moon},
    {k:"wheel",label:"Roue de l'année",icon:Sun},
    {k:"pendulum",label:"Pendule",icon:Gem},
    {k:"ritual",label:"Rituel du jour",icon:Flame},
    {k:"grimoire",label:"Grimoire",icon:BookOpen},
    {k:"crystals",label:"Cristaux",icon:Gem},
    {k:"herbs",label:"Herbes",icon:Leaf},
    {k:"tarot",label:"Tarot",icon:Stars},
    {k:"shifting",label:"Shifting & DR",icon:Compass},
    {k:"anchor",label:"Ancre DR",icon:Zap},
    {k:"fairy",label:"Royaume Fée",icon:Flower2},
    {k:"astral",label:"Astral",icon:CloudMoon},
    {k:"dreams",label:"Rêves",icon:CloudMoon},
    {k:"intentions",label:"Manifest",icon:Wand2},
    {k:"bottle",label:"Bouteille à la mer",icon:Sparkle},
  ],
};

/* ============================================================
   ✦ MON UNIVERS — page d'accueil style Moonmilk Magic (éditable A→Z)
   ============================================================ */
/* ============================================================
   ✦ HUB SHIFTING — liste de DR + page script détaillée
   ============================================================ */
const DR_DEFAULT_SECTIONS = [
  { id:"general", label:"✦ Infos générales", icon:"🌙" },
  { id:"appearance", label:"✦ Apparence & style", icon:"💄" },
  { id:"family", label:"✦ Famille & origines", icon:"👨‍👩‍👧" },
  { id:"friends", label:"✦ Amis & entourage", icon:"💌" },
  { id:"daily", label:"✦ Vie quotidienne", icon:"☕" },
  { id:"school", label:"✦ École / Travail", icon:"📚" },
  { id:"home", label:"✦ Lieu de vie", icon:"🏡" },
  { id:"romance", label:"✦ Romance / S.O.", icon:"💗" },
  { id:"rules", label:"✦ Règles & intentions", icon:"⚖️" },
  { id:"safewords", label:"✦ Safe words", icon:"🔐" },
  { id:"method", label:"✦ Méthode favorite", icon:"🌀" },
  { id:"attempts", label:"✦ Tentatives & ressentis", icon:"📝" },
];

// Template d'accordéons par défaut (clonable, modifiable)
const DR_TEMPLATE = [
  { id:"perso", icon:"☾", title:"Information Personnelle", subs:[
    { id:"about", title:"à propos de moi", fields:[["⚡︎ name","Yasmine"],["✧ âge",""],["☾ groupe sanguin",""],["⋆ maison",""],["✦ identité",""]], text:"" },
    { id:"appearance", title:"appearance", text:"" },
    { id:"wardrobe", title:"wardrobe", text:"" },
    { id:"belongings", title:"belongings", text:"" },
    { id:"powers", title:"pouvoirs & capacités", text:"" },
    { id:"langs", title:"langues", text:"" },
  ]},
  { id:"relations", icon:"♡", title:"Relationships & more", subs:[
    { id:"family", title:"family", text:"" },
    { id:"friends", title:"friends", text:"" },
    { id:"know", title:"people I know", text:"" },
    { id:"love", title:"love interest", text:"" },
    { id:"scenarios", title:"scenarios", text:"" },
  ]},
  { id:"reality", icon:"✦", title:"Reality Information", subs:[
    { id:"mansion", title:"house / mansion", text:"" },
    { id:"tech", title:"technologies", text:"" },
    { id:"transport", title:"transportation", text:"" },
    { id:"places", title:"places", text:"" },
    { id:"memories", title:"core memories", text:"" },
  ]},
  { id:"important", icon:"⚡", title:"Important Information", subs:[
    { id:"hogwarts", title:"Hogwarts / univers", text:"" },
    { id:"education", title:"education", text:"" },
    { id:"world", title:"wizarding world", text:"" },
    { id:"timeline2", title:"reality & timeline", text:"" },
    { id:"letters", title:"letters", text:"" },
  ]},
  { id:"basic", icon:"☆", title:"Basic Information", subs:[
    { id:"timeline", title:"timeline", text:"" },
    { id:"safety", title:"safety & more", text:"" },
    { id:"visual", title:"visual", text:"" },
    { id:"lifa", title:"LIFA", text:"" },
  ]},
];
const DIVIDER_STYLES = {
  hearts:"❤︎ ❤︎ ❤︎ ❤︎ ❤︎ ❤︎ ❤︎ ❤︎ ❤︎ ❤︎ ❤︎",
  stars:"✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦",
  knots:"⋆ ❀ ⋆ ❀ ⋆ ❀ ⋆ ❀ ⋆ ❀ ⋆ ❀",
  bows:"🎀 ⋆ 🎀 ⋆ 🎀 ⋆ 🎀 ⋆ 🎀 ⋆ 🎀",
  sparkle:"˚ ✦ ⋆ ｡˚ ✦ ⋆ ｡˚ ✦ ⋆ ｡˚ ✦ ⋆ ｡",
};

function makeBlankDR() {
  return {
    id: uid(),
    name: "Nouvelle DR",
    cover: "",
    tag: "",
    sections: DR_DEFAULT_SECTIONS.map(s=>({...s, content:""})),
    gallery: [],
    playlist: "",
    quote: "",
    favorite: false,
    created: new Date().toISOString().slice(0,10),
  };
}

/* ============================================================
   ✦ SHIFTING DATA ANALYSER — stats des tentatives
   ============================================================ */
const SHIFT_METHODS_Q = ["Raven","Julia","Estelle","Alice","Pilow","Sunni","ондes Thêta","Visualisation","Affirmations","Autre"];
const SHIFT_SYMPTOMS = ["Vibrations","Flottement","Voix/sons","Engourdissement","Chaleur","Vu ma DR","Aucun"];
const SHIFT_MOODS = ["😊 sereine","😴 fatiguée","😢 triste","😰 stressée","🤩 excitée","😐 neutre"];
function ShiftAnalyser({ log, setLog, moon }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ method:"", symptom:"", mood:"", shadowWork:false, aligned:50, signs:"", timeSync:"" });
  const moonName = moon?.name || "—";

  const addEntry = () => {
    setLog([{ id:uid(), date:new Date().toISOString().slice(0,10), ...form, moonPhase:moonName, moonIdx:moon?.idx??null }, ...log]);
    setForm({ method:"", symptom:"", mood:"", shadowWork:false, aligned:50, signs:"", timeSync:"" });
    setOpen(false);
  };

  // analyse : meilleure combinaison
  const analysis = (()=>{
    if (log.length<3) return null;
    const byMethod = {}, byMoon = {};
    let shadowAvg=[0,0], noShadowAvg=[0,0];
    log.forEach(e=>{
      if(e.method){ byMethod[e.method]=byMethod[e.method]||[]; byMethod[e.method].push(e.aligned); }
      if(e.moonPhase){ byMoon[e.moonPhase]=byMoon[e.moonPhase]||[]; byMoon[e.moonPhase].push(e.aligned); }
      if(e.shadowWork){ shadowAvg[0]+=e.aligned; shadowAvg[1]++; } else { noShadowAvg[0]+=e.aligned; noShadowAvg[1]++; }
    });
    const avg = arr => arr.reduce((a,b)=>a+b,0)/arr.length;
    const best = obj => Object.entries(obj).map(([k,v])=>({k, a:avg(v), n:v.length})).sort((a,b)=>b.a-a.a)[0];
    const bestMethod = best(byMethod), bestMoon = best(byMoon);
    const shadowHelps = shadowAvg[1] && noShadowAvg[1] && (shadowAvg[0]/shadowAvg[1] > noShadowAvg[0]/noShadowAvg[1]);
    return { bestMethod, bestMoon, shadowHelps, globalAvg: Math.round(avg(log.map(e=>e.aligned))) };
  })();

  return (
    <div className="rounded-2xl p-5 mb-6" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🔬 Analyse de mes tentatives</h3>
        <button onClick={()=>setOpen(o=>!o)} className="px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>{open?"fermer":"+ noter une nuit"}</button>
      </div>
      <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Note tes variables après chaque tentative → l'app trouve ce qui marche pour toi.</p>

      {open && (
        <div className="rounded-xl p-4 mb-4 space-y-3" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>Méthode</p>
            <div className="flex flex-wrap gap-1.5">{SHIFT_METHODS_Q.map(m=>(<button key={m} onClick={()=>setForm({...form,method:m})} className="px-2.5 py-1 rounded-full text-[11px]" style={{background:form.method===m?"var(--primary)":"var(--surface2)", color:form.method===m?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{m}</button>))}</div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>Symptôme physique</p>
            <div className="flex flex-wrap gap-1.5">{SHIFT_SYMPTOMS.map(m=>(<button key={m} onClick={()=>setForm({...form,symptom:m})} className="px-2.5 py-1 rounded-full text-[11px]" style={{background:form.symptom===m?"var(--primary)":"var(--surface2)", color:form.symptom===m?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{m}</button>))}</div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>Humeur de la veille</p>
            <div className="flex flex-wrap gap-1.5">{SHIFT_MOODS.map(m=>(<button key={m} onClick={()=>setForm({...form,mood:m})} className="px-2.5 py-1 rounded-full text-[11px]" style={{background:form.mood===m?"var(--primary)":"var(--surface2)", color:form.mood===m?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{m}</button>))}</div>
          </div>
          <label className="flex items-center gap-2 text-xs" style={{color:"var(--text)"}}>
            <input type="checkbox" checked={form.shadowWork} onChange={e=>setForm({...form,shadowWork:e.target.checked})}/> J'ai fait du Shadow Work avant
          </label>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>Alignement ressenti : <b style={{color:"var(--accent)"}}>{form.aligned}%</b></p>
            <input type="range" min="0" max="100" value={form.aligned} onChange={e=>setForm({...form,aligned:parseInt(e.target.value)})} className="w-full"/>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>✨ Signes de proximité (mini-shifting)</p>
            <textarea value={form.signs} onChange={e=>setForm({...form,signs:e.target.value})} rows={2} placeholder="odeur de feu de bois, chuchotement, détachement corporel, flash d'image..." className="w-full bg-transparent outline-none text-xs" style={{border:"1px solid var(--border)", borderRadius:"8px", padding:"6px", color:"var(--text)"}}/>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>⏰ Time Sync (que fait ton perso DR à cet instant ?)</p>
            <input value={form.timeSync} onChange={e=>setForm({...form,timeSync:e.target.value})} placeholder="ex: il est 7h à Poudlard, mon perso s'éveille..." className="w-full bg-transparent outline-none text-xs" style={{border:"1px solid var(--border)", borderRadius:"8px", padding:"6px", color:"var(--text)"}}/>
          </div>
          <p className="text-[10px]" style={{color:"var(--muted)"}}>🌙 Phase auto : {moonName}</p>
          <button onClick={addEntry} className="w-full py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ enregistrer cette nuit</button>
        </div>
      )}

      {/* diagnostic */}
      {analysis ? (
        <div className="rounded-xl p-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
          <p className="text-sm mb-2" style={{color:"var(--text)"}}>📊 Sur <b>{log.length}</b> tentatives · alignement moyen <b style={{color:"var(--accent)"}}>{analysis.globalAvg}%</b></p>
          <p className="text-sm leading-relaxed" style={{color:"var(--text)"}}>
            ✦ Tu es la plus alignée (<b style={{color:"var(--accent)"}}>{Math.round(analysis.bestMethod.a)}%</b>) avec la méthode <b>{analysis.bestMethod.k}</b>
            {analysis.bestMoon && <> lorsque la lune est <b>{analysis.bestMoon.k}</b></>}
            {analysis.shadowHelps && <>, et le <b>Shadow Work</b> améliore tes résultats</>}.
          </p>
        </div>
      ) : (
        <p className="text-xs italic text-center py-2" style={{color:"var(--muted)"}}>Note au moins 3 nuits pour débloquer ton diagnostic personnalisé ✦ ({log.length}/3)</p>
      )}

      {/* mini historique */}
      {log.length>0 && (
        <div className="mt-3 flex gap-1 items-end" style={{height:"50px"}}>
          {log.slice(0,20).reverse().map(e=>(
            <div key={e.id} title={`${e.date} · ${e.aligned}%`} className="flex-1 rounded-t" style={{height:`${Math.max(8,e.aligned)}%`, background:"var(--primary)", opacity:0.4+e.aligned/200}}/>
          ))}
        </div>
      )}

      {/* registre des signes de proximité */}
      {log.some(e=>e.signs||e.timeSync) && (
        <div className="mt-4">
          <p className="text-xs font-bold mb-2" style={{color:"var(--accent)"}}>✨ Mes signes de proximité</p>
          <div className="space-y-2">
            {log.filter(e=>e.signs||e.timeSync).slice(0,8).map(e=>(
              <div key={e.id} className="rounded-lg p-2 text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <span className="text-[10px]" style={{color:"var(--muted)"}}>{e.date} · {e.moonPhase} · {e.aligned}%</span>
                {e.signs && <p style={{color:"var(--text)"}}>✨ {e.signs}</p>}
                {e.timeSync && <p className="italic" style={{color:"var(--muted)"}}>⏰ {e.timeSync}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShiftingHub({ drs, setDrs, shiftLog=[], setShiftLog=()=>{}, moon={} }) {
  const [openId, setOpenId] = useState(null);
  const open = drs.find(d=>d.id===openId);

  const newDR = () => { const d = makeBlankDR(); setDrs([d, ...drs]); setOpenId(d.id); };
  const updateDR = (id, patch) => setDrs(drs.map(d=>d.id===id?{...d,...patch}:d));
  const delDR = (id) => { if(confirm("Supprimer cette DR et tout son script ?")){ setDrs(drs.filter(d=>d.id!==id)); setOpenId(null); } };

  if (open) return <ShiftingScriptPage dr={open} onBack={()=>setOpenId(null)} onUpdate={p=>updateDR(open.id,p)} onDelete={()=>delDR(open.id)}/>;

  return (
    <div className="animate-fade-up">
      {/* DATA ANALYSER */}
      <ShiftAnalyser log={shiftLog} setLog={setShiftLog} moon={moon}/>

      {/* En-tête méthodes */}
      <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <h3 className="text-2xl mb-3" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Méthodes de shifting ✦</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">{SHIFTING_METHODS.map(m=>(
          <div key={m.name} className="rounded-xl p-3" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
            <p className="font-bold mb-1" style={{color:"var(--accent)"}}>{m.name}</p>
            <p style={{color:"var(--text)"}}>{m.desc}</p>
          </div>
        ))}</div>
      </div>

      {/* Titre + bouton + */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-3xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Mes Desired Realities ✦</h3>
          <p className="text-xs italic" style={{color:"var(--muted)"}}>Chaque DR a son propre script complet. Touche une carte pour ouvrir.</p>
        </div>
        <button onClick={newDR} className="flex items-center gap-1 px-4 py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>
          <Plus size={14}/> Nouvelle DR
        </button>
      </div>

      {/* Grille des DR */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {drs.map(d=>(
          <button key={d.id} onClick={()=>setOpenId(d.id)} className="group text-left rounded-2xl overflow-hidden transition hover:scale-[1.02]"
            style={{background:"var(--surface)", border:"1px solid var(--border)", boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}>
            <div className="relative" style={{aspectRatio:"4/3"}}>
              {d.cover
                ? <img src={d.cover} alt="" className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center text-5xl" style={{background:"linear-gradient(160deg, var(--surface2), var(--primary))"}}>🌙</div>}
              {d.favorite && <span className="absolute top-2 right-2 text-xl">⭐</span>}
              {d.tag && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px]" style={{background:"rgba(0,0,0,0.5)", color:"#fff", backdropFilter:"blur(4px)"}}>{d.tag}</span>}
            </div>
            <div className="p-4">
              <h4 className="text-xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}>{d.name}</h4>
              {d.quote && <p className="text-xs italic line-clamp-2" style={{color:"var(--muted)"}}>« {d.quote} »</p>}
              <p className="text-[10px] mt-2" style={{color:"var(--muted)"}}>créée le {d.created}</p>
            </div>
          </button>
        ))}
        {drs.length===0 && (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-12 italic" style={{color:"var(--muted)"}}>
            Aucune DR encore. Touche « Nouvelle DR » pour créer ton premier script ✦
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ TEMPLATE DE SCRIPT DR — accordéons modulaires éditables
   ============================================================ */
function DRAccordionTemplate({ dr, onUpdate }) {
  const tmpl = dr.tmpl || DR_TEMPLATE;
  const [openCat, setOpenCat] = useState({});
  const [openSub, setOpenSub] = useState({});
  const setTmpl = (t) => onUpdate({ tmpl: t });

  const loadDefault = () => { if(confirm("Charger le template complet (Poudlard/univers) ? Tes accordéons actuels seront remplacés.")) setTmpl(JSON.parse(JSON.stringify(DR_TEMPLATE))); };

  const updCat = (ci, patch) => setTmpl(tmpl.map((c,i)=>i===ci?{...c,...patch}:c));
  const updSub = (ci, si, patch) => setTmpl(tmpl.map((c,i)=>i===ci?{...c, subs:c.subs.map((s,j)=>j===si?{...s,...patch}:s)}:c));
  const addCat = () => setTmpl([...tmpl, {id:uid(), icon:"✦", title:"Nouvelle catégorie", subs:[]}]);
  const delCat = (ci) => { if(confirm("Supprimer cette catégorie ?")) setTmpl(tmpl.filter((_,i)=>i!==ci)); };
  const addSub = (ci) => setTmpl(tmpl.map((c,i)=>i===ci?{...c, subs:[...c.subs, {id:uid(), title:"nouvelle sous-section", text:""}]}:c));
  const delSub = (ci, si) => setTmpl(tmpl.map((c,i)=>i===ci?{...c, subs:c.subs.filter((_,j)=>j!==si)}:c));
  const addField = (ci,si) => updSub(ci,si,{ fields:[...(tmpl[ci].subs[si].fields||[]), ["✦ clé","valeur"]] });
  const updField = (ci,si,fi,k,v) => { const f=[...(tmpl[ci].subs[si].fields||[])]; f[fi]=[k,v]; updSub(ci,si,{fields:f}); };
  const delField = (ci,si,fi) => updSub(ci,si,{ fields:(tmpl[ci].subs[si].fields||[]).filter((_,j)=>j!==fi) });

  if (!dr.tmpl) return (
    <div className="rounded-2xl p-6 text-center mt-8" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px dashed var(--accent)"}}>
      <h3 className="text-xl mb-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>📖 Template de script structuré</h3>
      <p className="text-xs italic mb-4" style={{color:"var(--muted)"}}>Génère un squelette complet façon Notion (accordéons, fiche d'identité, bases de données) — entièrement modifiable.</p>
      <button onClick={loadDefault} className="px-5 py-2.5 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ générer mon template</button>
    </div>
  );

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>📖 Mon script structuré</h3>
        <button onClick={addCat} className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> catégorie</button>
      </div>

      <div className="space-y-2">
        {tmpl.map((cat,ci)=>(
          <div key={cat.id} className="rounded-2xl overflow-hidden" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            {/* en-tête catégorie */}
            <div className="flex items-center gap-2 p-3 cursor-pointer group" style={{background:"var(--surface2)"}} onClick={()=>setOpenCat(o=>({...o,[cat.id]:!o[cat.id]}))}>
              <span style={{transform:openCat[cat.id]?"rotate(90deg)":"none", transition:"transform .2s", color:"var(--accent)"}}>▸</span>
              <input value={cat.icon} onClick={e=>e.stopPropagation()} onChange={e=>updCat(ci,{icon:e.target.value})} className="w-7 text-center bg-transparent outline-none text-lg"/>
              <input value={cat.title} onClick={e=>e.stopPropagation()} onChange={e=>updCat(ci,{title:e.target.value})} className="flex-1 bg-transparent outline-none font-bold text-sm" style={{color:"var(--text)", fontFamily:'"Cinzel",serif'}}/>
              <button onClick={e=>{e.stopPropagation(); delCat(ci);}} className="opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><Trash2 size={13}/></button>
            </div>

            {/* sous-sections */}
            {openCat[cat.id] && (
              <div className="p-3 space-y-1.5">
                {cat.subs.map((sub,si)=>{
                  const sk = cat.id+sub.id;
                  return (
                  <div key={sub.id} className="rounded-xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
                    <div className="flex items-center gap-2 px-3 py-2 cursor-pointer group" style={{background:"var(--surface2)"}} onClick={()=>setOpenSub(o=>({...o,[sk]:!o[sk]}))}>
                      <span style={{transform:openSub[sk]?"rotate(90deg)":"none", transition:"transform .2s", color:"var(--accent)", fontSize:"11px"}}>▸</span>
                      <input value={sub.title} onClick={e=>e.stopPropagation()} onChange={e=>updSub(ci,si,{title:e.target.value})} className="flex-1 bg-transparent outline-none text-xs" style={{color:"var(--text)"}}/>
                      <button onClick={e=>{e.stopPropagation(); delSub(ci,si);}} className="opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={12}/></button>
                    </div>
                    {openSub[sk] && (
                      <div className="p-3 space-y-2" style={{background:"var(--surface)"}}>
                        {/* fiche d'identité clé/valeur */}
                        {(sub.fields||[]).map((f,fi)=>(
                          <div key={fi} className="flex items-center gap-2 group/f">
                            <input value={f[0]} onChange={e=>updField(ci,si,fi,e.target.value,f[1])} className="bg-transparent outline-none text-xs w-28 flex-shrink-0" style={{color:"var(--accent)"}}/>
                            <span style={{color:"var(--muted)"}}>:</span>
                            <input value={f[1]} onChange={e=>updField(ci,si,fi,f[0],e.target.value)} placeholder="..." className="flex-1 bg-transparent outline-none text-xs" style={{color:"var(--text)", borderBottom:"1px solid var(--border)"}}/>
                            <button onClick={()=>delField(ci,si,fi)} className="opacity-0 group-hover/f:opacity-100" style={{color:"var(--muted)"}}><X size={11}/></button>
                          </div>
                        ))}
                        <button onClick={()=>addField(ci,si)} className="text-[10px] flex items-center gap-1" style={{color:"var(--accent)"}}><Plus size={10}/> champ (clé: valeur)</button>
                        {/* texte libre */}
                        <textarea value={sub.text||""} onChange={e=>updSub(ci,si,{text:e.target.value})} rows={3} placeholder="écris ici..." className="w-full bg-transparent outline-none text-sm mt-1" style={{border:"1px solid var(--border)", borderRadius:"8px", padding:"6px", color:"var(--text)"}}/>
                      </div>
                    )}
                  </div>
                );})}
                <button onClick={()=>addSub(ci)} className="text-[11px] flex items-center gap-1 mt-1" style={{color:"var(--accent)"}}><Plus size={11}/> sous-section</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ CANVAS SECTION — papier avec zones de texte déplaçables + dessin
   ============================================================ */
function DraggableTextBox({ box, onChange, onDelete }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const start = (e) => {
    if (box.locked) return; // verrouillé → pas de déplacement
    if (e.target.closest(".box-content")) return;
    const pt = e.touches ? e.touches[0] : e;
    drag.current = { sx:pt.clientX, sy:pt.clientY, ox:box.x, oy:box.y };
    const move = (ev) => {
      const p = ev.touches ? ev.touches[0] : ev;
      onChange({ ...box, x: drag.current.ox + (p.clientX-drag.current.sx), y: drag.current.oy + (p.clientY-drag.current.sy) });
    };
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
  };
  useEffect(()=>{ if(ref.current && ref.current.innerHTML!==(box.html||"")) ref.current.innerHTML = box.html||""; }, [box.id]);
  return (
    <div className="absolute group" style={{ left:box.x, top:box.y, width:box.w||220, zIndex:box.z||10 }}>
      {box.locked ? (
        <button onClick={()=>onChange({...box, locked:false})} title="déverrouiller pour déplacer" className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] opacity-0 group-hover:opacity-100 transition z-10" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>🔒</button>
      ) : (
        <div onMouseDown={start} onTouchStart={start} className="flex items-center justify-between px-2 py-1 rounded-t-lg cursor-move" style={{background:"var(--primary)", opacity:0.9}}>
          <span className="text-[9px]" style={{color:"var(--bg)"}}>⠿ déplacer</span>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>onChange({...box, locked:true})} title="verrouiller" style={{color:"var(--bg)"}}>🔓</button>
            <button onClick={onDelete} style={{color:"var(--bg)"}}><X size={12}/></button>
          </div>
        </div>
      )}
      <div ref={ref} contentEditable suppressContentEditableWarning
        onInput={()=>onChange({ ...box, html: ref.current.innerHTML })}
        className={`box-content richnote p-2 outline-none text-sm ${box.locked?"rounded-lg":"rounded-b-lg"}`}
        style={{ background:box.bg||"rgba(255,255,255,0.92)", color:box.color||"#2a2a2a", minHeight:"50px", fontFamily:'"Caveat",cursive', fontSize:"16px", boxShadow: box.locked?"none":"0 2px 8px rgba(0,0,0,0.15)" }}/>
    </div>
  );
}

function DrawWidget({ box, onChange, onDelete }) {
  const drag = useRef(null);
  const cvRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [penColor, setPenColor] = useState("#7a4ae0");
  const [penSize, setPenSize] = useState(3);
  const draw = useRef(false);
  const W = box.w||300, H = box.h||220;

  const start = (e) => {
    if (box.locked) return;
    const pt = e.touches ? e.touches[0] : e;
    drag.current = { sx:pt.clientX, sy:pt.clientY, ox:box.x, oy:box.y };
    const move = (ev) => { const p = ev.touches?ev.touches[0]:ev; onChange({ ...box, x: drag.current.ox+(p.clientX-drag.current.sx), y: drag.current.oy+(p.clientY-drag.current.sy) }); };
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
  };
  useEffect(()=>{ const cv=cvRef.current; if(!cv) return; const ctx=cv.getContext("2d"); ctx.clearRect(0,0,cv.width,cv.height); if(box.drawing){ const img=new Image(); img.onload=()=>ctx.drawImage(img,0,0,cv.width,cv.height); img.src=box.drawing; } }, [box.id]);
  const pos=(e)=>{ const r=cvRef.current.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; return {x:(p.clientX-r.left)*(cvRef.current.width/r.width), y:(p.clientY-r.top)*(cvRef.current.height/r.height)}; };
  const sd=(e)=>{ e.preventDefault(); draw.current=true; const ctx=cvRef.current.getContext("2d"); const{x,y}=pos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const md=(e)=>{ if(!draw.current) return; e.preventDefault(); const ctx=cvRef.current.getContext("2d"); const{x,y}=pos(e); if(tool==="eraser"){ctx.globalCompositeOperation="destination-out";ctx.lineWidth=penSize*5;}else{ctx.globalCompositeOperation="source-over";ctx.strokeStyle=penColor;ctx.lineWidth=penSize;} ctx.lineCap="round";ctx.lineJoin="round"; ctx.lineTo(x,y); ctx.stroke(); };
  const ed=()=>{ if(!draw.current) return; draw.current=false; onChange({...box, drawing:cvRef.current.toDataURL("image/png")}); };

  return (
    <div className="absolute group" style={{ left:box.x, top:box.y, width:W, zIndex:box.z||10 }}>
      <div onMouseDown={start} onTouchStart={start} className="flex items-center justify-between px-2 py-1 rounded-t-lg" style={{background:"var(--accent)", cursor:box.locked?"default":"move"}}>
        <span className="text-[9px]" style={{color:"#fff"}}>🎨 {box.locked?"figé":"dessin"}</span>
        <div className="flex items-center gap-1.5">
          {!box.locked && <button onClick={()=>setTool(tool==="pen"?"eraser":"pen")} title="crayon/gomme" style={{color:"#fff", fontSize:"11px"}}>{tool==="pen"?"✏️":"🧽"}</button>}
          <button onClick={()=>onChange({...box, locked:!box.locked})} title="verrouiller" style={{color:"#fff"}}>{box.locked?"🔒":"🔓"}</button>
          <button onClick={onDelete} style={{color:"#fff"}}><X size={12}/></button>
        </div>
      </div>
      {!box.locked && tool==="pen" && (
        <div className="flex items-center gap-1 px-2 py-1" style={{background:"var(--surface2)"}}>
          {["#7a4ae0","#c0392b","#2a6a4a","#2a4a7a","#d4a017","#1a1a1e","#ff9ed8"].map(c=>(<button key={c} onClick={()=>setPenColor(c)} className="w-4 h-4 rounded-full" style={{background:c, border:penColor===c?"2px solid var(--accent)":"1px solid var(--border)"}}/>))}
          <input type="range" min="1" max="12" value={penSize} onChange={e=>setPenSize(parseInt(e.target.value))} className="w-12"/>
        </div>
      )}
      <canvas ref={cvRef} width={W*2} height={H*2}
        onMouseDown={box.locked?undefined:sd} onMouseMove={box.locked?undefined:md} onMouseUp={ed} onMouseLeave={ed}
        onTouchStart={box.locked?undefined:sd} onTouchMove={box.locked?undefined:md} onTouchEnd={ed}
        className="rounded-b-lg block" style={{ width:W, height:H, background:"rgba(255,255,255,0.92)", touchAction:"none", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", cursor:box.locked?"default":"crosshair" }}/>
    </div>
  );
}

function CanvasSection({ section, onUpdate }) {
  const canvas = section.canvas || { boxes:[] };
  const setCanvas = (patch) => onUpdate({ canvas: { ...canvas, ...patch } });
  const addBox = () => setCanvas({ boxes:[...(canvas.boxes||[]), { id:uid(), kind:"text", x:24, y:24+(canvas.boxes?.length||0)*16, w:240, html:"", z:10+(canvas.boxes?.length||0) }] });
  const addDraw = () => setCanvas({ boxes:[...(canvas.boxes||[]), { id:uid(), kind:"draw", x:24, y:24+(canvas.boxes?.length||0)*16, w:300, h:220, drawing:null, z:10+(canvas.boxes?.length||0) }] });
  const updBox = (b) => setCanvas({ boxes:canvas.boxes.map(x=>x.id===b.id?b:x) });
  const delBox = (id) => setCanvas({ boxes:canvas.boxes.filter(x=>x.id!==id) });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3 p-3 rounded-xl" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <button onClick={addBox} className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> zone de texte</button>
        <button onClick={addDraw} className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>🎨 zone de dessin</button>
        <span className="text-[10px] italic ml-auto" style={{color:"var(--muted)"}}>glisse par le bandeau · 🔒 pour figer</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden" style={{ background:"var(--surface)", border:"1px solid var(--border)", minHeight:"560px" }}>
        {(canvas.boxes||[]).length===0 && <p className="absolute inset-0 flex items-center justify-center text-sm italic" style={{color:"var(--muted)"}}>Ajoute une zone de texte ou de dessin ✦</p>}
        {(canvas.boxes||[]).map(b=> b.kind==="draw"
          ? <DrawWidget key={b.id} box={b} onChange={updBox} onDelete={()=>delBox(b.id)}/>
          : <DraggableTextBox key={b.id} box={b} onChange={updBox} onDelete={()=>delBox(b.id)}/>
        )}
      </div>
    </div>
  );
}

function ShiftingScriptPage({ dr, onBack, onUpdate, onDelete }) {
  const [activeSection, setActiveSection] = useState(dr.sections[0]?.id || "general");
  const [showSet, setShowSet] = useState(false);
  const currentSec = dr.sections.find(s=>s.id===activeSection);

  const updateSection = (id, patch) => onUpdate({ sections: dr.sections.map(s=>s.id===id?{...s,...patch}:s) });
  const addSection = () => {
    const id = "custom_"+uid();
    onUpdate({ sections: [...dr.sections, { id, label:"✦ Nouvelle section", icon:"✨", content:"" }] });
    setActiveSection(id);
  };
  const delSection = (id) => {
    if (dr.sections.length<=1) return;
    if (!confirm("Supprimer cette section ?")) return;
    const newSecs = dr.sections.filter(s=>s.id!==id);
    onUpdate({ sections: newSecs });
    setActiveSection(newSecs[0]?.id);
  };
  const addGalleryImg = () => onUpdate({ gallery: [...dr.gallery, { id:uid(), url:"", caption:"" }] });
  const updateGalleryImg = (id, patch) => onUpdate({ gallery: dr.gallery.map(g=>g.id===id?{...g,...patch}:g) });
  const delGalleryImg = (id) => onUpdate({ gallery: dr.gallery.filter(g=>g.id!==id) });

  // thème indépendant pour cette DR
  const drTheme = dr.theme && THEMES[dr.theme] ? THEMES[dr.theme] : null;
  const drVars = drTheme ? { ...drTheme.vars } : {};
  const [showTheme, setShowTheme] = useState(false);

  return (
    <div className="animate-fade-up" style={drTheme ? drVars : undefined}>
      {/* fond image propre à la DR */}
      {dr.bgImage && <div className="fixed inset-0 -z-10 pointer-events-none" style={{background:`url(${dr.bgImage}) center/cover fixed`, opacity:dr.bgOpacity??0.5}}/>}
      {/* Barre de retour */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>
          ← retour à mes DR
        </button>
        <button onClick={()=>onUpdate({favorite:!dr.favorite})} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:dr.favorite?"#e0c97a":"var(--text)"}}>
          {dr.favorite ? "⭐ favorite" : "☆ ajouter aux favoris"}
        </button>
        <button onClick={()=>setShowTheme(s=>!s)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>🎨 thème</button>
        <button onClick={onDelete} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}>
          <Trash2 size={12} className="inline mr-1"/> supprimer DR
        </button>
      </div>

      {/* picker thème de la DR */}
      {showTheme && (
        <div className="rounded-2xl p-4 mb-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
          <p className="text-xs mb-2" style={{color:"var(--accent)"}}>🎨 Ambiance de cette DR (indépendante du reste)</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={()=>onUpdate({theme:null})} className="px-3 py-1.5 rounded-full text-xs" style={{background:!dr.theme?"var(--primary)":"var(--surface2)", color:!dr.theme?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>défaut</button>
            {Object.entries(THEMES).map(([k,t])=>(
              <button key={k} onClick={()=>onUpdate({theme:k})} className="px-3 py-1.5 rounded-full text-xs" style={{background:dr.theme===k?"var(--primary)":"var(--surface2)", color:dr.theme===k?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{t.icon} {t.name}</button>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>Image de fond de la DR</p>
          <ImgPicker value={dr.bgImage} onChange={v=>onUpdate({bgImage:v})} placeholder="URL image de fond"/>
          {dr.bgImage && (<>
            <p className="text-[10px] mt-2" style={{color:"var(--muted)"}}>Opacité : {Math.round((dr.bgOpacity??0.5)*100)}%</p>
            <input type="range" min="0.1" max="1" step="0.05" value={dr.bgOpacity??0.5} onChange={e=>onUpdate({bgOpacity:parseFloat(e.target.value)})} className="w-full"/>
            <button onClick={()=>onUpdate({bgImage:null})} className="text-[11px] underline mt-1" style={{color:"var(--muted)"}}>retirer l'image</button>
          </>)}
        </div>
      )}

      {/* HERO : couverture + nom + citation */}
      <div className="relative rounded-3xl overflow-hidden mb-6" style={{border:"1px solid var(--border)", boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
        <div className="relative" style={{aspectRatio:"16/7", minHeight:"200px",
          background: dr.cover ? `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.5)), url(${dr.cover}) center/cover` : `linear-gradient(160deg, var(--surface2) 0%, var(--primary) 100%)`}}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            {dr.crest && <img src={dr.crest} alt="" className="w-16 h-16 object-contain mb-2" style={{filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.5))"}}/>}
            <p className="text-sm tracking-[0.3em] mb-1" style={{color:"#fff", textShadow:"0 1px 6px rgba(0,0,0,0.6)", animation:"twinkle 3s ease-in-out infinite"}}>✧ ˚ ⁺</p>
            <input value={dr.name} onChange={e=>onUpdate({name:e.target.value})}
              className="bg-transparent outline-none text-center text-3xl sm:text-5xl"
              style={{fontFamily:'"Dancing Script",cursive', color:"#fff", textShadow:"0 2px 12px rgba(0,0,0,0.6)"}}/>
            <p className="text-sm tracking-[0.3em] mt-1" style={{color:"#fff", textShadow:"0 1px 6px rgba(0,0,0,0.6)", animation:"twinkle 3.5s ease-in-out infinite"}}>⁺ ˚ ✧</p>
            <input value={dr.quote} onChange={e=>onUpdate({quote:e.target.value})} placeholder="une citation, un mot, un mantra pour cette DR..."
              className="mt-2 w-full max-w-md bg-transparent outline-none text-center text-sm italic"
              style={{color:"#fff", textShadow:"0 1px 6px rgba(0,0,0,0.6)"}}/>
          </div>
        </div>
        {/* callout temporel */}
        <div className="px-4 py-3 flex items-center justify-center gap-2" style={{background:"var(--surface2)", borderBottom:"1px solid var(--border)"}}>
          <div className="rounded-xl px-4 py-2 flex items-center gap-2 text-sm" style={{background:"rgba(var(--glow),0.12)", border:"1px solid var(--accent)"}}>
            <span>⏳</span>
            <input value={dr.timeRule||""} onChange={e=>onUpdate({timeRule:e.target.value})} placeholder="1 heure [CR] = 1 semaine [DR] !"
              className="bg-transparent outline-none text-center" style={{color:"var(--accent)", minWidth:"200px"}}/>
          </div>
          <button onClick={()=>setShowSet(s=>!s)} title="modifier couverture, tag, blason" className="p-2 rounded-full" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)"}}>✏️</button>
        </div>
        {showSet && (
        <div className="grid sm:grid-cols-3 gap-3 p-4" style={{background:"var(--surface)"}}>
          <div>
            <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Couverture (bannière)</label>
            <div className="mt-1"><ImgPicker value={dr.cover} onChange={v=>onUpdate({cover:v})} placeholder="URL couverture"/></div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Tag / catégorie</label>
            <input value={dr.tag} onChange={e=>onUpdate({tag:e.target.value})} placeholder="ex: Hogwarts, K-pop, MCU..."
              className="w-full text-xs px-2 py-1 mt-1 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Blason / icône (PNG transparent conseillé)</label>
            <div className="mt-1"><ImgPicker value={dr.crest} onChange={v=>onUpdate({crest:v})} placeholder="petit logo en haut"/></div>
          </div>
        </div>
        )}
      </div>

      {/* Playlist — tourne-disque */}
      <VinylPlayer link={dr.playlist} cover={dr.cover} label={dr.name ? `playlist de ${dr.name}` : "ma playlist"} onChangeLink={(v)=>onUpdate({playlist:v})}/>

      {/* Layout : barre latérale sections + contenu */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* nav sections */}
        <nav className="md:col-span-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {dr.sections.map(s=>(
            <button key={s.id} onClick={()=>setActiveSection(s.id)}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left whitespace-nowrap md:whitespace-normal transition"
              style={{
                background: activeSection===s.id ? "var(--primary)" : "var(--surface)",
                color: activeSection===s.id ? "var(--bg)" : "var(--text)",
                border:"1px solid var(--border)"
              }}>
              <span>{s.icon}</span>
              <span className="text-xs md:text-sm">{s.label.replace("✦ ","")}</span>
            </button>
          ))}
          <button onClick={addSection} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs italic" style={{background:"transparent", border:"1px dashed var(--border)", color:"var(--muted)"}}>
            <Plus size={12}/> ajouter une section
          </button>
        </nav>

        {/* contenu section active */}
        <div className="md:col-span-3 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)", minHeight:"400px"}}>
          {currentSec && (<>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <input value={currentSec.label} onChange={e=>updateSection(currentSec.id,{label:e.target.value})}
                className="text-2xl bg-transparent outline-none flex-1 min-w-0"
                style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}/>
              {currentSec.id.startsWith("custom_") && (
                <button onClick={()=>delSection(currentSec.id)} className="text-xs flex items-center gap-1" style={{color:"#c08080"}}>
                  <Trash2 size={12}/> supprimer
                </button>
              )}
            </div>
            <RichNote
              page={{ id: dr.id+":"+currentSec.id, html: currentSec.contentHtml, body: currentSec.content, noteFont: currentSec.noteFont, paper: currentSec.paper, stickers: currentSec.stickers }}
              updatePage={(patch)=>{
                const p={}; if("html" in patch) p.contentHtml=patch.html; if("noteFont" in patch) p.noteFont=patch.noteFont; if("_lastPick" in patch) p._lastPick=patch._lastPick; if("paper" in patch) p.paper=patch.paper; if("stickers" in patch) p.stickers=patch.stickers;
                updateSection(currentSec.id, p);
              }}
              compact
            />
          </>)}
        </div>
      </div>

      {/* Galerie d'images */}
      <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Galerie & vision board ✦</h3>
          <button onClick={addGalleryImg} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>
            <Plus size={12}/> ajouter une image
          </button>
        </div>
        {dr.gallery.length===0 && <p className="text-sm italic text-center py-6" style={{color:"var(--muted)"}}>Aucune image. Ajoute des photos pour visualiser ta DR.</p>}

        {/* tableau Pinterest */}
        <div className="rounded-xl p-3 mb-4" style={{background:"var(--surface2)", border:"1px dashed var(--accent)"}}>
          <p className="text-[11px] mb-2" style={{color:"var(--accent)"}}>📌 Mon tableau Pinterest (s'affiche en entier ci-dessous)</p>
          <input value={dr.pinBoard||""} onChange={e=>onUpdate({pinBoard:e.target.value})} placeholder="colle le lien de ton tableau Pinterest..."
            className="w-full text-xs px-2 py-1.5 rounded bg-transparent outline-none mb-2" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          {dr.pinBoard && <div className="rounded-lg overflow-hidden"><PinterestPin url={dr.pinBoard} boardCols={4} boardRows={3}/></div>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {dr.gallery.map(g=>(
            <div key={g.id} className="group relative rounded-xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
              {g.url
                ? <img src={g.url} alt="" className="w-full object-cover" style={{aspectRatio:"1"}}/>
                : <div className="w-full flex items-center justify-center text-3xl" style={{aspectRatio:"1", background:"var(--surface2)"}}>🖼️</div>}
              <div className="p-2" style={{background:"var(--surface2)"}}>
                <div className="mb-1"><ImgPicker value={g.url} onChange={v=>updateGalleryImg(g.id,{url:v})} placeholder="URL image" small/></div>
                <input value={g.caption} onChange={e=>updateGalleryImg(g.id,{caption:e.target.value})} placeholder="légende..."
                  className="w-full text-xs px-1 py-0.5 rounded bg-transparent outline-none italic" style={{color:"var(--muted)"}}/>
              </div>
              <button onClick={()=>delGalleryImg(g.id)} className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition" style={{background:"rgba(0,0,0,0.6)", color:"#fff"}}>
                <X size={12}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RÈGLES DE SÉCURITÉ (toggles) */}
      <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🛡️ Règles absolues de sécurité</h3>
          <button onClick={()=>onUpdate({safety:[...(dr.safety||[]), {id:uid(), text:"Nouvelle règle...", on:true}]})} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> ajouter</button>
        </div>
        {(!dr.safety || dr.safety.length===0) && (
          <button onClick={()=>onUpdate({safety:[
            {id:uid(),text:"Je ne peux pas ressentir de douleur extrême",on:true},
            {id:uid(),text:"Je me souviens de tout à mon retour",on:true},
            {id:uid(),text:"1 heure CR = 1 mois DR",on:true},
            {id:uid(),text:"Mon mot de passe de retour fonctionne toujours",on:true},
          ]})} className="text-sm italic underline" style={{color:"var(--accent)"}}>✦ charger les règles de base</button>
        )}
        <div className="space-y-2">
          {(dr.safety||[]).map(s=>(
            <div key={s.id} className="flex items-center gap-3 rounded-xl p-3 group" style={{background: s.on?"rgba(var(--glow),0.12)":"var(--surface2)", border:`1px solid ${s.on?"var(--accent)":"var(--border)"}`}}>
              <button onClick={()=>onUpdate({safety:dr.safety.map(x=>x.id===s.id?{...x,on:!x.on}:x)})}
                className="flex-shrink-0 rounded-full transition" style={{width:"42px", height:"24px", background:s.on?"var(--primary)":"var(--border)", position:"relative"}}>
                <span style={{position:"absolute", top:"2px", left:s.on?"20px":"2px", width:"20px", height:"20px", borderRadius:"50%", background:"#fff", transition:"left .2s"}}/>
              </button>
              <input value={s.text} onChange={e=>onUpdate({safety:dr.safety.map(x=>x.id===s.id?{...x,text:e.target.value}:x)})} className="flex-1 bg-transparent outline-none text-sm" style={{color:"var(--text)"}}/>
              {s.on && <span title="protection active" style={{color:"var(--accent)"}}>🛡️</span>}
              <button onClick={()=>onUpdate({safety:dr.safety.filter(x=>x.id!==s.id)})} className="opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={14}/></button>
            </div>
          ))}
        </div>
        {(dr.safety||[]).some(s=>s.on) && <p className="text-xs italic mt-3 text-center" style={{color:"var(--accent)"}}>✦ Bouclier lumineux actif — ton subconscient a enregistré ta sécurité ✦</p>}
      </div>

      {/* GARDE-ROBE & INVENTAIRE */}
      <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <h3 className="text-2xl mb-4" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>👗 Garde-robe & sac à dos</h3>
        <div className="grid md:grid-cols-2 gap-5">
          {/* tenues */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm uppercase tracking-widest" style={{color:"var(--muted)"}}>Mes tenues</h4>
              <button onClick={()=>onUpdate({wardrobe:[...(dr.wardrobe||[]), {id:uid(), name:"Tenue", img:""}]})} className="text-xs flex items-center gap-1" style={{color:"var(--accent)"}}><Plus size={12}/> ajouter</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(dr.wardrobe||[]).map(w=>(
                <div key={w.id} className="group relative rounded-xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
                  {w.img ? <img src={w.img} alt="" className="w-full object-cover" style={{aspectRatio:"3/4"}}/> : <div className="w-full flex items-center justify-center text-2xl" style={{aspectRatio:"3/4", background:"var(--surface2)"}}>👗</div>}
                  <div className="p-1.5" style={{background:"var(--surface2)"}}>
                    <div className="mb-0.5"><ImgPicker value={w.img} onChange={v=>onUpdate({wardrobe:dr.wardrobe.map(x=>x.id===w.id?{...x,img:v}:x)})} placeholder="URL" small/></div>
                    <input value={w.name} onChange={e=>onUpdate({wardrobe:dr.wardrobe.map(x=>x.id===w.id?{...x,name:e.target.value}:x)})} placeholder="nom" className="w-full text-[11px] bg-transparent outline-none" style={{color:"var(--text)"}}/>
                  </div>
                  <button onClick={()=>onUpdate({wardrobe:dr.wardrobe.filter(x=>x.id!==w.id)})} className="absolute top-1 right-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100" style={{background:"rgba(0,0,0,0.6)", color:"#fff"}}><X size={10}/></button>
                </div>
              ))}
            </div>
          </div>
          {/* inventaire */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm uppercase tracking-widest" style={{color:"var(--muted)"}}>🎒 Mon sac à dos</h4>
              <button onClick={()=>onUpdate({inventory:[...(dr.inventory||[]), {id:uid(), text:"objet magique"}]})} className="text-xs flex items-center gap-1" style={{color:"var(--accent)"}}><Plus size={12}/> ajouter</button>
            </div>
            <div className="space-y-1.5">
              {(dr.inventory||[]).map(it=>(
                <div key={it.id} className="flex items-center gap-2 rounded-lg p-2 group" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
                  <span>✦</span>
                  <input value={it.text} onChange={e=>onUpdate({inventory:dr.inventory.map(x=>x.id===it.id?{...x,text:e.target.value}:x)})} className="flex-1 bg-transparent outline-none text-sm" style={{color:"var(--text)"}}/>
                  <button onClick={()=>onUpdate({inventory:dr.inventory.filter(x=>x.id!==it.id)})} className="opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={12}/></button>
                </div>
              ))}
              {(!dr.inventory||dr.inventory.length===0) && <p className="text-xs italic" style={{color:"var(--muted)"}}>baguette, grimoire, bijou de protection...</p>}
            </div>
          </div>
        </div>
      </div>

      {/* TEMPLATE STRUCTURÉ (accordéons) */}
      <DRAccordionTemplate dr={dr} onUpdate={onUpdate}/>

      {/* SCÉNARIOS WHAT IF */}
      <DRScenarios dr={dr} onUpdate={onUpdate}/>

      {/* RELATIONS, CARTE, GAZETTE */}
      <DRSocialGraph dr={dr} onUpdate={onUpdate}/>
      <DRMap dr={dr} onUpdate={onUpdate}/>
      <DRGazette dr={dr} onUpdate={onUpdate}/>
    </div>
  );
}

/* Simulateur de scénarios immersifs */
function DRScenarios({ dr, onUpdate }) {
  const [immersive, setImmersive] = useState(null);
  const scenarios = dr.scenarios || [];
  return (
    <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🎭 Mes scénarios clés</h3>
        <button onClick={()=>onUpdate({scenarios:[...scenarios, {id:uid(), title:"Nouvelle scène", text:""}]})} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> ajouter</button>
      </div>
      <div className="space-y-3">
        {scenarios.map(sc=>(
          <div key={sc.id} className="rounded-xl p-3 group" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
            <div className="flex items-center gap-2 mb-2">
              <input value={sc.title} onChange={e=>onUpdate({scenarios:scenarios.map(x=>x.id===sc.id?{...x,title:e.target.value}:x)})} className="flex-1 text-lg bg-transparent outline-none" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}/>
              <button onClick={()=>setImmersive(sc)} className="px-3 py-1 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ visualiser</button>
              <button onClick={()=>onUpdate({scenarios:scenarios.filter(x=>x.id!==sc.id)})} className="opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={14}/></button>
            </div>
            <textarea value={sc.text} onChange={e=>onUpdate({scenarios:scenarios.map(x=>x.id===sc.id?{...x,text:e.target.value}:x)})} rows={3} placeholder="Décris le début de ta scène... « Le jour où j'apprends à voler... »" className="w-full bg-transparent outline-none text-sm" style={{color:"var(--text)", fontFamily:'"Caveat",cursive', fontSize:"17px"}}/>
          </div>
        ))}
        {scenarios.length===0 && <p className="text-sm italic text-center py-4" style={{color:"var(--muted)"}}>Écris tes scènes à shadow-shifter ✦</p>}
      </div>

      {/* mode immersion */}
      {immersive && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 animate-fade-up" style={{background:"linear-gradient(160deg, var(--bg), var(--bg2))"}}>
          <Backdrop kind="dreamy"/>
          <div className="relative max-w-lg text-center">
            <h2 className="text-3xl mb-6" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)", textShadow:"0 0 20px rgba(var(--glow),0.5)"}}>{immersive.title}</h2>
            <p className="text-xl leading-relaxed" style={{fontFamily:'"Cormorant Garamond",serif', color:"var(--text)", lineHeight:"1.9"}}>{immersive.text||"(écris ta scène pour la visualiser)"}</p>
            <p className="text-sm italic mt-8" style={{color:"var(--muted)"}}>Ferme les yeux... laisse la scène se dérouler... 🌙</p>
            <button onClick={()=>setImmersive(null)} className="mt-6 px-5 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>revenir</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 👥 Tableau des relations */
const REL_LEVELS = [
  {k:"ennemi", l:"Ennemi", emoji:"⚔️", color:"#c85a5a"},
  {k:"connaissance", l:"Connaissance", emoji:"🤝", color:"#9a9aa8"},
  {k:"ami", l:"Ami", emoji:"💛", color:"#e8c860"},
  {k:"meilleur", l:"Meilleur ami", emoji:"💚", color:"#6ac09a"},
  {k:"amoureux", l:"Amoureux", emoji:"💗", color:"#e87a9a"},
  {k:"ame", l:"Âme sœur", emoji:"💞", color:"#d060c0"},
];
const REL_LINES = {
  amoureux:["« Je te chercherais dans mille vies. »","« Tu es mon endroit préféré. »","« Reste encore un peu. »"],
  ame:["« Je t'ai reconnue avant même de te voir. »","« Toi et moi, contre le reste du monde. »"],
  meilleur:["« On est une équipe, n'oublie jamais ça. »","« Je serai toujours là, peu importe quoi. »"],
  ami:["« Hé, ça faisait longtemps ! »","« Allez viens, on va s'amuser. »"],
  connaissance:["« Oh, salut... on se connaît, non ? »"],
  ennemi:["« Ne crois pas que j'ai oublié. »","« Tu ne devrais pas être là. »"],
};
function DRSocialGraph({ dr, onUpdate }) {
  const people = dr.people || [];
  const [line, setLine] = useState(null);
  const [openId, setOpenId] = useState(null);
  const add = ()=>{ const id=uid(); onUpdate({people:[...people,{id,name:"",lastname:"",img:"",level:"ami",affinity:50,photos:[],background:"",personality:"",relation:"",scenarios:""}]}); setOpenId(id); };
  const upd = (id,patch)=>onUpdate({people:people.map(p=>p.id===id?{...p,...patch}:p)});
  const speak = (p)=>{ const pool=REL_LINES[p.level]||REL_LINES.ami; setLine({name:p.name||"?", text:pool[Math.floor(Math.random()*pool.length)]}); };
  const cur = people.find(p=>p.id===openId);

  return (
    <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>👥 Mon entourage en DR</h3>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> ajouter</button>
      </div>

      {/* GALERIE DE CARTES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {people.map(p=>{
          const lvl = p.level?.startsWith("custom:")
            ? (p.customRoles?.[parseInt(p.level.split(":")[1])] ? {...p.customRoles[parseInt(p.level.split(":")[1])], emoji:"✦"} : REL_LEVELS[2])
            : (REL_LEVELS.find(l=>l.k===p.level)||REL_LEVELS[2]);
          return (
          <button key={p.id} onClick={()=>setOpenId(p.id)} className="group relative rounded-2xl overflow-hidden text-left transition hover:scale-[1.03]" style={{border:`2px solid ${lvl.color}`, background:"var(--surface2)", boxShadow:`0 4px 16px ${lvl.color}33`}}>
            {/* visage */}
            <div className="relative" style={{aspectRatio:"3/4", background: p.img?`url(${p.img}) center/cover`:"linear-gradient(160deg, var(--surface2), var(--surface))"}}>
              {!p.img && <div className="absolute inset-0 flex items-center justify-center text-4xl">{lvl.emoji}</div>}
              <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)"}}/>
              {/* badge rôle lumineux */}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{background:lvl.color, color:"#fff", boxShadow:`0 0 10px ${lvl.color}`}}>{lvl.emoji} {lvl.l}</span>
              {/* nom */}
              <div className="absolute bottom-0 inset-x-0 p-2">
                <p className="text-sm leading-tight" style={{fontFamily:'"Dancing Script",cursive', color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.8)", fontSize:"17px"}}>{p.name||"Sans nom"}</p>
                {p.lastname && <p className="text-[10px]" style={{color:"#fff", opacity:0.85}}>{p.lastname}</p>}
              </div>
            </div>
          </button>
        );})}
        {people.length===0 && <p className="col-span-full text-center italic py-6 text-sm" style={{color:"var(--muted)"}}>Ajoute les personnages de ta DR — crush, meilleure amie, rival... ✦</p>}
      </div>

      {/* PROFIL DÉTAILLÉ (plein écran) */}
      {cur && (()=>{
        const lvl = cur.level?.startsWith("custom:")
          ? (cur.customRoles?.[parseInt(cur.level.split(":")[1])] ? {...cur.customRoles[parseInt(cur.level.split(":")[1])], emoji:"✦"} : REL_LEVELS[2])
          : (REL_LEVELS.find(l=>l.k===cur.level)||REL_LEVELS[2]);
        const photos = cur.photos||[];
        return (
        <div className="fixed inset-0 z-[80] overflow-y-auto animate-fade-up" style={{background:"rgba(10,8,20,0.85)", backdropFilter:"blur(6px)"}} onClick={()=>setOpenId(null)}>
          <div className="min-h-full flex items-start justify-center p-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl overflow-hidden" style={{background:"var(--bg2)", border:`2px solid ${lvl.color}`}} onClick={e=>e.stopPropagation()}>
              {/* hero */}
              <div className="relative" style={{minHeight:"200px", background: cur.img?`linear-gradient(to top, var(--bg2), transparent 60%), url(${cur.img}) center/cover`:`linear-gradient(160deg, ${lvl.color}44, var(--surface))`}}>
                <button onClick={()=>setOpenId(null)} className="absolute top-3 right-3 p-2 rounded-full" style={{background:"rgba(0,0,0,0.5)", color:"#fff"}}><X size={16}/></button>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:lvl.color, color:"#fff", boxShadow:`0 0 12px ${lvl.color}`}}>{lvl.emoji} {lvl.l}</span>
                  <div className="flex gap-2 items-end mt-1">
                    <input value={cur.name} onChange={e=>upd(cur.id,{name:e.target.value})} placeholder="prénom" className="bg-transparent outline-none text-3xl" style={{fontFamily:'"Dancing Script",cursive', color:"#fff", textShadow:"0 2px 8px rgba(0,0,0,0.8)"}}/>
                    <input value={cur.lastname||""} onChange={e=>upd(cur.id,{lastname:e.target.value})} placeholder="nom" className="bg-transparent outline-none text-lg pb-1" style={{color:"#fff", textShadow:"0 2px 8px rgba(0,0,0,0.8)"}}/>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* photo principale + rôle + affinité */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Photo principale</label>
                    <div className="mt-1"><ImgPicker value={cur.img} onChange={v=>upd(cur.id,{img:v})} placeholder="URL visage"/></div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Rôle pour moi</label>
                    <select value={cur.level} onChange={e=>upd(cur.id,{level:e.target.value})} className="w-full mt-1 text-xs px-2 py-2 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}>
                      {REL_LEVELS.map(l=>(<option key={l.k} value={l.k} style={{background:"var(--bg2)"}}>{l.emoji} {l.l}</option>))}
                      {(cur.customRoles||[]).map((r,i)=>(<option key={"c"+i} value={"custom:"+i} style={{background:"var(--bg2)"}}>✦ {r.l}</option>))}
                    </select>
                  </div>
                </div>

                {/* rôle personnalisé */}
                <div className="rounded-xl p-3" style={{background:"var(--surface)", border:"1px dashed var(--accent)"}}>
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>✦ Créer un rôle personnalisé</p>
                  {(cur.customRoles||[]).map((r,i)=>(
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <input type="color" value={r.color} onChange={e=>{ const cr=[...(cur.customRoles||[])]; cr[i]={...cr[i],color:e.target.value}; upd(cur.id,{customRoles:cr}); }} className="w-7 h-7 rounded cursor-pointer flex-shrink-0" style={{border:"1px solid var(--border)"}}/>
                      <input value={r.l} onChange={e=>{ const cr=[...(cur.customRoles||[])]; cr[i]={...cr[i],l:e.target.value}; upd(cur.id,{customRoles:cr}); }} placeholder="nom du rôle (ex: mon âme jumelle)" className="flex-1 bg-transparent outline-none text-xs" style={{color:"var(--text)", borderBottom:"1px solid var(--border)"}}/>
                      <button onClick={()=>{ const cr=(cur.customRoles||[]).filter((_,j)=>j!==i); upd(cur.id,{customRoles:cr, level: cur.level==="custom:"+i?"ami":cur.level}); }} style={{color:"var(--muted)"}}><X size={12}/></button>
                    </div>
                  ))}
                  <button onClick={()=>{ const cr=[...(cur.customRoles||[]), {l:"", color:"#b088e0"}]; upd(cur.id,{customRoles:cr}); }} className="text-[11px] flex items-center gap-1 mt-1" style={{color:"var(--accent)"}}><Plus size={11}/> nouveau rôle + couleur</button>
                  <p className="text-[9px] italic mt-1" style={{color:"var(--muted)"}}>Une fois créé, sélectionne-le dans "Rôle pour moi" ci-dessus.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px]" style={{color:"var(--muted)"}}>affinité avec moi</span>
                  <input type="range" min="0" max="100" value={cur.affinity} onChange={e=>upd(cur.id,{affinity:parseInt(e.target.value)})} className="flex-1"/>
                  <span className="text-xs" style={{color:lvl.color}}>{cur.affinity}%</span>
                </div>

                {/* Memory Catalyst */}
                <div className="rounded-xl p-3" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
                  <p className="text-xs font-bold mb-1" style={{color:"var(--accent)"}}>🧠 Memory Catalyst — notre passé commun</p>
                  <p className="text-[10px] italic mb-2" style={{color:"var(--muted)"}}>Vos souvenirs vécus ensemble avant ton arrivée (ton cerveau a besoin de passé pour stabiliser la réalité)</p>
                  {(cur.memories && cur.memories.length ? cur.memories : ["","",""]).map((mem,i)=>(
                    <div key={i} className="flex items-center gap-2 mb-1.5 group/m">
                      <span style={{color:"var(--accent)", fontSize:"11px"}}>✦</span>
                      <input value={mem} onChange={e=>{ const base=(cur.memories&&cur.memories.length?cur.memories:["","",""]); const m=[...base]; m[i]=e.target.value; upd(cur.id,{memories:m}); }} placeholder={`souvenir ${i+1}...`} className="flex-1 bg-transparent outline-none text-sm" style={{borderBottom:"1px solid var(--border)", color:"var(--text)", padding:"3px 0"}}/>
                      <button onClick={()=>{ const base=(cur.memories&&cur.memories.length?cur.memories:["","",""]); upd(cur.id,{memories:base.filter((_,j)=>j!==i)}); }} className="opacity-0 group-hover/m:opacity-100" style={{color:"var(--muted)"}}><X size={12}/></button>
                    </div>
                  ))}
                  <button onClick={()=>{ const base=(cur.memories&&cur.memories.length?cur.memories:["","",""]); upd(cur.id,{memories:[...base,""]}); }} className="text-[11px] flex items-center gap-1 mt-1" style={{color:"var(--accent)"}}><Plus size={11}/> ajouter un souvenir</button>
                </div>

                {/* champs détaillés */}
                {[
                  {k:"background", label:"📖 Background & histoire", ph:"D'où vient cette personne, sa vie, son passé..."},
                  {k:"personality", label:"✨ Traits de caractère", ph:"Sa personnalité, ses manies, ce qui la rend unique..."},
                  {k:"vibe", label:"💫 Vibe Check émotionnel", ph:"Ce que tu ressens physiquement/mentalement à côté d'elle (ex: à côté de Luna mon anxiété disparaît)..."},
                  {k:"integration", label:"🛡️ Protocole d'intégration", ph:"S'ils remarquent que tu as changé, qu'est-ce qu'ils se disent ? (ex: elle met ça sur le stress des exams)..."},
                  {k:"relation", label:"💗 Notre relation", ph:"Comment on s'est rencontrés, notre dynamique..."},
                  {k:"scenarios", label:"🎬 Scénarios clés ensemble", ph:"Les moments importants qu'on va vivre là-bas..."},
                ].map(f=>(
                  <div key={f.k}>
                    <label className="text-xs font-bold" style={{color:"var(--accent)"}}>{f.label}</label>
                    <textarea value={cur[f.k]||""} onChange={e=>upd(cur.id,{[f.k]:e.target.value})} rows={3} placeholder={f.ph} className="w-full mt-1 bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", borderRadius:"10px", padding:"8px", color:"var(--text)"}}/>
                  </div>
                ))}

                {/* galerie de photos perso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold" style={{color:"var(--accent)"}}>📸 Ses photos</label>
                    <button onClick={()=>upd(cur.id,{photos:[...photos,{id:uid(),url:"",cap:""}]})} className="text-[11px] flex items-center gap-1" style={{color:"var(--accent)"}}><Plus size={11}/> photo</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map(ph=>(
                      <div key={ph.id} className="group relative rounded-lg overflow-hidden" style={{border:"1px solid var(--border)"}}>
                        {ph.url ? <img src={ph.url} alt="" className="w-full object-cover" style={{aspectRatio:"1"}}/> : <div className="flex items-center justify-center text-xl" style={{aspectRatio:"1", background:"var(--surface2)"}}>📸</div>}
                        <div className="p-1" style={{background:"var(--surface2)"}}>
                          <ImgPicker value={ph.url} onChange={v=>upd(cur.id,{photos:photos.map(x=>x.id===ph.id?{...x,url:v}:x)})} placeholder="URL" small/>
                          <input value={ph.cap||""} onChange={e=>upd(cur.id,{photos:photos.map(x=>x.id===ph.id?{...x,cap:e.target.value}:x)})} placeholder="légende" className="w-full text-[9px] bg-transparent outline-none italic mt-0.5" style={{color:"var(--muted)"}}/>
                        </div>
                        <button onClick={()=>upd(cur.id,{photos:photos.filter(x=>x.id!==ph.id)})} className="absolute top-0.5 right-0.5 p-0.5 rounded-full opacity-0 group-hover:opacity-100" style={{background:"rgba(0,0,0,0.6)", color:"#fff"}}><X size={10}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={()=>speak(cur)} className="flex-1 py-2 rounded-full text-xs" style={{background:"var(--surface)", border:`1px solid ${lvl.color}`, color:lvl.color}}>💬 qu'est-ce qu'il/elle me dirait ?</button>
                  <button onClick={()=>{ if(confirm("Supprimer ce personnage ?")){ onUpdate({people:people.filter(x=>x.id!==cur.id)}); setOpenId(null); } }} className="px-4 py-2 rounded-full text-xs" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}><Trash2 size={12}/></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );})()}

      {line && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-8" style={{background:"rgba(0,0,0,0.7)"}} onClick={()=>setLine(null)}>
          <div className="max-w-sm text-center rounded-3xl p-6" style={{background:"var(--surface)", border:"1px solid var(--accent)"}} onClick={e=>e.stopPropagation()}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>{line.name}</p>
            <p className="text-xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{line.text}</p>
            <button onClick={()=>setLine(null)} className="mt-4 text-xs underline" style={{color:"var(--muted)"}}>fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🗺️ Carte interactive */
function DRMap({ dr, onUpdate }) {
  const places = dr.places || [];
  const [open, setOpen] = useState(null);
  const add = ()=>onUpdate({places:[...places,{id:uid(),name:"Nouveau lieu",emoji:"📍",sound:"",moodboard:"",desc:""}]});
  const upd = (id,patch)=>onUpdate({places:places.map(p=>p.id===id?{...p,...patch}:p)});
  const cur = places.find(p=>p.id===open);
  return (
    <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🗺️ Lieux de ma DR</h3>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> ajouter</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {places.map(p=>(
          <button key={p.id} onClick={()=>setOpen(open===p.id?null:p.id)} className="px-3 py-2 rounded-full text-sm transition" style={{background:open===p.id?"var(--primary)":"var(--surface2)", color:open===p.id?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{p.emoji} {p.name}</button>
        ))}
        {places.length===0 && <p className="text-sm italic" style={{color:"var(--muted)"}}>Le Grand Chêne, Ma chambre, Le café... ✦</p>}
      </div>
      {cur && (
        <div className="rounded-2xl overflow-hidden animate-fade-up" style={{border:"1px solid var(--accent)"}}>
          {cur.moodboard && <img src={cur.moodboard} alt="" className="w-full max-h-48 object-cover"/>}
          <div className="p-4" style={{background:"var(--surface2)"}}>
            <div className="flex gap-2 mb-2">
              <input value={cur.emoji} onChange={e=>upd(cur.id,{emoji:e.target.value})} className="w-10 text-center bg-transparent outline-none text-lg"/>
              <input value={cur.name} onChange={e=>upd(cur.id,{name:e.target.value})} className="flex-1 bg-transparent outline-none text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}/>
              <button onClick={()=>{ onUpdate({places:places.filter(x=>x.id!==cur.id)}); setOpen(null); }} style={{color:"var(--muted)"}}><Trash2 size={14}/></button>
            </div>
            <textarea value={cur.desc} onChange={e=>upd(cur.id,{desc:e.target.value})} rows={2} placeholder="ambiance, description du lieu..." className="w-full bg-transparent outline-none text-sm mb-2" style={{border:"1px solid var(--border)", borderRadius:"8px", padding:"6px", color:"var(--text)"}}/>
            <div className="mb-2"><ImgPicker value={cur.moodboard} onChange={v=>upd(cur.id,{moodboard:v})} placeholder="URL image d'ambiance"/></div>
            <input value={cur.sound} onChange={e=>upd(cur.id,{sound:e.target.value})} placeholder="lien son d'ambiance (Spotify, YouTube...)" className="w-full bg-transparent outline-none text-xs mb-2" style={{border:"1px solid var(--border)", borderRadius:"8px", padding:"6px", color:"var(--accent)"}}/>
            {cur.sound?.includes("spotify") && <iframe title="amb" src={cur.sound.replace("/track/","/embed/track/").replace("/playlist/","/embed/playlist/")} width="100%" height="80" frameBorder="0" allow="encrypted-media" className="rounded-lg"/>}
            {cur.sound && !cur.sound.includes("spotify") && <a href={cur.sound} target="_blank" rel="noreferrer" className="text-xs underline" style={{color:"var(--accent)"}}>▶ ouvrir l'ambiance sonore</a>}
          </div>
        </div>
      )}
    </div>
  );
}

/* 📜 Gazette de la DR */
const GAZETTE_TEMPLATES = [
  (n)=>`📰 La Gazette de ${n} : des lumières étranges ont été aperçues près du lac ce matin. La rumeur enfle...`,
  (n)=>`📰 ${n} aujourd'hui : on murmure qu'un événement se prépare. Tout le monde est sur le qui-vive.`,
  (n)=>`📰 Nouvelle du jour à ${n} : quelqu'un te cherchait. On dit que c'était important.`,
  (n)=>`📰 ${n} : le temps est parfait aujourd'hui. Une journée idéale pour que quelque chose de magique arrive.`,
  (n)=>`📰 Rumeur à ${n} : ton nom a été prononcé dans une conversation importante hier soir...`,
  (n)=>`📰 ${n} : les habitants préparent une célébration. On espère te voir y participer.`,
  (n)=>`📰 Journal de ${n} : un visage familier pense à toi en ce moment même. Le savais-tu ?`,
];
function DRGazette({ dr }) {
  const name = dr.name || "ta DR";
  const txt = pickByDate(GAZETTE_TEMPLATES, "gazette"+dr.id)(name);
  return (
    <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
      <h3 className="text-2xl mb-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>📜 La Gazette du jour</h3>
      <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Des nouvelles de ta DR, même quand tu n'y es pas ✦</p>
      <div className="rounded-xl p-4" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <p className="text-sm leading-relaxed" style={{color:"var(--text)", fontFamily:'"Cormorant Garamond",serif', fontSize:"16px"}}>{txt}</p>
      </div>
      <p className="text-[10px] italic mt-2 text-center" style={{color:"var(--muted)"}}>nouvelle gazette chaque jour</p>
    </div>
  );
}

function EditableText({ value, onChange, edit, className, style, multiline, placeholder }) {
  if (!edit) return multiline
    ? <p className={className} style={{...style, whiteSpace:"pre-wrap"}}>{value}</p>
    : <span className={className} style={style}>{value}</span>;
  return multiline
    ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={5} placeholder={placeholder}
        className={`bg-transparent outline-none resize-none w-full rounded ${className}`} style={{...style, boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.3)"}}/>
    : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className={`bg-transparent outline-none w-full rounded ${className}`} style={{...style, boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.3)"}}/>;
}

const HOME_DEFAULT = {
  name: "",
  heroImg: "",
  greeting: "Bienvenue dans ton sanctuaire",
  subtitle: "ton espace de vie, doux et magique — respire, tu es exactement là où tu dois être",
  heroBtn: "Commencer ma journée",
  introTitle: "Mon intention du moment",
  introText: "Note ici ce vers quoi tu avances en ce moment : un projet, une énergie, une saison de ta vie. C'est ta boussole quand tu ouvres l'app.",
  introImg: "",
  shortcutsTitle: "Mes raccourcis",
  cards: [
    { id:"c1", n:"01", title:"Mes tâches du jour", sub:"to-do & douceur", img:"", go:"tasks" },
    { id:"c2", n:"02", title:"Mon humeur", sub:"mood tracker", img:"", go:"mood" },
    { id:"c3", n:"03", title:"Mon journal", sub:"pages secrètes", img:"", go:"journal" },
  ],
};

function HomeUniverse({ content, setContent, affirm, onGo }) {
  const [edit, setEdit] = useState(false);
  const c = content;
  const set = (patch) => setContent({ ...c, ...patch });
  const setCard = (id, patch) => set({ cards: c.cards.map(x=>x.id===id?{...x,...patch}:x) });

  // ambiance inspirée de l'image : bleu nuit + lune + rose poudré + crème (mais en couleurs de thème)
  return (
    <div className="relative animate-fade-up">
      <button onClick={()=>setEdit(!edit)} className="absolute -top-1 right-0 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs"
        style={{background: edit?"var(--primary)":"var(--surface)", color: edit?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>
        <Edit3 size={12}/> {edit?"Terminer":"Personnaliser"}
      </button>

      <div className="rounded-3xl overflow-hidden" style={{border:"1px solid var(--border)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)"}}>

        {/* HERO — nuit étoilée + lune + branches fleuries */}
        <div className="relative px-4 sm:px-6 py-10 sm:py-16 text-center overflow-hidden" style={{
          background: c.heroImg
            ? `linear-gradient(rgba(20,25,50,0.45),rgba(20,25,50,0.55)), url(${c.heroImg}) center/cover`
            : `linear-gradient(165deg, var(--bg) 0%, var(--bg2) 55%, var(--primary) 160%)`,
          minHeight:"300px"
        }}>
          <div className="absolute rounded-full" style={{top:"10%", left:"50%", transform:"translateX(-50%)", width:"clamp(70px,15vw,110px)", height:"clamp(70px,15vw,110px)",
            background:"radial-gradient(circle at 40% 40%, #fff, #f3e9d6 55%, #ddcdaf)", boxShadow:"0 0 60px 22px rgba(255,250,230,0.30)"}}/>
          {Array.from({length:18}).map((_,i)=>(
            <span key={i} className="absolute rounded-full" style={{top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, width:"3px", height:"3px",
              background:"#fff", opacity:0.5, boxShadow:"0 0 6px #fff", animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`, animationDelay:`${Math.random()*3}s`}}/>
          ))}
          <div className="absolute top-1 left-1 text-2xl sm:text-3xl opacity-70 select-none" style={{transform:"rotate(-10deg)"}}>🌸</div>
          <div className="absolute top-6 right-2 text-xl sm:text-2xl opacity-60 select-none" style={{transform:"rotate(20deg)"}}>🌿🌸</div>
          <div className="absolute bottom-2 left-4 text-xl sm:text-2xl opacity-60 select-none">🌸🌿</div>

          <div className="relative" style={{zIndex:2}}>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-4 sm:mb-6" style={{color:"var(--accent)"}}>✦ Nyx ✦</p>
            <div className="max-w-2xl mx-auto">
              {edit ? (
                <EditableText edit value={c.greeting} onChange={v=>set({greeting:v})}
                  className="text-2xl sm:text-3xl md:text-4xl text-center" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}/>
              ) : (
                <h2 className="text-2xl sm:text-3xl md:text-4xl leading-snug" style={{fontFamily:"var(--font-display)", color:"var(--text)", textShadow:"0 2px 12px rgba(0,0,0,0.25)"}}>
                  {c.greeting}{c.name ? `, ${c.name}` : ""} ✿
                </h2>
              )}
              <div className="mt-3 sm:mt-4 max-w-xl mx-auto">
                <EditableText edit={edit} multiline value={c.subtitle} onChange={v=>set({subtitle:v})}
                  className="italic leading-relaxed text-center" style={{fontFamily:'"Dancing Script", cursive', color:"var(--muted)", fontSize:"clamp(16px,2.5vw,20px)"}}/>
              </div>
              {edit && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <input value={c.name} onChange={e=>set({name:e.target.value})} placeholder="ton prénom"
                    className="w-full max-w-xs text-xs px-2 py-1 rounded bg-black/20 outline-none text-center" style={{color:"var(--text)", border:"1px solid var(--border)"}}/>
                  <input value={c.heroImg} onChange={e=>set({heroImg:e.target.value})} placeholder="URL image de fond (optionnel)"
                    className="w-full max-w-xs text-xs px-2 py-1 rounded bg-black/20 outline-none text-center" style={{color:"var(--text)", border:"1px solid var(--border)"}}/>
                </div>
              )}
              <button onClick={()=>onGo("tasks")} className="mt-5 sm:mt-7 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm tracking-wide transition hover:scale-105"
                style={{background:"var(--primary)", color:"var(--bg)", boxShadow:"0 8px 24px rgba(var(--glow),0.4)"}}>
                <EditableText edit={edit} value={c.heroBtn} onChange={v=>set({heroBtn:v})} style={{color:"var(--bg)", textAlign:"center"}}/>
              </button>
            </div>
          </div>
        </div>

        {/* INTENTION + horloge */}
        <div className="px-4 sm:px-6 py-8 sm:py-12" style={{background:"var(--surface2)"}}>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center max-w-5xl mx-auto">
            <div className="relative">
              <div className="rounded-lg overflow-hidden mx-auto" style={{maxWidth:"260px", border:"1px solid var(--border)", padding:"10px"}}>
                <div className="relative" style={{border:"1px solid var(--border)"}}>
                  {c.introImg
                    ? <img src={c.introImg} alt="" className="w-full object-cover" style={{aspectRatio:"3/4"}}/>
                    : <div className="w-full flex items-center justify-center text-5xl" style={{aspectRatio:"3/4", background:"linear-gradient(160deg, var(--bg), var(--bg2))"}}>🌙</div>}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border" style={{borderColor:"var(--border)", background:"var(--surface2)"}}/>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border" style={{borderColor:"var(--border)", background:"var(--surface2)"}}/>
                </div>
              </div>
              {edit && <input value={c.introImg} onChange={e=>set({introImg:e.target.value})} placeholder="URL image (portrait/vision board)"
                className="mt-3 mx-auto block w-full max-w-xs text-xs px-2 py-1 rounded bg-black/20 outline-none text-center" style={{color:"var(--text)", border:"1px solid var(--border)"}}/>}
            </div>
            <div className="text-center md:text-left">
              <EditableText edit={edit} value={c.introTitle} onChange={v=>set({introTitle:v})}
                className="text-2xl sm:text-3xl mb-3 sm:mb-4 block" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}/>
              <EditableText edit={edit} multiline value={c.introText} onChange={v=>set({introText:v})}
                className="text-sm leading-relaxed mb-4 sm:mb-6" style={{color:"var(--muted)"}}/>
              <div className="rounded-2xl p-4 inline-block max-w-full" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{color:"var(--accent)"}}>affirmation du jour</p>
                <p className="text-base sm:text-lg italic" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>« {affirm} »</p>
              </div>
            </div>
          </div>
        </div>

        {/* RACCOURCIS en arches (cliquables) */}
        <div className="px-4 sm:px-6 py-8 sm:py-12" style={{background:"linear-gradient(180deg, var(--bg2), var(--bg))"}}>
          <EditableText edit={edit} value={c.shortcutsTitle} onChange={v=>set({shortcutsTitle:v})}
            className="text-2xl sm:text-3xl text-center mb-6 sm:mb-10 block" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}/>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {c.cards.map(card=>(
              <div key={card.id} className="text-center group">
                <button onClick={()=>card.go && onGo(card.go)} className="mx-auto block overflow-hidden transition group-hover:scale-105"
                  style={{ width:"100%", maxWidth:"200px", aspectRatio:"3/4.2", borderRadius:"100px 100px 12px 12px",
                    border:"2px solid var(--border)", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                  {card.img
                    ? <img src={card.img} alt="" className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex flex-col items-center justify-center text-4xl" style={{background:"linear-gradient(160deg, var(--surface2), var(--primary))"}}>
                        {card.go==="tasks"?"📝":card.go==="mood"?"🌸":card.go==="journal"?"📖":"✦"}
                      </div>}
                </button>
                <p className="mt-2 sm:mt-3 text-base sm:text-lg" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>
                  <span style={{opacity:0.5}}>{card.n} </span>
                  <EditableText edit={edit} value={card.title} onChange={v=>setCard(card.id,{title:v})} style={{color:"var(--text)"}}/>
                </p>
                <EditableText edit={edit} value={card.sub} onChange={v=>setCard(card.id,{sub:v})}
                  className="text-[10px] sm:text-xs italic" style={{color:"var(--muted)"}}/>
                {edit && (
                  <div className="mt-2 space-y-1">
                    <input value={card.img} onChange={e=>setCard(card.id,{img:e.target.value})} placeholder="URL image"
                      className="w-full text-xs px-2 py-1 rounded bg-black/20 outline-none text-center" style={{color:"var(--text)", border:"1px solid var(--border)"}}/>
                    <select value={card.go||""} onChange={e=>setCard(card.id,{go:e.target.value})}
                      className="w-full text-xs px-2 py-1 rounded bg-transparent outline-none" style={{color:"var(--text)", border:"1px solid var(--border)"}}>
                      <option value="" style={{background:"var(--bg2)"}}>— mène vers —</option>
                      {[["tasks","To-do"],["habits","Habitudes"],["goals","Objectifs"],["passions","Passions"],["wishlist","Wishlist"],["gratitude","Gratitude"],["mood","Mood"],["journal","Journal"]].map(o=>(
                        <option key={o[0]} value={o[0]} style={{background:"var(--bg2)"}}>{o[1]}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
          {edit && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button onClick={()=>set({cards:[...c.cards,{id:uid(),n:String(c.cards.length+1).padStart(2,"0"),title:"Nouveau",sub:"",img:"",go:""}]})}
                className="px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12} className="inline"/> ajouter un raccourci</button>
              {c.cards.length>1 && <button onClick={()=>set({cards:c.cards.slice(0,-1)})} className="px-3 py-1.5 rounded-full text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>retirer le dernier</button>}
            </div>
          )}
        </div>
      </div>

      {edit && <p className="text-xs italic mt-3 text-center" style={{color:"var(--muted)"}}>
        Mode personnalisation : clique dans les textes, colle tes images, choisis vers quoi mène chaque raccourci. Couleurs & fond animé → ⚙️ Couleurs & Fond.
      </p>}
    </div>
  );
}


/* ============================================================
   ✦ ÉCRAN DE CONNEXION (Firebase Auth)
   ============================================================ */
function AuthGate() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode==="signup") await signUp(email, pwd);
      else await signIn(email, pwd);
    } catch (e) {
      setErr(e.code==="auth/invalid-credential" ? "Email ou mot de passe incorrect"
        : e.code==="auth/email-already-in-use" ? "Cet email a déjà un compte"
        : e.code==="auth/weak-password" ? "Mot de passe trop court (min 6 caractères)"
        : e.code==="auth/invalid-email" ? "Email invalide"
        : "Erreur : " + (e.message||e.code));
    }
    setBusy(false);
  };
  const google = async () => {
    setErr(""); setBusy(true);
    try { await signInGoogle(); }
    catch (e) { setErr("Connexion Google annulée ou échouée"); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden"
      style={{background:"linear-gradient(160deg,#1a0d24 0%,#2a1638 50%,#3a2a5e 100%)"}}>
      <Backdrop kind="fullMoon"/>
      <div className="relative max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-spin-slow inline-block">🌙</div>
          <h1 className="text-4xl mb-2" style={{fontFamily:'"Dancing Script", cursive', color:"#f0e0c8", textShadow:"0 0 20px rgba(224,201,122,0.5)"}}>Nyx</h1>
          <p className="text-sm italic" style={{color:"#b39ac8"}}>
            {mode==="signup" ? "Crée ton sanctuaire" : "Reviens dans ton sanctuaire"}
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{color:"#b39ac8"}}/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ton email"
              className="w-full pl-10 pr-3 py-3 rounded-2xl bg-transparent outline-none"
              style={{border:"1px solid rgba(180,140,220,0.4)", color:"#ede0f5"}}/>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{color:"#b39ac8"}}/>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="mot de passe"
              onKeyDown={e=>e.key==="Enter"&&submit()}
              className="w-full pl-10 pr-3 py-3 rounded-2xl bg-transparent outline-none"
              style={{border:"1px solid rgba(180,140,220,0.4)", color:"#ede0f5"}}/>
          </div>

          {err && <p className="text-xs text-center" style={{color:"#ffb0c0"}}>{err}</p>}

          <button onClick={submit} disabled={busy||!email||!pwd}
            className="w-full py-3 rounded-2xl text-sm transition hover:scale-95 disabled:opacity-30"
            style={{background:"linear-gradient(180deg,#a875d4,#7a3a8a)", color:"#fff"}}>
            {busy ? "..." : mode==="signup" ? "Créer mon compte" : "Entrer"}
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{background:"rgba(180,140,220,0.3)"}}/>
            <span className="text-xs" style={{color:"#9a7fb0"}}>ou</span>
            <div className="flex-1 h-px" style={{background:"rgba(180,140,220,0.3)"}}/>
          </div>

          <button onClick={google} disabled={busy}
            className="w-full py-3 rounded-2xl text-sm transition hover:scale-95"
            style={{background:"rgba(255,255,255,0.95)", color:"#3a1f4e"}}>
            ✦ Continuer avec Google
          </button>

          <button onClick={()=>{setMode(mode==="signin"?"signup":"signin"); setErr("");}}
            className="w-full text-xs underline pt-3" style={{color:"#b39ac8"}}>
            {mode==="signup" ? "J'ai déjà un compte — me connecter" : "Pas encore de compte — en créer un"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ✦ VERROU D'ENTRÉE DE L'APP — code PIN magique
   ============================================================ */
function AppLock({ pin, setPin, onUnlock }) {
  const [entered, setEntered] = useState("");
  const [shake, setShake] = useState(false);
  const [settingNew, setSettingNew] = useState(!pin);
  const submit = () => {
    if (settingNew) { if (entered.length===4){ setPin(entered); onUnlock(); } return; }
    if (entered===pin) onUnlock();
    else { setShake(true); setTimeout(()=>setShake(false),500); setEntered(""); }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden"
      style={{background:"linear-gradient(160deg,#1a0d24 0%,#2a1638 50%,#3a2a5e 100%)"}}>
      <Backdrop kind="fullMoon"/>
      <div className={`relative max-w-sm w-full text-center ${shake?"animate-shake":""}`}>
        <div className="mb-8">
          <div className="text-6xl mb-3 animate-spin-slow inline-block">🌙</div>
          <h1 className="text-4xl mb-2" style={{fontFamily:'"Dancing Script", cursive', color:"#f0e0c8", textShadow:"0 0 20px rgba(224,201,122,0.5)"}}>Nyx</h1>
          <p className="text-sm italic" style={{color:"#b39ac8"}}>{settingNew?"Crée ton code magique d'entrée":"Murmure ton code magique"}</p>
        </div>
        <div className="flex justify-center gap-3 mb-8">
          {[0,1,2,3].map(i=>(
            <div key={i} className="w-14 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all"
              style={{border:`2px solid ${entered.length>i?"#e0c97a":"rgba(180,140,220,0.4)"}`, background:entered.length>i?"rgba(224,201,122,0.15)":"rgba(255,255,255,0.04)", color:"#f0e0c8", boxShadow:entered.length>i?"0 0 16px rgba(224,201,122,0.4)":"none"}}>
              {entered[i]?"✦":""}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} onClick={()=>entered.length<4&&setEntered(entered+n)} className="py-4 rounded-2xl text-xl transition hover:scale-95"
              style={{background:"rgba(168,117,212,0.15)", border:"1px solid rgba(180,140,220,0.3)", color:"#ede0f5"}}>{n}</button>
          ))}
          <button onClick={()=>setEntered(entered.slice(0,-1))} className="py-4 rounded-2xl transition hover:scale-95" style={{background:"rgba(168,117,212,0.1)", border:"1px solid rgba(180,140,220,0.3)", color:"#b39ac8"}}>←</button>
          <button onClick={()=>entered.length<4&&setEntered(entered+"0")} className="py-4 rounded-2xl text-xl transition hover:scale-95" style={{background:"rgba(168,117,212,0.15)", border:"1px solid rgba(180,140,220,0.3)", color:"#ede0f5"}}>0</button>
          <button onClick={submit} disabled={entered.length!==4} className="py-4 rounded-2xl transition hover:scale-95 disabled:opacity-30" style={{background:"linear-gradient(180deg,#a875d4,#7a3a8a)", color:"#fff"}}><Check size={20} className="mx-auto"/></button>
        </div>
        {settingNew && <p className="text-xs italic mt-6" style={{color:"#9a7fb0"}}>Ce code protégera l'entrée de ton sanctuaire ✦</p>}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ CALENDRIER MENSTRUEL (Yasmine)
   ============================================================ */
function CycleTracker({ data, setData }) {
  // data = { lastPeriod:"YYYY-MM-DD", cycleLength:28, periodLength:5, logs:[{date,flow,mood,notes}] }
  const d = data || { lastPeriod:"", cycleLength:28, periodLength:5, logs:[] };
  const set = (patch) => setData({ ...d, ...patch });
  const today = new Date(); today.setHours(0,0,0,0);

  const calc = () => {
    if (!d.lastPeriod) return null;
    const last = new Date(d.lastPeriod); last.setHours(0,0,0,0);
    const cl = d.cycleLength || 28;
    const diff = Math.floor((today - last) / 86400000);
    const dayInCycle = ((diff % cl) + cl) % cl + 1;
    const next = new Date(last); next.setDate(last.getDate() + cl);
    while (next < today) next.setDate(next.getDate() + cl);
    const daysToNext = Math.ceil((next - today) / 86400000);
    const ovulation = new Date(next); ovulation.setDate(next.getDate() - 14);
    let phase = "Folliculaire", emoji = "🌱", color = "#9ac8a8";
    if (dayInCycle <= (d.periodLength||5)) { phase = "Règles"; emoji = "🩸"; color = "#c85a6a"; }
    else if (dayInCycle >= cl-16 && dayInCycle <= cl-12) { phase = "Ovulation"; emoji = "🌕"; color = "#e8a85a"; }
    else if (dayInCycle > cl-12) { phase = "Lutéale"; emoji = "🌙"; color = "#a875d4"; }
    return { dayInCycle, daysToNext, next, ovulation, phase, emoji, color };
  };
  const info = calc();

  const flows = [{e:"💧",l:"léger"},{e:"💧💧",l:"moyen"},{e:"💧💧💧",l:"abondant"}];
  const logToday = (flow) => {
    const ds = today.toISOString().slice(0,10);
    const logs = (d.logs||[]).filter(l=>l.date!==ds);
    set({ logs:[{date:ds, flow}, ...logs] });
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      <div className="rounded-3xl p-6 mb-6 text-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🩸 Mon cycle</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Suis ton flux, tes phases et ta lune intérieure</p>
      </div>

      {/* Réglages */}
      <div className="rounded-2xl p-5 mb-6 grid sm:grid-cols-3 gap-4" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div>
          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{color:"var(--muted)"}}>Début dernières règles</label>
          <input type="date" value={d.lastPeriod} onChange={e=>set({lastPeriod:e.target.value})}
            className="w-full text-sm px-2 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{color:"var(--muted)"}}>Durée du cycle (jours)</label>
          <input type="number" value={d.cycleLength} onChange={e=>set({cycleLength:parseInt(e.target.value)||28})}
            className="w-full text-sm px-2 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{color:"var(--muted)"}}>Durée des règles (jours)</label>
          <input type="number" value={d.periodLength} onChange={e=>set({periodLength:parseInt(e.target.value)||5})}
            className="w-full text-sm px-2 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        </div>
      </div>

      {info ? (<>
        <div className="rounded-3xl p-6 mb-6 text-center" style={{background:`linear-gradient(160deg, ${info.color}33, var(--surface))`, border:`1px solid ${info.color}66`}}>
          <div className="text-5xl mb-2">{info.emoji}</div>
          <p className="text-2xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:info.color}}>Phase {info.phase}</p>
          <p className="text-sm" style={{color:"var(--text)"}}>Jour <b>{info.dayInCycle}</b> de ton cycle</p>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="rounded-xl p-3" style={{background:"var(--surface2)"}}>
              <p className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Prochaines règles</p>
              <p style={{color:"var(--text)"}}>dans {info.daysToNext} jours</p>
              <p className="text-xs" style={{color:"var(--muted)"}}>{info.next.toLocaleDateString("fr-FR")}</p>
            </div>
            <div className="rounded-xl p-3" style={{background:"var(--surface2)"}}>
              <p className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Ovulation estimée</p>
              <p style={{color:"var(--text)"}}>{info.ovulation.toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <p className="text-sm mb-3" style={{color:"var(--text)"}}>Noter mon flux aujourd'hui :</p>
          <div className="flex gap-2 flex-wrap">{flows.map(f=>(
            <button key={f.l} onClick={()=>logToday(f.l)} className="px-4 py-2 rounded-full text-sm transition hover:scale-105" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>{f.e} {f.l}</button>
          ))}</div>
          {(d.logs||[]).length>0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Historique récent</p>
              <div className="flex flex-wrap gap-2">{d.logs.slice(0,14).map((l,i)=>(
                <span key={i} className="text-xs px-2 py-1 rounded-full" style={{background:"var(--surface2)", color:"var(--muted)"}}>{new Date(l.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})} · {l.flow}</span>
              ))}</div>
            </div>
          )}
        </div>
      </>) : (
        <p className="text-center italic py-8" style={{color:"var(--muted)"}}>Renseigne la date de tes dernières règles pour voir tes phases ✦</p>
      )}
    </div>
  );
}

/* ============================================================
   ✦ ROUE DE L'ANNÉE — 8 sabbats (Yasmeen)
   ============================================================ */
const SABBATS = [
  { name:"Samhain", date:"31 oct", emoji:"🎃", theme:"Nouvel an des sorcières, honorer les ancêtres, voile le plus fin", color:"#c85a3a", deg:0 },
  { name:"Yule", date:"21 déc", emoji:"🕯️", theme:"Solstice d'hiver, renaissance du soleil, introspection", color:"#5a7ac8", deg:45 },
  { name:"Imbolc", date:"1 fév", emoji:"🕯️", theme:"Premiers signes du printemps, purification, Brigid", color:"#e8d49a", deg:90 },
  { name:"Ostara", date:"21 mars", emoji:"🌸", theme:"Équinoxe de printemps, équilibre, nouveaux départs", color:"#9ac88a", deg:135 },
  { name:"Beltane", date:"1 mai", emoji:"🔥", theme:"Fertilité, passion, feu de joie, abondance", color:"#e85a8a", deg:180 },
  { name:"Litha", date:"21 juin", emoji:"☀️", theme:"Solstice d'été, apogée du soleil, force et lumière", color:"#e8a83a", deg:225 },
  { name:"Lughnasadh", date:"1 août", emoji:"🌾", theme:"Premières récoltes, gratitude, partage", color:"#c89a4a", deg:270 },
  { name:"Mabon", date:"21 sept", emoji:"🍂", theme:"Équinoxe d'automne, bilan, remerciements, équilibre", color:"#a85a3a", deg:315 },
];
function WheelOfYear() {
  // trouver le prochain sabbat
  const now = new Date();
  const year = now.getFullYear();
  const dates = [
    {i:0, d:new Date(year,9,31)}, {i:1, d:new Date(year,11,21)}, {i:2, d:new Date(year,1,1)},
    {i:3, d:new Date(year,2,21)}, {i:4, d:new Date(year,4,1)}, {i:5, d:new Date(year,5,21)},
    {i:6, d:new Date(year,7,1)}, {i:7, d:new Date(year,8,21)},
  ];
  let next = null, minDiff = Infinity;
  dates.forEach(({i,d})=>{ let dd=d; if(dd<now){dd=new Date(d); dd.setFullYear(year+1);} const diff=dd-now; if(diff<minDiff){minDiff=diff; next={i, days:Math.ceil(diff/86400000)};} });
  const [sel, setSel] = useState(next?.i ?? 0);
  const s = SABBATS[sel];

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>☀️ La Roue de l'Année ✦</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Les 8 sabbats qui rythment l'année magique</p>
        {next && <p className="text-sm mt-2" style={{color:"var(--text)"}}>Prochain sabbat : <b style={{color:SABBATS[next.i].color}}>{SABBATS[next.i].name}</b> dans {next.days} jours {SABBATS[next.i].emoji}</p>}
      </div>

      {/* roue */}
      <div className="relative mx-auto mb-6" style={{width:"min(320px,80vw)", aspectRatio:"1"}}>
        <div className="absolute inset-0 rounded-full" style={{background:"radial-gradient(circle, var(--surface2), var(--surface))", border:"2px solid var(--border)"}}/>
        {SABBATS.map((sb,i)=>{
          const angle = (sb.deg-90) * Math.PI/180;
          const r = 42;
          const x = 50 + r*Math.cos(angle);
          const y = 50 + r*Math.sin(angle);
          return (
            <button key={sb.name} onClick={()=>setSel(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition hover:scale-110"
              style={{ left:`${x}%`, top:`${y}%`, width:sel===i?"54px":"44px", height:sel===i?"54px":"44px",
                background:sel===i?sb.color:"var(--surface)", border:`2px solid ${sb.color}`, fontSize:sel===i?"24px":"20px",
                boxShadow:sel===i?`0 0 20px ${sb.color}`:"none", zIndex:sel===i?5:1 }}>
              {sb.emoji}
            </button>
          );
        })}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">🌙</div>
      </div>

      {/* détail sabbat */}
      <div className="rounded-2xl p-6 text-center" style={{background:`linear-gradient(160deg, ${s.color}22, var(--surface))`, border:`1px solid ${s.color}66`}}>
        <div className="text-5xl mb-2">{s.emoji}</div>
        <h4 className="text-2xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:s.color}}>{s.name}</h4>
        <p className="text-sm mb-2" style={{color:"var(--muted)"}}>{s.date}</p>
        <p className="text-sm" style={{color:"var(--text)"}}>{s.theme}</p>
      </div>
    </div>
  );
}

/* ============================================================
   ✦ PENDULE VIRTUEL — divination flash (Yasmeen)
   ============================================================ */
function Pendulum() {
  const [question, setQuestion] = useState("");
  const [swinging, setSwinging] = useState(false);
  const [answer, setAnswer] = useState(null);
  const holdRef = useRef(null);

  const start = () => {
    if (swinging) return;
    setAnswer(null); setSwinging(true);
    const dur = 2500 + Math.random()*2000;
    holdRef.current = setTimeout(()=>{
      const r = Math.random();
      const res = r<0.42 ? {t:"Oui", dir:"clockwise", emoji:"✓", color:"#7ac8a8"}
        : r<0.84 ? {t:"Non", dir:"counter", emoji:"✕", color:"#c87a8a"}
        : {t:"Le voile est flou... attends", dir:"still", emoji:"~", color:"#a89ad4"};
      setAnswer(res); setSwinging(false);
    }, dur);
  };
  useEffect(()=>()=>clearTimeout(holdRef.current), []);

  return (
    <div className="animate-fade-up max-w-lg mx-auto text-center">
      <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🔮 Le Pendule</h3>
      <p className="text-xs italic mb-5" style={{color:"var(--muted)"}}>Pose ta question, ferme les yeux, laisse l'énergie répondre</p>

      <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ta question..."
        className="w-full px-4 py-3 rounded-2xl bg-transparent outline-none text-center mb-6" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>

      {/* pendule animé */}
      <div className="relative mx-auto mb-6" style={{width:"120px", height:"220px"}}>
        <div className="absolute left-1/2 top-0 origin-top" style={{
          transformOrigin:"top center",
          animation: swinging ? "pendSwing 1.1s ease-in-out infinite" : answer?.dir==="clockwise" ? "pendCW 1.4s linear infinite" : answer?.dir==="counter" ? "pendCCW 1.4s linear infinite" : "none",
          transform:"translateX(-50%)"
        }}>
          <div style={{width:"2px", height:"150px", background:"var(--border)", margin:"0 auto"}}/>
          <div style={{
            width:"34px", height:"46px", margin:"0 auto",
            background:`linear-gradient(160deg, ${answer?.color||"var(--accent)"}, var(--primary))`,
            clipPath:"polygon(50% 0, 100% 35%, 50% 100%, 0 35%)",
            boxShadow:`0 0 20px ${answer?.color||"var(--accent)"}`,
          }}/>
        </div>
      </div>

      {answer ? (
        <div className="rounded-2xl p-5 animate-fade-up" style={{background:`${answer.color}22`, border:`1px solid ${answer.color}66`}}>
          <p className="text-2xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:answer.color}}>{answer.emoji} {answer.t}</p>
          {question && <p className="text-xs italic" style={{color:"var(--muted)"}}>« {question} »</p>}
        </div>
      ) : (
        <button onClick={start} disabled={swinging}
          className="px-6 py-3 rounded-2xl text-sm transition hover:scale-105 disabled:opacity-50"
          style={{background:"var(--primary)", color:"var(--bg)"}}>
          {swinging ? "le pendule oscille..." : "✦ Consulter le pendule"}
        </button>
      )}
      {answer && <button onClick={()=>{setAnswer(null); setQuestion("");}} className="block mx-auto mt-4 text-xs underline" style={{color:"var(--muted)"}}>nouvelle question</button>}

      <style>{`
        @keyframes pendSwing{0%,100%{transform:translateX(-50%) rotate(-22deg)}50%{transform:translateX(-50%) rotate(22deg)}}
        @keyframes pendCW{0%{transform:translateX(-50%) rotate(0)}100%{transform:translateX(-50%) rotate(360deg)}}
        @keyframes pendCCW{0%{transform:translateX(-50%) rotate(0)}100%{transform:translateX(-50%) rotate(-360deg)}}
      `}</style>
    </div>
  );
}

/* ============================================================
   ✦ REALITY ANCHOR — mini-jeu d'ancrage 30s vers la DR
   ============================================================ */
function RealityAnchor({ drs }) {
  const favDR = (drs||[]).find(d=>d.favorite) || (drs||[])[0] || null;
  const [dr, setDr] = useState(favDR);
  const [phase, setPhase] = useState("idle"); // idle | charging | done
  const [charge, setCharge] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const raf = useRef(null);

  // 5 ancrages générés depuis la DR
  const anchors = useMemo(()=>{
    const name = dr?.name || "ta réalité désirée";
    const tag = dr?.tag || "";
    const base = [
      `Respire l'air de ${name} 🌬️`,
      `Sens le sol sous tes pieds là-bas`,
      `Écoute les sons autour de toi dans ${name}`,
      `Ressens la chaleur / la lumière de cet endroit`,
      tag ? `Rappelle-toi pourquoi tu aimes ${tag}` : `Visualise un visage aimé de ta DR`,
    ];
    return base;
  }, [dr]);

  const startHold = () => {
    if (phase==="done") return;
    setPhase("charging");
    const tick = () => {
      setCharge(c=>{
        const nc = Math.min(100, c + 0.8);
        setStepIdx(Math.min(4, Math.floor(nc/20)));
        if (nc>=100){ setPhase("done"); return 100; }
        raf.current = requestAnimationFrame(tick);
        return nc;
      });
    };
    raf.current = requestAnimationFrame(tick);
  };
  const stopHold = () => {
    if (phase==="done") return;
    cancelAnimationFrame(raf.current);
    setPhase("idle");
    // redescend doucement
    const down = () => { setCharge(c=>{ if(c<=0){return 0;} const nc=Math.max(0,c-2); setStepIdx(Math.min(4,Math.floor(nc/20))); raf.current=requestAnimationFrame(down); return nc;}); };
    raf.current = requestAnimationFrame(down);
  };
  useEffect(()=>()=>cancelAnimationFrame(raf.current), []);
  const reset = () => { setCharge(0); setStepIdx(0); setPhase("idle"); };

  return (
    <div className="animate-fade-up max-w-lg mx-auto text-center">
      <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>⚓ L'Ancre de Réalité</h3>
      <p className="text-xs italic mb-4" style={{color:"var(--muted)"}}>Reste appuyée pour charger ton intention et t'aligner sur ta DR</p>

      {drs && drs.length>0 && (
        <select value={dr?.id||""} onChange={e=>{setDr(drs.find(d=>d.id===e.target.value)); reset();}}
          className="mb-5 px-3 py-2 rounded-full text-sm bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}>
          {drs.map(d=>(<option key={d.id} value={d.id} style={{background:"var(--bg2)"}}>{d.name}</option>))}
        </select>
      )}

      {/* cercle de charge */}
      <div className="relative mx-auto mb-6 select-none" style={{width:"220px", height:"220px", cursor:"pointer", touchAction:"none"}}
        onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}>
        <svg viewBox="0 0 220 220" style={{width:"220px", height:"220px"}}>
          <circle cx="110" cy="110" r="96" fill="none" stroke="var(--surface2)" strokeWidth="10"/>
          <circle cx="110" cy="110" r="96" fill="none" stroke="#e0c97a" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={2*Math.PI*96} strokeDashoffset={2*Math.PI*96*(1-charge/100)}
            transform="rotate(-90 110 110)" style={{transition:"stroke-dashoffset .1s linear", filter: phase!=="idle"?"drop-shadow(0 0 8px #e0c97a)":"none"}}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {phase==="done" ? (<>
            <div className="text-4xl mb-1 animate-spin-slow">🌟</div>
            <p className="text-xl" style={{fontFamily:'"Dancing Script",cursive', color:"#e0c97a"}}>100%</p>
          </>) : (<>
            <div className="text-3xl mb-1">🌙</div>
            <p className="text-2xl" style={{color:"var(--text)"}}>{Math.round(charge)}%</p>
            <p className="text-[10px]" style={{color:"var(--muted)"}}>{phase==="charging"?"continue...":"appuie & garde"}</p>
          </>)}
        </div>
        {phase==="done" && <div className="absolute inset-0 rounded-full pointer-events-none" style={{boxShadow:"0 0 60px 10px #e0c97a55", animation:"glowPulse 1.5s ease-in-out infinite"}}/>}
      </div>

      {/* ancrage courant */}
      {phase!=="done" ? (
        <div className="rounded-2xl p-4 mb-4 min-h-[64px] flex items-center justify-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <p className="text-sm" style={{color:"var(--text)"}}>{anchors[stepIdx]}</p>
        </div>
      ) : (
        <div className="rounded-2xl p-5 animate-fade-up" style={{background:"linear-gradient(160deg,#e0c97a33,var(--surface))", border:"1px solid #e0c97a66"}}>
          <p className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"#e0c97a"}}>✦ Fréquence DR alignée à 100% ✦</p>
          <p className="text-sm mt-1" style={{color:"var(--text)"}}>Tu es prête. {dr?.name ? `${dr.name} t'attend.` : ""}</p>
          <button onClick={reset} className="mt-3 px-4 py-2 rounded-full text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>recommencer</button>
        </div>
      )}
      <style>{`@keyframes glowPulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  );
}

/* ============================================================
   ✦ BOUTEILLE À LA MER — message scellé qui s'envole
   ============================================================ */
function MessageBottle({ bottles, setBottles }) {
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [flying, setFlying] = useState(false);

  const send = () => {
    if (!msg.trim()) return;
    setFlying(true);
    setTimeout(()=>{
      setBottles([{ id:uid(), to:to.trim()||"l'univers", msg:msg.trim(), date:new Date().toISOString().slice(0,10) }, ...(bottles||[])]);
      setFlying(false); setTo(""); setMsg("");
    }, 3200);
  };

  return (
    <div className="animate-fade-up max-w-lg mx-auto">
      <div className="text-center mb-5">
        <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Bouteille à la mer ✦</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Envoie ton énergie à un proche, ton moi futur, ou un habitant de ta DR</p>
      </div>

      {!flying ? (
        <div className="rounded-2xl p-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{color:"var(--muted)"}}>Destinataire</label>
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="mon moi futur, un guide, [personnage]..."
            className="w-full px-3 py-2 mb-3 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{color:"var(--muted)"}}>Ton message</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5} placeholder="Écris ce que ton cœur veut transmettre..."
            className="w-full px-3 py-3 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)", fontFamily:'"Caveat",cursive', fontSize:"18px", lineHeight:"26px"}}/>
          <button onClick={send} disabled={!msg.trim()} className="w-full mt-3 py-3 rounded-2xl text-sm transition hover:scale-95 disabled:opacity-40" style={{background:"var(--primary)", color:"var(--bg)"}}>
            ✦ Sceller & libérer
          </button>
        </div>
      ) : (
        <div className="relative h-64 overflow-hidden rounded-2xl" style={{background:"linear-gradient(180deg,#1a1438,#3a2a6e)"}}>
          {Array.from({length:30}).map((_,i)=>(<span key={i} className="absolute rounded-full" style={{top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,width:"2px",height:"2px",background:"#fff",opacity:0.6,animation:`twinkle ${2+Math.random()*2}s ease-in-out infinite`}}/>))}
          <div className="absolute left-1/2 -translate-x-1/2 text-5xl" style={{bottom:"-60px", animation:"bottleRise 3.2s ease-in forwards"}}>🏮</div>
          <p className="absolute inset-x-0 bottom-4 text-center text-sm italic" style={{color:"#d4b0e8"}}>libération dans le vortex quantique...</p>
          <style>{`@keyframes bottleRise{0%{bottom:-60px;opacity:0;transform:translateX(-50%) scale(.6)}20%{opacity:1}100%{bottom:110%;opacity:0;transform:translateX(-50%) scale(1.1)}}`}</style>
        </div>
      )}

      {/* archives */}
      {(bottles||[]).length>0 && !flying && (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Messages libérés</p>
          <div className="space-y-2">{bottles.map(b=>(
            <div key={b.id} className="rounded-xl p-3 flex items-start gap-3" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <span className="text-xl">🏮</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{color:"var(--accent)"}}>→ {b.to} <span style={{color:"var(--muted)"}}>· {b.date}</span></p>
                <p className="text-sm" style={{color:"var(--text)", fontFamily:'"Caveat",cursive', fontSize:"16px"}}>{b.msg}</p>
              </div>
              <button onClick={()=>setBottles(bottles.filter(x=>x.id!==b.id))} style={{color:"var(--muted)"}}><X size={14}/></button>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ✦ GRIMOIRE VIVANT — rituel du jour selon humeur + lune
   ============================================================ */
function LivingGrimoire({ moodLog, entries, setEntries }) {
  const moon = moonPhase();
  const lastMood = (moodLog||[])[0];

  const ritual = useMemo(()=>{
    const m = lastMood?.mood || "";
    // règle selon humeur
    let r;
    if (/stress|énerv|triste|mélanco|fatig/i.test(m)) {
      r = { titre:"Rituel d'apaisement", emoji:"🌿",
        ingr:["1 bougie blanche ou lavande","sel pour purifier","encens / sauge"],
        steps:"Allume la bougie. Respire 4 fois profondément. Visualise les tensions quitter ton corps avec la fumée. Dis : « Je relâche ce qui ne me sert plus. »" };
    } else if (/heureu|amour|câlin|inspir|sereine|rêveuse/i.test(m)) {
      r = { titre:"Rituel d'amplification de joie", emoji:"✨",
        ingr:["1 bougie rose ou dorée","une fleur","quartz rose"],
        steps:"Tiens le cristal. Souris. Liste 3 choses qui te rendent vivante. Dis : « J'attire encore plus de cette lumière. »" };
    } else {
      r = { titre:"Rituel d'ancrage du jour", emoji:"🕯️",
        ingr:["1 bougie","un verre d'eau","ta respiration"],
        steps:"Bois une gorgée d'eau en conscience. Pose une intention claire pour aujourd'hui. Dis : « Je suis alignée avec ma journée. »" };
    }
    // ajout selon la lune
    const lune = moon.idx<=1 ? "Lune idéale pour PLANTER une intention nouvelle 🌑"
      : moon.idx<=3 ? "Lune croissante : fais GRANDIR un projet 🌒"
      : moon.idx<=4 ? "Pleine lune : MANIFESTE et charge tes cristaux 🌕"
      : "Lune décroissante : LÂCHE et bannis le négatif 🌘";
    return { ...r, lune };
  }, [lastMood, moon.idx]);

  const saveToGrimoire = () => {
    setEntries([{ id:uid(), created:new Date().toISOString().slice(0,10),
      title:ritual.titre, intention:lastMood?.mood?`humeur : ${lastMood.mood}`:"rituel du jour",
      moon:moon.name||"", ingredients:ritual.ingr.join("\n"), steps:ritual.steps, result:"" }, ...entries]);
  };

  return (
    <div className="rounded-2xl p-5 mb-6 animate-fade-up" style={{background:`linear-gradient(160deg, var(--surface2), var(--surface))`, border:"1px solid var(--accent)"}}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h3 className="text-xl flex items-center gap-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{ritual.emoji} Rituel du jour sur-mesure</h3>
        <span className="text-[10px] px-2 py-1 rounded-full" style={{background:"var(--surface)", color:"var(--muted)"}}>{moon.name} {moon.emoji||"🌙"}</span>
      </div>
      <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>
        {lastMood?.mood ? `Généré selon ton humeur (${lastMood.mood}) et la lune` : "Généré selon la phase de lune actuelle"}
      </p>
      <p className="text-sm font-bold mb-1" style={{color:"var(--text)"}}>{ritual.titre}</p>
      <p className="text-xs mb-2" style={{color:"var(--accent)"}}>{ritual.lune}</p>
      <p className="text-xs uppercase tracking-widest mt-2" style={{color:"var(--muted)"}}>Ingrédients</p>
      <ul className="text-sm mb-2" style={{color:"var(--text)"}}>{ritual.ingr.map((x,i)=>(<li key={i}>• {x}</li>))}</ul>
      <p className="text-xs uppercase tracking-widest" style={{color:"var(--muted)"}}>Rituel</p>
      <p className="text-sm" style={{color:"var(--text)"}}>{ritual.steps}</p>
      <button onClick={saveToGrimoire} className="mt-3 px-3 py-1.5 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ garder dans mon grimoire</button>
    </div>
  );
}

/* ============================================================
   ✦ COMFORT CHARACTERS — réconfort par tes persos préférés
   ============================================================ */
function ComfortCharacters({ items, setItems }) {
  const [openId, setOpenId] = useState(null);
  const [comfortMsg, setComfortMsg] = useState(null);
  const open = items.find(i=>i.id===openId);

  const addNew = () => { const it={id:uid(), name:"", show:"", img:"", traits:"", phrases:""}; setItems([it,...items]); setOpenId(it.id); };
  const update = (id,patch)=>setItems(items.map(i=>i.id===id?{...i,...patch}:i));
  const del = (id)=>{ if(confirm("Retirer ce personnage ?")){ setItems(items.filter(i=>i.id!==id)); setOpenId(null);} };

  const comfortFrom = (c) => {
    const custom = (c.phrases||"").split("\n").map(s=>s.trim()).filter(Boolean);
    const generic = [
      `Hey... c'est moi. Respire. Tu as traversé 100% de tes pires jours jusqu'ici. Tu vas traverser celui-là aussi.`,
      `Je suis fière de toi, même quand tu doutes. Surtout quand tu doutes.`,
      `Tu n'as pas besoin d'être parfaite pour mériter du repos. Pose tout. Je veille.`,
      `Tu es plus forte que ce qui essaie de te briser aujourd'hui. Je le sais, je te connais.`,
    ];
    const pool = custom.length ? custom : generic;
    const msg = pool[Math.floor(Math.random()*pool.length)];
    setComfortMsg({ name:c.name||"Ton perso", img:c.img, msg });
  };

  if (comfortMsg) return (
    <div className="animate-fade-up max-w-md mx-auto text-center">
      <div className="rounded-3xl p-6" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
        {comfortMsg.img && <img src={comfortMsg.img} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-3" style={{border:"2px solid var(--accent)"}}/>}
        <p className="text-sm uppercase tracking-widest mb-3" style={{color:"var(--muted)"}}>{comfortMsg.name} te parle</p>
        <p className="text-lg leading-relaxed" style={{fontFamily:'"Caveat",cursive', fontSize:"22px", color:"var(--text)"}}>« {comfortMsg.msg} »</p>
      </div>
      <button onClick={()=>setComfortMsg(null)} className="mt-4 px-4 py-2 rounded-full text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour</button>
    </div>
  );

  if (open) return (
    <div className="animate-fade-up max-w-lg mx-auto">
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setOpenId(null)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour</button>
        <button onClick={()=>del(open.id)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}><Trash2 size={12} className="inline"/></button>
      </div>
      <div className="rounded-2xl p-5 space-y-3" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        {open.img && <img src={open.img} alt="" className="w-28 h-28 rounded-full object-cover mx-auto" style={{border:"2px solid var(--accent)"}}/>}
        <input value={open.name} onChange={e=>update(open.id,{name:e.target.value})} placeholder="Nom du personnage" className="w-full text-2xl text-center bg-transparent outline-none" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}/>
        <input value={open.show} onChange={e=>update(open.id,{show:e.target.value})} placeholder="Série / film / anime" className="w-full text-sm text-center bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)", borderRadius:"10px", padding:"6px"}}/>
        <div><ImgPicker value={open.img} onChange={v=>update(open.id,{img:v})} placeholder="URL image"/></div>
        <input value={open.traits} onChange={e=>update(open.id,{traits:e.target.value})} placeholder="Ce que tu aimes chez lui/elle" className="w-full text-sm bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)", borderRadius:"10px", padding:"6px"}}/>
        <div>
          <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Phrases de réconfort (une par ligne)</label>
          <textarea value={open.phrases} onChange={e=>update(open.id,{phrases:e.target.value})} rows={4} placeholder="Tout va bien se passer, je suis là...&#10;Tu es courageuse..." className="mt-1 w-full bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)", borderRadius:"10px", padding:"8px", fontFamily:'"Caveat",cursive', fontSize:"17px"}}/>
        </div>
        <button onClick={()=>comfortFrom(open)} className="w-full py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>💌 Tester le réconfort</button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-5">
        <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>💌 Mes Comfort Characters</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Tes personnages doudous. Un coup de mou ? Ils te parlent.</p>
      </div>
      <div className="flex justify-center mb-5">
        <button onClick={addNew} className="px-4 py-2 rounded-full text-sm flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/> Ajouter un perso</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(c=>(
          <div key={c.id} className="rounded-2xl p-4 text-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <button onClick={()=>setOpenId(c.id)} className="block w-full">
              {c.img ? <img src={c.img} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-2" style={{border:"2px solid var(--accent)"}}/> : <div className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl" style={{background:"var(--surface2)"}}>💗</div>}
              <p className="text-sm" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)", fontSize:"18px"}}>{c.name||"Sans nom"}</p>
              {c.show && <p className="text-[10px]" style={{color:"var(--muted)"}}>{c.show}</p>}
            </button>
            <button onClick={()=>comfortFrom(c)} className="mt-2 w-full py-1.5 rounded-full text-[11px]" style={{background:"var(--surface2)", color:"var(--accent)"}}>besoin de réconfort</button>
          </div>
        ))}
        {items.length===0 && <p className="col-span-full text-center italic py-10" style={{color:"var(--muted)"}}>Aucun perso encore. Ajoute tes doudous ✦</p>}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ SHIFT-DECK — choisir sa DR active (cartes swipe)
   ============================================================ */
function ShiftDeck({ drs, activeDR, setActiveDR }) {
  if (!drs || drs.length===0) return (
    <div className="rounded-2xl p-5 text-center" style={{background:"var(--surface)", border:"1px dashed var(--border)"}}>
      <p className="text-sm italic" style={{color:"var(--muted)"}}>🃏 Crée des DR dans Yasmeen → Shifting pour activer ton Shift-Deck ici.</p>
    </div>
  );
  return (
    <div className="rounded-2xl p-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl flex items-center gap-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🃏 Shift-Deck</h3>
        {activeDR && <span className="text-[10px] px-2 py-1 rounded-full" style={{background:"var(--primary)", color:"var(--bg)"}}>active : {drs.find(d=>d.id===activeDR)?.name}</span>}
      </div>
      <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Choisis ta réalité désirée du moment. Touche une carte pour l'activer.</p>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {drs.map(d=>{
          const on = activeDR===d.id;
          return (
            <button key={d.id} onClick={()=>setActiveDR(on?null:d.id)}
              className="flex-shrink-0 rounded-2xl overflow-hidden transition" style={{width:"130px", border:on?"2px solid var(--accent)":"1px solid var(--border)", boxShadow:on?"0 0 18px rgba(var(--glow),0.4)":"none", transform:on?"scale(1.03)":"none"}}>
              <div style={{height:"90px", background:d.cover?`url(${d.cover}) center/cover`:"linear-gradient(160deg,var(--surface2),var(--primary))"}}/>
              <div className="p-2" style={{background:"var(--surface)"}}>
                <p className="text-sm leading-tight" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}>{d.name}</p>
                {on && <p className="text-[9px] mt-1" style={{color:"var(--accent)"}}>✦ alignée</p>}
              </div>
            </button>
          );
        })}
      </div>
      {activeDR && <p className="text-xs italic mt-3" style={{color:"var(--accent)"}}>✦ Tu vibres avec « {drs.find(d=>d.id===activeDR)?.name} ». Que cette énergie t'accompagne aujourd'hui.</p>}
    </div>
  );
}

/* ============================================================
   ✦ MOODBOARDS DE TENUES par thème (Yasmine)
   ============================================================ */
function OutfitBoards({ boards, setBoards }) {
  const [openId, setOpenId] = useState(null);
  const open = boards.find(b=>b.id===openId);

  const addBoard = () => { const b={id:uid(), name:"Nouveau thème", vibe:"", items:[]}; setBoards([b,...boards]); setOpenId(b.id); };
  const update = (id,patch)=>setBoards(boards.map(b=>b.id===id?{...b,...patch}:b));
  const del = (id)=>{ if(confirm("Supprimer ce moodboard ?")){ setBoards(boards.filter(b=>b.id!==id)); setOpenId(null);} };
  const addItem = (b)=>update(b.id,{items:[...b.items,{id:uid(),img:"",label:""}]});
  const updItem = (b,iid,patch)=>update(b.id,{items:b.items.map(it=>it.id===iid?{...it,...patch}:it)});
  const delItem = (b,iid)=>update(b.id,{items:b.items.filter(it=>it.id!==iid)});

  if (open) return (
    <div className="animate-fade-up">
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={()=>setOpenId(null)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>← retour</button>
        <button onClick={()=>del(open.id)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}><Trash2 size={12} className="inline"/></button>
        <button onClick={()=>addItem(open)} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12} className="inline"/> ajouter une pièce</button>
      </div>
      <input value={open.name} onChange={e=>update(open.id,{name:e.target.value})} className="text-3xl bg-transparent outline-none mb-1 w-full" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}/>
      <input value={open.vibe} onChange={e=>update(open.id,{vibe:e.target.value})} placeholder="la vibe / occasion..." className="text-sm bg-transparent outline-none mb-4 w-full italic" style={{color:"var(--muted)"}}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {open.items.map(it=>(
          <div key={it.id} className="group relative rounded-2xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
            {it.img ? <img src={it.img} alt="" className="w-full object-cover" style={{aspectRatio:"3/4"}}/> : <div className="w-full flex items-center justify-center text-3xl" style={{aspectRatio:"3/4", background:"var(--surface2)"}}>👗</div>}
            <div className="p-2" style={{background:"var(--surface)"}}>
              <div className="mb-1"><ImgPicker value={it.img} onChange={v=>updItem(open,it.id,{img:v})} placeholder="URL image" small/></div>
              <input value={it.label} onChange={e=>updItem(open,it.id,{label:e.target.value})} placeholder="pièce / marque" className="w-full text-xs bg-transparent outline-none" style={{color:"var(--text)"}}/>
            </div>
            <button onClick={()=>delItem(open,it.id)} className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100" style={{background:"rgba(0,0,0,0.6)", color:"#fff"}}><X size={12}/></button>
          </div>
        ))}
        {open.items.length===0 && <p className="col-span-full text-center italic py-8" style={{color:"var(--muted)"}}>Ajoute tes pièces avec leurs images ✦</p>}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-5">
        <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>👗 Mes moodboards tenues</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Coquette, Dark Academia, Y2K... planifie ton glow-up</p>
      </div>
      <div className="flex justify-center mb-5"><button onClick={addBoard} className="px-4 py-2 rounded-full text-sm flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/> Nouveau thème</button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map(b=>(
          <button key={b.id} onClick={()=>setOpenId(b.id)} className="text-left rounded-2xl overflow-hidden transition hover:scale-[1.02]" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <div className="grid grid-cols-2 gap-0.5" style={{height:"140px"}}>
              {(b.items.slice(0,4)).map(it=>(<div key={it.id} style={{background:it.img?`url(${it.img}) center/cover`:"var(--surface2)"}}/>))}
              {b.items.length===0 && <div className="col-span-2 flex items-center justify-center text-4xl" style={{background:"var(--surface2)"}}>👗</div>}
            </div>
            <div className="p-3">
              <p className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}>{b.name}</p>
              {b.vibe && <p className="text-[10px] italic" style={{color:"var(--muted)"}}>{b.vibe}</p>}
              <p className="text-[10px] mt-1" style={{color:"var(--muted)"}}>{b.items.length} pièces</p>
            </div>
          </button>
        ))}
        {boards.length===0 && <p className="col-span-full text-center italic py-10" style={{color:"var(--muted)"}}>Aucun moodboard. Crée ton premier thème ✦</p>}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ OST DE TA VIE 2026 — une chanson par mois
   ============================================================ */
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
function LifeOST({ ost, setOst }) {
  const year = 2026;
  const data = ost || {};
  const setMonth = (m, patch) => setOst({ ...data, [m]:{ ...(data[m]||{}), ...patch } });
  const filled = MONTHS_FR.filter((_,i)=>data[i]?.title).length;

  return (
    <div className="animate-fade-up max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <h3 className="text-3xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🎵 L'OST de ma vie · {year}</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Une chanson par mois. À la fin de l'année, c'est la bande-son de ton année.</p>
        <p className="text-xs mt-1" style={{color:"var(--accent)"}}>{filled}/12 mois remplis</p>
      </div>
      <div className="space-y-2">
        {MONTHS_FR.map((mn,i)=>{
          const cur = new Date().getMonth(), isCur = i===cur && year===new Date().getFullYear();
          const m = data[i]||{};
          return (
            <div key={i} className="rounded-2xl p-3" style={{background:isCur?"linear-gradient(160deg,var(--surface2),var(--surface))":"var(--surface)", border:isCur?"1px solid var(--accent)":"1px solid var(--border)"}}>
              <div className="flex items-center gap-3">
                <span className="text-xs w-16 flex-shrink-0" style={{color:isCur?"var(--accent)":"var(--muted)", fontFamily:'"Dancing Script",cursive', fontSize:"15px"}}>{mn}</span>
                <div className="flex-1 min-w-0">
                  <input value={m.title||""} onChange={e=>setMonth(i,{title:e.target.value})} placeholder="titre — artiste" className="w-full text-sm bg-transparent outline-none" style={{color:"var(--text)"}}/>
                  {m.spotify && m.spotify.includes("spotify") && <iframe title={"sp"+i} src={m.spotify.replace("/track/","/embed/track/")} width="100%" height="80" frameBorder="0" allow="encrypted-media" className="rounded-lg mt-2"/>}
                  <input value={m.spotify||""} onChange={e=>setMonth(i,{spotify:e.target.value})} placeholder="lien Spotify (optionnel)" className="w-full text-[10px] bg-transparent outline-none mt-1" style={{color:"var(--muted)"}}/>
                </div>
                <span className="text-lg">{m.title?"🎶":"🎵"}</span>
              </div>
            </div>
          );
        })}
      </div>
      {filled===12 && <div className="mt-5 rounded-2xl p-5 text-center" style={{background:"linear-gradient(160deg,var(--surface2),var(--surface))", border:"1px solid var(--accent)"}}><p className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Ton année 2026 a sa bande-son complète ✦</p><p className="text-xs italic" style={{color:"var(--muted)"}}>12 chansons qui racontent ton année</p></div>}
    </div>
  );
}

/* ============================================================
   ✦ SPIRALE LUNAIRE DU MOIS (Yasmeen)
   ============================================================ */
function MoonSpiral() {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const todayD = now.getDate();
  // points sur une spirale
  const pts = [];
  for (let day=1; day<=daysInMonth; day++) {
    const d = new Date(year, month, day);
    const mp = moonPhase(d);
    const t = (day-1)/(daysInMonth-1);
    const angle = t * Math.PI * 4; // 2 tours
    const r = 12 + t * 78;
    const cx = 110 + r*Math.cos(angle);
    const cy = 110 + r*Math.sin(angle);
    pts.push({ day, cx, cy, illum:mp.illum, idx:mp.idx, isNew:mp.idx===0, isFull:mp.idx===4, isToday:day===todayD });
  }
  return (
    <div className="rounded-2xl p-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <h3 className="text-xl mb-1 flex items-center gap-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🌀 Spirale lunaire</h3>
      <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Le cycle de la lune ce mois-ci · {MONTHS_FR[month]} {year}</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 220 220" style={{width:"min(280px,80vw)", height:"min(280px,80vw)"}}>
          {pts.map((p,i)=> i>0 && <line key={"l"+i} x1={pts[i-1].cx} y1={pts[i-1].cy} x2={p.cx} y2={p.cy} stroke="var(--border)" strokeWidth="1" opacity="0.4"/>)}
          {pts.map(p=>(
            <g key={p.day}>
              <circle cx={p.cx} cy={p.cy} r={p.isFull?6:p.isNew?5:3.2}
                fill={p.isFull?"#fff":p.isNew?"#2a2a3a":`rgba(230,220,255,${0.25+p.illum/150})`}
                stroke={p.isToday?"var(--accent)":p.isFull?"#e0c97a":"none"} strokeWidth={p.isToday?2.5:p.isFull?1.5:0}
                style={{filter:(p.isFull||p.isToday)?"drop-shadow(0 0 4px var(--accent))":"none"}}/>
              {p.isFull && <text x={p.cx} y={p.cy-9} textAnchor="middle" fontSize="7" fill="var(--accent)">🌕</text>}
              {p.isNew && <text x={p.cx} y={p.cy-8} textAnchor="middle" fontSize="7" fill="var(--muted)">🌑</text>}
            </g>
          ))}
          <text x="110" y="113" textAnchor="middle" fontSize="20">🌙</text>
        </svg>
      </div>
      <div className="flex justify-center gap-4 text-[10px] mt-2" style={{color:"var(--muted)"}}>
        <span>🌑 Nouvelle Lune</span><span>🌕 Pleine Lune</span><span style={{color:"var(--accent)"}}>○ aujourd'hui</span>
      </div>
    </div>
  );
}

/* ============================================================
   ✦ BOÎTE À MANIFESTATION (Yasmeen)
   ============================================================ */
function ManifestBox({ seeds, setSeeds }) {
  const [text, setText] = useState("");
  const [shaking, setShaking] = useState(false);
  const addSeed = () => { if(!text.trim()) return; setSeeds([{id:uid(), text:text.trim(), date:new Date().toISOString().slice(0,10), grown:null}, ...seeds]); setText(""); };
  const shake = () => { setShaking(true); setTimeout(()=>setShaking(false), 900); };
  const markGrown = (id, val) => setSeeds(seeds.map(s=>s.id===id?{...s,grown:val}:s));
  const remove = (id) => setSeeds(seeds.filter(s=>s.id!==id));
  const daysSince = (d) => Math.floor((Date.now()-new Date(d))/86400000);

  return (
    <div className="rounded-2xl p-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <h3 className="text-xl mb-1 flex items-center gap-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>📦 Boîte à manifestation</h3>
      <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Glisse tes désirs dedans. Secoue pour diffuser l'énergie. Reviens voir si la graine a poussé.</p>

      <div className="flex gap-2 mb-3">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSeed()} placeholder="un désir, un mot, une intention..."
          className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        <button onClick={addSeed} className="px-3 rounded-lg" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={16}/></button>
      </div>

      <button onClick={shake} className="w-full mb-4 py-8 rounded-2xl text-center transition" style={{background:"linear-gradient(160deg, var(--surface2), var(--primary))", border:"2px solid var(--accent)", animation:shaking?"boxShake 0.4s ease-in-out 2":"none"}}>
        <div className="text-5xl mb-1">🎁</div>
        <p className="text-sm" style={{color:"var(--text)"}}>{shaking?"✦ énergie diffusée ✦":"touche pour secouer & diffuser"}</p>
        <p className="text-[10px]" style={{color:"var(--muted)"}}>{seeds.length} graine{seeds.length>1?"s":""} à l'intérieur</p>
      </button>

      <div className="space-y-2">
        {seeds.map(s=>(
          <div key={s.id} className="rounded-xl p-3" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{color:"var(--text)"}}>🌱 {s.text}</p>
                <p className="text-[10px]" style={{color:"var(--muted)"}}>planté il y a {daysSince(s.date)}j</p>
              </div>
              <button onClick={()=>remove(s.id)} style={{color:"var(--muted)"}}><X size={14}/></button>
            </div>
            {daysSince(s.date)>=14 && s.grown===null && (
              <div className="mt-2 rounded-lg p-2" style={{background:"rgba(var(--glow),0.12)"}}>
                <p className="text-xs mb-2" style={{color:"var(--accent)"}}>✦ Est-ce que cette graine a poussé dans ta réalité ?</p>
                <div className="flex gap-2">
                  <button onClick={()=>markGrown(s.id,true)} className="px-3 py-1 rounded-full text-xs" style={{background:"var(--primary)", color:"var(--bg)"}}>🌸 oui, manifesté !</button>
                  <button onClick={()=>markGrown(s.id,false)} className="px-3 py-1 rounded-full text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>pas encore</button>
                </div>
              </div>
            )}
            {s.grown===true && <p className="text-xs mt-1" style={{color:"var(--accent)"}}>🌸 manifesté — merci l'Univers</p>}
            {s.grown===false && <button onClick={()=>markGrown(s.id,null)} className="text-[10px] underline mt-1" style={{color:"var(--muted)"}}>revérifier plus tard</button>}
          </div>
        ))}
        {seeds.length===0 && <p className="text-center italic text-xs py-4" style={{color:"var(--muted)"}}>La boîte est vide. Plante ta première intention ✦</p>}
      </div>
      <style>{`@keyframes boxShake{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-6px) rotate(-3deg)}75%{transform:translateX(6px) rotate(3deg)}}`}</style>
    </div>
  );
}

/* ============================================================
   ✦ LÂCHER-PRISE — respiration + fumée (Yasmeen)
   ============================================================ */
function LetGo() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | breathing | smoke | done
  const release = () => {
    if (!text.trim()) return;
    setPhase("breathing");
    setTimeout(()=>setPhase("smoke"), 10000);
    setTimeout(()=>{ setPhase("done"); setText(""); }, 13000);
  };
  return (
    <div className="rounded-2xl p-5 text-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <h3 className="text-xl mb-1 flex items-center justify-center gap-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>💨 Lâcher-prise</h3>
      <p className="text-xs italic mb-4" style={{color:"var(--muted)"}}>Tu penses trop ? Écris, respire, et confie tout à l'Univers.</p>

      {phase==="idle" && (<>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={4} placeholder="Écris ce qui t'obsède, ce qui te stresse, ta sur-manifestation..."
          className="w-full px-3 py-3 rounded-xl bg-transparent outline-none text-sm mb-3" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        <button onClick={release} disabled={!text.trim()} className="px-5 py-2 rounded-full text-sm disabled:opacity-40" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ Lâcher prise</button>
      </>)}

      {phase==="breathing" && (
        <div className="py-8">
          <div className="mx-auto mb-4 rounded-full" style={{width:"80px", height:"80px", background:"radial-gradient(circle, var(--accent), var(--primary))", animation:"breathe 4s ease-in-out infinite"}}/>
          <p className="text-sm" style={{color:"var(--text)"}}>Respire... inspire 4s... expire 4s...</p>
          <p className="text-xs italic mt-1" style={{color:"var(--muted)"}}>laisse les pensées se déposer</p>
        </div>
      )}
      {phase==="smoke" && (
        <div className="py-10 relative overflow-hidden" style={{minHeight:"120px"}}>
          <p className="text-sm" style={{color:"var(--muted)", animation:"smokeAway 3s ease-in forwards"}}>{text}</p>
          {Array.from({length:12}).map((_,i)=>(<span key={i} className="absolute text-2xl" style={{left:`${20+Math.random()*60}%`, bottom:"0", opacity:0.5, animation:`smokeRise ${2+Math.random()*1.5}s ease-in forwards`, animationDelay:`${Math.random()}s`}}>💨</span>))}
        </div>
      )}
      {phase==="done" && (
        <div className="py-8 animate-fade-up">
          <div className="text-4xl mb-2">🕊️</div>
          <p className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>C'est envoyé.</p>
          <p className="text-sm" style={{color:"var(--text)"}}>Maintenant, vis ta vie ici-bas. L'Univers s'en occupe.</p>
          <button onClick={()=>setPhase("idle")} className="mt-4 px-4 py-2 rounded-full text-xs" style={{background:"var(--surface2)", color:"var(--text)"}}>recommencer</button>
        </div>
      )}
      <style>{`@keyframes breathe{0%,100%{transform:scale(0.7);opacity:0.6}50%{transform:scale(1.2);opacity:1}}
        @keyframes smokeAway{0%{opacity:1;filter:blur(0)}100%{opacity:0;filter:blur(8px);transform:translateY(-20px)}}
        @keyframes smokeRise{0%{transform:translateY(0) scale(1);opacity:0.5}100%{transform:translateY(-100px) scale(2);opacity:0}}`}</style>
    </div>
  );
}

/* ============================================================
   ✦ ROYAUME FÉE (Fairy) — hub avec sous-sections
   ============================================================ */
const FAIRY_LORE_SEED = [
  { id:"pixie", name:"Pixies", emoji:"🧚", flower:"Digitale", likes:"la danse, les blagues, le désordre joyeux", taboo:"ne jamais les remercier de façon humaine, ça les vexe", note:"Petites fées espiègles qui adorent jouer des tours bon enfant." },
  { id:"sylph", name:"Sylphes", emoji:"🌬️", flower:"Pissenlit", likes:"le vent, l'encens, les plumes", taboo:"ne pas les enfermer ni retenir l'air", note:"Esprits de l'air, messagers entre les mondes." },
  { id:"dryad", name:"Dryades", emoji:"🌳", flower:"Chêne / Gui", likes:"qu'on protège les arbres, le silence", taboo:"ne jamais couper un arbre vivant sans demander", note:"Nymphes des arbres, gardiennes des forêts anciennes." },
  { id:"leprechaun", name:"Leprechauns", emoji:"🍀", flower:"Trèfle", likes:"l'or, l'artisanat, le whisky", taboo:"ne jamais les quitter des yeux ou ils disparaissent", note:"Petits artisans rusés du folklore irlandais." },
  { id:"undine", name:"Ondines", emoji:"💧", flower:"Nénuphar", likes:"l'eau pure, les coquillages, les chants", taboo:"ne pas polluer leur eau", note:"Nymphes de l'eau, gardiennes des sources et rivières." },
];
const FAIRY_OFFERINGS = {
  printemps:["Lait chaud au miel 🍯","Pétales de fleurs fraîches","Eau de rose"],
  été:["Biscuits à la lavande","Fruits rouges","Eau de source"],
  automne:["Noisettes & glands","Cidre doux","Petits objets en cuivre"],
  hiver:["Lait chaud épicé","Miel & cannelle","Cristaux brillants"],
};
function currentSeason() {
  const m = new Date().getMonth();
  return m<=1||m===11 ? "hiver" : m<=4 ? "printemps" : m<=7 ? "été" : "automne";
}

const FAIRY_ORACLE = [
  { name:"La Clochette", emoji:"🔔", msg:"Une surprise joyeuse arrive. Reste ouverte à l'inattendu." },
  { name:"Le Chêne", emoji:"🌳", msg:"Protection et force. Tu es plus enracinée que tu ne crois." },
  { name:"La Licorne", emoji:"🦄", msg:"Pureté et magie. Crois en l'impossible aujourd'hui." },
  { name:"Le Papillon", emoji:"🦋", msg:"Transformation. Tu sors d'un cocon, laisse-toi déployer." },
  { name:"La Rose", emoji:"🌹", msg:"Amour de soi. Offre-toi la douceur que tu donnes aux autres." },
  { name:"Le Champignon", emoji:"🍄", msg:"Entre deux mondes. Fais confiance à ton intuition." },
  { name:"La Luciole", emoji:"✨", msg:"Ta lumière intérieure guide le chemin. Ne la caches pas." },
  { name:"Le Ruisseau", emoji:"💧", msg:"Laisse couler. Ce qui doit partir partira naturellement." },
  { name:"Le Cerf Blanc", emoji:"🦌", msg:"Un guide veille sur toi. Suis les signes de la nature." },
  { name:"La Lune", emoji:"🌙", msg:"Honore tes cycles. Le repos fait aussi partie de la magie." },
];
const FAIRY_LAWS_DEFAULT = [
  "Toujours laisser un coin de mon jardin sauvage pour qu'elles s'y cachent.",
  "Ne jamais jeter de déchets et remercier l'esprit de l'eau.",
  "Cultiver ma joie de vivre, car les fées détestent l'ennui.",
];

function FairyWeather() {
  const [w, setW] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = () => {
    setLoading(true); setErr("");
    if (!navigator.geolocation) { setErr("Géolocalisation indisponible"); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      try {
        const { latitude, longitude } = pos.coords;
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,cloud_cover,is_day`);
        const j = await r.json();
        setW(j.current);
      } catch(e){ setErr("Impossible de récupérer la météo"); }
      setLoading(false);
    }, ()=>{ setErr("Localisation refusée"); setLoading(false); });
  };

  // interprétation féerique du code météo
  const fey = (c) => {
    if (!c) return null;
    const code = c.weather_code;
    const mist = [45,48].includes(code);
    const sunRain = [51,53,80].includes(code) && c.cloud_cover<70;
    const clearNight = code===0 && c.is_day===0;
    if (mist) return { msg:"Brume féerique ! Météo idéale pour la danse des fées. Ouvre l'œil ! 🌫️", good:true };
    if (sunRain) return { msg:"Pluie sous le soleil — un arc-en-ciel se forme. Les fées sortent ! 🌈", good:true };
    if (clearNight) return { msg:"Ciel étoilé sans nuages. Nuit parfaite pour leur magie. ✨", good:true };
    if (code===0) return { msg:"Grand soleil. Belle journée, mais les fées se cachent à midi. ☀️", good:false };
    return { msg:"Temps calme. Pose ton intention de rencontre quand même. 🍃", good:false };
  };
  const f = w && fey(w);

  return (
    <div className="max-w-md mx-auto text-center">
      {!w ? (
        <div className="rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <p className="text-sm italic mb-4" style={{color:"var(--muted)"}}>Synchronise ta vraie météo pour savoir si c'est un jour féerique</p>
          <button onClick={fetchWeather} disabled={loading} className="px-5 py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>{loading?"...":"🌦️ Voir la météo féerique"}</button>
          {err && <p className="text-xs mt-3" style={{color:"#c89a9a"}}>{err}</p>}
        </div>
      ) : (
        <div className="rounded-3xl p-6 animate-fade-up" style={{background:f?.good?"linear-gradient(160deg,#ffd0ee33,var(--surface))":"var(--surface)", border:`1px solid ${f?.good?"var(--accent)":"var(--border)"}`}}>
          <p className="text-3xl mb-1">{Math.round(w.temperature_2m)}°</p>
          <p className="text-sm" style={{color:"var(--text)"}}>{f?.msg}</p>
          {f?.good && <p className="text-xs italic mt-3" style={{color:"var(--accent)"}}>✦ Spécifie ton intention de rencontre aujourd'hui ✦</p>}
          <button onClick={fetchWeather} className="mt-4 text-xs underline" style={{color:"var(--muted)"}}>rafraîchir</button>
        </div>
      )}
    </div>
  );
}

function FairyRealm({ data, setData }) {
  const d = data || {};
  const set = (patch) => setData({ ...d, ...patch });
  const [tab, setTab] = useState("profile");
  const tabs = [
    {k:"profile",l:"🧚 Profil"},{k:"lore",l:"📖 Lore"},{k:"garden",l:"🌱 Jardin"},
    {k:"feast",l:"🍯 Offrandes"},{k:"glamour",l:"👗 Glamour"},
    {k:"weather",l:"🌦️ Météo fée"},{k:"oracle",l:"🃏 Oracle"},
    {k:"avalon",l:"🌙 Rêves Avalon"},{k:"laws",l:"📜 Lois"},
  ];

  // --- Profile ---
  const prof = d.profile || {};
  const setProf = (patch)=>set({profile:{...prof,...patch}});

  // --- Garden ---
  const garden = d.garden || { seeds:0, plants:[] };
  const earnSeed = ()=>set({garden:{...garden, seeds:(garden.seeds||0)+1}});
  const plantSeed = (type)=>{ if((garden.seeds||0)<1) return; set({garden:{seeds:garden.seeds-1, plants:[...(garden.plants||[]), {id:uid(), type, x:8+Math.random()*84, y:30+Math.random()*55}]}}); };

  // --- Glamour ---
  const glam = d.glamour || [];
  const addGlam = ()=>set({glamour:[{id:uid(),img:"",label:""},...glam]});
  const updGlam = (id,patch)=>set({glamour:glam.map(g=>g.id===id?{...g,...patch}:g)});
  const delGlam = (id)=>set({glamour:glam.filter(g=>g.id!==id)});

  const season = currentSeason();

  // --- Oracle ---
  const [card, setCard] = useState(null);
  const drawCard = ()=> setCard(pickByDate(FAIRY_ORACLE, "fairyoracle"));
  // --- Laws ---
  const laws = d.laws || FAIRY_LAWS_DEFAULT;
  const setLaws = (l)=>set({laws:l});
  // --- Avalon dreams ---
  const avalon = d.avalon || [];
  const [avText, setAvText] = useState("");
  const addAvalon = ()=>{ if(!avText.trim()) return; set({avalon:[{id:uid(), text:avText.trim(), date:new Date().toISOString().slice(0,10), visited:false}, ...avalon]}); setAvText(""); };
  // --- Poussière de fée ---
  const [dust, setDust] = useState(false);

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-5">
        <h3 className="text-4xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🧚‍♀️ Mon Royaume Féerique 🌿</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>ton coin secret avec le Petit Peuple</p>
      </div>

      {/* sous-onglets */}
      <div className="flex flex-nowrap gap-2 mb-5 overflow-x-auto pb-2 -mx-3 px-3 justify-start sm:justify-center">
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm whitespace-nowrap" style={{background:tab===t.k?"var(--primary)":"var(--surface)", color:tab===t.k?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{t.l}</button>
        ))}
      </div>

      {/* 1. FAIRY PROFILE */}
      {tab==="profile" && (
        <div className="max-w-xl mx-auto rounded-3xl p-6" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
          <h4 className="text-2xl mb-4 text-center" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>Ma fiche d'identité féerique</h4>
          <div className="space-y-3 text-sm">
            {[
              {k:"type",l:"Mon type de fée",ph:"fée des bois, nymphe de l'eau, fée de la nuit, elfe de lumière..."},
              {k:"wings",l:"Mes ailes (texture & couleur)",ph:"voiles irisés rose pâle, comme des pétales..."},
              {k:"size",l:"Ma taille",ph:"haute comme une fleur, taille humaine..."},
              {k:"power",l:"Mon pouvoir élémentaire",ph:"guérison, contrôle des plantes, illusions..."},
              {k:"companions",l:"Mes créatures compagnes",ph:"un cerf blanc, des lucioles, un renard..."},
              {k:"realm",l:"Mon royaume",ph:"une forêt enchantée près d'une cascade..."},
            ].map(f=>(
              <div key={f.k}>
                <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>{f.l}</label>
                <input value={prof[f.k]||""} onChange={e=>setProf({[f.k]:e.target.value})} placeholder={f.ph}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FAIRY LORE (éditable) */}
      {tab==="lore" && (()=>{
        const lore = d.lore || FAIRY_LORE_SEED;
        const setLore = (l)=>set({lore:l});
        const updL = (id,patch)=>setLore(lore.map(c=>c.id===id?{...c,...patch}:c));
        return (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={()=>setLore([{id:uid(),name:"Nouvel être",emoji:"✨",flower:"",likes:"",taboo:"",note:""},...lore])} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/> ajouter une fiche</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
          {lore.map(c=>(
            <div key={c.id} className="rounded-2xl p-4 group relative" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <button onClick={()=>setLore(lore.filter(x=>x.id!==c.id))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><Trash2 size={14}/></button>
              <div className="flex items-center gap-2 mb-2">
                <input value={c.emoji} onChange={e=>updL(c.id,{emoji:e.target.value})} className="text-2xl w-10 bg-transparent outline-none text-center"/>
                <input value={c.name} onChange={e=>updL(c.id,{name:e.target.value})} className="text-xl bg-transparent outline-none flex-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}/>
              </div>
              <textarea value={c.note} onChange={e=>updL(c.id,{note:e.target.value})} rows={2} placeholder="description..." className="w-full text-sm mb-2 bg-transparent outline-none" style={{color:"var(--text)", border:"1px solid var(--border)", borderRadius:"8px", padding:"4px 8px"}}/>
              <div className="flex items-center gap-1 text-xs mb-1"><span>🌸</span><input value={c.flower} onChange={e=>updL(c.id,{flower:e.target.value})} placeholder="fleur associée" className="flex-1 bg-transparent outline-none" style={{color:"var(--muted)"}}/></div>
              <div className="flex items-center gap-1 text-xs mb-1"><span>💚</span><input value={c.likes} onChange={e=>updL(c.id,{likes:e.target.value})} placeholder="ce qu'ils aiment" className="flex-1 bg-transparent outline-none" style={{color:"var(--muted)"}}/></div>
              <div className="flex items-center gap-1 text-xs"><span>⚠️</span><input value={c.taboo} onChange={e=>updL(c.id,{taboo:e.target.value})} placeholder="tabou / interdit" className="flex-1 bg-transparent outline-none" style={{color:"#c89a9a"}}/></div>
            </div>
          ))}
          </div>
        </div>
      );})()}

      {/* 3. FAIRY GARDEN */}
      {tab==="garden" && (
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl p-4 mb-4 text-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <p className="text-sm" style={{color:"var(--text)"}}>🌰 Graines magiques : <b style={{color:"var(--accent)"}}>{garden.seeds||0}</b></p>
            <p className="text-xs italic mt-1 mb-3" style={{color:"var(--muted)"}}>Passe du temps dans la vraie nature → gagne une graine</p>
            <button onClick={earnSeed} className="px-4 py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>🌿 J'ai été dans la nature (+1 graine)</button>
          </div>
          {(garden.seeds||0)>0 && (
            <div className="flex gap-2 justify-center mb-4 flex-wrap">
              {[["🌸","fleur"],["🍄","champignon"],["🌷","tulipe"],["✨","fleur-lumière"]].map(([e,t])=>(
                <button key={t} onClick={()=>plantSeed(e)} className="px-3 py-1.5 rounded-full text-sm" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>planter {e}</button>
              ))}
            </div>
          )}
          <div className="relative rounded-3xl overflow-hidden" style={{height:"280px", background:"linear-gradient(180deg, #1a2a3a 0%, #2a3a2e 60%, #1e2a1a 100%)", border:"1px solid var(--border)"}}>
            {Array.from({length:25}).map((_,i)=>(<span key={i} className="absolute rounded-full" style={{top:`${Math.random()*60}%`,left:`${Math.random()*100}%`,width:"2px",height:"2px",background:"#fff",opacity:0.5,animation:`twinkle ${2+Math.random()*2}s ease-in-out infinite`}}/>))}
            {(garden.plants||[]).map(p=>(
              <span key={p.id} className="absolute" style={{left:`${p.x}%`, top:`${p.y}%`, fontSize:"26px", filter:"drop-shadow(0 0 6px rgba(200,255,200,0.6))", animation:"floatY 4s ease-in-out infinite"}}>{p.type}</span>
            ))}
            {(garden.plants||[]).length===0 && <p className="absolute inset-0 flex items-center justify-center text-sm italic" style={{color:"rgba(255,255,255,0.5)"}}>Ton jardin attend tes premières graines ✦</p>}
          </div>
        </div>
      )}

      {/* 4. FAIRY FEAST (éditable) */}
      {tab==="feast" && (()=>{
        const myOff = d.offerings || FAIRY_OFFERINGS[season];
        const setOff = (l)=>set({offerings:l});
        return (
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl p-5 mb-4 text-center" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
            <p className="text-xs uppercase tracking-widest" style={{color:"var(--muted)"}}>Offrande suggérée · {season}</p>
            <p className="text-lg mt-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{FAIRY_OFFERINGS[season][0]}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm uppercase tracking-widest" style={{color:"var(--muted)"}}>Mes offrandes</h4>
            <button onClick={()=>setOff([...myOff,"Nouvelle offrande..."])} className="px-3 py-1 rounded-full text-xs flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={12}/> ajouter</button>
          </div>
          <div className="space-y-2">
            {myOff.map((o,i)=>(
              <div key={i} className="rounded-xl p-3 flex items-center gap-2 group" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <span>✦</span>
                <input value={o} onChange={e=>setOff(myOff.map((x,j)=>j===i?e.target.value:x))} className="flex-1 bg-transparent outline-none text-sm" style={{color:"var(--text)"}}/>
                <button onClick={()=>setOff(myOff.filter((_,j)=>j!==i))} className="opacity-0 group-hover:opacity-100" style={{color:"var(--muted)"}}><X size={14}/></button>
              </div>
            ))}
          </div>
          <p className="text-xs italic mt-4 text-center" style={{color:"var(--muted)"}}>Laisse ton offrande dehors, dans un coin de nature, avec une intention douce 🌿</p>
        </div>
      );})()}

      {/* 5. FAIRY GLAMOUR */}
      {tab==="glamour" && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <p className="text-sm italic" style={{color:"var(--muted)"}}>Tes inspirations Fairycore & Coquette ✦</p>
            <button onClick={addGlam} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={14}/> ajouter</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {glam.map(g=>(
              <div key={g.id} className="group relative rounded-2xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
                {g.img ? <img src={g.img} alt="" className="w-full object-cover" style={{aspectRatio:"3/4"}}/> : <div className="w-full flex items-center justify-center text-3xl" style={{aspectRatio:"3/4", background:"var(--surface2)"}}>🧚</div>}
                <div className="p-2" style={{background:"var(--surface)"}}>
                  <div className="mb-1"><ImgPicker value={g.img} onChange={v=>updGlam(g.id,{img:v})} placeholder="URL image" small/></div>
                  <input value={g.label} onChange={e=>updGlam(g.id,{label:e.target.value})} placeholder="note..." className="w-full text-xs bg-transparent outline-none" style={{color:"var(--text)"}}/>
                </div>
                <button onClick={()=>delGlam(g.id)} className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100" style={{background:"rgba(0,0,0,0.6)", color:"#fff"}}><X size={12}/></button>
              </div>
            ))}
            {glam.length===0 && <p className="col-span-full text-center italic py-8" style={{color:"var(--muted)"}}>Ajoute tes inspirations féeriques ✦</p>}
          </div>
        </div>
      )}

      {/* 6. MÉTÉO FÉERIQUE */}
      {tab==="weather" && <FairyWeather/>}

      {/* 7. ORACLE */}
      {tab==="oracle" && (
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm italic mb-4" style={{color:"var(--muted)"}}>Tire ta carte du jour pour recevoir la guidance de la nature</p>
          {card ? (
            <div className="rounded-3xl p-8 animate-fade-up" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
              <div className="text-6xl mb-3">{card.emoji}</div>
              <h4 className="text-2xl mb-2" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{card.name}</h4>
              <p className="text-sm" style={{color:"var(--text)"}}>{card.msg}</p>
              <button onClick={()=>setCard(null)} className="mt-4 text-xs underline" style={{color:"var(--muted)"}}>retirer une carte</button>
            </div>
          ) : (
            <button onClick={drawCard} className="px-6 py-4 rounded-2xl text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>🃏 Tirer ma carte du jour</button>
          )}
        </div>
      )}

      {/* 8. RÊVES D'AVALON */}
      {tab==="avalon" && (
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl p-4 mb-4" style={{background:"linear-gradient(160deg, #1e2a1a, #2a3a2e)", border:"1px solid var(--accent)"}}>
            <p className="text-xs italic mb-2" style={{color:"#b8d0b0"}}>🌿 Note ici tes rêves de nature magique, créatures, paysages féeriques...</p>
            <textarea value={avText} onChange={e=>setAvText(e.target.value)} rows={3} placeholder="Cette nuit j'ai rêvé d'une forêt lumineuse..." className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid rgba(180,208,176,0.3)", color:"#eaf5e8"}}/>
            <button onClick={addAvalon} className="mt-2 px-4 py-2 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ noter ce rêve</button>
          </div>
          <div className="space-y-2">
            {avalon.map(a=>(
              <div key={a.id} className="rounded-xl p-3" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm flex-1" style={{color:"var(--text)"}}>🍃 {a.text}</p>
                  <button onClick={()=>set({avalon:avalon.filter(x=>x.id!==a.id)})} style={{color:"var(--muted)"}}><X size={14}/></button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px]" style={{color:"var(--muted)"}}>{a.date}</span>
                  <label className="flex items-center gap-1 text-[11px]" style={{color:"var(--accent)"}}>
                    <input type="checkbox" checked={a.visited} onChange={e=>set({avalon:avalon.map(x=>x.id===a.id?{...x,visited:e.target.checked}:x)})}/>
                    j'ai visité leur monde
                  </label>
                </div>
              </div>
            ))}
            {avalon.length===0 && <p className="text-center italic py-6 text-sm" style={{color:"var(--muted)"}}>Aucun rêve d'Avalon noté ✦</p>}
          </div>
        </div>
      )}

      {/* 9. FAIRY LAWS */}
      {tab==="laws" && (
        <div className="max-w-xl mx-auto">
          <p className="text-sm italic mb-4 text-center" style={{color:"var(--muted)"}}>Tes lois magiques pour attirer leurs bonnes grâces ✦</p>
          <div className="space-y-2">
            {laws.map((law,i)=>(
              <div key={i} className="rounded-xl p-3 flex items-start gap-3" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--border)"}}>
                <span className="text-sm flex-shrink-0" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)", fontSize:"18px"}}>Loi {i+1}</span>
                <input value={law} onChange={e=>setLaws(laws.map((l,j)=>j===i?e.target.value:l))} className="flex-1 bg-transparent outline-none text-sm" style={{color:"var(--text)"}}/>
                <button onClick={()=>setLaws(laws.filter((_,j)=>j!==i))} style={{color:"var(--muted)"}}><X size={14}/></button>
              </div>
            ))}
          </div>
          <button onClick={()=>setLaws([...laws,"Nouvelle loi magique..."])} className="mt-3 px-4 py-2 rounded-full text-sm flex items-center gap-1 mx-auto" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}><Plus size={14}/> ajouter une loi</button>
        </div>
      )}

      {/* 10. BOUTON POUSSIÈRE DE FÉE */}
      <div className="text-center mt-8 mb-4">
        <button onClick={()=>{ setDust(true); setTimeout(()=>setDust(false), 6000); }}
          className="px-5 py-2.5 rounded-full text-sm shadow-lg transition hover:scale-105"
          style={{ background:"linear-gradient(90deg,#ffc0e0,#e0c97a)", color:"#5a2a4a" }}>
          ✦ Poussière de Fée — quand tu te sens lourde
        </button>
      </div>
      {dust && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-up" style={{background:"rgba(20,10,30,0.92)"}}>
          {Array.from({length:60}).map((_,i)=>(<span key={i} className="absolute" style={{top:"-5%", left:`${Math.random()*100}%`, fontSize:`${8+Math.random()*14}px`, opacity:0.8, animation:`fall ${3+Math.random()*4}s linear ${Math.random()*2}s infinite`}}>{["✨","💖","⭐","🌸"][i%4]}</span>))}
          <div className="text-center max-w-sm relative">
            <div className="text-5xl mb-4">🧚‍♀️</div>
            <p className="text-xl leading-relaxed" style={{fontFamily:'"Dancing Script",cursive', color:"#ffd0ee"}}>Respire. Rappelle-toi qui tu es. Tu appartiens au monde de la magie — ne laisse pas la lourdeur des humains éteindre tes ailes.</p>
            <button onClick={()=>setDust(false)} className="mt-6 px-4 py-2 rounded-full text-xs" style={{background:"rgba(255,255,255,0.2)", color:"#fff"}}>merci ✦</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ✦ BOUTON THÈME DE PAGE — thème indépendant par sous-section
   ============================================================ */
function PageThemeButton({ activeSection, activeSub, subLabel, overrides, setOverrides, ALL_THEMES, customBackdrops }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("theme"); // theme | backdrop
  const key = `sub:${activeSection}:${activeSub}`;
  const ov = overrides[key] || {};
  const setTheme = (t) => setOverrides({ ...overrides, [key]: { ...ov, theme:t } });
  const resetTheme = () => { const c={...overrides}; if(c[key]){ const {theme, ...rest}=c[key]; c[key]=rest; if(Object.keys(c[key]).length===0) delete c[key]; } setOverrides(c); };
  const setBackdrop = (b) => setOverrides({ ...overrides, [key]: { ...ov, backdrop:b } });
  const resetBackdrop = () => { const c={...overrides}; if(c[key]){ const {backdrop, ...rest}=c[key]; c[key]=rest; if(Object.keys(c[key]).length===0) delete c[key]; } setOverrides(c); };
  const setBgImg = (v) => { if(v) setOverrides({ ...overrides, [key]: { ...ov, bgImage:v } }); else { const c={...overrides}; if(c[key]){ const {bgImage, bgOpacity, ...rest}=c[key]; c[key]=rest; if(Object.keys(c[key]).length===0) delete c[key]; } setOverrides(c); } };
  const setBgOpacity = (o) => setOverrides({ ...overrides, [key]: { ...ov, bgOpacity:o } });

  return (
    <>
      <button onClick={()=>setOpen(true)} aria-label="Thème de cette page"
        className="fixed z-40 w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110 shadow-xl"
        style={{ left:"calc(env(safe-area-inset-left) + 1rem)", bottom:"calc(env(safe-area-inset-bottom) + 1rem)", background:"var(--surface)", border:"1px solid var(--accent)", color:"var(--accent)" }}>
        <Palette size={20}/>
      </button>

      {open && (
        <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center" onClick={()=>setOpen(false)} style={{background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)"}}>
          <div onClick={e=>e.stopPropagation()} className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[82vh] overflow-y-auto animate-fade-up" style={{background:"var(--bg2)", border:"1px solid var(--accent)"}}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🎨 Apparence de cette page</h3>
              <button onClick={()=>setOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}><X size={18}/></button>
            </div>
            <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>« {subLabel} » — thème et fond indépendants du reste.</p>

            {/* onglets thème / fond / image */}
            <div className="flex gap-2 mb-4">
              <button onClick={()=>setTab("theme")} className="flex-1 py-2 rounded-lg text-[11px]" style={{background:tab==="theme"?"var(--primary)":"var(--surface)", color:tab==="theme"?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>🎨 Thème</button>
              <button onClick={()=>setTab("backdrop")} className="flex-1 py-2 rounded-lg text-[11px]" style={{background:tab==="backdrop"?"var(--primary)":"var(--surface)", color:tab==="backdrop"?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>✨ Fond animé</button>
              <button onClick={()=>setTab("image")} className="flex-1 py-2 rounded-lg text-[11px]" style={{background:tab==="image"?"var(--primary)":"var(--surface)", color:tab==="image"?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>🖼️ Image</button>
            </div>

            {tab==="theme" && (<>
              <button onClick={resetTheme} className="w-full mb-3 py-2 rounded-xl text-xs" style={{background:ov.theme?"var(--surface)":"var(--primary)", border:"1px solid var(--border)", color:ov.theme?"var(--text)":"var(--bg)"}}>
                ↺ utiliser le thème du côté (par défaut)
              </button>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ALL_THEMES).map(([k,t])=>{ const I=t.icon||Sparkles; return (
                  <button key={k} onClick={()=>setTheme(k)} className="p-3 rounded-xl text-left transition" style={{background:"var(--surface)", border:`1px solid ${ov.theme===k?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                    <I size={15} className="mb-1"/><div className="text-[11px] leading-tight">{t.name}</div>
                  </button>
                );})}
              </div>
              {ov.theme && <p className="text-xs text-center mt-3" style={{color:"var(--accent)"}}>✦ Cette page utilise « {ALL_THEMES[ov.theme]?.name} »</p>}
            </>)}

            {tab==="backdrop" && (<>
              <button onClick={resetBackdrop} className="w-full mb-3 py-2 rounded-xl text-xs" style={{background:(ov.backdrop===undefined)?"var(--primary)":"var(--surface)", border:"1px solid var(--border)", color:(ov.backdrop===undefined)?"var(--bg)":"var(--text)"}}>
                ↺ fond du thème (par défaut)
              </button>
              <button onClick={()=>setBackdrop("none")} className="w-full mb-3 py-2 rounded-xl text-xs" style={{background:ov.backdrop==="none"?"var(--primary)":"var(--surface)", border:"1px solid var(--border)", color:ov.backdrop==="none"?"var(--bg)":"var(--text)"}}>
                ∅ aucun fond
              </button>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BACKDROPS).map(([k,b])=>(
                  <button key={k} onClick={()=>setBackdrop(k)} className="p-2 rounded-xl text-center transition" style={{background:ov.backdrop===k?"rgba(var(--glow),0.2)":"var(--surface)", border:`1px solid ${ov.backdrop===k?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                    <div className="text-xl">{b.emoji}</div><div className="text-[9px] leading-tight mt-1">{b.name}</div>
                  </button>
                ))}
                {Object.entries(customBackdrops).map(([k,b])=>(
                  <button key={k} onClick={()=>setBackdrop(k)} className="p-2 rounded-xl text-center transition" style={{background:ov.backdrop===k?"rgba(var(--glow),0.2)":"var(--surface)", border:`1px solid ${ov.backdrop===k?"var(--primary)":"var(--accent)"}`, color:"var(--text)"}}>
                    <div className="text-xl">{b.particle}</div><div className="text-[9px] leading-tight mt-1">{b.name}</div>
                  </button>
                ))}
              </div>
            </>)}

            {tab==="image" && (<>
              <p className="text-xs italic mb-3" style={{color:"var(--muted)"}}>Une image de fond rien que pour cette page (URL ou galerie).</p>
              <ImgPicker value={ov.bgImage} onChange={v=>setBgImg(v)} placeholder="URL image de fond"/>
              {ov.bgImage && (<>
                <div className="mt-3 rounded-xl overflow-hidden" style={{height:"90px", background:`url(${ov.bgImage}) center/cover`, border:"1px solid var(--border)"}}/>
                <p className="text-[10px] uppercase tracking-widest mt-3 mb-1" style={{color:"var(--muted)"}}>Opacité : {Math.round((ov.bgOpacity??0.5)*100)}%</p>
                <input type="range" min="0.1" max="1" step="0.05" value={ov.bgOpacity??0.5} onChange={e=>setBgOpacity(parseFloat(e.target.value))} className="w-full"/>
                <button onClick={()=>setBgImg(null)} className="w-full mt-3 py-2 rounded-xl text-xs" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>retirer l'image</button>
              </>)}
            </>)}
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   ✦ SERRE MYSTIQUE — accueil visuel de Yasmeen
   ============================================================ */
const MOOD_LIQUID = { "✨":"#e0c97a", "😊":"#7ac8a8", "😌":"#8ac0e8", "🥰":"#e87a9a", "😢":"#6a8ad0", "😡":"#c0392b", "😴":"#9a7ad0", "🤩":"#e89b5a", "😰":"#7a9a8a" };
function MysticGreenhouse({ lastMood, plantsCount, decor=[], onCauldron, onPortal, onHerbs }) {
  const [portalAnim, setPortalAnim] = useState(false);
  const liquid = (lastMood && MOOD_LIQUID[lastMood.emoji]) || "var(--primary)";
  const triggerPortal = () => { setPortalAnim(true); setTimeout(()=>{ setPortalAnim(false); onPortal(); }, 1400); };
  const herbCount = Math.min(7, Math.max(plantsCount, 0));

  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🌿 Ma serre mystique 🔮</h3>
        <p className="text-xs italic" style={{color:"var(--muted)"}}>Touche le chaudron, l'herbier, ou la cloche pour voyager</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden mx-auto" style={{maxWidth:"720px", aspectRatio:"4/3", background:"linear-gradient(180deg, var(--surface2) 0%, var(--bg2) 75%)", border:"1px solid var(--border)", boxShadow:"inset 0 0 50px rgba(0,0,0,0.25)"}}>
        <RoomDecor unlocked={decor}/>
        {/* structure de serre : arches */}
        <div className="absolute inset-0 pointer-events-none" style={{background:"repeating-linear-gradient(90deg, transparent, transparent 23%, rgba(var(--glow),0.06) 23%, rgba(var(--glow),0.06) 24%)"}}/>
        <div className="absolute top-0 inset-x-0 pointer-events-none" style={{height:"14%", background:"linear-gradient(180deg, rgba(var(--glow),0.12), transparent)", borderBottom:"1px solid var(--border)"}}/>

        {/* sol */}
        <div className="absolute bottom-0 inset-x-0" style={{height:"15%", background:"var(--surface)", borderTop:"2px solid var(--border)"}}/>

        {/* ---- HERBIER SUSPENDU (en haut) ---- */}
        <button onClick={onHerbs} className="absolute inset-x-0 top-0 transition hover:brightness-110" style={{height:"38%", background:"transparent", border:"none"}}>
          {/* poutre du plafond */}
          <div className="absolute inset-x-0 top-0" style={{height:"7px", background:"var(--accent)", opacity:0.7}}/>
          <div className="absolute inset-x-0 flex justify-around items-start" style={{top:"7px", paddingLeft:"6%", paddingRight:"6%"}}>
            {Array.from({length:7}).map((_,i)=>{
              const has = i < herbCount;
              const plant = ["🌿","🌸","🍄","🌺","🪻","🌱","💐"][i%7];
              const cordLen = 18 + (i%3)*14;
              return (
                <span key={i} className="relative flex flex-col items-center" style={{width:"12%"}}>
                  {/* corde */}
                  <span style={{width:"2px", height:`${cordLen}px`, background:"linear-gradient(var(--accent), transparent)", opacity:0.6}}/>
                  {/* pot suspendu */}
                  <span className="relative flex items-center justify-center" style={{animation:`sway ${3.5+i%3}s ease-in-out infinite`, transformOrigin:"top center"}}>
                    {has ? (
                      <span className="relative flex flex-col items-center">
                        <span style={{fontSize:"24px", filter:"drop-shadow(0 0 6px var(--accent))", marginBottom:"-8px", zIndex:2}}>{plant}</span>
                        <span style={{width:"26px", height:"22px", background:"linear-gradient(180deg, var(--surface), var(--surface2))", borderRadius:"4px 4px 12px 12px", border:"2px solid var(--accent)"}}/>
                      </span>
                    ) : (
                      <span style={{width:"22px", height:"20px", background:"var(--surface)", borderRadius:"4px 4px 10px 10px", border:"1px dashed var(--border)", opacity:0.5}}/>
                    )}
                  </span>
                </span>
              );
            })}
          </div>
          <span className="absolute inset-x-0 text-center text-[11px]" style={{bottom:"0", color:"var(--text)", fontFamily:'"Dancing Script",cursive'}}>🌿 mon herbier · {plantsCount} plante{plantsCount>1?"s":""} cultivée{plantsCount>1?"s":""}</span>
        </button>

        {/* ---- CHAUDRON (bas gauche) ---- */}
        <div className="absolute" style={{left:"8%", bottom:"15%", width:"30%"}}>
          <button onClick={onCauldron} className="w-full transition hover:scale-105 relative flex flex-col items-center" style={{background:"transparent", border:"none"}}>
            {/* fumée */}
            <div className="relative" style={{height:"34px", width:"100%"}}>
              {Array.from({length:4}).map((_,i)=>(<span key={i} className="absolute" style={{left:`${30+i*12}%`, bottom:"0", fontSize:"14px", opacity:0.5, animation:`emberRise ${2.5+i*0.6}s ease-in infinite`, animationDelay:`${i*0.4}s`}}>💨</span>))}
            </div>
            {/* liquide + chaudron */}
            <div className="relative" style={{width:"82%"}}>
              <div className="rounded-b-full rounded-t-lg relative overflow-hidden" style={{height:"60px", background:"radial-gradient(circle at 50% 0%, #2a2a2e, #0d0d10)", border:"3px solid var(--accent)"}}>
                <div className="absolute inset-x-1 rounded-b-full" style={{bottom:"3px", top:"30%", background:liquid, opacity:0.85, animation:"glow 3s ease-in-out infinite"}}>
                  {Array.from({length:3}).map((_,i)=>(<span key={i} className="absolute rounded-full" style={{left:`${20+i*28}%`, bottom:`${10+Math.random()*30}%`, width:"6px", height:"6px", background:"rgba(255,255,255,0.4)", animation:`floatY ${1.5+i*0.5}s ease-in-out infinite`}}/>))}
                </div>
              </div>
              <div className="mx-auto" style={{width:"110%", height:"6px", marginLeft:"-5%", background:"var(--accent)", borderRadius:"4px", marginTop:"-2px"}}/>
            </div>
          </button>
          <p className="text-center text-[11px] mt-2" style={{color:"var(--text)", fontFamily:'"Dancing Script",cursive'}}>🫧 mon humeur {lastMood?`· ${lastMood.emoji}`:""}</p>
        </div>

        {/* ---- CLOCHE DE VERRE / PORTAIL (bas droite) ---- */}
        <div className="absolute" style={{right:"8%", bottom:"15%", width:"30%"}}>
          <button onClick={triggerPortal} className="w-full transition hover:scale-105 relative flex flex-col items-center" style={{background:"transparent", border:"none"}}>
            {/* cloche */}
            <div className="relative flex items-center justify-center" style={{width:"96px", height:"110px"}}>
              <div className="absolute" style={{inset:"0", borderRadius:"50% 50% 12px 12px", background:"linear-gradient(180deg, rgba(var(--glow),0.18), rgba(var(--glow),0.05))", border:"2px solid var(--accent)", boxShadow:"inset 0 0 20px rgba(var(--glow),0.3)"}}/>
              <span style={{fontSize:"40px", animation:"floatY 4s ease-in-out infinite", filter:"drop-shadow(0 0 8px var(--accent))"}}>🔮</span>
              {Array.from({length:6}).map((_,i)=>(<span key={i} className="absolute" style={{top:`${20+Math.random()*60}%`, left:`${15+Math.random()*70}%`, fontSize:"9px", opacity:0.7, animation:`twinkle ${1.5+Math.random()*2}s ease-in-out infinite`}}>✨</span>))}
              <div className="absolute" style={{bottom:"-4px", width:"108%", height:"8px", background:"var(--accent)", borderRadius:"4px"}}/>
            </div>
          </button>
          <p className="text-center text-[11px] mt-2" style={{color:"var(--text)", fontFamily:'"Dancing Script",cursive'}}>✦ portail shifting</p>
        </div>
      </div>

      {/* animation de transition portail */}
      {portalAnim && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" style={{background:"rgba(20,10,40,0.85)", backdropFilter:"blur(8px)", animation:"fadeUp 0.3s ease"}}>
          {Array.from({length:50}).map((_,i)=>(<span key={i} className="absolute" style={{top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, fontSize:`${8+Math.random()*16}px`, opacity:0.8, animation:`twinkle ${0.8+Math.random()*1.2}s ease-in-out infinite`}}>{["✨","💫","⭐","🌟"][i%4]}</span>))}
          <div className="text-center relative">
            <div className="text-6xl mb-3" style={{animation:"floatY 1.4s ease-in-out infinite"}}>🔮</div>
            <p className="text-xl" style={{fontFamily:'"Dancing Script",cursive', color:"#e0c0ff"}}>Le voile se lève...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ✦ JOURNAL LUNAIRE — parler à la Lune
   ============================================================ */
const MOON_ACTIONS = [
  "🌊 Création d'eau de lune",
  "💎 Rechargement de mes cristaux",
  "🕯️ Rituel de manifestation",
  "🍃 Rituel de bannissement",
  "🌙 Méditation de shifting",
  "📿 Tirage de cartes / oracle",
  "🛁 Bain rituel",
  "✍️ Écriture d'intentions",
];
function LunarJournal({ moon, entries, setEntries }) {
  const [text, setText] = useState("");
  const [actions, setActions] = useState({});
  const [tab, setTab] = useState("write"); // write | archive
  const isFull = moon.idx===4, isNew = moon.idx===0;

  // ambiance selon la phase
  const sky = isFull
    ? "radial-gradient(circle at 50% 30%, #2a2a4a, #15152e 70%)"
    : isNew
    ? "radial-gradient(circle at 50% 40%, #0a0a18, #050510 80%)"
    : "radial-gradient(circle at 50% 35%, #1a1a3a, #0d0d22 75%)";
  const glow = isFull ? "0 0 40px rgba(220,220,255,0.4)" : isNew ? "0 0 20px rgba(120,120,180,0.15)" : "0 0 25px rgba(160,160,220,0.25)";

  const save = () => {
    const chosen = Object.keys(actions).filter(k=>actions[k]);
    if (!text.trim() && chosen.length===0) return;
    setEntries([{ id:uid(), date:new Date().toISOString().slice(0,10), phase:moon.name, phaseIdx:moon.idx, illum:moon.illum, text:text.trim(), actions:chosen }, ...entries]);
    setText(""); setActions({});
  };

  return (
    <div className="rounded-3xl overflow-hidden" style={{border:"1px solid var(--accent)"}}>
      {/* en-tête céleste */}
      <div className="relative p-6" style={{background:sky, minHeight:"60px"}}>
        {/* étoiles */}
        {Array.from({length:isNew?40:isFull?15:25}).map((_,i)=>(<span key={i} className="absolute rounded-full" style={{top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, width:"2px", height:"2px", background:"#fff", opacity:0.7, animation:`twinkle ${1.5+Math.random()*2.5}s ease-in-out infinite`}}/>))}
        {/* la lune */}
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-full mb-3 flex items-center justify-center" style={{width:"56px", height:"56px", background: isNew?"radial-gradient(circle at 60% 40%, #1a1a2e, #0a0a14)":isFull?"radial-gradient(circle at 40% 35%, #fff, #d8d8f0)":"radial-gradient(circle at 35% 40%, #e0e0f5, #50506a 60%, #1a1a2e)", boxShadow:glow}}>
            {isNew && <span style={{fontSize:"10px", opacity:0.5}}>✦</span>}
          </div>
          <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"#e8e8ff"}}>Parler à la Lune</h3>
          <p className="text-xs italic" style={{color:"#b0b0d8"}}>{moon.name} · {moon.illum}% illuminée</p>
        </div>
      </div>

      {/* onglets */}
      <div className="flex gap-2 p-3" style={{background:"var(--surface)"}}>
        <button onClick={()=>setTab("write")} className="flex-1 py-2 rounded-lg text-xs" style={{background:tab==="write"?"var(--primary)":"var(--surface2)", color:tab==="write"?"var(--bg)":"var(--text)"}}>✍️ Confier à la Lune</button>
        <button onClick={()=>setTab("archive")} className="flex-1 py-2 rounded-lg text-xs" style={{background:tab==="archive"?"var(--primary)":"var(--surface2)", color:tab==="archive"?"var(--bg)":"var(--text)"}}>🌙 Archive des cycles</button>
      </div>

      <div className="p-5" style={{background:"var(--surface)"}}>
        {tab==="write" ? (<>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} placeholder="Chère Lune, ce soir je ressens..."
            className="w-full px-4 py-3 rounded-xl bg-transparent outline-none text-sm mb-4" style={{border:"1px solid var(--border)", color:"var(--text)", fontFamily:'"Caveat",cursive', fontSize:"18px"}}/>

          <p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Registre des actions magiques</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {MOON_ACTIONS.map(a=>(
              <button key={a} onClick={()=>setActions({...actions,[a]:!actions[a]})} className="text-left text-xs px-3 py-2 rounded-lg transition" style={{background:actions[a]?"var(--primary)":"var(--surface2)", color:actions[a]?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>
                {actions[a]?"✓ ":""}{a}
              </button>
            ))}
          </div>
          <button onClick={save} className="w-full py-3 rounded-full text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ Confier à la Lune</button>
        </>) : (
          <div className="space-y-3">
            {entries.length===0 && <p className="text-center italic py-6 text-sm" style={{color:"var(--muted)"}}>Aucune confidence encore. La Lune t'écoute ✦</p>}
            {entries.map(e=>(
              <div key={e.id} className="rounded-xl p-4" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{e.phase}</span>
                  <span className="text-[10px]" style={{color:"var(--muted)"}}>{e.date} · {e.illum}%</span>
                </div>
                {e.text && <p className="text-sm mb-2" style={{color:"var(--text)", fontFamily:'"Caveat",cursive', fontSize:"17px"}}>« {e.text} »</p>}
                {e.actions?.length>0 && <div className="flex flex-wrap gap-1">{e.actions.map((a,i)=>(<span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"var(--surface)", color:"var(--accent)"}}>{a}</span>))}</div>}
                <button onClick={()=>setEntries(entries.filter(x=>x.id!==e.id))} className="text-[10px] mt-2 underline" style={{color:"var(--muted)"}}>supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ✦ ALCHIMIE DES CYCLES CROISÉS (astro natal + lune + cycle)
   ============================================================ */
const ZODIAC = [
  {s:"Capricorne",el:"Terre",from:[12,22],to:[1,19]},
  {s:"Verseau",el:"Air",from:[1,20],to:[2,18]},
  {s:"Poissons",el:"Eau",from:[2,19],to:[3,20]},
  {s:"Bélier",el:"Feu",from:[3,21],to:[4,19]},
  {s:"Taureau",el:"Terre",from:[4,20],to:[5,20]},
  {s:"Gémeaux",el:"Air",from:[5,21],to:[6,20]},
  {s:"Cancer",el:"Eau",from:[6,21],to:[7,22]},
  {s:"Lion",el:"Feu",from:[7,23],to:[8,22]},
  {s:"Vierge",el:"Terre",from:[8,23],to:[9,22]},
  {s:"Balance",el:"Air",from:[9,23],to:[10,22]},
  {s:"Scorpion",el:"Eau",from:[10,23],to:[11,21]},
  {s:"Sagittaire",el:"Feu",from:[11,22],to:[12,21]},
];
function sunSign(dateStr) {
  if(!dateStr) return null;
  const d = new Date(dateStr); const m=d.getMonth()+1, day=d.getDate();
  for(const z of ZODIAC){ const[fm,fd]=z.from,[tm,td]=z.to;
    if((m===fm&&day>=fd)||(m===tm&&day<=td)) return z;
  }
  return ZODIAC[0];
}
// lune natale approximative : cycle ~2.5j/signe depuis une éphéméride simplifiée
function moonSign(dateStr) {
  if(!dateStr) return null;
  const d = new Date(dateStr);
  const days = Math.floor((d - new Date(2000,0,6))/86400000); // réf lune en Bélier ~6 jan 2000
  const idx = ((Math.floor(days/2.466)%12)+12)%12;
  // mapper sur ZODIAC en partant du Bélier (index 3)
  const order=["Bélier","Taureau","Gémeaux","Cancer","Lion","Vierge","Balance","Scorpion","Sagittaire","Capricorne","Verseau","Poissons"];
  const name=order[idx];
  return ZODIAC.find(z=>z.s===name);
}
const ELEMENT_NEEDS = {
  Terre:{need:"d'ancrage et de repos", advice:"privilégie le concret, la nature, le sommeil"},
  Eau:{need:"d'émotion et d'introspection", advice:"écris, ressens, prends un bain rituel"},
  Feu:{need:"d'action et de création", advice:"bouge, crée, ose un projet"},
  Air:{need:"d'échange et de mental", advice:"écris tes idées, parle, apprends"},
};

function CrossedCycles({ profile, setProfile, moon, cycle }) {
  const [edit, setEdit] = useState(!profile?.birthdate);
  const p = profile || {};
  const sun = sunSign(p.birthdate);
  const moonNatal = moonSign(p.birthdate);
  const todayMoonSign = moonSign(new Date().toISOString().slice(0,10));

  // phase du cycle menstruel
  let cyclePhase = null;
  if (cycle?.lastPeriod) {
    const days = Math.floor((Date.now()-new Date(cycle.lastPeriod))/86400000) % (cycle.cycleLength||28);
    cyclePhase = days<=(cycle.periodLength||5) ? "règles" : days<14 ? "folliculaire" : days<17 ? "ovulation" : "lutéale (fin de cycle)";
  }

  // diagnostic
  const diag = (()=>{
    if(!sun) return null;
    const needEl = todayMoonSign?.el || "Eau";
    const need = ELEMENT_NEEDS[needEl];
    const tired = cyclePhase==="lutéale (fin de cycle)" || cyclePhase==="règles";
    let txt = `Ta lune natale est en ${moonNatal?.s} (${moonNatal?.el}), ton soleil en ${sun.s}. `;
    txt += `Aujourd'hui, la Lune (${moon?.name}) traverse ${todayMoonSign?.s} — une énergie ${needEl}. `;
    if (cyclePhase) txt += `Tu es en phase ${cyclePhase}. `;
    if (tired) txt += `Ton corps réclame ${ELEMENT_NEEDS.Terre.need}. Ne force pas le voyage astral ce soir — privilégie l'écriture douce dans ton Journal Intime. 🌿`;
    else if (moon?.idx===4) txt += `Pleine Lune : énergie maximale, idéale pour libérer et manifester. ✨`;
    else txt += `Bon moment pour ${need.advice}.`;
    return txt;
  })();

  if (edit) return (
    <div className="rounded-2xl p-6 max-w-md mx-auto" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
      <h3 className="text-2xl mb-1 text-center" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🔮 Mon thème astral</h3>
      <p className="text-xs italic mb-4 text-center" style={{color:"var(--muted)"}}>Pour des diagnostics calculés rien que pour toi</p>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Date de naissance</label>
          <input type="date" value={p.birthdate||""} onChange={e=>setProfile({...p, birthdate:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Heure de naissance (optionnel)</label>
          <input type="time" value={p.birthtime||""} onChange={e=>setProfile({...p, birthtime:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Lieu de naissance (optionnel)</label>
          <input value={p.birthplace||""} onChange={e=>setProfile({...p, birthplace:e.target.value})} placeholder="ville..." className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        </div>
        <button onClick={()=>setEdit(false)} disabled={!p.birthdate} className="w-full py-2 rounded-full text-sm disabled:opacity-40" style={{background:"var(--primary)", color:"var(--bg)"}}>✦ calculer mon profil</button>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl p-6" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🔮 Mon alchimie du jour</h3>
        <button onClick={()=>setEdit(true)} className="text-xs underline" style={{color:"var(--muted)"}}>modifier mon thème</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="rounded-xl p-2" style={{background:"var(--surface)"}}><p className="text-[9px] uppercase" style={{color:"var(--muted)"}}>Soleil</p><p className="text-sm" style={{color:"var(--accent)"}}>{sun?.s}</p><p className="text-[9px]" style={{color:"var(--muted)"}}>{sun?.el}</p></div>
        <div className="rounded-xl p-2" style={{background:"var(--surface)"}}><p className="text-[9px] uppercase" style={{color:"var(--muted)"}}>Lune natale</p><p className="text-sm" style={{color:"var(--accent)"}}>{moonNatal?.s}</p><p className="text-[9px]" style={{color:"var(--muted)"}}>{moonNatal?.el}</p></div>
        <div className="rounded-xl p-2" style={{background:"var(--surface)"}}><p className="text-[9px] uppercase" style={{color:"var(--muted)"}}>Cycle</p><p className="text-sm" style={{color:"var(--accent)"}}>{cyclePhase||"—"}</p></div>
      </div>
      <div className="rounded-xl p-4" style={{background:"var(--surface)", border:"1px solid var(--accent)"}}>
        <p className="text-sm leading-relaxed" style={{color:"var(--text)", fontFamily:'"Cormorant Garamond",serif', fontSize:"16px"}}>{diag}</p>
      </div>
      {!cycle?.lastPeriod && <p className="text-[10px] italic mt-2 text-center" style={{color:"var(--muted)"}}>💡 Renseigne ton cycle (Yasmine → Cycle) pour un diagnostic encore plus précis</p>}
      <p className="text-[9px] italic mt-2 text-center" style={{color:"var(--muted)"}}>✦ calculs approximatifs basés sur ta date de naissance</p>
    </div>
  );
}

/* ============================================================
   ✦ ROOM UPGRADES — décor débloqué par les succès réels
   ============================================================ */
function RoomDecor({ unlocked }) {
  // overlay décoratif par-dessus une pièce (vines, candles, fairies, stars, crystals)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:5}}>
      {/* lierre grimpant sur les bords */}
      {unlocked.includes("vines") && (<>
        <div className="absolute top-0 left-0 text-2xl" style={{lineHeight:1}}>🌿<br/>🍃<br/>🌿</div>
        <div className="absolute top-0 right-0 text-2xl text-right" style={{lineHeight:1}}>🌿<br/>🍃<br/>🌿</div>
      </>)}
      {/* bougies en bas */}
      {unlocked.includes("candles") && (<>
        <span className="absolute" style={{bottom:"3%", left:"6%", fontSize:"20px", animation:"twinkle 3s ease-in-out infinite"}}>🕯️</span>
        <span className="absolute" style={{bottom:"3%", right:"6%", fontSize:"20px", animation:"twinkle 3.5s ease-in-out infinite"}}>🕯️</span>
      </>)}
      {/* fées qui volent */}
      {unlocked.includes("fairies") && Array.from({length:3}).map((_,i)=>(
        <span key={i} className="absolute" style={{top:`${20+i*22}%`, left:`${10+i*30}%`, fontSize:"14px", animation:`floatY ${3+i}s ease-in-out infinite`, animationDelay:`${i*0.6}s`}}>🧚</span>
      ))}
      {/* étoiles scintillantes */}
      {unlocked.includes("stars") && Array.from({length:8}).map((_,i)=>(
        <span key={"s"+i} className="absolute" style={{top:`${Math.random()*60}%`, left:`${Math.random()*100}%`, fontSize:"10px", animation:`twinkle ${1.5+Math.random()*2}s ease-in-out infinite`}}>✨</span>
      ))}
      {/* cristaux dans les coins */}
      {unlocked.includes("crystals") && (<>
        <span className="absolute" style={{bottom:"20%", left:"3%", fontSize:"18px", filter:"drop-shadow(0 0 6px #c0a0e8)"}}>🔮</span>
        <span className="absolute" style={{top:"30%", right:"3%", fontSize:"16px", filter:"drop-shadow(0 0 6px #a0e0d0)"}}>💎</span>
      </>)}
    </div>
  );
}

function RoomProgress({ points, level, tiers, nextTier }) {
  const cur = tiers[level];
  const pct = nextTier ? Math.round(((points - cur.pts) / (nextTier.pts - cur.pts)) * 100) : 100;
  const LABELS = { vines:"🌿 lierre grimpant", candles:"🕯️ bougies", fairies:"🧚 fées", stars:"✨ étoiles", crystals:"🔮 cristaux" };
  return (
    <div className="rounded-2xl p-4 mb-4" style={{background:"linear-gradient(160deg, var(--surface2), var(--surface))", border:"1px solid var(--accent)"}}>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
        <h4 className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ {cur.name}</h4>
        <span className="text-xs" style={{color:"var(--muted)"}}>{points} pts magiques · niv. {level+1}</span>
      </div>
      {nextTier ? (
        <>
          <div className="h-2 rounded-full overflow-hidden mb-1" style={{background:"var(--surface)"}}>
            <div className="h-full rounded-full transition-all" style={{width:`${pct}%`, background:"var(--primary)"}}/>
          </div>
          <p className="text-[11px]" style={{color:"var(--muted)"}}>Encore <b style={{color:"var(--accent)"}}>{nextTier.pts-points} pts</b> pour débloquer {LABELS[nextTier.unlock]||"un décor"}</p>
        </>
      ) : <p className="text-[11px]" style={{color:"var(--accent)"}}>✦ Tous les décors débloqués ! Ton royaume est complet 🌙</p>}
      <p className="text-[10px] italic mt-2" style={{color:"var(--muted)"}}>Gagne des points en validant tes tâches, habitudes, journal, rituels... ton succès réel décore ton app.</p>
    </div>
  );
}

export default function App() {
  // --- Auth ---
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const initialLoadDone = useRef(false);

  useEffect(()=>{
    const unsub = watchUser(async (u)=>{
      setUser(u);
      setAuthReady(true);
      if (u) {
        setLoadingState(true);
        initialLoadDone.current = false;
        const data = await loadState(u.uid);
        if (data) {
          // restaurer chaque morceau d'état si présent
          if (data.appPin!==undefined) setAppPin(data.appPin);
          if (data.homeContent) setHomeContent(data.homeContent);
          if (data.witchTexts) {
            const wt = {...data.witchTexts};
            // migration : si l'ancien style bois marron est encore là, le passer au thème
            if (wt.tavernBg && wt.tavernBg.includes("#6b4a2a")) {
              wt.tavernBg = "linear-gradient(180deg, var(--surface2), var(--primary))";
              wt.tavernBorderColor = "var(--accent)";
              wt.tavernColor = "var(--text)";
            }
            setWitchTexts(wt);
          }
          if (data.sectionThemes) setSectionThemes(data.sectionThemes);
          else if (data.theme) setSectionThemes({ moi: data.theme, witch: data.theme });
          if (data.font) setFont(data.font);
          if (data.sections) setSections(data.sections.map(s=>{
            // migration : remplace les anciens noms par défaut
            if (s.id==="moi" && (s.name==="Moi"||s.name==="moi")) return {...s, name:"Yasmine"};
            if (s.id==="witch" && (s.name==="Witch"||s.name==="witch")) return {...s, name:"Yasmeen"};
            return s;
          }));
          if (data.overrides) setOverrides(data.overrides);
          if (data.customThemes) setCustomThemes(data.customThemes);
          if (data.customBackdrops) setCustomBackdrops(data.customBackdrops);
          if (data.tasks) setTasks(data.tasks);
          if (data.widgets) setWidgets(data.widgets);
          if (data.scrapPages) setScrapPages(data.scrapPages);
          if (data.journalPin!==undefined) setJournalPin(data.journalPin);
          if (data.grimoireEntries) setGrimoireEntries(data.grimoireEntries);
          if (data.shiftingNotes) setShiftingNotes(data.shiftingNotes);
          if (data.astralNotes) setAstralNotes(data.astralNotes);
          if (data.passions) setPassions(data.passions);
          if (data.wishlist) setWishlist(data.wishlist);
          if (data.goals) setGoals(data.goals);
          if (data.gratitude) setGratitude(data.gratitude);
          if (data.moodLog) setMoodLog(data.moodLog);
          if (data.cycleData) setCycleData(data.cycleData);
          if (data.bottles) setBottles(data.bottles);
          if (data.comfortChars) setComfortChars(data.comfortChars);
          if (data.outfitBoards) setOutfitBoards(data.outfitBoards);
          if (data.lifeOst) setLifeOst(data.lifeOst);
          if (data.manifestSeeds) setManifestSeeds(data.manifestSeeds);
          if (data.fairyData) setFairyData(data.fairyData);
          if (data.lunarLog) setLunarLog(data.lunarLog);
          if (data.shiftLog) setShiftLog(data.shiftLog);
          if (data.astroProfile) setAstroProfile(data.astroProfile);
          if (data.activeDR) setActiveDR(data.activeDR);
          if (data.habits) setHabits(data.habits);
          if (data.dreamLog) setDreamLog(data.dreamLog);
          if (data.tarotLog) setTarotLog(data.tarotLog);
          if (data.intentions) setIntentions(data.intentions);
          if (data.customRituals) setCustomRituals(data.customRituals);
          if (data.customTips) setCustomTips(data.customTips);
          if (data.customAffirm) setCustomAffirm(data.customAffirm);
        }
        setLoadingState(false);
        // attendre un petit instant avant d'autoriser les sauvegardes
        setTimeout(()=>{ initialLoadDone.current = true; }, 500);
      } else {
        initialLoadDone.current = false;
      }
    });
    return unsub;
  }, []);

  const [appPin, setAppPin] = useState("");
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [homeContent, setHomeContent] = useState(HOME_DEFAULT);
  const [witchTexts, setWitchTexts] = useState({
    tavern: "THE WITCH'S TAVERN",
    tavernBg: "linear-gradient(180deg, var(--surface2), var(--primary))",
    tavernBorderColor: "var(--accent)",
    tavernColor: "var(--text)",
    tavernRadius: 8,
    spellNo: "No. 13",
    spellTitle: "The Witches Spell Book",
    spellSub: "Useful spells for quick reference",
  });
  const [witchEdit, setWitchEdit] = useState(false);
  const [font, setFont] = useState("serif");
  const [panelOpen, setPanelOpen] = useState(false);
  const [widgetMenuOpen, setWidgetMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("moi");
  const [activeSub, setActiveSub] = useState("dashboard");
  const [sectionThemes, setSectionThemes] = useState({ moi:"myUniverse", witch:"witchPurple" });
  // le thème affiché dépend UNIQUEMENT du côté actif → changer un côté ne touche jamais l'autre
  const theme = sectionThemes[activeSection] || (activeSection==="witch" ? "witchPurple" : "myUniverse");
  const setTheme = (t) => {
    setSectionThemes(prev => ({ ...prev, [activeSection]: t }));
    // en changeant le thème du côté, on efface les surcharges de couleur/fond de la SECTION
    // pour que le nouveau thème s'affiche pleinement (les surcharges par sous-page restent)
    setOverrides(prev => {
      const c = { ...prev };
      const secKey = `sec:${activeSection}`;
      if (c[secKey]) { const { colors, backdrop, ...rest } = c[secKey]; if (Object.keys(rest).length) c[secKey]=rest; else delete c[secKey]; }
      return c;
    });
  };
  const [sections, setSections] = useState([{id:"moi",name:"Yasmine",custom:false},{id:"witch",name:"Yasmeen",custom:false}]);
  const [overrides, setOverrides] = useState({}); // {"sec:moi":{backdrop,colors}, "sub:witch:dreams":{...}}
  const [customThemes, setCustomThemes] = useState({}); // thèmes générés par l'utilisatrice
  const [customBackdrops, setCustomBackdrops] = useState({}); // fonds animés générés

  // DATA
  const [tasks, setTasks] = useState([]);
  const [widgets, setWidgets] = useState({
    moi: [{id:uid(),type:"quote",content:"Tu es la magie que tu cherches.",x:4,y:4,w:30}],
    witch: [{id:uid(),type:"clock",content:"",x:70,y:4,w:24}],
  });
  const [scrapPages, setScrapPages] = useState([]);
  const [journalPin, setJournalPin] = useState("");
  const [grimoireEntries, setGrimoireEntries] = useState([]);
  const [shiftingNotes, setShiftingNotes] = useState([]);
  const [astralNotes, setAstralNotes] = useState([]);
  const [passions, setPassions] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [goals, setGoals] = useState([]);
  const [gratitude, setGratitude] = useState([]);
  const [moodLog, setMoodLog] = useState([]);
  const [cycleData, setCycleData] = useState(null);
  const [bottles, setBottles] = useState([]);
  const [comfortChars, setComfortChars] = useState([]);
  const [outfitBoards, setOutfitBoards] = useState([]);
  const [lifeOst, setLifeOst] = useState({});
  const [manifestSeeds, setManifestSeeds] = useState([]);
  const [fairyData, setFairyData] = useState({});
  const [lunarLog, setLunarLog] = useState([]);
  const [shiftLog, setShiftLog] = useState([]);
  const [astroProfile, setAstroProfile] = useState({});
  const [activeDR, setActiveDR] = useState(null);
  const [habits, setHabits] = useState([{id:uid(),name:"Boire 2L d'eau",days:{}},{id:uid(),name:"Méditer 10 min",days:{}},{id:uid(),name:"Skincare soir",days:{}}]);
  const [dreamLog, setDreamLog] = useState([]);
  const [tarotLog, setTarotLog] = useState([]);
  const [intentions, setIntentions] = useState([]);
  const [customRituals, setCustomRituals] = useState([]);
  const [customTips, setCustomTips] = useState([]);
  const [customAffirm, setCustomAffirm] = useState([]);

  const allRituals=[...WITCH_RITUALS,...customRituals];
  const allTips=[...WITCH_TIPS,...customTips.map(t=>t.text)];
  const allAffirm=[...AFFIRMATIONS_DAILY,...customAffirm.map(a=>a.text)];

  // ✦ Auto-sauvegarde Firestore (debounced 1s)
  useEffect(()=>{
    if (!user || !initialLoadDone.current) return;
    const t = setTimeout(()=>{
      saveState(user.uid, {
        appPin, homeContent, witchTexts, theme, sectionThemes, font, sections, overrides, customThemes, customBackdrops,
        tasks, widgets, scrapPages, journalPin, grimoireEntries,
        shiftingNotes, astralNotes, passions, wishlist, goals,
        gratitude, moodLog, cycleData, bottles, comfortChars, outfitBoards, lifeOst, manifestSeeds, fairyData, lunarLog, shiftLog, astroProfile, activeDR, habits, dreamLog, tarotLog, intentions,
        customRituals, customTips, customAffirm,
      });
    }, 1000);
    return ()=>clearTimeout(t);
  }, [user, appPin, homeContent, witchTexts, theme, sectionThemes, font, sections, overrides, customThemes, customBackdrops, tasks, widgets, scrapPages, journalPin, grimoireEntries, shiftingNotes, astralNotes, passions, wishlist, goals, gratitude, moodLog, cycleData, bottles, comfortChars, outfitBoards, lifeOst, manifestSeeds, fairyData, lunarLog, shiftLog, astroProfile, activeDR, habits, dreamLog, tarotLog, intentions, customRituals, customTips, customAffirm]);

  const ALL_THEMES = useMemo(()=>({ ...THEMES, ...customThemes }), [customThemes]);
  const themeObj = ALL_THEMES[theme] || THEMES.myUniverse;

  // résoudre overrides : sous-section > section > thème global
  const secOv = overrides[`sec:${activeSection}`] || {};
  const subOv = overrides[`sub:${activeSection}:${activeSub}`] || {};
  // thème effectif : override sous-section > override section > thème du côté
  const effectiveThemeKey = subOv.theme || secOv.theme || theme;
  const effectiveTheme = ALL_THEMES[effectiveThemeKey] || themeObj;
  const effectiveFont = subOv.font || secOv.font || font;
  const activeBackdropRaw = subOv.backdrop ?? secOv.backdrop ?? effectiveTheme.backdrop;
  const activeBackdrop = (activeBackdropRaw && customBackdrops[activeBackdropRaw]) ? customBackdrops[activeBackdropRaw] : activeBackdropRaw;
  const bgImage = subOv.bgImage ?? secOv.bgImage ?? null;
  const bgOpacity = subOv.bgOpacity ?? secOv.bgOpacity ?? 0.5;
  const mergedColors = { ...(secOv.colors||{}), ...(subOv.colors||{}) };

  useEffect(()=>{
    Object.entries(effectiveTheme.vars).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));
    // applique overrides couleurs
    Object.entries(mergedColors).forEach(([k,v])=>{
      document.documentElement.style.setProperty(k,v);
    });
    document.documentElement.style.setProperty("--font-body", FONTS[effectiveFont]?.stack || FONTS[font].stack);
    document.documentElement.style.setProperty("--font-display", FONTS.display.stack);
    document.body.style.background = `linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)`;
    document.body.style.color="var(--text)";
    document.body.style.fontFamily="var(--font-body)";
  }, [effectiveThemeKey, effectiveFont, font, JSON.stringify(effectiveTheme.vars), JSON.stringify(mergedColors)]);

  const ritualOfDay=pickByDate(allRituals,"ritual");
  const tipOfDay=pickByDate(allTips,"tip");
  const affirmOfDay=pickByDate(allAffirm,"aff");
  const crystalOfDay=pickByDate(CRYSTALS,"crystal");
  const herbOfDay=pickByDate(HERBS,"herb");
  const dayTip=dayOfWeekTip();
  const moon=moonPhase();

  // ✦ POINTS MAGIQUES — succès réels → décor débloqué
  const magicPoints = useMemo(()=>{
    let pts = 0;
    pts += tasks.filter(t=>t.done).length * 2;
    pts += habits.reduce((a,h)=>a+(h.log?Object.values(h.log).filter(Boolean).length:0),0);
    pts += (scrapPages?.length||0) * 3;
    pts += gratitude.length * 2;
    pts += (moodLog?.length||0);
    pts += grimoireEntries.length * 3;
    pts += (lunarLog?.length||0) * 3;
    pts += (shiftLog?.length||0) * 3;
    pts += goals.filter(g=>g.done).length * 5;
    pts += ((fairyData?.garden?.plants?.length)||0) * 4;
    return pts;
  }, [tasks, habits, scrapPages, gratitude, moodLog, grimoireEntries, lunarLog, shiftLog, goals, fairyData]);
  const ROOM_TIERS = [
    {pts:0,   name:"Cocon simple",      unlock:""},
    {pts:30,  name:"Première étincelle", unlock:"vines"},
    {pts:70,  name:"Coin chaleureux",    unlock:"candles"},
    {pts:130, name:"Refuge enchanté",    unlock:"fairies"},
    {pts:210, name:"Sanctuaire magique", unlock:"stars"},
    {pts:320, name:"Royaume personnel",  unlock:"crystals"},
  ];
  const roomLevel = ROOM_TIERS.filter(t=>magicPoints>=t.pts).length-1;
  const unlocked = ROOM_TIERS.slice(0,roomLevel+1).map(t=>t.unlock).filter(Boolean);
  const nextTier = ROOM_TIERS[roomLevel+1];

  const secWidgets = widgets[activeSection] || [];
  const setSecWidgets = (list) => setWidgets({ ...widgets, [activeSection]: list });
  const addWidget=(type)=>setSecWidgets([...secWidgets, {id:uid(), type, content:"", x:6+Math.random()*10, y:6+Math.random()*10, w: type==="clock"?24:30}]);
  const subTabsFor=(sec)=>SUBTABS[sec]||[];

  const ctx = { theme,setTheme,font,setFont,sections,setSections,activeSection,activeSub,subTabsFor,overrides,setOverrides,customRituals,setCustomRituals,customTips,setCustomTips,customAffirm,setCustomAffirm,ALL_THEMES,customThemes,setCustomThemes,customBackdrops,setCustomBackdrops };

  if (!authReady) return (
    <div className="fixed inset-0 flex items-center justify-center" style={{background:"linear-gradient(160deg,#1a0d24,#3a2a5e)"}}>
      <div className="text-center">
        <div className="text-5xl animate-spin-slow inline-block">🌙</div>
        <p className="mt-3 text-sm italic" style={{color:"#b39ac8"}}>chargement...</p>
      </div>
      <style>{`@keyframes spinSlow{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.animate-spin-slow{animation:spinSlow 30s linear infinite}`}</style>
    </div>
  );

  if (!user) return (<><AuthGate/>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Cormorant+Garamond&display=swap');
      @keyframes twinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}
      @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
      @keyframes spinSlow{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
      .animate-spin-slow{animation:spinSlow 30s linear infinite}`}</style>
  </>);

  if (loadingState) return (
    <div className="fixed inset-0 flex items-center justify-center" style={{background:"linear-gradient(160deg,#1a0d24,#3a2a5e)"}}>
      <div className="text-center">
        <div className="text-5xl animate-spin-slow inline-block">🌙</div>
        <p className="mt-3 text-sm italic" style={{color:"#b39ac8"}}>récupération de tes données...</p>
      </div>
      <style>{`@keyframes spinSlow{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.animate-spin-slow{animation:spinSlow 30s linear infinite}`}</style>
    </div>
  );

  if (!appUnlocked) return (<><Backdrop kind="fullMoon"/><AppLock pin={appPin} setPin={setAppPin} onUnlock={()=>setAppUnlocked(true)}/>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Cormorant+Garamond&display=swap');
      @keyframes twinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}
      @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
      @keyframes spinSlow{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
      @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
      .animate-spin-slow{animation:spinSlow 30s linear infinite}.animate-shake{animation:shake .4s ease}`}</style>
  </>);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Cinzel:wght@400;700&family=Fraunces:wght@300;600&family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Major+Mono+Display&family=VT323&family=UnifrakturCook:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+SC:wght@400;600&family=EB+Garamond:ital@0;1&family=Italiana&family=Marcellus&family=Cinzel+Decorative:wght@400;700&family=Great+Vibes&family=Parisienne&family=Sacramento&family=Pinyon+Script&family=Homemade+Apple&family=Shadows+Into+Light&family=Gloock&family=Space+Mono:ital@0;1&family=Pixelify+Sans&family=Monoton&family=Yeseva+One&family=Amatic+SC:wght@400;700&display=swap');
        :root { --font-body:'Cormorant Garamond',serif; --font-display:'Cinzel',serif; }
        body { font-family:var(--font-body); min-height:100vh; transition:background .8s ease; }
        @keyframes twinkle {0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes floatY {0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        @keyframes fall {0%{transform:translateY(-10vh) rotate(0)}100%{transform:translateY(110vh) rotate(360deg)}}
        @keyframes rainFall {0%{transform:translateY(-10vh)}100%{transform:translateY(110vh)}}
        @keyframes emberRise {0%{transform:translateY(0) translateX(0);opacity:.8}100%{transform:translateY(-100vh) translateX(20px);opacity:0}}
        @keyframes flyAcross {0%{transform:translateX(0) translateY(0)}100%{transform:translateX(110vw) translateY(-30px)}}
        @keyframes sway {0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
        @keyframes auroraShift {0%,100%{transform:translateX(-10%) skewX(-5deg)}50%{transform:translateX(10%) skewX(5deg)}}
        @keyframes holoShift {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes shake {0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes pingOnce {0%{box-shadow:0 0 0 0 var(--primary)}100%{box-shadow:0 0 0 14px transparent}}
        @keyframes fadeUp {0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        .richnote:empty:before { content: attr(data-ph); opacity:0.4; white-space:pre-line; }
        @keyframes spinSlow {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes glow {0%,100%{box-shadow:0 0 20px rgba(var(--glow),0.2)}50%{box-shadow:0 0 40px rgba(var(--glow),0.5)}}
        .animate-shake{animation:shake .4s ease}.animate-ping-once{animation:pingOnce .6s ease}
        .animate-fade-up{animation:fadeUp .6s ease both}.animate-spin-slow{animation:spinSlow 30s linear infinite}
        .animate-glow{animation:glow 4s ease-in-out infinite}
        ::selection{background:var(--primary);color:var(--bg)}
        input,textarea,select{font-family:inherit}
      `}</style>

      {bgImage && <div className="fixed inset-0 -z-20 pointer-events-none" style={{background:`url(${bgImage}) center/cover fixed`, opacity:bgOpacity}}/>}
      <Backdrop kind={activeBackdrop}/>

      <header className="sticky top-0 z-30 backdrop-blur-xl" style={{background:"rgba(0,0,0,0.08)", borderBottom:"1px solid var(--border)"}}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Sparkle className="animate-spin-slow flex-shrink-0" style={{color:"var(--primary)"}} size={20}/>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl leading-none truncate" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>✦ Nyx ✦</h1>
              <div className="text-[10px] sm:text-xs italic truncate" style={{color:"var(--muted)"}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} — {moon.name}</div>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {sections.map(s=>(
              <button key={s.id} onClick={()=>{
                setActiveSection(s.id);
                if(s.id==="moi"){ setActiveSub("dashboard"); }
                else if(s.id==="witch"){ setActiveSub("tavern"); }
                else setActiveSub("main");
              }} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all" style={{background:activeSection===s.id?"var(--primary)":"transparent", color:activeSection===s.id?"var(--bg)":"var(--text)", border:"1px solid var(--border)"}}>{s.name}</button>
            ))}
            <button onClick={()=>setPanelOpen(true)} className="ml-1 sm:ml-2 p-2 rounded-full transition hover:scale-110" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}><Settings size={16}/></button>
            <button onClick={()=>{ if(confirm("Se déconnecter ?")){ logOut(); setAppUnlocked(false); } }} title="Déconnexion" className="p-2 rounded-full transition hover:scale-110" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)"}}><LogOut size={14}/></button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 relative">
        {/* ===== MOI ===== */}
        {activeSection==="moi" && (<div className="animate-fade-up">
          <SoftBrandBanner subtitle="a journal made with love and dry petals"/>
          <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-visible">{SUBTABS.moi.map(t=>{const I=t.icon;return(
            <button key={t.k} onClick={()=>setActiveSub(t.k)} className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap" style={{background:activeSub===t.k?"var(--primary)":"var(--surface)", color:activeSub===t.k?"var(--paper)":"var(--text)", border:"1px solid var(--border)"}}><I size={14}/>{t.label}</button>
          )})}</div>

          {activeSub==="dashboard" && (
            <HomeUniverse content={homeContent} setContent={setHomeContent} affirm={affirmOfDay} onGo={(k)=>setActiveSub(k)}/>
          )}
          {activeSub==="tasks" && (<div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}><h3 className="text-xl mb-4 flex items-center gap-2" style={{fontFamily:'"Dancing Script", cursive', color:"var(--ink)"}}><Sun size={18}/> Today</h3><TaskList scope="day" tasks={tasks} setTasks={setTasks}/></div>
            <div className="rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}><h3 className="text-xl mb-4 flex items-center gap-2" style={{fontFamily:'"Dancing Script", cursive', color:"var(--ink)"}}><Calendar size={18}/> Cette semaine</h3><TaskList scope="week" tasks={tasks} setTasks={setTasks}/></div>
          </div>)}
          {activeSub==="habits" && <HabitsTracker habits={habits} setHabits={setHabits}/>}
          {activeSub==="goals" && <CardList items={goals} setItems={setGoals} title="Objectifs & vision board" fields={[{k:"title",label:"Titre"},{k:"deadline",label:"Échéance"},{k:"why",label:"Pourquoi ?",multi:true},{k:"steps",label:"Premiers pas",multi:true},{k:"image",label:"Image URL"}]}/>}
          {activeSub==="passions" && <PassionsList items={passions} setItems={setPassions} onMakeDR={(p)=>{
            const dr = makeBlankDR();
            dr.name = p.title || "Nouvelle DR";
            dr.tag = p.type || p.title || "";
            dr.cover = p.image || "";
            dr.quote = p.note ? p.note.slice(0,80) : "";
            dr.sections = dr.sections.map(s=> s.id==="general" ? {...s, content:`Univers inspiré de : ${p.title||""}\n${p.note||""}`} : s);
            setShiftingNotes([dr, ...shiftingNotes]);
            setActiveSection("witch"); setActiveSub("shifting");
          }} decor={unlocked} roomProgress={<RoomProgress points={magicPoints} level={roomLevel} tiers={ROOM_TIERS} nextTier={nextTier}/>}/>}
          {activeSub==="wishlist" && <CardList items={wishlist} setItems={setWishlist} title="Wishlist" fields={[{k:"title",label:"Objet"},{k:"price",label:"Prix"},{k:"priority",label:"Priorité"},{k:"url",label:"Lien"},{k:"image",label:"Image URL"}]}/>}
          {activeSub==="gratitude" && <GratitudeJournal entries={gratitude} setEntries={setGratitude}/>}
          {activeSub==="mood" && <MoodTracker log={moodLog} setLog={setMoodLog}/>}
          {activeSub==="cycle" && <CycleTracker data={cycleData} setData={setCycleData}/>}
          {activeSub==="comfort" && <ComfortCharacters items={comfortChars} setItems={setComfortChars}/>}
          {activeSub==="outfits" && <OutfitBoards boards={outfitBoards} setBoards={setOutfitBoards}/>}
          {activeSub==="ost" && <LifeOST ost={lifeOst} setOst={setLifeOst}/>}
          {activeSub==="journal" && <JournalLock pin={journalPin} setPin={setJournalPin}><ScrapbookEditor pages={scrapPages} setPages={setScrapPages}/></JournalLock>}
        </div>)}

        {/* ===== WITCH ===== */}
        {activeSection==="witch" && (<div className="animate-fade-up">
          <div className="text-center mb-2 relative">
            {witchEdit ? (
              <div className="inline-block">
                <input value={witchTexts.tavern} onChange={e=>setWitchTexts({...witchTexts, tavern:e.target.value})}
                  className="text-center bg-transparent outline-none text-xl px-4 py-2 rounded-lg"
                  style={{ background:witchTexts.tavernBg, color:witchTexts.tavernColor, border:`2px solid ${witchTexts.tavernBorderColor}`, borderRadius:`${witchTexts.tavernRadius}px`, fontFamily:'"Dancing Script",cursive' }}/>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs p-3 rounded-xl" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                  <label className="flex items-center gap-1" style={{color:"var(--text)"}}>texte
                    <input type="color" value={witchTexts.tavernColor} onChange={e=>setWitchTexts({...witchTexts, tavernColor:e.target.value})} className="w-7 h-7 rounded cursor-pointer bg-transparent"/>
                  </label>
                  <label className="flex items-center gap-1" style={{color:"var(--text)"}}>contour
                    <input type="color" value={witchTexts.tavernBorderColor} onChange={e=>setWitchTexts({...witchTexts, tavernBorderColor:e.target.value})} className="w-7 h-7 rounded cursor-pointer bg-transparent"/>
                  </label>
                  <label className="flex items-center gap-1" style={{color:"var(--text)"}}>fond
                    <input type="color" defaultValue="#4a3018" onChange={e=>setWitchTexts({...witchTexts, tavernBg:`linear-gradient(180deg, ${e.target.value} 0%, ${e.target.value} 100%)`})} className="w-7 h-7 rounded cursor-pointer bg-transparent"/>
                  </label>
                  <label className="flex items-center gap-1" style={{color:"var(--text)"}}>arrondi
                    <input type="range" min="0" max="40" value={witchTexts.tavernRadius} onChange={e=>setWitchTexts({...witchTexts, tavernRadius:parseInt(e.target.value)})} className="w-20"/>
                  </label>
                  <div className="flex gap-1">
                    {[
                      {l:"bois", bg:"linear-gradient(180deg, #6b4a2a 0%, #4a3018 100%)", c:"#f0d49a", b:"#2a1810"},
                      {l:"violet", bg:"linear-gradient(180deg, #7a3a8a 0%, #3a1f4e 100%)", c:"#e0c97a", b:"#2a0f3a"},
                      {l:"or", bg:"linear-gradient(180deg, #c9a26a 0%, #8a6a3a 100%)", c:"#2a1810", b:"#5a3a18"},
                      {l:"rose", bg:"linear-gradient(180deg, #d99a8f 0%, #9c4a5a 100%)", c:"#fff", b:"#6a2a3a"},
                      {l:"nuit", bg:"linear-gradient(180deg, #3a4d6b 0%, #1a2438 100%)", c:"#cfe0f5", b:"#0d1420"},
                    ].map(p=>(
                      <button key={p.l} onClick={()=>setWitchTexts({...witchTexts, tavernBg:p.bg, tavernColor:p.c, tavernBorderColor:p.b})}
                        className="px-2 py-1 rounded text-[10px]" style={{background:p.bg, color:p.c, border:`1px solid ${p.b}`}}>{p.l}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : <WoodPlank st={{bg:witchTexts.tavernBg, color:witchTexts.tavernColor, border:`2px solid ${witchTexts.tavernBorderColor}`, radius:witchTexts.tavernRadius}}>{witchTexts.tavern}</WoodPlank>}
            <button onClick={()=>setWitchEdit(!witchEdit)} className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] align-middle"
              style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>
              <Edit3 size={10}/> {witchEdit?"ok":"modifier"}
            </button>
          </div>
          <p className="text-center text-sm italic mt-3" style={{color:"var(--muted)"}}>« {pickByDate(QUOTES_WITCH,"w")} »</p>
          <Garland/>
          <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-6 sm:mb-8 sm:justify-center overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-visible">{SUBTABS.witch.map(t=>{const I=t.icon;return(
            <button key={t.k} onClick={()=>setActiveSub(t.k)} className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap" style={{background:activeSub===t.k?"var(--primary)":"var(--surface)", color:activeSub===t.k?"var(--bg)":"var(--text)", border:activeSub===t.k?"1px solid var(--primary)":"1px solid var(--border)", fontFamily:activeSub===t.k?'"Dancing Script",cursive':"inherit"}}><I size={14}/>{t.label}</button>
          )})}</div>

          {activeSub==="tavern" && (<div className="space-y-6">
            <RoomProgress points={magicPoints} level={roomLevel} tiers={ROOM_TIERS} nextTier={nextTier}/>
            <MysticGreenhouse
              lastMood={moodLog[0]}
              plantsCount={(fairyData?.garden?.plants?.length)||0}
              decor={unlocked}
              onCauldron={()=>setActiveSub("mood")}
              onPortal={()=>setActiveSub("shifting")}
              onHerbs={()=>setActiveSub("fairy")}
            />
            <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 text-center animate-glow" style={{background:"linear-gradient(180deg, var(--surface2), var(--primary))", border:"3px double var(--accent)", color:"var(--text)"}}>
              {witchEdit ? (<>
                <input value={witchTexts.spellNo} onChange={e=>setWitchTexts({...witchTexts, spellNo:e.target.value})} className="text-center bg-black/10 rounded outline-none text-xs uppercase tracking-[0.3em] w-full mb-1" style={{color:"var(--text)"}}/>
                <input value={witchTexts.spellTitle} onChange={e=>setWitchTexts({...witchTexts, spellTitle:e.target.value})} className="text-center bg-black/10 rounded outline-none text-2xl w-full" style={{color:"var(--text)", fontFamily:'"UnifrakturCook",serif'}}/>
              </>) : (<>
                <p className="text-xs uppercase tracking-[0.3em]">{witchTexts.spellNo}</p>
                <h3 className="text-3xl mt-2" style={{fontFamily:'"UnifrakturCook",serif'}}>{witchTexts.spellTitle}</h3>
              </>)}
              <div className="my-4 text-6xl">📖</div>
              {witchEdit
                ? <input value={witchTexts.spellSub} onChange={e=>setWitchTexts({...witchTexts, spellSub:e.target.value})} className="text-center bg-black/10 rounded outline-none text-[10px] uppercase tracking-widest w-full" style={{color:"var(--text)"}}/>
                : <p className="text-[10px] uppercase tracking-widest">{witchTexts.spellSub}</p>}
            </div>
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <p className="italic mb-3" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✧ check the time ✧</p><MoonClock compact/>
            </div>
            <div className="rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <div className="text-center mb-3"><WoodPlank>IDEAS</WoodPlank></div>
              <ul className="space-y-1 text-sm">{["rituel à tester","livre à lire","cristal à acheter","lieu à visiter"].map((l,i)=>(<li key={i} className="px-3 py-1.5 rounded" style={{background:"var(--surface2)", color:"var(--text)"}}>◦ {l}</li>))}</ul>
            </div>
            <div className="lg:col-span-3 rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <div className="grid md:grid-cols-3 gap-6">
                <div><p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--accent)"}}>✦ Conseil du jour</p><p className="text-sm" style={{color:"var(--text)"}}>{tipOfDay}</p><p className="text-xs italic mt-2" style={{color:"var(--muted)"}}>+ {dayTip}</p></div>
                <div><p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--accent)"}}>✦ Cristal du jour</p><p className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}>{crystalOfDay.name}</p><p className="text-xs italic" style={{color:"var(--muted)"}}>{crystalOfDay.use}</p></div>
                <div><p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--accent)"}}>✦ Herbe du jour</p><p className="text-lg" style={{fontFamily:'"Dancing Script",cursive', color:"var(--text)"}}>{herbOfDay.name}</p><p className="text-xs italic" style={{color:"var(--muted)"}}>{herbOfDay.use}</p></div>
              </div>
            </div>
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">{[{s:"day",l:"Daily"},{s:"week",l:"Weekly"},{s:"month",l:"Monthly"}].map(b=>(
              <div key={b.s} className="rounded-2xl p-4" style={{background:"var(--surface)", border:"1px solid var(--border)"}}><div className="text-center mb-3"><WoodPlank>{b.l}</WoodPlank></div><TaskList scope={b.s} tasks={tasks} setTasks={setTasks} soft={false}/></div>
            ))}</div>
            <div className="lg:col-span-3"><ShiftDeck drs={shiftingNotes} activeDR={activeDR} setActiveDR={setActiveDR}/></div>
            <div className="lg:col-span-3 grid md:grid-cols-2 gap-4">
              <MoonSpiral/>
              <ManifestBox seeds={manifestSeeds} setSeeds={setManifestSeeds}/>
            </div>
            </div>
          </div>)}

          {activeSub==="mood" && (<div>
            <div className="text-center mb-4">
              <h3 className="text-2xl" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>🫧 Mon chaudron d'humeur</h3>
              <p className="text-xs italic" style={{color:"var(--muted)"}}>Verse tes émotions dans le chaudron</p>
            </div>
            <MoodTracker log={moodLog} setLog={setMoodLog}/>
          </div>)}

          {activeSub==="moon" && (<div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}><MoonClock/><p className="mt-6 text-center text-xs italic" style={{color:"var(--muted)"}}>{moon.illum}% illuminée · {moon.ageDays} jours</p></div>
            <div className="rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <h3 className="text-2xl mb-3" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{moon.name}</h3>
              <p className="text-sm mb-4" style={{color:"var(--text)"}}>{moon.energy}</p>
              <p className="text-xs uppercase tracking-widest mb-1" style={{color:"var(--muted)"}}>rituel suggéré</p>
              <p className="text-sm" style={{color:"var(--text)"}}>{ritualOfDay.title}</p>
            </div>
            <div className="md:col-span-2 rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <h4 className="text-lg mb-4" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>Les 8 phases & leurs énergies</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">{Object.entries(MOON_INFLUENCE).map(([i,p])=>(
                <div key={i} className="rounded-xl p-3 text-xs" style={{background:parseInt(i)===moon.idx?"rgba(var(--glow),0.2)":"transparent", border:`1px solid ${parseInt(i)===moon.idx?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                  <p className="font-bold mb-1" style={{color:"var(--accent)"}}>{p.name}</p><p className="italic">{p.energy}</p></div>
              ))}</div>
            </div>
            <div className="md:col-span-2"><LunarJournal moon={moon} entries={lunarLog} setEntries={setLunarLog}/></div>
          </div>)}

          {activeSub==="wheel" && <WheelOfYear/>}
          {activeSub==="pendulum" && <Pendulum/>}
          {activeSub==="ritual" && (<div className="max-w-3xl mx-auto">
            <div className="rounded-3xl p-8 animate-glow" style={{background:"var(--surface)", border:"2px solid var(--accent)"}}>
              <p className="text-xs uppercase tracking-[0.4em] text-center mb-3" style={{color:"var(--muted)"}}>✦ Rituel du {new Date().toLocaleDateString("fr-FR")} ✦</p>
              <h2 className="text-4xl text-center mb-6" style={{fontFamily:'"UnifrakturCook",serif', color:"var(--accent)"}}>{ritualOfDay.title}</h2>
              <div className="mb-6"><p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Ingrédients</p><p className="text-sm italic" style={{color:"var(--text)"}}>{ritualOfDay.ingredients}</p></div>
              <div><p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--muted)"}}>Étapes</p><p className="text-sm leading-relaxed" style={{color:"var(--text)"}}>{ritualOfDay.steps}</p></div>
            </div>
            <div className="mt-8 rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <h3 className="text-lg mb-3" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>Autres rituels (rotation auto)</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">{allRituals.slice(0,8).map((r,i)=>(<div key={i} className="px-3 py-2 rounded-lg" style={{background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)"}}>✦ {r.title}</div>))}</div>
            </div>
          </div>)}

          {activeSub==="grimoire" && (<div>
            <LivingGrimoire moodLog={moodLog} entries={grimoireEntries} setEntries={setGrimoireEntries}/>
            <CardList items={grimoireEntries} setItems={setGrimoireEntries} title="Mon grimoire personnel" fields={[{k:"title",label:"Nom du sort"},{k:"intention",label:"Intention"},{k:"moon",label:"Phase idéale"},{k:"ingredients",label:"Ingrédients",multi:true},{k:"steps",label:"Étapes",multi:true,big:true},{k:"result",label:"Résultats",multi:true}]}/>
          </div>)}

          {activeSub==="crystals" && (<div>
            <h3 className="text-3xl mb-6" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Bibliothèque des cristaux ✦</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{CRYSTALS.map(c=>(
              <article key={c.name} className="rounded-2xl p-5 transition hover:scale-105" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <div className="text-3xl mb-2">💎</div><h4 className="text-xl mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{c.name}</h4>
                <p className="text-xs italic mb-2" style={{color:"var(--muted)"}}>couleur : {c.color}</p><p className="text-sm" style={{color:"var(--text)"}}>{c.use}</p></article>
            ))}</div>
            <div className="mt-8 rounded-2xl p-6" style={{background:"var(--surface2)", border:"1px solid var(--border)"}}>
              <h4 className="text-lg mb-2" style={{color:"var(--accent)"}}>✦ Astuces de soin</h4>
              <ul className="text-sm space-y-1" style={{color:"var(--text)"}}><li>◦ Recharge sous la pleine lune (sauf sélénite)</li><li>◦ Purifie à la sauge, au sel ou à l'eau (attention, sélénite craint l'eau)</li><li>◦ Parle-leur, programme une intention</li></ul>
            </div>
          </div>)}

          {activeSub==="herbs" && (<div>
            <h3 className="text-3xl mb-6" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✦ Herbier magique ✦</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{HERBS.map(h=>(
              <article key={h.name} className="rounded-2xl p-5 transition hover:scale-105" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
                <div className="text-2xl mb-2">🌿</div><h4 className="text-lg mb-1" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>{h.name}</h4><p className="text-sm" style={{color:"var(--text)"}}>{h.use}</p></article>
            ))}</div>
          </div>)}

          {activeSub==="tarot" && <CardList items={tarotLog} setItems={setTarotLog} title="Journal de tirages" fields={[{k:"title",label:"Date/contexte"},{k:"deck",label:"Jeu"},{k:"question",label:"Question"},{k:"cards",label:"Cartes",multi:true},{k:"interpretation",label:"Interprétation",multi:true,big:true}]}/>}

          {activeSub==="shifting" && <ShiftingHub drs={shiftingNotes} setDrs={setShiftingNotes} shiftLog={shiftLog} setShiftLog={setShiftLog} moon={moon}/>}
          {activeSub==="anchor" && <RealityAnchor drs={shiftingNotes}/>}
          {activeSub==="fairy" && <FairyRealm data={fairyData} setData={setFairyData}/>}

          {activeSub==="astral" && (<div className="space-y-6">
            <CrossedCycles profile={astroProfile} setProfile={setAstroProfile} moon={moon} cycle={cycleData}/>
            <CardList items={astralNotes} setItems={setAstralNotes} title="Voyages astraux & expériences" fields={[{k:"title",label:"Date/titre"},{k:"type",label:"Type (OBE, lucide)"},{k:"sensations",label:"Sensations",multi:true},{k:"content",label:"Récit",multi:true,big:true}]}/>
          </div>)}

          {activeSub==="dreams" && <DreamJournal entries={dreamLog} setEntries={setDreamLog}/>}

          {activeSub==="intentions" && (<div>
            <div className="mb-6"><LetGo/></div>
            <CardList items={intentions} setItems={setIntentions} title="Intentions & loi de l'attraction" fields={[{k:"title",label:"Intention"},{k:"deadline",label:"Date cible"},{k:"affirmation",label:"Affirmation présent",multi:true},{k:"feeling",label:"Ressenti une fois réel"},{k:"actions",label:"Actions alignées",multi:true},{k:"signs",label:"Synchronicités",multi:true}]}/>
          </div>)}
          {activeSub==="bottle" && <MessageBottle bottles={bottles} setBottles={setBottles}/>}
        </div>)}

        {/* ===== CUSTOM SECTIONS ===== */}
        {sections.find(s=>s.id===activeSection)?.custom && (<div className="animate-fade-up">
          <h2 className="text-5xl mb-8" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>✦ {sections.find(s=>s.id===activeSection).name}</h2>
          <p className="italic" style={{color:"var(--muted)"}}>Ce coin est à toi. Personnalise ses couleurs et son fond dans le Dashboard, et ajoute des widgets ci-dessous.</p>
        </div>)}

        <footer className="mt-20 mb-6 text-center text-xs italic" style={{color:"var(--muted)"}}>✦ Nyx — un espace créé pour toi, qui change avec la lune ✦</footer>

        {/* WIDGETS FLOTTANTS — posés PARTOUT par-dessus toute la section */}
        <div className="absolute inset-0 pointer-events-none" style={{zIndex:15}}>
          {secWidgets.map(w=>(
            <Widget key={w.id} widget={w}
              onUpdate={u=>setSecWidgets(secWidgets.map(x=>x.id===w.id?u:x))}
              onDelete={()=>setSecWidgets(secWidgets.filter(x=>x.id!==w.id))}/>
          ))}
        </div>
      </main>

      {/* BOUTON FLOTTANT : ajouter un widget n'importe où */}
      {appUnlocked && (
        <>
          {widgetMenuOpen && <div onClick={()=>setWidgetMenuOpen(false)} className="fixed inset-0 z-30" style={{background:"rgba(0,0,0,0.15)"}}/>}
          <div className="fixed z-40" style={{ right:"calc(env(safe-area-inset-right) + 1rem)", bottom:"calc(env(safe-area-inset-bottom) + 1rem)" }}>
            {widgetMenuOpen && (
              <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-1 animate-fade-up items-end">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest mb-1" style={{background:"var(--primary)", color:"var(--bg)"}}>
                  ajouter chez {sections.find(s=>s.id===activeSection)?.name || activeSection}
                </span>
                {[{t:"pinterest",label:"📌 Pinterest"},{t:"image",label:"🖼️ Image"},{t:"gif",label:"✨ Gif"},{t:"quote",label:"❝ Citation"},{t:"sticky",label:"🗒️ Note"},{t:"playlist",label:"🎵 Musique"},{t:"clock",label:"🌙 Horloge"}].map(b=>(
                  <button key={b.t} onClick={()=>{ addWidget(b.t); setWidgetMenuOpen(false); }}
                    className="px-4 py-2 rounded-full text-sm whitespace-nowrap transition hover:scale-105 shadow-lg"
                    style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", backdropFilter:"blur(8px)"}}>{b.label}</button>
                ))}
              </div>
            )}
            <button onClick={()=>setWidgetMenuOpen(!widgetMenuOpen)} aria-label="Ajouter un widget"
              className="w-14 h-14 rounded-full flex items-center justify-center transition hover:scale-110 shadow-xl"
              style={{background:"var(--primary)", color:"var(--bg)", boxShadow:"0 8px 24px rgba(var(--glow),0.5)"}}>
              <Plus size={26} style={{transform: widgetMenuOpen?"rotate(45deg)":"none", transition:"transform .2s"}}/>
            </button>
          </div>

          {/* BOUTON THÈME DE CETTE PAGE */}
          <PageThemeButton
            activeSection={activeSection} activeSub={activeSub}
            subLabel={(SUBTABS[activeSection]||[]).find(t=>t.k===activeSub)?.label || activeSub}
            overrides={overrides} setOverrides={setOverrides}
            ALL_THEMES={ALL_THEMES} customBackdrops={customBackdrops}
          />
        </>
      )}

      <ControlPanel open={panelOpen} onClose={()=>setPanelOpen(false)} ctx={ctx}/>
    </>
  );
}
