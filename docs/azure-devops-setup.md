# Conectar el proyecto a Azure DevOps

1. Crea una organización y un proyecto en `https://dev.azure.com/`.
2. En Boards, crea 2 Epics, 4 Features, 8 User Stories y al menos 16 Tasks. Completa responsable, prioridad, estimación y estado.
3. Crea un repositorio GitHub y sube el proyecto. Copia su URL.
4. En Azure Pipelines, crea un pipeline desde el repositorio GitHub y selecciona el YAML existente `azure-pipelines.yml`.
5. Autoriza la conexión GitHub cuando Azure la solicite; concede únicamente los permisos necesarios.
6. Primera ejecución: el YAML utiliza un agente hospedado `ubuntu-latest` para verificar que la configuración básica funciona.
7. Después configura un self-hosted agent siguiendo `../devops/agent-setup.md`; cambia el `pool` en el YAML al nombre del pool privado y ejecuta otra vez.
8. En Azure Repos/Pipelines, configura políticas y aprobaciones disponibles para proteger `main` y el release.
9. Guarda evidencias de ejecuciones reales. No inventes IDs, PR, resultados ni capturas.
10. Para cada cambio, crea una rama y PR en GitHub y vincula el Work Item mediante `AB#ID` en la descripción/commit.

La interfaz y disponibilidad de las opciones pueden variar según la configuración y permisos de la organización. Sigue los mensajes de Azure DevOps y la documentación oficial actual.
