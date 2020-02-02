export default [
  { // simple bridge
    objects: [
      { type: "start", x: -800, y: 0 },
      { type: "ground", x: -400, y: 400, width: 1000, height: 20 },
      { type: "ground", x: 550, y: 400, width: 350, height: 20 },
      { type: "goal", x: 500, y: 350 },
      { type: 'text', x: 390, y: 500, text: '- Draw a line ^ -'}
    ]
  },
  { // simple bridge
    objects: [
      { type: "start", x: -800, y: 0 },
      { type: "ground", x: -400, y: 400, width: 1000, height: 20 },
      { type: "ground", x: 800, y: 400, width: 350, height: 20 },
      { type: "goal", x: 850, y: 350 },
      { type: 'text', x: 390, y: 500, text: '- Draw a line ^ -'}
    ]
  },
  { // simple bridges
    objects: [
      { type: "start", x: -800, y: 0 },
      { type: "ground", x: -400, y: 400, width: 1000, height: 20 },
      { type: "ground", x: 700, y: 400, width: 350, height: 20 },
      { type: "ground", x: 1400, y: 400, width: 350, height: 20 },
      { type: "goal", x: 1450, y: 350 },
      { type: 'text', x: 390, y: 500, text: '- Draw a line ^ -'}
    ]
  },
  { // high ground
    objects: [
      { type: "start", x: 50, y: 50 },
      { type: "ground", x: 160, y: 100, width: 300, height: 20 },
      { type: "ground", x: 650, y: 400, width: 150, height: 20 },
      { type: "goal", x: 650, y: 350 },
      { type: 'text', x: 300, y: 250, text: '- Draw a line ^ -'}
    ]
  },
  { // simple bridges
    objects: [
      { type: "start", x: -800, y: 0 },
      { type: "ground", x: -400, y: 400, width: 1000, height: 20 },
      { type: "ground", x: 700, y: 300, width: 350, height: 20 },
      { type: "ground", x: 700, y: 400, width: 20, height: 180 },
      { type: "ground", x: 1400, y: 400, width: 350, height: 20 },
      { type: "goal", x: 1450, y: 350 },
      { type: 'text', x: 390, y: 500, text: '- Draw a line ^ -'}
    ]
  },
  { // hill
    objects: [
      { type: "start", x: 50, y: 50 },
      { type: "ground", x: 160, y: 400, width: 400, height: 20 },
      { type: "ground", x: 550, y: 480, width: 400, height: 20, angle: Math.PI / 8 },
      { type: "ground", x: 930, y: 750, width: 500, height: 20, angle: Math.PI / 4 },
      { type: "ground", x: 1320, y: 1300, width: 800, height: 20, angle: Math.PI / 3 },
      { type: "ground", x: 1700, y: 1840, width: 500, height: 20, angle: Math.PI / 4 },
      { type: "ground", x: 2260, y: 2180, width: 800, height: 20, angle: Math.PI / 8 },
      { type: "ground", x: 2840, y: 2340, width: 400, height: 20 },
      { type: "ground", x: 3090, y: 2325, width: 80, height: 20, angle: -Math.PI / 8 },
      { type: "ground", x: 3150, y: 2295, width: 40, height: 20, angle: -Math.PI / 4 },
      { type: "goal", x: 4000, y: 2000 },
    ]
  },
  { // loop
    objects: [
      { type: "start", x: 350, y: 100 },
      { type: "ground", x: 450, y: 300, width: 550, height: 20, angle: Math.PI/4 },
      { type: "ground", x: 700, y: 510, width: 150, height: 20, angle: Math.PI/8 },
      { type: "ground", x: 950, y: 540, width: 450, height: 20, angle: Math.PI },
      { type: "ground", x: 1200, y: 510, width: 150, height: 20, angle: Math.PI*0.75 },
      { type: "ground", x: 1260, y: 430, width: 100, height: 20, angle: Math.PI*0.65 },
      { type: "ground", x: 1280, y: 400, width: 100, height: 20, angle: Math.PI*0.55 },
      { type: "ground", x: 1290, y: 300, width: 300, height: 20, angle: Math.PI*0.5 },
      { type: "ground", x: 1200, y: 100, width: 150, height: 20, angle: Math.PI*0.2 },
      { type: "ground", x: 1260, y: 150, width: 100, height: 20, angle: Math.PI*0.25 },
      { type: "ground", x: 1270, y: 155, width: 100, height: 20, angle: Math.PI*0.35 },
      { type: "goal", x: 650, y: 350 }
    ]
  },
  { // loop
    objects: [
      { type: "start", x: 350, y: 100 },
      { type: "ground", x: 450, y: 300, width: 550, height: 20, angle: Math.PI/4 },
      { type: "ground", x: 700, y: 510, width: 150, height: 20, angle: Math.PI/8 },
      { type: "ground", x: 950, y: 540, width: 450, height: 20, angle: Math.PI },
      { type: "ground", x: 1200, y: 510, width: 150, height: 20, angle: Math.PI*0.75 },
      { type: "ground", x: 1260, y: 430, width: 100, height: 20, angle: Math.PI*0.65 },
      { type: "ground", x: 1280, y: 400, width: 100, height: 20, angle: Math.PI*0.55 },
      { type: "ground", x: 1290, y: 300, width: 300, height: 20, angle: Math.PI*0.5 },
      { type: "ground", x: 1200, y: 100, width: 150, height: 20, angle: Math.PI*0.2 },
      { type: "ground", x: 1260, y: 150, width: 100, height: 20, angle: Math.PI*0.25 },
      { type: "ground", x: 1270, y: 155, width: 100, height: 20, angle: Math.PI*0.35 },
      { type: "goal", x: 1050, y: 250 }
    ]
  },
  { // hill with a hole
    objects: [
      { type: "start", x: 50, y: 50 },
      { type: "ground", x: 160, y: 400, width: 400, height: 20 },
      { type: "ground", x: 550, y: 480, width: 400, height: 20, angle: Math.PI / 8 },
      { type: "ground", x: 930, y: 750, width: 500, height: 20, angle: Math.PI / 4 },
      { type: "ground", x: 1320, y: 1300, width: 800, height: 20, angle: Math.PI / 3 },
      { type: "ground", x: 2260, y: 2180, width: 800, height: 20, angle: Math.PI / 8 },
      { type: "ground", x: 2840, y: 2340, width: 400, height: 20 },
      { type: "ground", x: 3090, y: 2325, width: 80, height: 20, angle: -Math.PI / 8 },
      { type: "ground", x: 3150, y: 2295, width: 40, height: 20, angle: -Math.PI / 4 },
      { type: "goal", x: 4000, y: 2200 },
    ]
  },
  { // elevator needed
    objects: [
      { type: "start", x: 50, y: 0 },
      { type: "ground", x: 160, y: 100, width: 300, height: 20 },
      { type: "ground", x: 160, y: 600, width: 100, height: 20 },
      { type: "goal", x: 160, y: 550 },
    ]
  },
];
