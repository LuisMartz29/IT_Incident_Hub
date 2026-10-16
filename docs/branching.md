# Estrategia de ramas y revisión

- `main`: rama estable; integrar solamente cambios revisados.
- `feature/AB-<id>-descripcion`: funcionalidad nueva.
- `fix/AB-<id>-descripcion`: corrección.
- `refactor/AB-<id>-descripcion`: mejora interna.

## Flujo requerido
1. Crear o seleccionar el Work Item en Azure Boards.
2. Crear una rama desde `main`.
3. Implementar y probar el cambio.
4. Crear commits claros y vincular el ID del Work Item; por ejemplo `AB#123`.
5. Abrir Pull Request hacia `main`, describiendo problema, solución y pruebas.
6. Solicitar revisión, resolver comentarios y verificar CI.
7. Completar el PR y registrar evidencia real.

El equipo debe producir al menos seis PR reales. No se deben fabricar capturas ni marcar revisiones no realizadas.
