# Estrategia de release

## Versionado
Usar Semantic Versioning `MAJOR.MINOR.PATCH`. Durante el desarrollo inicial puede registrarse `0.1.0`; el objetivo de la asignación es culminar en `1.0.0` con una secuencia coherente y etiquetas Git reales.

## Flujo propuesto
1. Integrar cambios revisados en `main`.
2. Verificar pipeline exitoso, pruebas y auditoría.
3. Publicar artefacto de pipeline.
4. Validar el artefacto en ambiente de prueba.
5. Obtener aprobación definida para release.
6. Crear etiqueta `v1.0.0` y registrar notas de versión.
7. Registrar evidencia de versión, artefacto y validación.

## Rollback
Si falla la validación, detener la promoción y volver a la versión previamente aprobada. Documentar responsable, motivo y resultado. Configura ambientes/aprobaciones reales en Azure DevOps según las capacidades disponibles en el proyecto.
