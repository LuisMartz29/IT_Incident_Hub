# IT Incident Hub — Starter DevOps

Aplicación inicial para registrar y dar seguimiento a incidentes de TI. Este ZIP entrega una **base funcional para comenzar**, no una entrega DevOps terminada: los PR reales, el historial de Azure Boards, el agente autohospedado, los pipelines ejecutados y el release deben configurarse y demostrarse en las cuentas del equipo.

## Stack
- Backend: Python 3.12, FastAPI, SQLAlchemy 2.x, Pydantic
- Base de datos: PostgreSQL
- Frontend: React + Vite
- Pruebas backend: pytest
- CI complementaria: GitHub Actions
- CI/CD principal: Azure Pipelines (`azure-pipelines.yml`)
- Contenedores: Docker Compose (opcional pero recomendado)

## Estructura
- `backend/`: API REST y pruebas.
- `frontend/`: interfaz web.
- `database/`: esquema de referencia.
- `tests/`: carpeta para pruebas de integración adicionales.
- `devops/`: guía para agente autohospedado.
- `docs/`: arquitectura, ramas, deuda técnica, seguridad, dependencias, release y evidencia.
- `.github/workflows/ci.yml`: workflow complementario.
- `azure-pipelines.yml`: pipeline principal.

## Requisitos
- Python 3.12+
- Node.js 20+
- Git
- Docker Desktop (recomendado para PostgreSQL)
- Cuentas en GitHub y Azure DevOps

## Inicio rápido con Docker
1. Descomprime el ZIP y abre `IT_Incident_Hub_Starter` en VS Code.
2. Copia `.env.example` a `.env` y cambia las contraseñas de ejemplo.
3. Ejecuta:
   ```bash
   docker compose up --build
   ```
4. Abre:
   - Frontend: http://localhost:5173
   - API: http://localhost:8000
   - Swagger: http://localhost:8000/docs

Si no usas Docker, consulta `docs/local-development.md`.

## Funcionalidad incluida
- Crear y listar incidentes.
- Campos de título, descripción, categoría, prioridad, usuario, fecha, estado y técnico asignado.
- Cambiar estado y asignar técnico.
- Añadir comentarios y consultar bitácora.
- Filtros por estado, prioridad, categoría y técnico.
- Endpoint de métricas para abiertos, cerrados, críticos y distribución por categoría/técnico.

## Limitaciones conocidas del starter
- Autenticación y autorización de usuarios no están implementadas.
- No está preparado para datos sensibles ni producción.
- El dashboard es básico.
- Las pruebas incluidas son iniciales; ampliar integración/E2E es parte del proyecto.
- El pipeline requiere configurar conexión de GitHub/agent pool en Azure DevOps.
- GitHub Actions puede necesitar permisos de ejecución habilitados en el repositorio.
- No se han creado PR reales, work items, ejecuciones ni un release desde este ZIP.

## Entregas de clase
El documento del proyecto pide tres repositorios, uno por semana. Conserva este ZIP como base y crea las entregas/repositorios de acuerdo con la instrucción del docente. No presentes el ZIP como evidencia de PR, Boards, pipeline o release: esas evidencias deben salir de las plataformas reales.
