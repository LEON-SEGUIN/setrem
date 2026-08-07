// Données réelles du tableau des capacités — scrape/SYNTHESE.md §3.
// Valeurs en kg/h. Ne jamais modifier sans validation client.
// ⚠️ Y160 et Y200 : la plaquette PDF donne des puissances différentes
// (110–132 kW et 160–200 kW) — arbitrage client en attente.

export const modeles = [
  { ref: 'S50', chambres: '3 – 5', kw: '22 – 37' },
  { ref: 'X100', chambres: '4 – 5', kw: '75' },
  { ref: 'X125', chambres: '5 – 6', kw: '90' },
  { ref: 'Y160', chambres: '5 – 6', kw: '110' },
  { ref: 'Y200', chambres: '6 – 7', kw: '160' },
  { ref: 'Z300', chambres: '7 – 9', kw: '200 – 250' },
];

export const applications = [
  {
    id: 'soja-sec',
    label: 'Soja à sec',
    detail: 'Préparation à la pression',
    valeurs: [
      [100, 200],
      [300, 500],
      [500, 750],
      [1000, 1400],
      [1200, 2000],
      [2500, 4000],
    ],
  },
  {
    id: 'soja-humide',
    label: 'Extrusion humide soja',
    detail: 'Process semi-humide',
    valeurs: [
      [400, 500],
      [1000, 1200],
      [1200, 1500],
      [2000, 2500],
      [3000, 4000],
      [5500, 9000],
    ],
  },
  {
    id: 'cereales',
    label: 'Mélange céréales',
    detail: 'Traitement des matières premières',
    valeurs: [
      [150, 300],
      [700, 1000],
      [1000, 1200],
      [1200, 1800],
      [2000, 4000],
      [3000, 6000],
    ],
  },
  {
    id: 'petfood-gros',
    label: 'Petfood & poisson Ø > 5 mm',
    detail: 'Granulés flottants ou coulants',
    valeurs: [
      [300, 450],
      [800, 1100],
      [1000, 1800],
      [2500, 3800],
      [3800, 5000],
      [5000, 8500],
    ],
  },
  {
    id: 'petfood-fin',
    label: 'Petfood & poisson Ø < 5 mm',
    detail: 'Granulés fins',
    valeurs: [
      [150, 300],
      [500, 800],
      [750, 1400],
      [1500, 3200],
      [2500, 3800],
      [4000, 6500],
    ],
  },
];

// Échelle commune : le max de toute la gamme (Z300 extrusion humide)
export const MAX = 9000;

export const fmt = (n: number) => n.toLocaleString('fr-FR');

// Mention obligatoire, à reproduire partout où les valeurs apparaissent
export const disclaimer =
  'Les productions sont fournies à titre indicatif. Elles dépendent de la ' +
  'formule, des matières premières et de la granulométrie.';
