// 🌼 Code-A-Pookalam
// Generative Pookalam inspired by the traditional floral carpets of Kerala

const fs = require("fs");

const size = 840;
const center = size / 2;

const colors = {
  background: "#fff8e7",
  gold: "#d4a72c",
  ivory: "#fff9e6",
  marigold: "#ffb300",
  marigoldDeep: "#e87500",
  red: "#d93636",
  redDeep: "#a82020",
  rose: "#e78aa8",
  roseLight: "#f5bfd0",
  violet: "#8b5fbf",
  leaf: "#39834a",
  leafLight: "#70a95b"
};

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${size}"
     height="${size}"
     viewBox="0 0 ${size} ${size}">

  <rect width="100%" height="100%" fill="${colors.background}"/>

  <circle
    cx="${center}"
    cy="${center}"
    r="400"
    fill="#fff2c7"
  />

  <circle
    cx="${center}"
    cy="${center}"
    r="368"
    fill="none"
    stroke="${colors.gold}"
    stroke-width="3"
  />

  <circle
    cx="${center}"
    cy="${center}"
    r="361"
    fill="none"
    stroke="${colors.gold}"
    stroke-width="1"
  />
`;

// ---------------------------------------------------------
// Utility functions
// ---------------------------------------------------------

function point(cx, cy, radius, angle) {
  const radians = angle * Math.PI / 180;

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
}

function petal(cx, cy, length, width, angle, color, opacity = 1) {

  const a = angle * Math.PI / 180;

  const dx = Math.cos(a);
  const dy = Math.sin(a);

  const px = -dy;
  const py = dx;

  const tipX = cx + dx * length;
  const tipY = cy + dy * length;

  const leftX = cx + px * width;
  const leftY = cy + py * width;

  const rightX = cx - px * width;
  const rightY = cy - py * width;

  return `
    <path
      d="
        M ${cx} ${cy}
        C ${leftX} ${leftY},
          ${cx + dx * length * 0.7 + px * width * 0.4}
          ${cy + dy * length * 0.7 + py * width * 0.4},
          ${tipX} ${tipY}
        C ${cx + dx * length * 0.7 - px * width * 0.4}
          ${cy + dy * length * 0.7 - py * width * 0.4},
          ${rightX} ${rightY},
          ${cx} ${cy}
        Z"
      fill="${color}"
      opacity="${opacity}"
    />
  `;
}

function circle(cx, cy, radius, color) {
  return `
    <circle
      cx="${cx}"
      cy="${cy}"
      r="${radius}"
      fill="${color}"
    />
  `;
}

// ---------------------------------------------------------
// Flowers
// ---------------------------------------------------------

function jasmine(x, y, size) {

  let flower = "";

  for (let i = 0; i < 5; i++) {
    flower += petal(
      x, y,
      size,
      size * 0.34,
      i * 72,
      colors.ivory
    );
  }

  flower += circle(
    x, y,
    size * 0.18,
    colors.gold
  );

  return flower;
}

function marigold(x, y, size) {

  let flower = "";

  // Outer layer
  for (let i = 0; i < 10; i++) {
    flower += petal(
      x, y,
      size,
      size * 0.30,
      i * 36,
      colors.marigoldDeep
    );
  }

  // Inner layer
  for (let i = 0; i < 10; i++) {
    flower += petal(
      x, y,
      size * 0.62,
      size * 0.24,
      i * 36 + 18,
      colors.marigold
    );
  }

  flower += circle(
    x, y,
    size * 0.16,
    colors.redDeep
  );

  return flower;
}

function chethi(x, y, size) {

  let flower = "";

  for (let i = 0; i < 4; i++) {

    const angle = i * 90 + 45;

    flower += petal(
      x, y,
      size,
      size * 0.40,
      angle,
      colors.red
    );
  }

  flower += circle(
    x, y,
    size * 0.20,
    colors.gold
  );

  flower += circle(
    x, y,
    size * 0.09,
    colors.ivory
  );

  return flower;
}

function orchid(x, y, size) {

  let flower = "";

  // Rose layer
  for (let i = 0; i < 6; i++) {
    flower += petal(
      x, y,
      size,
      size * 0.42,
      i * 60 + 30,
      colors.rose,
      0.85
    );
  }

  // Violet layer
  for (let i = 0; i < 6; i++) {
    flower += petal(
      x, y,
      size * 0.92,
      size * 0.26,
      i * 60,
      colors.violet
    );
  }

  flower += circle(
    x, y,
    size * 0.15,
    colors.ivory
  );

  return flower;
}

function leaves(x, y, size, rotation = 0) {

  let flower = "";

  flower += petal(
    x, y,
    size,
    size * 0.30,
    rotation - 24,
    colors.leaf
  );

  flower += petal(
    x, y,
    size,
    size * 0.30,
    rotation + 24,
    colors.leafLight
  );

  return flower;
}

function lotus(x, y, size) {

  let flower = "";

  // Outer petals
  for (let i = 0; i < 8; i++) {
    flower += petal(
      x, y,
      size,
      size * 0.42,
      i * 45,
      colors.rose
    );
  }

  // Inner petals
  for (let i = 0; i < 8; i++) {
    flower += petal(
      x, y,
      size * 0.66,
      size * 0.34,
      i * 45 + 22.5,
      colors.roseLight
    );
  }

  flower += circle(
    x, y,
    size * 0.20,
    colors.gold
  );

  return flower;
}

// ---------------------------------------------------------
// Flower rings
// ---------------------------------------------------------

function flowerRing(radius, count, flower, flowerSize, rotation = 0) {

  let ring = "";

  for (let i = 0; i < count; i++) {

    const angle =
      i * (360 / count) + rotation;

    const position = point(
      center,
      center,
      radius,
      angle
    );

    ring += flower(
      position.x,
      position.y,
      flowerSize
    );
  }

  return ring;
}

// ---------------------------------------------------------
// Build Pookalam
// ---------------------------------------------------------

// Outer green ring
svg += flowerRing(
  326,
  48,
  leaves,
  34
);

// Orchid ring
svg += flowerRing(
  272,
  28,
  orchid,
  30,
  6
);

// Jasmine ring
svg += flowerRing(
  218,
  32,
  jasmine,
  30
);

// Chethi ring
svg += flowerRing(
  164,
  24,
  chethi,
  28,
  7
);

// Marigold ring
svg += flowerRing(
  112,
  18,
  marigold,
  28
);

// Inner leaf ring
svg += flowerRing(
  66,
  12,
  leaves,
  26,
  15
);

// Central lotus
svg += lotus(
  center,
  center,
  44
);

svg += `
</svg>
`;

// ---------------------------------------------------------
// Save the generated design
// ---------------------------------------------------------

fs.writeFileSync(
  "pookalam.svg",
  svg
);

console.log("🌼 Pookalam generated successfully!");
console.log("Created: pookalam.svg");
