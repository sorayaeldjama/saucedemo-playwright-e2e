import fs from 'fs';
import path from 'path';

async function globalTeardown() {
  const downloadDir = path.join(__dirname, 'downloads');
  
  // Vérifie si le dossier existe, puis le vide
  if (fs.existsSync(downloadDir)) {
    fs.rmSync(downloadDir, { recursive: true, force: true });
    console.log(' Teardown : Dossier des téléchargements nettoyé.');
  }
}

export default globalTeardown;