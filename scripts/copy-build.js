import fs from 'fs';
import path from 'path';

// O diretório de origem do instalador temporário (fora do OneDrive)
const srcDir = 'C:\\Users\\54258672807\\AppData\\Local\\Temp\\desktop-release-builder';
const srcFile = path.join(srcDir, 'Lista de Tarefas Setup 0.0.0.exe');
// Destino no projeto
const destDir = path.resolve('./release');
const destFile = path.join(destDir, 'Lista de Tarefas Setup.exe');

console.log(`Copiando instalador final de:\n  ${srcFile}\npara:\n  ${destFile}...\n`);

try {
  // Garantir que a pasta release exista
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  // Tenta apagar arquivos anteriores de forma segura
  fs.readdirSync(destDir).forEach(file => {
    const filePath = path.join(destDir, file);
    try {
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn(`Aviso: O arquivo ${file} não pôde ser apagado (pode estar aberto no editor).`);
    }
  });

  // Copia o executável do instalador
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log('Sucesso! O Instalador oficial do aplicativo foi gerado e copiado.');
    console.log('Você pode executar o instalador em: release/Lista de Tarefas Setup.exe');
  } else {
    throw new Error(`Instalador não encontrado em ${srcFile}.`);
  }
} catch (err) {
  console.error('Erro fatal ao copiar o instalador:', err);
  process.exit(1);
}
