/* pixel-fans.js — animated pixel-art fan stadium.
   No labels. Fans recognizable by jerseys, caps, banners, signs, scarves.

   Color palette key per fan:
     0 = transparent
     1 = skin
     2 = primary team color
     3 = secondary team color
     4 = accent (white / black)
     5 = sign/banner pole/wood
     6 = hair color
     7 = extra accent
*/
(function() {
  const container = document.getElementById('stands-section');
  if (!container) return;

  // Universal palette helper — each fan defines indices
  // Each pixel row is 16 chars wide; each fan is 22 rows tall
  // 0 = transparent, otherwise = palette index

  // ===== PAKISTAN CRICKET FAN =====
  // Holds Pakistan flag (green with white crescent + star)
  const pakFan = {
    palette: {
      1: '#f4c89a',  // skin
      2: '#01411c',  // pak green (jersey + flag)
      3: '#ffffff',  // white (flag side + crescent)
      4: '#2a1810',  // hair
      5: '#7a5a2a',  // flag pole
      6: '#f4d845',  // gold accent on jersey
      7: '#000000',  // detail
    },
    art: [
      // Row 0-2: flag waving above head (green field + white stripe + crescent/star)
      '0000522222330000',
      '0000522226330000',
      '0000522222330000',
      // Row 3-4: head (with hair)
      '0000044444400000',
      '0000414111400000',
      // Row 5-7: face + neck
      '0000111711110000',
      '0000111111110000',
      '0000011111100000',
      // Row 8-12: torso (green jersey with gold trim)
      '0002222222220000',
      '0022266266220500',
      '0022222222220500',
      '0022222222220500',
      '0022222222220500',
      // Row 13-14: arms reaching up (holding flag)
      '0022222222220500',
      '0002222222200500',
      // Row 15-17: lower torso / belt
      '0002266662200000',
      '0002222222200000',
      '0002222222200000',
      // Row 18-21: legs
      '0000220022000000',
      '0000220022000000',
      '0000110011000000',
      '0000770077000000',
    ],
    animClass: 'fan-bounce',
  };

  // ===== BLUE JAYS FAN =====
  // Blue cap + blue jersey + sign held high
  const jaysFan = {
    palette: {
      1: '#f4c89a',  // skin
      2: '#134a8e',  // jays blue
      3: '#ffffff',  // white text
      4: '#1a1714',  // detail
      5: '#7a5a2a',  // sign stick
      6: '#e8112d',  // jays red accent
      7: '#2a1810',  // dark
    },
    art: [
      // Row 0-2: sign held above — "JAYS" white on blue
      '0552222222222500',
      '0552223232225500',
      '0552222222225500',
      // Row 3-4: blue cap (curved bill)
      '0000022222200000',
      '0000222222220000',
      // Row 5-6: face
      '0000011111100000',
      '0000111111110000',
      // Row 7: chin
      '0000011111100000',
      // Row 8-12: blue jersey
      '0002222222200000',
      '0022262626220000',
      '0022222222220000',
      '0022222222220000',
      '0022226622220000',
      // Row 13-14: arms (one holding sign already shown above)
      '0022222222220000',
      '0002222222200000',
      // Row 15-17: lower torso
      '0002222222200000',
      '0002222222200000',
      '0002244442200000',
      // Row 18-21: legs (dark pants)
      '0000440044000000',
      '0000440044000000',
      '0000770077000000',
      '0000770077000000',
    ],
    animClass: 'fan-wave',
  };

  // ===== TORONTO RAPTORS FAN =====
  // Red jersey, "WE THE NORTH" banner, headband
  const raptorsFan = {
    palette: {
      1: '#f4c89a',  // skin
      2: '#ce1141',  // raptors red
      3: '#000000',  // black
      4: '#ffffff',  // white text
      5: '#7a5a2a',  // banner pole
      6: '#a1a1a4',  // silver
      7: '#2a1810',  // hair
    },
    art: [
      // Row 0-2: banner — "NORTH" red field, white text
      '5222222222222220',
      '5224424442244420',
      '5222222222222220',
      // Row 3-4: headband + head
      '0000033333300000',
      '0000077777700000',
      // Row 5-7: face
      '0000111711110000',
      '0000111111110000',
      '0000011111100000',
      // Row 8-12: red jersey
      '0002222222220000',
      '0022244244220000',
      '0022222222220000',
      '0022222222220000',
      '0022222222220000',
      // Row 13-14: arms raised
      '0022222222220000',
      '0002222222200000',
      // Row 15-17: bottom
      '0002233332200000',
      '0002233332200000',
      '0002233332200000',
      // Row 18-21: legs (dark shorts then skin)
      '0000330033000000',
      '0000330033000000',
      '0000110011000000',
      '0000770077000000',
    ],
    animClass: 'fan-bounce-2',
  };

  // ===== LIVERPOOL FAN =====
  // Red jersey + RED SCARF held up between hands + LFC sign
  const liverpoolFan = {
    palette: {
      1: '#f4c89a',  // skin
      2: '#c8102e',  // LFC red
      3: '#f6eb61',  // LFC yellow
      4: '#ffffff',  // white text
      5: '#00a398',  // accent green
      6: '#1a1714',  // dark
      7: '#2a1810',  // hair
    },
    art: [
      // Row 0-2: scarf stretched above (red w/ yellow stripes)
      '0223322332233220',
      '0222222222222220',
      '0223322332233220',
      // Row 3-4: head with hair
      '0000077777700000',
      '0000711111700000',
      // Row 5-6: face
      '0000111111110000',
      '0000011111100000',
      // Row 7-12: red jersey w/ LFC crest spot (yellow)
      '0002222222200000',
      '0022232232220000',
      '0022223322220000',
      '0022222222220000',
      '0022222222220000',
      '0022222222220000',
      // Row 13-14: arms (holding scarf already)
      '0022222222220000',
      '0002222222200000',
      // Row 15-17: shorts
      '0002266662200000',
      '0002266662200000',
      '0002266662200000',
      // Row 18-21: legs (skin)
      '0000110011000000',
      '0000110011000000',
      '0000770077000000',
      '0000770077000000',
    ],
    animClass: 'fan-wave-2',
  };

  // ===== ROGER FEDERER FAN =====
  // White outfit + RF cap + tennis racket
  const federerFan = {
    palette: {
      1: '#f4c89a',  // skin
      2: '#ffffff',  // white outfit
      3: '#1a1714',  // black (RF logo / racket strings)
      4: '#e8b923',  // gold (RF logo trim)
      5: '#7a5a2a',  // racket handle wood
      6: '#c8102e',  // swiss red accent
      7: '#2a1810',  // hair
    },
    art: [
      // Row 0-2: racket frame (oval) held overhead
      '0000033333000000',
      '0000300003000000',
      '0000303330300000',
      // Row 3-4: white cap with RF logo (4 = gold)
      '0000022222200000',
      '0000242442200000',
      // Row 5-7: face
      '0000111711110000',
      '0000111111110000',
      '0000011111100000',
      // Row 8-12: white polo with red collar accent
      '0002266622200000',
      '0022222222220000',
      '0022222422220000',
      '0022222222220000',
      '0022222222220000',
      // Row 13-14: arms (one holding racket via row 0)
      '0022222222220500',  // right arm holds racket
      '0002222222200500',
      // Row 15-17: white shorts
      '0002222222200000',
      '0002222222200000',
      '0002233332200000',
      // Row 18-21: legs (skin)
      '0000110011000000',
      '0000110011000000',
      '0000220022000000',  // shoes (white)
      '0000770077000000',
    ],
    animClass: 'fan-bounce-3',
  };

  // Build the stadium — two rows of fans (back row + front row),
  // multiple of each fan for crowd density
  const allFans = [pakFan, jaysFan, raptorsFan, liverpoolFan, federerFan];

  // Generate stands rows
  const backRow = document.createElement('div');
  backRow.className = 'stands-row';
  backRow.style.opacity = '0.65'; // back row slightly faded for depth
  backRow.style.transform = 'scale(0.85)';
  backRow.style.transformOrigin = 'bottom center';

  const midRow = document.createElement('div');
  midRow.className = 'stands-row';
  midRow.style.opacity = '0.85';
  midRow.style.transform = 'scale(0.95)';
  midRow.style.transformOrigin = 'bottom center';

  const frontRow = document.createElement('div');
  frontRow.className = 'stands-row';

  // Compose: shuffle/sequence so each row has all teams but in different orders
  const seq1 = [0, 1, 2, 3, 4, 0, 2, 4, 1, 3]; // back: 10 fans
  const seq2 = [2, 0, 4, 1, 3, 4, 0, 2, 3, 1]; // mid: 10 fans
  const seq3 = [4, 3, 0, 2, 1, 3, 0, 4];        // front: 8 fans

  seq1.forEach((i) => backRow.appendChild(buildFan(allFans[i])));
  seq2.forEach((i) => midRow.appendChild(buildFan(allFans[i])));
  seq3.forEach((i) => frontRow.appendChild(buildFan(allFans[i])));

  container.appendChild(backRow);
  container.appendChild(midRow);
  container.appendChild(frontRow);

  function buildFan(fan) {
    const wrap = document.createElement('div');
    wrap.className = 'fan-wrap ' + (fan.animClass || '');

    const canvas = document.createElement('div');
    canvas.className = 'fan-canvas';

    fan.art.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        const px = document.createElement('div');
        const idx = parseInt(row[i]);
        if (idx > 0 && fan.palette[idx]) {
          px.style.background = fan.palette[idx];
        }
        canvas.appendChild(px);
      }
    });

    wrap.appendChild(canvas);
    return wrap;
  }
})();
