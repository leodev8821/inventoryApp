// generate-structure.js
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Definir la estructura de directorios y archivos
const structure = {
  'inventoryApp': {
    'clientv2': {
      'public': ['Book.js'],
      'scr': ['bookController.js'],
      '.env': '# Variables de entorno del cliente',
      '.gitignore': '# Archivos ignorados por Git',
      'eslint.config.js': '# Configuración de ESLint para Vite',
      'index.html': '# Página principal de la aplicación',
      'package.json': '# Dependencias del cliente',
      'vite.config.js': '# Configuración de Vite',
    },
    'server': {
      'models': ['Book.js'],
      'controllers': ['bookController.js'],
      'routes': ['bookRoutes.js'],
      'server.js': '// Server configuration'
    },
    'README.md': '# Project Documentation\n',
    '.env': 'PORT=3000\nDB_URI=mongodb://localhost:27017/inventory'
  }
};

// Función recursiva para crear la estructura
function createStructure(basePath, structure) {
  Object.entries(structure).forEach(([name, content]) => {
    const currentPath = join(basePath, name);
    
    if (Array.isArray(content)) {
      // Crear archivos dentro del directorio
      content.forEach(file => {
        const filePath = join(currentPath, file);
        writeFileSync(filePath, '');
      });
    } else if (typeof content === 'string') {
      // Crear archivo con contenido
      writeFileSync(currentPath, content);
    } else {
      // Crear directorio y contenido
      mkdirSync(currentPath, { recursive: true });
      createStructure(currentPath, content);
    }
  });
}

// Ejecutar
createStructure(process.cwd(), structure);
console.log('Estructura creada exitosamente!');