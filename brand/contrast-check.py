#!/usr/bin/env python3
"""Verifie les contrastes WCAG 2.1 de la palette SETREM.

    python3 brand/contrast-check.py

Toute nouvelle paire de couleurs doit passer par ici avant d'entrer dans
tokens.css. Sort en code 1 si une paire echoue.
"""

import sys

# --- Palette : doit rester synchronisee avec tokens.css --------------------

STEEL = {
    50: "#F7F9FA", 100: "#EDF1F3", 200: "#DDE3E7", 300: "#C6CFD5",
    400: "#A3B0B8", 500: "#7E8D95", 600: "#5D6B6F", 700: "#4E5B61",
    800: "#3A4449", 900: "#232B2F", 950: "#141A1D",
}
BLUE = {
    50: "#E6EFF7", 100: "#C2D8EC", 200: "#94BADC", 300: "#5E97C9",
    400: "#2E75B3", 500: "#0A5C9E", 600: "#004C91", 700: "#003F79",
    800: "#003261", 900: "#00223F",
}
TEAL = {100: "#D5F0EC", 200: "#A9E0D8", 300: "#7FD4CA", 400: "#3FB3A6",
        500: "#0F8A7E", 600: "#0A7268", 700: "#086057"}

SURFACE = STEEL[100]
CARD = "#FFFFFF"
DEEP = STEEL[950]

AA_TEXT = 4.5      # texte courant
AA_LARGE = 3.0     # texte >= 24px, ou >= 18.66px bold
AA_NONTEXT = 3.0   # composants d'interface et elements porteurs d'info


def _lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hexstr):
    h = hexstr.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def ratio(a, b):
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


FAILURES = []


def check(label, fg, bg, need):
    r = ratio(fg, bg)
    good = r >= need
    if not good:
        FAILURES.append((label, r, need))
    print(f"  [{'OK ' if good else 'NON'}] {r:5.2f}:1  (min {need})  {label}")


def section(title):
    print(f"\n{title}")
    print("  " + "-" * 56)


print("=" * 62)
print("SETREM — verification des contrastes")
print(f"surface {SURFACE}   carte {CARD}   sombre {DEEP}")
print("=" * 62)

section("TEXTE sur surface")
check("titre           steel-900", STEEL[900], SURFACE, AA_TEXT)
check("courant         steel-800", STEEL[800], SURFACE, AA_TEXT)
check("secondaire      steel-700", STEEL[700], SURFACE, AA_TEXT)
check("tertiaire       steel-600", STEEL[600], SURFACE, AA_TEXT)
check("lien            blue-600 ", BLUE[600], SURFACE, AA_TEXT)
check("accent          teal-600", TEAL[600], SURFACE, AA_TEXT)
check("accent fort     teal-700", TEAL[700], SURFACE, AA_TEXT)

section("TEXTE sur carte blanche")
check("titre           steel-900", STEEL[900], CARD, AA_TEXT)
check("secondaire      steel-700", STEEL[700], CARD, AA_TEXT)
check("tertiaire       steel-600", STEEL[600], CARD, AA_TEXT)
check("lien            blue-600 ", BLUE[600], CARD, AA_TEXT)
check("accent          teal-600", TEAL[600], CARD, AA_TEXT)

section("BOUTONS — texte blanc sur aplat")
check("primaire        blue-600 ", CARD, BLUE[600], AA_TEXT)
check("primaire hover  blue-700 ", CARD, BLUE[700], AA_TEXT)
check("accent          teal-600", CARD, TEAL[600], AA_TEXT)
check("accent hover    teal-700", CARD, TEAL[700], AA_TEXT)

section("SECTIONS SOMBRES — ponctuation seulement")
check("texte           steel-100", STEEL[100], DEEP, AA_TEXT)
check("secondaire      steel-300", STEEL[300], DEEP, AA_TEXT)
check("accent          teal-400", TEAL[400], DEEP, AA_TEXT)
check("accent          teal-300", TEAL[300], DEEP, AA_TEXT)
check("lien            blue-200 ", BLUE[200], DEEP, AA_TEXT)

section("NON TEXTUEL sur surface — bordures, icones, focus")
check("bordure champ   steel-500", STEEL[500], SURFACE, AA_NONTEXT)
check("icone           steel-600", STEEL[600], SURFACE, AA_NONTEXT)
check("focus           teal-600", TEAL[600], SURFACE, AA_NONTEXT)
check("focus           blue-600 ", BLUE[600], SURFACE, AA_NONTEXT)

section("LOGO — couleurs d'origine, non modifiables")
check("bleu  #004C91 sur surface", "#004C91", SURFACE, AA_LARGE)
check("bleu  #004C91 sur blanc  ", "#004C91", CARD, AA_LARGE)
check("gris  #78878F sur surface", "#78878F", SURFACE, AA_LARGE)
check("gris  #69797D sur surface", "#69797D", SURFACE, AA_LARGE)

print("\n" + "=" * 62)
if FAILURES:
    print(f"{len(FAILURES)} PAIRE(S) NON CONFORME(S) :")
    for label, r, need in FAILURES:
        print(f"  {label} — {r:.2f}:1, il faut {need}:1")
    print("=" * 62)
    sys.exit(1)

print("TOUTES LES PAIRES SONT CONFORMES AA")
print("=" * 62)
print("""
Rappels — volontairement hors du test automatique :

  Sur fond CLAIR, l'accent teal est toujours teal-600 (5.10:1).
  teal-100 a teal-500 sont trop clairs pour porter du texte :
  fonds teintes et aplats decoratifs uniquement.

  Sur fond SOMBRE, l'accent est teal-400 (6.87:1) ou teal-300.

  steel-400 #A3B0B8 (1.95:1) est DECORATIF UNIQUEMENT.
  Pour une bordure fonctionnelle (champ, controle) : steel-500.
""")
