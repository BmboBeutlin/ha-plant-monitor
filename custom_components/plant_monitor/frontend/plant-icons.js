/**
 * Plant Icons — Cartoon-style SVGs with terracotta pots
 * ~18 distinct types for 54 library plants
 */

// Shared pot base (reused across icons)
const POT_SM = `<ellipse cx="50" cy="93" rx="18" ry="3.5" fill="#000" opacity="0.15"/>
  <path d="M35 72h30l-3 18H38z" fill="#c4713a"/>
  <rect x="32" y="68" width="36" height="6" rx="2" fill="#d4814a"/>
  <rect x="32" y="68" width="36" height="2.5" rx="1.2" fill="#daa070" opacity="0.5"/>
  <ellipse cx="50" cy="71" rx="15" ry="2.5" fill="#5a3a20"/>`;

const POT_WIDE = `<ellipse cx="50" cy="93" rx="20" ry="3.5" fill="#000" opacity="0.15"/>
  <path d="M32 68h36l-3 22H35z" fill="#c4713a"/>
  <rect x="29" y="64" width="42" height="6" rx="2" fill="#d4814a"/>
  <rect x="29" y="64" width="42" height="2.5" rx="1.2" fill="#daa070" opacity="0.5"/>
  <ellipse cx="50" cy="67" rx="18" ry="2.5" fill="#5a3a20"/>`;

const S = (body, pot) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${pot || POT_SM}${body}</svg>`;

const PLANT_ICONS = {

  // === MONSTERA — big fenestrated leaves with holes ===
  monstera: S(`
    <path d="M50 68c-2-8-4-18-12-28" stroke="#3a7a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 68c2-6 6-16 14-24" stroke="#3a7a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 68c0-8 1-20 0-30" stroke="#3a7a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M38 40c-14-4-22 2-20 10s12 8 16 2c-2-4-6-4-8-2" fill="#3cb34a" stroke="#2a8a32" stroke-width="0.5"/>
    <ellipse cx="24" cy="44" rx="3" ry="2" fill="#1e3e1e" opacity="0.2"/>
    <path d="M64 44c14-6 20 2 18 10s-12 6-16 0c2-3 6-3 8-1" fill="#32a540" stroke="#2a8a32" stroke-width="0.5"/>
    <ellipse cx="76" cy="48" rx="2.5" ry="2" fill="#1e3e1e" opacity="0.2"/>
    <path d="M50 38c-4-14-2-22 6-22s10 8 6 18c-3-2-6 0-6 3" fill="#44c454" stroke="#2a8a32" stroke-width="0.5"/>
    <path d="M44 52c-8-2-14 2-12 8s8 4 10 0" fill="#3cb34a" stroke="#2a8a32" stroke-width="0.5"/>
    <path d="M56 50c8-2 14 4 10 10s-8 2-10-2" fill="#44c454" stroke="#2a8a32" stroke-width="0.5"/>`),

  // === POTHOS / EFEUTUTE — trailing heart-shaped leaves ===
  pothos: S(`
    <path d="M45 70c-8 4-20 8-26 18" stroke="#3a8a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M55 70c8 4 20 8 26 18" stroke="#3a8a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M48 70c-4 6-14 12-22 20" stroke="#44944a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M50 68V42" stroke="#3a7a3a" stroke-width="2" fill="none"/>
    <path d="M50 42c-4-6-10-4-10 0s6 8 10 4" fill="#44aa44"/>
    <path d="M50 42c4-6 10-4 10 0s-6 8-10 4" fill="#3ca03c"/>
    <path d="M46 54c-3-5-8-3-8 0s5 6 8 3" fill="#4cb54c"/>
    <path d="M28 80c-3-4-7-3-7 0s4 5 7 3" fill="#44aa44"/>
    <path d="M72 82c3-4 7-3 7 0s-4 5-7 3" fill="#4cb54c"/>
    <path d="M22 86c-2-3-5-2-5 1s3 3 5 1" fill="#3ca03c"/>
    <path d="M78 88c2-3 5-2 5 1s-3 3-5 1" fill="#44aa44"/>`),

  // === SNAKE PLANT / BOGENHANF — tall upright sword leaves ===
  snake_plant: S(`
    <path d="M44 68c-1-14-3-30-4-44" stroke="none" fill="#3a8a3a"/>
    <path d="M40 24l4 0 0 44-6 0z" fill="#3a8a3a"/>
    <path d="M41 26l2 0 0 40-3 0z" fill="#4ca04c" opacity="0.4"/>
    <path d="M48 68c0-16 0-36 0-48" stroke="none"/>
    <path d="M46 20l4 0 0 48-6 0z" fill="#44944a"/>
    <path d="M47 22l2 0 0 44-3 0z" fill="#5ab05a" opacity="0.4"/>
    <path d="M52 68c1-14 2-32 3-42" stroke="none"/>
    <path d="M52 26l4 0-1 42-5 0z" fill="#3a8a3a"/>
    <path d="M53 28l2 0 0 38-3 0z" fill="#4ca04c" opacity="0.4"/>
    <path d="M56 68c1-12 3-26 5-36" stroke="none"/>
    <path d="M57 32l4 0-2 36-4 0z" fill="#44944a"/>
    <path d="M58 34l2 0-1 32-2 0z" fill="#5ab05a" opacity="0.4"/>
    <!-- Yellow edges -->
    <path d="M40 24l0.5 44" stroke="#c8c040" stroke-width="0.8" opacity="0.6"/>
    <path d="M44 24l-0.5 44" stroke="#c8c040" stroke-width="0.8" opacity="0.6"/>
    <path d="M46 20l0.5 48" stroke="#c8c040" stroke-width="0.8" opacity="0.6"/>
    <path d="M50 20l-0.5 48" stroke="#c8c040" stroke-width="0.8" opacity="0.6"/>`),

  // === SPIDER PLANT / GRÜNLILIE — arching striped leaves ===
  spider_plant: S(`
    <path d="M50 66c-10-2-24 4-32 16" stroke="#4ca04c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c10-2 24 4 32 16" stroke="#4ca04c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c-6-4-18-2-28 8" stroke="#5ab85a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 66c6-4 18-2 28 8" stroke="#5ab85a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 66c-4-8-8-20-6-32" stroke="#4ca04c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c4-8 8-20 6-32" stroke="#4ca04c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c0-10 0-22 0-34" stroke="#5ab85a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <!-- Center stripe on leaves -->
    <path d="M50 66c-10-2-24 4-32 16" stroke="#b8d8a0" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M50 66c10-2 24 4 32 16" stroke="#b8d8a0" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M50 66c0-10 0-22 0-34" stroke="#b8d8a0" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Baby spider -->
    <circle cx="22" cy="80" r="3" fill="#5ab85a" opacity="0.6"/>
    <circle cx="78" cy="80" r="3" fill="#4ca04c" opacity="0.6"/>`),

  // === PEACE LILY / EINBLATT — white spathe flower ===
  peace_lily: S(`
    <path d="M50 68V40" stroke="#3a7a3a" stroke-width="2" fill="none"/>
    <path d="M46 68V44" stroke="#3a7a3a" stroke-width="1.8" fill="none"/>
    <path d="M54 68V46" stroke="#3a7a3a" stroke-width="1.8" fill="none"/>
    <path d="M42 48c-6-2-14 2-12 8s8 4 12 0" fill="#3ca03c"/>
    <path d="M58 50c6-2 14 2 12 8s-8 4-12 0" fill="#44aa44"/>
    <path d="M46 44c-5-4-12-2-10 4s7 4 10 0" fill="#4cb54c"/>
    <path d="M54 46c5-4 12-2 10 4s-7 4-10 0" fill="#3ca03c"/>
    <path d="M48 56c-4-2-10 0-8 4s6 2 8 0" fill="#44aa44"/>
    <!-- White spathe -->
    <path d="M52 38c2-10 10-14 12-8s-4 14-10 12" fill="#e8e8e0" stroke="#d0d0c8" stroke-width="0.5"/>
    <!-- Yellow spadix -->
    <line x1="56" y1="32" x2="58" y2="26" stroke="#e8c840" stroke-width="2.5" stroke-linecap="round"/>`),

  // === FIDDLE LEAF FIG / GEIGENFEIGE — large fiddle-shaped leaves ===
  fiddle_leaf: S(`
    <path d="M50 68V34" stroke="#5a4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50 40c-4-10-14-12-14-4s6 14 14 8" fill="#3a8a3a" stroke="#2a7a2a" stroke-width="0.5"/>
    <path d="M50 40c4-10 14-12 14-4s-6 14-14 8" fill="#44944a" stroke="#2a7a2a" stroke-width="0.5"/>
    <path d="M50 34c-3-12-12-14-12-6s5 14 12 10" fill="#44944a" stroke="#2a7a2a" stroke-width="0.5"/>
    <path d="M50 34c3-12 12-14 12-6s-5 14-12 10" fill="#3a8a3a" stroke="#2a7a2a" stroke-width="0.5"/>
    <path d="M50 50c-5-6-14-6-14 0s6 10 14 4" fill="#4ca04c" stroke="#2a7a2a" stroke-width="0.5"/>
    <path d="M50 50c5-6 14-6 14 0s-6 10-14 4" fill="#3a8a3a" stroke="#2a7a2a" stroke-width="0.5"/>
    <path d="M50 58c-4-4-10-4-10 0s4 8 10 4" fill="#4ca04c" stroke="#2a7a2a" stroke-width="0.5"/>`),

  // === RUBBER PLANT / GUMMIBAUM — glossy oval leaves ===
  rubber_plant: S(`
    <path d="M50 68V36" stroke="#4a3a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="42" rx="10" ry="7" fill="#2a6a30" transform="rotate(-20 38 42)"/>
    <ellipse cx="38" cy="42" rx="4" ry="6" fill="#3a7a3a" opacity="0.3" transform="rotate(-20 38 42)"/>
    <ellipse cx="62" cy="38" rx="10" ry="7" fill="#326e36" transform="rotate(15 62 38)"/>
    <ellipse cx="62" cy="38" rx="4" ry="6" fill="#3a7a3a" opacity="0.3" transform="rotate(15 62 38)"/>
    <ellipse cx="40" cy="54" rx="9" ry="6" fill="#2a6a30" transform="rotate(-10 40 54)"/>
    <ellipse cx="60" cy="50" rx="9" ry="6" fill="#326e36" transform="rotate(10 60 50)"/>
    <ellipse cx="46" cy="32" rx="8" ry="6" fill="#326e36" transform="rotate(-30 46 32)"/>
    <ellipse cx="56" cy="28" rx="8" ry="5.5" fill="#2a6a30" transform="rotate(25 56 28)"/>
    <!-- Glossy highlight -->
    <ellipse cx="36" cy="40" rx="3" ry="2" fill="#fff" opacity="0.08" transform="rotate(-20 36 40)"/>
    <ellipse cx="60" cy="36" rx="3" ry="2" fill="#fff" opacity="0.08" transform="rotate(15 60 36)"/>`),

  // === ALOE VERA — pointed succulent leaves ===
  aloe: S(`
    <path d="M50 66c-2-14-6-28-14-38" stroke="#5a9a5a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M50 66c2-14 6-28 14-38" stroke="#5a9a5a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M50 66c-1-16-2-30-4-40" stroke="#6aaa6a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c1-16 2-30 4-40" stroke="#6aaa6a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c0-16 0-32 0-42" stroke="#7aba7a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M50 66c-4-10-12-20-20-28" stroke="#5a9a5a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66c4-10 12-20 20-28" stroke="#5a9a5a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <!-- Spines -->
    <circle cx="42" cy="40" r="0.8" fill="#aadaaa"/>
    <circle cx="38" cy="46" r="0.8" fill="#aadaaa"/>
    <circle cx="58" cy="42" r="0.8" fill="#aadaaa"/>
    <circle cx="62" cy="48" r="0.8" fill="#aadaaa"/>`),

  // === SUCCULENT ROSETTE — echeveria style ===
  succulent: S(`
    <ellipse cx="50" cy="52" rx="6" ry="14" fill="#6ab56a"/>
    <ellipse cx="50" cy="52" rx="6" ry="14" fill="#7acc7a" transform="rotate(36 50 52)" opacity="0.9"/>
    <ellipse cx="50" cy="52" rx="6" ry="14" fill="#6ab56a" transform="rotate(72 50 52)" opacity="0.85"/>
    <ellipse cx="50" cy="52" rx="6" ry="14" fill="#7acc7a" transform="rotate(108 50 52)" opacity="0.8"/>
    <ellipse cx="50" cy="52" rx="6" ry="14" fill="#6ab56a" transform="rotate(144 50 52)" opacity="0.85"/>
    <circle cx="50" cy="52" r="5" fill="#8ade8a"/>
    <circle cx="50" cy="52" r="2.5" fill="#a0eca0"/>`),

  // === CACTUS — classic saguaro with arms ===
  cactus: S(`
    <rect x="42" y="28" width="16" height="42" rx="8" fill="#4a9a4a"/>
    <rect x="44" y="30" width="5" height="38" rx="2.5" fill="#5aaa5a" opacity="0.4"/>
    <rect x="53" y="30" width="3" height="38" rx="1.5" fill="#5aaa5a" opacity="0.3"/>
    <rect x="24" y="38" width="10" height="22" rx="5" fill="#4a9a4a"/>
    <path d="M34 48h8" stroke="#4a9a4a" stroke-width="6" stroke-linecap="round"/>
    <rect x="66" y="34" width="10" height="16" rx="5" fill="#4a9a4a"/>
    <path d="M58 42h8" stroke="#4a9a4a" stroke-width="6" stroke-linecap="round"/>
    <circle cx="50" cy="26" r="4" fill="#f0607a"/>
    <circle cx="50" cy="26" r="2" fill="#f8a0b0"/>`),

  // === BARREL CACTUS — round with ribs ===
  cactus_round: S(`
    <ellipse cx="50" cy="52" rx="18" ry="20" fill="#4a9a4a"/>
    <path d="M38 34c0 18 0 36 0 36" stroke="#5aaa5a" stroke-width="1" opacity="0.5"/>
    <path d="M44 32c0 20 0 40 0 40" stroke="#5aaa5a" stroke-width="1" opacity="0.5"/>
    <path d="M50 31c0 20 0 42 0 42" stroke="#5aaa5a" stroke-width="1" opacity="0.5"/>
    <path d="M56 32c0 20 0 40 0 40" stroke="#5aaa5a" stroke-width="1" opacity="0.5"/>
    <path d="M62 34c0 18 0 36 0 36" stroke="#5aaa5a" stroke-width="1" opacity="0.5"/>
    <circle cx="48" cy="34" r="1" fill="#f0e060"/>
    <circle cx="54" cy="36" r="0.8" fill="#f0e060"/>
    <circle cx="42" cy="44" r="0.8" fill="#f0e060"/>
    <circle cx="58" cy="42" r="0.8" fill="#f0e060"/>`),

  // === FERN — arching fronds ===
  fern: S(`
    <path d="M50 68c-6-10-20-20-30-22" stroke="#3a9a4a" stroke-width="2" fill="none"/>
    <path d="M35 56l-5-3m4 5l-6-1m5 4l-6 1m6 3l-5 3" stroke="#4aaa5a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M50 68c6-10 20-20 30-22" stroke="#3a9a4a" stroke-width="2" fill="none"/>
    <path d="M65 56l5-3m-4 5l6-1m-5 4l6 1m-6 3l5 3" stroke="#4aaa5a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M50 68c-3-12-10-26-18-34" stroke="#44aa54" stroke-width="1.8" fill="none"/>
    <path d="M40 48l-4-2m3 4l-5 0m4 3l-4 2" stroke="#55bb65" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M50 68c3-12 10-26 18-34" stroke="#44aa54" stroke-width="1.8" fill="none"/>
    <path d="M60 48l4-2m-3 4l5 0m-4 3l4 2" stroke="#55bb65" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M50 68c0-14 0-28 0-38" stroke="#3a9a4a" stroke-width="2" fill="none"/>
    <path d="M50 45l-4-2m4 5l-4 1m4 3l-3 2m3-14l4-2m-4 5l4 1m-4 3l3 2" stroke="#4aaa5a" stroke-width="1.3" stroke-linecap="round"/>`),

  // === HERB BUSHY — basil, mint (round leaves) ===
  herb: S(`
    <path d="M42 66V48" stroke="#5a8a3a" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 66V40" stroke="#5a8a3a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M58 66V50" stroke="#5a8a3a" stroke-width="2" stroke-linecap="round"/>
    <path d="M46 66V44" stroke="#5a8a3a" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M54 66V46" stroke="#5a8a3a" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="42" cy="46" rx="5" ry="4" fill="#5caa3c" transform="rotate(-15 42 46)"/>
    <ellipse cx="38" cy="52" rx="4.5" ry="3.5" fill="#68b848" transform="rotate(10 38 52)"/>
    <ellipse cx="50" cy="38" rx="6" ry="4.5" fill="#5caa3c"/>
    <ellipse cx="46" cy="42" rx="5" ry="4" fill="#68b848" transform="rotate(15 46 42)"/>
    <ellipse cx="54" cy="42" rx="5" ry="4" fill="#5caa3c" transform="rotate(-10 54 42)"/>
    <ellipse cx="58" cy="48" rx="5" ry="3.5" fill="#68b848" transform="rotate(-20 58 48)"/>
    <ellipse cx="50" cy="44" rx="4" ry="3.5" fill="#78c858"/>`, POT_WIDE),

  // === HERB NEEDLE — rosemary, thyme, lavender ===
  herb_needle: S(`
    <path d="M44 66V38" stroke="#5a7a3a" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 66V32" stroke="#5a7a3a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M56 66V40" stroke="#5a7a3a" stroke-width="2" stroke-linecap="round"/>
    <!-- Needle leaves -->
    <path d="M44 42l-4-1m4 4l-5 0m4 4l-4 1m4 4l-3 1m4 4l-4 1" stroke="#6a9a4a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M44 42l3-1m-3 4l4 0m-3 4l3 1m-3 4l3 1m-3 4l3 1" stroke="#6a9a4a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M50 36l-4-1m4 4l-5 0m4 4l-4 1m4 4l-4 0m4 4l-3 1m3 4l-4 1" stroke="#7aaa5a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M50 36l4-1m-4 4l5 0m-4 4l4 1m-4 4l4 0m-4 4l3 1m-3 4l4 1" stroke="#7aaa5a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M56 44l-3-1m3 4l-4 0m3 4l-3 1m3 4l-3 1" stroke="#6a9a4a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M56 44l3-1m-3 4l4 0m-3 4l3 1m-3 4l3 1" stroke="#6a9a4a" stroke-width="1.5" stroke-linecap="round"/>`, POT_WIDE),

  // === ORCHID — distinctive flower ===
  orchid: S(`
    <path d="M50 68V38" stroke="#3a7a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 58c-4-2-10 0-8 4s6 2 8 0" fill="#3a8a3a"/>
    <path d="M50 54c4-2 10 2 8 6s-6 2-8-2" fill="#44944a"/>
    <!-- Orchid flowers -->
    <ellipse cx="44" cy="34" rx="6" ry="4" fill="#d88ac8" transform="rotate(-10 44 34)"/>
    <ellipse cx="44" cy="28" rx="4" ry="5" fill="#e0a0d0" transform="rotate(-5 44 28)"/>
    <ellipse cx="38" cy="32" rx="4" ry="5" fill="#d88ac8" transform="rotate(30 38 32)"/>
    <circle cx="44" cy="33" r="2.5" fill="#c06898"/>
    <ellipse cx="56" cy="40" rx="5" ry="3.5" fill="#d88ac8" transform="rotate(10 56 40)"/>
    <ellipse cx="56" cy="35" rx="3.5" ry="4.5" fill="#e0a0d0" transform="rotate(5 56 35)"/>
    <ellipse cx="61" cy="38" rx="3.5" ry="4.5" fill="#d88ac8" transform="rotate(-30 61 38)"/>
    <circle cx="56" cy="39" r="2" fill="#c06898"/>
    <!-- Aerial roots -->
    <path d="M48 66c-2 2-6 4-10 4" stroke="#8a8a7a" stroke-width="1" fill="none" opacity="0.4"/>`),

  // === FLOWERING — generic flowers ===
  flowering: S(`
    <path d="M50 68V42" stroke="#3a7a3a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M50 58c-4-6-10-10-14-10" stroke="#3a7a3a" stroke-width="2" fill="none"/>
    <path d="M50 54c4-4 10-6 12-4" stroke="#3a7a3a" stroke-width="2" fill="none"/>
    <path d="M36 48c-6-2-10 2-8 6s6 2 8-2" fill="#44aa44"/>
    <path d="M62 50c6 0 8 4 6 8s-6 0-8-4" fill="#44aa44"/>
    <path d="M44 60c-4-2-8 0-6 4s5 2 6-1" fill="#4cb54c"/>
    <ellipse cx="50" cy="32" rx="5" ry="8" fill="#e86090"/>
    <ellipse cx="50" cy="32" rx="5" ry="8" fill="#f070a0" transform="rotate(72 50 38)"/>
    <ellipse cx="50" cy="32" rx="5" ry="8" fill="#e86090" transform="rotate(144 50 38)"/>
    <ellipse cx="50" cy="32" rx="5" ry="8" fill="#f070a0" transform="rotate(216 50 38)"/>
    <ellipse cx="50" cy="32" rx="5" ry="8" fill="#e86090" transform="rotate(288 50 38)"/>
    <circle cx="50" cy="38" r="5" fill="#f0c040"/>
    <circle cx="50" cy="38" r="3" fill="#f8d868"/>`),

  // === PALM / DRACAENA / YUCCA — trunk + top leaves ===
  palm: S(`
    <path d="M50 68V32" stroke="#6a5a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Trunk texture -->
    <path d="M47 60h6m-6-6h6m-6-6h6m-6-6h6m-6-6h6" stroke="#7a6a4a" stroke-width="0.8" opacity="0.4"/>
    <!-- Top leaves -->
    <path d="M50 34c-6-4-20-6-28-2" stroke="#3a8a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 34c6-4 20-6 28-2" stroke="#3a8a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 34c-4-6-14-12-22-12" stroke="#44944a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M50 34c4-6 14-12 22-12" stroke="#44944a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M50 34c-2-8-6-18-8-24" stroke="#3a8a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 34c2-8 6-18 8-24" stroke="#44944a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 34c0-10 0-20 0-26" stroke="#4ca04c" stroke-width="2" fill="none" stroke-linecap="round"/>`),

  // === CALATHEA / PRAYER PLANT — patterned oval leaves ===
  calathea: S(`
    <path d="M50 68V42" stroke="#3a7a3a" stroke-width="2" fill="none"/>
    <path d="M46 68V46" stroke="#3a7a3a" stroke-width="1.8" fill="none"/>
    <path d="M54 68V48" stroke="#3a7a3a" stroke-width="1.8" fill="none"/>
    <!-- Patterned leaves -->
    <ellipse cx="36" cy="44" rx="12" ry="7" fill="#3a8a3a" transform="rotate(-20 36 44)"/>
    <ellipse cx="36" cy="44" rx="6" ry="5" fill="#2a6a2a" opacity="0.4" transform="rotate(-20 36 44)"/>
    <path d="M30 40l12 8" stroke="#5aaa5a" stroke-width="0.6" opacity="0.6"/>
    <ellipse cx="64" cy="42" rx="12" ry="7" fill="#44944a" transform="rotate(15 64 42)"/>
    <ellipse cx="64" cy="42" rx="6" ry="5" fill="#2a6a2a" opacity="0.4" transform="rotate(15 64 42)"/>
    <path d="M58 38l12 8" stroke="#5aaa5a" stroke-width="0.6" opacity="0.6"/>
    <ellipse cx="38" cy="56" rx="10" ry="6" fill="#3a8a3a" transform="rotate(-10 38 56)"/>
    <ellipse cx="38" cy="56" rx="5" ry="4" fill="#2a6a2a" opacity="0.4" transform="rotate(-10 38 56)"/>
    <ellipse cx="62" cy="54" rx="10" ry="6" fill="#44944a" transform="rotate(10 62 54)"/>
    <ellipse cx="50" cy="36" rx="10" ry="6.5" fill="#3a8a3a" transform="rotate(-5 50 36)"/>
    <ellipse cx="50" cy="36" rx="5" ry="4.5" fill="#2a6a2a" opacity="0.4" transform="rotate(-5 50 36)"/>`),

  // === AIR PLANT / TILLANDSIA ===
  air_plant: S(`
    <path d="M50 62c-3-10-8-22-16-30" stroke="#6aaa7a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 62c3-10 8-22 16-30" stroke="#6aaa7a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 62c-1-12-2-26-4-36" stroke="#7aba8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 62c1-12 2-26 4-36" stroke="#7aba8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 62c0-14 0-28 0-38" stroke="#8aca9a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 62c-6-6-16-14-24-16" stroke="#6aaa7a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 62c6-6 16-14 24-16" stroke="#6aaa7a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- No pot - floating -->`, `<ellipse cx="50" cy="68" rx="8" ry="4" fill="rgba(255,255,255,0.05)"/>`),

  // === TRAILING SUCCULENT — string of pearls ===
  trailing_succulent: S(`
    <path d="M44 70c-6 4-14 10-18 18" stroke="#5a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M50 70c0 6-2 14-4 20" stroke="#5a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M56 70c6 4 14 10 18 18" stroke="#5a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M47 70c-3 6-8 14-12 20" stroke="#5a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M53 70c3 6 8 14 12 20" stroke="#5a9a5a" stroke-width="1.5" fill="none"/>
    <!-- Pearls -->
    <circle cx="40" cy="74" r="2.5" fill="#6aaa6a"/><circle cx="36" cy="78" r="2.5" fill="#7aba7a"/>
    <circle cx="30" cy="84" r="2.5" fill="#6aaa6a"/><circle cx="27" cy="88" r="2" fill="#7aba7a"/>
    <circle cx="50" cy="76" r="2.5" fill="#7aba7a"/><circle cx="49" cy="82" r="2.5" fill="#6aaa6a"/>
    <circle cx="47" cy="88" r="2" fill="#7aba7a"/>
    <circle cx="60" cy="74" r="2.5" fill="#6aaa6a"/><circle cx="64" cy="78" r="2.5" fill="#7aba7a"/>
    <circle cx="70" cy="84" r="2.5" fill="#6aaa6a"/><circle cx="73" cy="88" r="2" fill="#7aba7a"/>
    <circle cx="44" cy="76" r="2" fill="#6aaa6a"/><circle cx="56" cy="76" r="2" fill="#6aaa6a"/>
    <!-- Top rosette -->
    <circle cx="47" cy="66" r="3" fill="#6aaa6a"/>
    <circle cx="53" cy="66" r="3" fill="#7aba7a"/>
    <circle cx="50" cy="63" r="3" fill="#8aca8a"/>`),

  // === DEFAULT — generic houseplant ===
  default: S(`
    <path d="M50 68V44" stroke="#3a7a3a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M50 52c-6-6-16-4-14 2s10 6 14 0" fill="#44aa44"/>
    <path d="M50 52c6-6 16-4 14 2s-10 6-14 0" fill="#3ca03c"/>
    <path d="M50 44c-5-8-14-6-12 0s8 6 12 2" fill="#4cb54c"/>
    <path d="M50 44c5-8 14-6 12 0s-8 6-12 2" fill="#44aa44"/>
    <path d="M50 60c-4-4-10-2-8 2s6 4 8 0" fill="#4cb54c" opacity="0.8"/>`),
};

// Map plant IDs to specific icon types
const PLANT_ICON_MAP = {
  // Tropical with big leaves
  monstera_deliciosa: "monstera",
  // Trailing / climbing
  epipremnum_aureum: "pothos",
  hedera_helix: "pothos",
  tradescantia_zebrina: "pothos",
  syngonium_podophyllum: "pothos",
  hoya_carnosa: "pothos",
  // Upright sword leaves
  sansevieria: "snake_plant",
  zamioculcas: "snake_plant",
  // Spider-like
  chlorophytum_comosum: "spider_plant",
  // Peace lily
  spathiphyllum: "peace_lily",
  anthurium: "peace_lily",
  // Large-leafed trees
  ficus_lyrata: "fiddle_leaf",
  ficus_elastica: "rubber_plant",
  ficus_benjamina: "fiddle_leaf",
  pachira_aquatica: "fiddle_leaf",
  // Rubber/glossy leaf
  dieffenbachia: "rubber_plant",
  codiaeum: "rubber_plant",
  // Aloe type
  aloe_vera: "aloe",
  // Succulent rosettes
  echeveria: "succulent",
  haworthia_fasciata: "succulent",
  crassula_ovata: "succulent",
  kalanchoe: "succulent",
  // Cacti
  mammillaria: "cactus",
  opuntia: "cactus_round",
  euphorbia_tirucalli: "cactus",
  // Ferns
  nephrolepis_exaltata: "fern",
  asplenium_nidus: "fern",
  adiantum: "fern",
  asparagus_densiflorus: "fern",
  // Herbs bushy
  ocimum_basilicum: "herb",
  mentha: "herb",
  petroselinum: "herb",
  // Herbs needle
  rosmarinus: "herb_needle",
  thymus_vulgaris: "herb_needle",
  lavandula: "herb_needle",
  // Orchids
  phalaenopsis: "orchid",
  // Flowering
  begonia_rex: "flowering",
  strelitzia_reginae: "flowering",
  // Palm / Dracaena / Yucca
  dracaena_marginata: "palm",
  dracaena_fragrans: "palm",
  yucca_elephantipes: "palm",
  schefflera: "palm",
  // Calathea / patterned
  calathea_orbifolia: "calathea",
  maranta_leuconeura: "calathea",
  calathea_lancifolia: "calathea",
  ctenanthe_oppenheimiana: "calathea",
  // Philodendron (big tropical)
  philodendron_hederaceum: "monstera",
  philodendron_birkin: "calathea",
  alocasia: "monstera",
  // Air plant
  tillandsia: "air_plant",
  // Trailing succulent
  senecio_rowleyanus: "trailing_succulent",
  sedum_morganianum: "trailing_succulent",
  // Pilea
  pilea_peperomioides: "default",
  peperomia_obtusifolia: "default",
};

function getPlantIcon(plantInfo) {
  if (!plantInfo) return PLANT_ICONS.default;
  const id = plantInfo.id || "";

  // Direct map lookup
  if (PLANT_ICON_MAP[id]) return PLANT_ICONS[PLANT_ICON_MAP[id]];

  // Fallback pattern matching
  if (id.match(/kaktus|cactus|mammillaria|opuntia|euphorbia/i)) return PLANT_ICONS.cactus;
  if (id.match(/echever|haworth|crassula|sedum|kalanchoe/i)) return PLANT_ICONS.succulent;
  if (id.match(/senecio|morganian/i)) return PLANT_ICONS.trailing_succulent;
  if (id.match(/farn|fern|nephro|asplen|adiatum|asparagus/i)) return PLANT_ICONS.fern;
  if (id.match(/basil|minze|mint|petersil|ocimum|mentha/i)) return PLANT_ICONS.herb;
  if (id.match(/rosmar|thymian|lavend|salvia/i)) return PLANT_ICONS.herb_needle;
  if (id.match(/orchid|phalaen/i)) return PLANT_ICONS.orchid;
  if (id.match(/monstera|philod|alocas/i)) return PLANT_ICONS.monstera;
  if (id.match(/pothos|epipr|heder|tradesc|syngon|hoya/i)) return PLANT_ICONS.pothos;
  if (id.match(/sansev|zamio/i)) return PLANT_ICONS.snake_plant;
  if (id.match(/chloro|gruen/i)) return PLANT_ICONS.spider_plant;
  if (id.match(/spathi|anthu/i)) return PLANT_ICONS.peace_lily;
  if (id.match(/ficus.*lyra|geigen/i)) return PLANT_ICONS.fiddle_leaf;
  if (id.match(/ficus.*elastic|gummi/i)) return PLANT_ICONS.rubber_plant;
  if (id.match(/dracae|yucca|scheff|palme/i)) return PLANT_ICONS.palm;
  if (id.match(/calath|maran|ctenan/i)) return PLANT_ICONS.calathea;
  if (id.match(/aloe/i)) return PLANT_ICONS.aloe;
  if (id.match(/begon|strelitz/i)) return PLANT_ICONS.flowering;
  if (id.match(/tillands/i)) return PLANT_ICONS.air_plant;

  return PLANT_ICONS.default;
}

// Export
window.PLANT_ICONS = PLANT_ICONS;
window.getPlantIcon = getPlantIcon;
