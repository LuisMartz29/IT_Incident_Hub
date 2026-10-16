# Arquitectura

## Componentes
- **Frontend:** React + Vite. Presenta formulario, tabla, filtros e indicadores.
- **Backend:** FastAPI expone la API REST y valida solicitudes con Pydantic.
- **Persistencia:** PostgreSQL en ejecución normal; SQLite se usa como base ligera para pruebas iniciales.
- **Automatización:** Azure Pipelines es la CI principal; GitHub Actions aporta una verificación complementaria.

## Flujo
Navegador → React → HTTP/JSON → FastAPI → SQLAlchemy → PostgreSQL.

## Entidades
- `incidents`: título, descripción, categoría, prioridad, reportante, técnico, estado y fecha.
- `incident_comments`: incidente relacionado, autor, comentario y fecha.

## Decisiones y límites
Se eligió este stack para mantener un proyecto pequeño y fácil de ejecutar localmente. La autenticación, autorización por rol, migraciones de esquema con Alembic, logging estructurado y despliegue productivo quedan como mejoras explícitas.
