import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const appPath = fileURLToPath(
  new URL('../frontend/src/App.jsx', import.meta.url)
);

test('El frontend contiene los componentes principales del sistema', async () => {
  const source = await readFile(appPath, 'utf8');

  assert.ok(source.includes('IT Incident Hub'), 'Debe mostrar el nombre del sistema');
  assert.ok(source.includes('Registrar incidente'), 'Debe permitir registrar incidentes');
  assert.ok(source.includes('Incidentes'), 'Debe mostrar la sección de incidentes');
  assert.ok(source.includes('/incidents'), 'Debe conectarse con la API de incidentes');
});