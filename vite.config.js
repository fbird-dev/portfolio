import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  input: ['index.html', 'projet-01.html', 'projet-02.html', 'projet-03.html', 'projet-04.html'],
  build: {
    // Évite d’effacer un éventuel dossier de compilation préexistant.
    emptyOutDir: false,
  },
});
