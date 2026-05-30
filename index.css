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

function PinterestPin({ url, size="medium" }) {
  const ref = useRef(null);
  // détecter si c'est une image directe (i.pinimg.com) ou une épingle
  const isDirectImg = /i\.pinimg\.com|\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url||"");
  useEffect(()=>{
    if (isDirectImg || !url) return;
    let cancelled = false;
    loadPinterestScript().then(()=>{
      if (cancelled) return;
      // PinUtils.build re-scanne la page et rend les épingles
      if (window.PinUtils && window.PinUtils.build) {
        try { window.PinUtils.build(); } catch(e){}
      }
    });
    return ()=>{ cancelled = true; };
  }, [url, isDirectImg]);

  if (!url) return <div className="text-xs italic" style={{color:"var(--muted)"}}>colle un lien Pinterest ↓</div>;
  if (isDirectImg) return <img src={url} alt="" className="w-full rounded-xl object-cover" style={{border:"3px solid #fff"}}/>;
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
            <div className="aspect-video rounded-xl flex items-center justify-center text-xs" style={{background:"rgba(255,255,255,0.06)", color:"var(--muted)"}}>colle une URL ↓</div>}
          <input value={widget.content||""} onChange={e=>onUpdate({...widget, content:e.target.value})} placeholder={widget.type==="gif"?"URL du gif":"URL de l'image"}
            className="mt-2 w-full bg-transparent text-xs outline-none border-b py-1" style={{borderColor:"var(--border)", color:"var(--text)"}}/></>)}
        {widget.type==="playlist" && (<>
          {widget.content?.includes("spotify") ?
            <iframe title="sp" src={widget.content.replace("/track/","/embed/track/").replace("/playlist/","/embed/playlist/").replace("/album/","/embed/album/")} width="100%" height="152" frameBorder="0" allow="encrypted-media" className="rounded-xl"/> :
            <div className="text-xs italic" style={{color:"var(--muted)"}}>{widget.content ? <a href={widget.content} target="_blank" rel="noreferrer" className="underline">Ouvrir le lien</a> : "Colle un lien Spotify ↓"}</div>}
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
  const add = () => { if(!text.trim()) return; setTasks([...tasks,{id:uid(),scope,text:text.trim(),done:false}]); setText(""); };
  const toggle = id => setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done,justDone:!t.done}:t));
  const remove = id => setTasks(tasks.filter(t=>t.id!==id));
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="+ ajouter une tâche..."
          className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
        <button onClick={add} className="px-3 rounded-lg transition hover:scale-105" style={{background:"var(--primary)", color:"var(--bg)"}}><Plus size={16}/></button>
      </div>
      <ul className="space-y-1.5">
        {list.map(t=>(
          <li key={t.id} className="group flex items-center gap-3 px-3 py-2 rounded-lg transition-all" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <button onClick={()=>toggle(t.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${t.justDone?"animate-ping-once":""}`}
              style={{borderColor:"var(--primary)", background:t.done?"var(--primary)":"transparent"}}>{t.done && <Check size={12} style={{color:"var(--bg)"}}/>}</button>
            <span className={`flex-1 text-sm transition ${t.done?"line-through opacity-50":""}`} style={{color:"var(--text)"}}>{t.text}</span>
            <button onClick={()=>remove(t.id)} className="opacity-0 group-hover:opacity-100 transition"><X size={14} style={{color:"var(--muted)"}}/></button>
          </li>
        ))}
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

function ScrapbookEditor({ pages, setPages }) {
  const [activePage, setActivePage] = useState(pages[0]?.id || null);
  const [choosing, setChoosing] = useState(false); // affiche le choix de format
  const current = pages.find(p=>p.id===activePage);

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
              {[{t:"title",i:TypeIcon,l:"Titre"},{t:"text",i:AlignLeft,l:"Texte"},{t:"image",i:ImageIcon,l:"Image"},{t:"gif",i:Sparkles,l:"Gif"},{t:"pinterest",i:ImageIcon,l:"📌"},{t:"music",i:Music,l:"Musique"},{t:"sticker",i:Star,l:"Sticker"}].map(b=>{const I=b.i;return(
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
        {current.format==="note" && (
          <div className="rounded-2xl p-8" style={{
            background:`var(--paper)`,
            backgroundImage:`repeating-linear-gradient(transparent, transparent 31px, rgba(120,120,150,0.18) 32px)`,
            border:"1px solid var(--border)", boxShadow:"inset 0 0 60px rgba(0,0,0,0.05)", minHeight:"clamp(420px,60vh,640px)"
          }}>
            <textarea value={current.body||""} onChange={e=>updatePage({body:e.target.value})}
              placeholder="Cher journal,&#10;&#10;Aujourd'hui..."
              className="w-full bg-transparent outline-none resize-none"
              style={{ minHeight:"500px", lineHeight:"32px", fontFamily:'"Caveat", cursive', fontSize:"22px", color:"var(--ink)" }}/>
          </div>
        )}
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
              <div className="aspect-video rounded-lg flex items-center justify-center text-xs" style={{background:"rgba(255,255,255,0.5)", border:"4px solid #fff", color:"#888"}}>colle une URL ↓</div>}
            <input value={block.content||""} onChange={e=>onChange({content:e.target.value})} placeholder={block.type==="gif"?"URL du gif":"URL de l'image"}
              className="mt-1 w-full bg-transparent text-[10px] outline-none border-b py-0.5" style={{borderColor:"var(--border)", color:"var(--ink)"}}/>
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

function PassionsList({ items, setItems }) {
  const [openId, setOpenId] = useState(null);
  const [linkInput, setLinkInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const open = items.find(i=>i.id===openId);

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
      </div>
      <div className="rounded-3xl overflow-hidden" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div className="md:flex">
          <div className="md:w-1/3 p-5">
            {open.image
              ? <img src={open.image} alt="" className="w-full rounded-xl object-cover" style={{maxHeight:"360px"}}/>
              : <div className="w-full rounded-xl flex items-center justify-center text-5xl" style={{aspectRatio:"3/4", background:"var(--surface2)"}}>🎬</div>}
            <input value={open.image||""} onChange={e=>update(open.id,{image:e.target.value})} placeholder="URL couverture"
              className="mt-2 w-full text-xs px-2 py-1 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
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

  /* ---- LISTE ---- */
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-2xl" style={{fontFamily:"var(--font-display)", color:"var(--text)"}}>Anime · Films · K-Dramas · Livres</h3>
        <button onClick={addBlank} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}><Plus size={14}/> Vide</button>
      </div>

      {/* barre lien auto */}
      <div className="rounded-2xl p-4 mb-5" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
        <p className="text-xs italic mb-2" style={{color:"var(--muted)"}}>Colle un lien (Wikipedia de préférence) → la fiche se remplit toute seule (titre, résumé, couverture). Puis ajoute ton avis ✦</p>
        <div className="flex gap-2">
          <input value={linkInput} onChange={e=>setLinkInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFromLink()}
            placeholder="https://fr.wikipedia.org/wiki/..." className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none text-sm" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          <button onClick={addFromLink} disabled={loading} className="px-4 rounded-lg text-sm" style={{background:"var(--primary)", color:"var(--bg)"}}>{loading?"⏳":"✦ Remplir"}</button>
        </div>
        {msg && <p className="text-xs mt-2" style={{color:"var(--accent)"}}>{msg}</p>}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(i=>(
          <button key={i.id} onClick={()=>setOpenId(i.id)} className="group text-left rounded-2xl overflow-hidden transition hover:scale-[1.02]" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <div className="relative" style={{aspectRatio:"3/4"}}>
              {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-4xl" style={{background:"var(--surface2)"}}>🎬</div>}
              {i.status && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px]" style={{background:"rgba(0,0,0,0.5)", color:"#fff", backdropFilter:"blur(4px)"}}>{i.status}</span>}
              {i.rating && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px]" style={{background:"rgba(0,0,0,0.5)", color:"#e0c97a"}}>★ {i.rating}</span>}
            </div>
            <div className="p-3">
              <h4 className="text-lg leading-tight" style={{fontFamily:'"Dancing Script", cursive', color:"var(--text)"}}>{i.title||"Sans titre"}</h4>
              {i.type && <p className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>{i.type}</p>}
            </div>
          </button>
        ))}
        {items.length===0 && <p className="col-span-full text-center italic py-12" style={{color:"var(--muted)"}}>Rien encore. Colle un lien ou ajoute une fiche vide ✦</p>}
      </div>
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
  const bg = st.bg || "linear-gradient(180deg, #6b4a2a 0%, #4a3018 100%)";
  const border = st.border || "2px solid #2a1810";
  const color = st.color || "#f0d49a";
  const radius = st.radius!==undefined ? st.radius : 8;
  return (
    <div className={`relative inline-block px-6 py-3 ${className}`} style={{background:bg, border, boxShadow:"inset 0 0 20px rgba(0,0,0,0.4), 0 4px 0 rgba(0,0,0,0.4)", borderRadius:`${radius}px`, fontFamily:'"Dancing Script", cursive'}}>
      <span className="text-xl" style={{color, textShadow:"1px 1px 2px #000"}}>✦ {children} ✦</span>
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

function ControlPanel({ open, onClose, ctx }) {
  const {
    theme, setTheme, font, setFont, sections, setSections,
    activeSection, activeSub, subTabsFor,
    overrides, setOverrides,
    customRituals, setCustomRituals, customTips, setCustomTips, customAffirm, setCustomAffirm
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
              <div className="grid grid-cols-2 gap-2">{Object.entries(THEMES).map(([k,t])=>{ const I=t.icon; return (
                <button key={k} onClick={()=>setTheme(k)} className="p-3 rounded-xl text-left transition-all" style={{background:"var(--surface)", border:`1px solid ${theme===k?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                  <I size={16} className="mb-1"/><div className="text-xs">{t.name}</div></button>
              );})}</div>
            </section>
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
              <div className="grid grid-cols-3 gap-2">{Object.entries(BACKDROPS).map(([k,b])=>(
                <button key={k} onClick={()=>setOv({backdrop:k})} className="p-2 rounded-xl text-center transition" style={{background:(ov.backdrop||"")===k?"rgba(var(--glow),0.2)":"var(--surface)", border:`1px solid ${(ov.backdrop||"")===k?"var(--primary)":"var(--border)"}`, color:"var(--text)"}}>
                  <div className="text-xl">{b.emoji}</div><div className="text-[9px] leading-tight mt-1">{b.name}</div></button>
              ))}</div>
            </section>

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
function DreamJournal({ entries, setEntries }) {
  const [editing, setEditing] = useState(null);
  const blank = { id:null, date:new Date().toISOString().slice(0,10), title:"", lucid:false, mood:"", symbols:"", content:"" };
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
          {["✦ archive","✦ about","✦ credits"].map(s=>(
            <div key={s} className="rounded-full px-4 py-2 text-center text-sm" style={{background:"linear-gradient(180deg, #8a6ac0, #6a4a9a)", border:"1px solid #c8a0e8", color:"#fff", textShadow:"1px 1px 2px #000"}}>{s}</div>
          ))}
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
    {k:"journal",label:"Journal secret",icon:Lock},
  ],
  witch: [
    {k:"tavern",label:"Tavern",icon:BookMarked},
    {k:"moon",label:"La Lune",icon:Moon},
    {k:"ritual",label:"Rituel du jour",icon:Flame},
    {k:"grimoire",label:"Grimoire",icon:BookOpen},
    {k:"crystals",label:"Cristaux",icon:Gem},
    {k:"herbs",label:"Herbes",icon:Leaf},
    {k:"tarot",label:"Tarot",icon:Stars},
    {k:"shifting",label:"Shifting & DR",icon:Compass},
    {k:"astral",label:"Astral",icon:CloudMoon},
    {k:"dreams",label:"Rêves",icon:CloudMoon},
    {k:"intentions",label:"Manifest",icon:Wand2},
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

function ShiftingHub({ drs, setDrs }) {
  const [openId, setOpenId] = useState(null);
  const open = drs.find(d=>d.id===openId);

  const newDR = () => { const d = makeBlankDR(); setDrs([d, ...drs]); setOpenId(d.id); };
  const updateDR = (id, patch) => setDrs(drs.map(d=>d.id===id?{...d,...patch}:d));
  const delDR = (id) => { if(confirm("Supprimer cette DR et tout son script ?")){ setDrs(drs.filter(d=>d.id!==id)); setOpenId(null); } };

  if (open) return <ShiftingScriptPage dr={open} onBack={()=>setOpenId(null)} onUpdate={p=>updateDR(open.id,p)} onDelete={()=>delDR(open.id)}/>;

  return (
    <div className="animate-fade-up">
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

function ShiftingScriptPage({ dr, onBack, onUpdate, onDelete }) {
  const [activeSection, setActiveSection] = useState(dr.sections[0]?.id || "general");
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

  return (
    <div className="animate-fade-up">
      {/* Barre de retour */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)"}}>
          ← retour à mes DR
        </button>
        <button onClick={()=>onUpdate({favorite:!dr.favorite})} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid var(--border)", color:dr.favorite?"#e0c97a":"var(--text)"}}>
          {dr.favorite ? "⭐ favorite" : "☆ ajouter aux favoris"}
        </button>
        <button onClick={onDelete} className="px-3 py-2 rounded-full text-sm" style={{background:"var(--surface)", border:"1px solid #c08080", color:"#c08080"}}>
          <Trash2 size={12} className="inline mr-1"/> supprimer DR
        </button>
      </div>

      {/* HERO : couverture + nom + citation */}
      <div className="relative rounded-3xl overflow-hidden mb-6" style={{border:"1px solid var(--border)", boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
        <div className="relative" style={{aspectRatio:"16/7", minHeight:"200px",
          background: dr.cover ? `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.5)), url(${dr.cover}) center/cover` : `linear-gradient(160deg, var(--surface2) 0%, var(--primary) 100%)`}}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <input value={dr.name} onChange={e=>onUpdate({name:e.target.value})}
              className="bg-transparent outline-none text-center text-3xl sm:text-5xl"
              style={{fontFamily:'"Dancing Script",cursive', color:"#fff", textShadow:"0 2px 12px rgba(0,0,0,0.6)"}}/>
            <input value={dr.quote} onChange={e=>onUpdate({quote:e.target.value})} placeholder="une citation, un mot, un mantra pour cette DR..."
              className="mt-2 w-full max-w-md bg-transparent outline-none text-center text-sm italic"
              style={{color:"#fff", textShadow:"0 1px 6px rgba(0,0,0,0.6)"}}/>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 p-4" style={{background:"var(--surface)"}}>
          <div>
            <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>URL couverture</label>
            <input value={dr.cover} onChange={e=>onUpdate({cover:e.target.value})} placeholder="https://..."
              className="w-full text-xs px-2 py-1 mt-1 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Tag / catégorie</label>
            <input value={dr.tag} onChange={e=>onUpdate({tag:e.target.value})} placeholder="ex: Hogwarts, K-pop, MCU..."
              className="w-full text-xs px-2 py-1 mt-1 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest" style={{color:"var(--muted)"}}>Playlist (Spotify)</label>
            <input value={dr.playlist} onChange={e=>onUpdate({playlist:e.target.value})} placeholder="lien Spotify"
              className="w-full text-xs px-2 py-1 mt-1 rounded bg-transparent outline-none" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
          </div>
        </div>
      </div>

      {/* Playlist embed */}
      {dr.playlist?.includes("spotify") && (
        <div className="rounded-2xl overflow-hidden mb-6" style={{border:"1px solid var(--border)"}}>
          <iframe title="dr-playlist" src={dr.playlist.replace("/track/","/embed/track/").replace("/playlist/","/embed/playlist/").replace("/album/","/embed/album/")} width="100%" height="80" frameBorder="0" allow="encrypted-media"/>
        </div>
      )}

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
            <textarea value={currentSec.content||""} onChange={e=>updateSection(currentSec.id,{content:e.target.value})}
              placeholder="Écris tout ce que tu veux pour cette section. Détails physiques, anecdotes, dialogues, souvenirs futurs, intentions... tout ce qui rend cette DR vivante."
              rows={16}
              className="w-full bg-transparent outline-none leading-relaxed"
              style={{ fontFamily:'"Caveat", cursive', fontSize:"19px", color:"var(--text)", lineHeight:"30px",
                backgroundImage:"repeating-linear-gradient(transparent, transparent 29px, rgba(120,120,150,0.18) 30px)" }}/>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {dr.gallery.map(g=>(
            <div key={g.id} className="group relative rounded-xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
              {g.url
                ? <img src={g.url} alt="" className="w-full object-cover" style={{aspectRatio:"1"}}/>
                : <div className="w-full flex items-center justify-center text-3xl" style={{aspectRatio:"1", background:"var(--surface2)"}}>🖼️</div>}
              <div className="p-2" style={{background:"var(--surface2)"}}>
                <input value={g.url} onChange={e=>updateGalleryImg(g.id,{url:e.target.value})} placeholder="URL image"
                  className="w-full text-[10px] px-1 py-0.5 rounded bg-transparent outline-none mb-1" style={{border:"1px solid var(--border)", color:"var(--text)"}}/>
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
          if (data.witchTexts) setWitchTexts(data.witchTexts);
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
    tavernBg: "linear-gradient(180deg, #6b4a2a 0%, #4a3018 100%)",
    tavernBorderColor: "#2a1810",
    tavernColor: "#f0d49a",
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
  const setTheme = (t) => setSectionThemes(prev => ({ ...prev, [activeSection]: t }));
  const [sections, setSections] = useState([{id:"moi",name:"Yasmine",custom:false},{id:"witch",name:"Yasmeen",custom:false}]);
  const [overrides, setOverrides] = useState({}); // {"sec:moi":{backdrop,colors}, "sub:witch:dreams":{...}}

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
        appPin, homeContent, witchTexts, theme, sectionThemes, font, sections, overrides,
        tasks, widgets, scrapPages, journalPin, grimoireEntries,
        shiftingNotes, astralNotes, passions, wishlist, goals,
        gratitude, moodLog, habits, dreamLog, tarotLog, intentions,
        customRituals, customTips, customAffirm,
      });
    }, 1000);
    return ()=>clearTimeout(t);
  }, [user, appPin, homeContent, witchTexts, theme, sectionThemes, font, sections, overrides, tasks, widgets, scrapPages, journalPin, grimoireEntries, shiftingNotes, astralNotes, passions, wishlist, goals, gratitude, moodLog, habits, dreamLog, tarotLog, intentions, customRituals, customTips, customAffirm]);

  const themeObj = THEMES[theme];

  // résoudre overrides : sous-section > section > thème
  const secOv = overrides[`sec:${activeSection}`] || {};
  const subOv = overrides[`sub:${activeSection}:${activeSub}`] || {};
  const activeBackdrop = subOv.backdrop ?? secOv.backdrop ?? themeObj.backdrop;
  const mergedColors = { ...(secOv.colors||{}), ...(subOv.colors||{}) };

  useEffect(()=>{
    Object.entries(themeObj.vars).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));
    // applique overrides couleurs
    Object.entries(mergedColors).forEach(([k,v])=>{
      document.documentElement.style.setProperty(k,v);
      if(k==="--primary"||k==="--accent"){ /* recalcul glow approx */ }
    });
    document.documentElement.style.setProperty("--font-body", FONTS[font].stack);
    document.documentElement.style.setProperty("--font-display", FONTS.display.stack);
    document.body.style.background = `linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)`;
    document.body.style.color="var(--text)";
    document.body.style.fontFamily="var(--font-body)";
  }, [theme, font, JSON.stringify(mergedColors)]);

  const ritualOfDay=pickByDate(allRituals,"ritual");
  const tipOfDay=pickByDate(allTips,"tip");
  const affirmOfDay=pickByDate(allAffirm,"aff");
  const crystalOfDay=pickByDate(CRYSTALS,"crystal");
  const herbOfDay=pickByDate(HERBS,"herb");
  const dayTip=dayOfWeekTip();
  const moon=moonPhase();

  const secWidgets = widgets[activeSection] || [];
  const setSecWidgets = (list) => setWidgets({ ...widgets, [activeSection]: list });
  const addWidget=(type)=>setSecWidgets([...secWidgets, {id:uid(), type, content:"", x:6+Math.random()*10, y:6+Math.random()*10, w: type==="clock"?24:30}]);
  const subTabsFor=(sec)=>SUBTABS[sec]||[];

  const ctx = { theme,setTheme,font,setFont,sections,setSections,activeSection,activeSub,subTabsFor,overrides,setOverrides,customRituals,setCustomRituals,customTips,setCustomTips,customAffirm,setCustomAffirm };

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
        @keyframes spinSlow {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes glow {0%,100%{box-shadow:0 0 20px rgba(var(--glow),0.2)}50%{box-shadow:0 0 40px rgba(var(--glow),0.5)}}
        .animate-shake{animation:shake .4s ease}.animate-ping-once{animation:pingOnce .6s ease}
        .animate-fade-up{animation:fadeUp .6s ease both}.animate-spin-slow{animation:spinSlow 30s linear infinite}
        .animate-glow{animation:glow 4s ease-in-out infinite}
        ::selection{background:var(--primary);color:var(--bg)}
        input,textarea,select{font-family:inherit}
      `}</style>

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
          {activeSub==="passions" && <PassionsList items={passions} setItems={setPassions}/>}
          {activeSub==="wishlist" && <CardList items={wishlist} setItems={setWishlist} title="Wishlist" fields={[{k:"title",label:"Objet"},{k:"price",label:"Prix"},{k:"priority",label:"Priorité"},{k:"url",label:"Lien"},{k:"image",label:"Image URL"}]}/>}
          {activeSub==="gratitude" && <GratitudeJournal entries={gratitude} setEntries={setGratitude}/>}
          {activeSub==="mood" && <MoodTracker log={moodLog} setLog={setMoodLog}/>}
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
            <button key={t.k} onClick={()=>setActiveSub(t.k)} className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap" style={{background:activeSub===t.k?"linear-gradient(180deg,#6b4a2a,#4a3018)":"var(--surface)", color:activeSub===t.k?"#f0d49a":"var(--text)", border:activeSub===t.k?"1px solid #2a1810":"1px solid var(--border)", fontFamily:activeSub===t.k?'"Dancing Script",cursive':"inherit"}}><I size={14}/>{t.label}</button>
          )})}</div>

          {activeSub==="tavern" && (<div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 text-center animate-glow" style={{background:"linear-gradient(180deg,#e8dcc0,#c9a26a)", border:"3px double #4a3018", color:"#2a1810"}}>
              {witchEdit ? (<>
                <input value={witchTexts.spellNo} onChange={e=>setWitchTexts({...witchTexts, spellNo:e.target.value})} className="text-center bg-white/30 rounded outline-none text-xs uppercase tracking-[0.3em] w-full mb-1" style={{color:"#2a1810"}}/>
                <input value={witchTexts.spellTitle} onChange={e=>setWitchTexts({...witchTexts, spellTitle:e.target.value})} className="text-center bg-white/30 rounded outline-none text-2xl w-full" style={{color:"#2a1810", fontFamily:'"UnifrakturCook",serif'}}/>
              </>) : (<>
                <p className="text-xs uppercase tracking-[0.3em]">{witchTexts.spellNo}</p>
                <h3 className="text-3xl mt-2" style={{fontFamily:'"UnifrakturCook",serif'}}>{witchTexts.spellTitle}</h3>
              </>)}
              <div className="my-4 text-6xl">📖</div>
              {witchEdit
                ? <input value={witchTexts.spellSub} onChange={e=>setWitchTexts({...witchTexts, spellSub:e.target.value})} className="text-center bg-white/30 rounded outline-none text-[10px] uppercase tracking-widest w-full" style={{color:"#2a1810"}}/>
                : <p className="text-[10px] uppercase tracking-widest">{witchTexts.spellSub}</p>}
            </div>
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <p className="italic mb-3" style={{fontFamily:'"Dancing Script",cursive', color:"var(--accent)"}}>✧ check the time ✧</p><MoonClock compact/>
            </div>
            <div className="rounded-2xl p-6" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
              <div className="text-center mb-3"><WoodPlank>IDEAS</WoodPlank></div>
              <ul className="space-y-1 text-sm">{["rituel à tester","livre à lire","cristal à acheter","lieu à visiter"].map((l,i)=>(<li key={i} className="px-3 py-1.5 rounded" style={{background:"rgba(106,74,42,0.2)", color:"var(--text)"}}>◦ {l}</li>))}</ul>
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
          </div>)}

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

          {activeSub==="grimoire" && <CardList items={grimoireEntries} setItems={setGrimoireEntries} title="Mon grimoire personnel" fields={[{k:"title",label:"Nom du sort"},{k:"intention",label:"Intention"},{k:"moon",label:"Phase idéale"},{k:"ingredients",label:"Ingrédients",multi:true},{k:"steps",label:"Étapes",multi:true,big:true},{k:"result",label:"Résultats",multi:true}]}/>}

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

          {activeSub==="shifting" && <ShiftingHub drs={shiftingNotes} setDrs={setShiftingNotes}/>}

          {activeSub==="astral" && <CardList items={astralNotes} setItems={setAstralNotes} title="Voyages astraux & expériences" fields={[{k:"title",label:"Date/titre"},{k:"type",label:"Type (OBE, lucide)"},{k:"sensations",label:"Sensations",multi:true},{k:"content",label:"Récit",multi:true,big:true}]}/>}

          {activeSub==="dreams" && <DreamJournal entries={dreamLog} setEntries={setDreamLog}/>}

          {activeSub==="intentions" && <CardList items={intentions} setItems={setIntentions} title="Intentions & loi de l'attraction" fields={[{k:"title",label:"Intention"},{k:"deadline",label:"Date cible"},{k:"affirmation",label:"Affirmation présent",multi:true},{k:"feeling",label:"Ressenti une fois réel"},{k:"actions",label:"Actions alignées",multi:true},{k:"signs",label:"Synchronicités",multi:true}]}/>}
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
        </>
      )}

      <ControlPanel open={panelOpen} onClose={()=>setPanelOpen(false)} ctx={ctx}/>
    </>
  );
}
