function verifierTriCroissant(prixBruts: string[]): boolean {
  // On compare chaque prix avec le suivant
  for (let i = 0; i < prixBruts.length - 1; i++) {
    const prixActuel = parseFloat(prixBruts[i].replace('$', ''));
    const prixSuivant = parseFloat(prixBruts[i + 1].replace('$', ''));
    
    // Si un prix est plus grand que le suivant, le tri est raté !
    if (prixActuel > prixSuivant) {
      return false; 
    }
  }
  return true; // Si la boucle termine, tout est parfait
}

function verifierTriAlphabetiqueInverse(noms: string[]): boolean {
  for (let i = 0; i < noms.length - 1; i++) {
    // En JavaScript, on peut comparer des textes avec < ou >
    // "Z" est plus grand que "A". Donc pour un tri Z-A, l'actuel doit être >= au suivant.
    if (noms[i] < noms[i + 1]) {
      return false;
    }
  }
  return true;
}