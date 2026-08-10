// Données réelles du tableau des capacités - scrape/SYNTHESE.md §3.
// Valeurs en kg/h. Ne jamais modifier sans validation client.
// ⚠️ Y160 et Y200 : la plaquette PDF donne des puissances différentes
// (110-132 kW et 160-200 kW) - arbitrage client en attente.
import { numberLocale, type Locale } from '../i18n/ui';

export const modeles = [
  { ref: 'S50', chambres: '3 - 5', kw: '22 - 37' },
  { ref: 'X100', chambres: '4 - 5', kw: '75' },
  { ref: 'X125', chambres: '5 - 6', kw: '90' },
  { ref: 'Y160', chambres: '5 - 6', kw: '110' },
  { ref: 'Y200', chambres: '6 - 7', kw: '160' },
  { ref: 'Z300', chambres: '7 - 9', kw: '200 - 250' },
];

// Les valeurs ne sont saisies qu'une fois : seuls les libellés portent
// une variante par langue. getApplications(locale) rend la forme plate
// que les composants consomment.
const applicationsBrutes = [
  {
    id: 'soja-sec',
    label: { fr: 'Soja à sec', en: 'Dry soybean' },
    detail: {
      fr: 'Préparation à la pression',
      en: 'Preparation for pressing',
    },
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
    label: { fr: 'Extrusion humide soja', en: 'Wet soybean extrusion' },
    detail: { fr: 'Process semi-humide', en: 'Semi-wet process' },
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
    label: { fr: 'Mélange céréales', en: 'Cereal blend' },
    detail: {
      fr: 'Traitement des matières premières',
      en: 'Raw material processing',
    },
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
    label: {
      fr: 'Petfood & poisson Ø > 5 mm',
      en: 'Pet food & fish Ø > 5 mm',
    },
    detail: {
      fr: 'Granulés flottants ou coulants',
      en: 'Floating or sinking pellets',
    },
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
    label: {
      fr: 'Petfood & poisson Ø < 5 mm',
      en: 'Pet food & fish Ø < 5 mm',
    },
    detail: { fr: 'Granulés fins', en: 'Fine pellets' },
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

export const getApplications = (locale: Locale) =>
  applicationsBrutes.map((a) => ({
    id: a.id,
    label: a.label[locale],
    detail: a.detail[locale],
    valeurs: a.valeurs,
  }));

// Échelle commune : le max de toute la gamme (Z300 extrusion humide)
export const MAX = 9000;

export const fmt = (n: number, locale: Locale) =>
  n.toLocaleString(numberLocale[locale]);

// Mention obligatoire, à reproduire partout où les valeurs apparaissent
export const disclaimer: Record<Locale, string> = {
  fr:
    'Les productions sont fournies à titre indicatif. Elles dépendent de la ' +
    'formule, des matières premières et de la granulométrie.',
  en:
    'Throughputs are given as an indication only. They depend on the ' +
    'formula, the raw materials and the particle size.',
};
