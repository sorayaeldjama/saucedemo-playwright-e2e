
export class SorterHelper {
  
  /**
   * Méthode privée pour nettoyer le texte du prix (Principe DRY)
   */
  private static extractPrice(priceText: string): number {
    return parseFloat(priceText.replace('$', ''));
  }

  // Retourne le tableau trié par Prix : Croissant (lohi)
  static getExpectedPricesAscending(priceTexts: string[]): string[] {
    return [...priceTexts].sort((a, b) => this.extractPrice(a) - this.extractPrice(b));
  }

  // Retourne le tableau trié par Prix : Décroissant (hilo)
  static getExpectedPricesDescending(priceTexts: string[]): string[] {
    return [...priceTexts].sort((a, b) => this.extractPrice(b) - this.extractPrice(a));
  }

  // Retourne le tableau trié par Nom : Alphabétique (az)
  static getExpectedNamesAtoZ(nameTexts: string[]): string[] {
    return [...nameTexts].sort((a, b) => a.localeCompare(b));
  }

  // Retourne le tableau trié par Nom : Alphabétique inversé (za)
  static getExpectedNamesZtoA(nameTexts: string[]): string[] {
    return [...nameTexts].sort((a, b) => b.localeCompare(a));
  }
}