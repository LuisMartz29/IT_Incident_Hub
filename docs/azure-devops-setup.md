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

## Pipeline de integración continua (CI)

El proyecto IT Incident Hub utiliza Azure Pipelines para automatizar la validación del código, la ejecución de pruebas, las auditorías de dependencias y el empaquetado del sistema.

La configuración se encuentra en el archivo `azure-pipelines.yml`, ubicado en la raíz del repositorio.

### Activadores

El pipeline se ejecuta cuando se realizan cambios en la rama `main` y cuando se crean o actualizan solicitudes de integración dirigidas a dicha rama.

### Agente de ejecución

Se utiliza un agente hospedado por Azure DevOps mediante la imagen `ubuntu-latest`.

### Validación del backend

La etapa de validación configura Python 3.12 e instala las dependencias definidas en `backend/requirements.txt`.

Posteriormente, ejecuta las pruebas automatizadas mediante `pytest` sobre el directorio `backend/tests`.

También se utiliza `pip-audit` para revisar las dependencias de Python e identificar vulnerabilidades conocidas. Los errores de esta auditoría se registran sin detener obligatoriamente el pipeline.

### Validación del frontend

El pipeline configura Node.js 20 e instala las dependencias del frontend.

A continuación, ejecuta las siguientes validaciones:

- `npm run lint`: analiza el código fuente mediante las reglas de lint configuradas.
- `npm run build`: comprueba que la aplicación pueda compilarse.
- `npm audit --audit-level=high`: revisa las dependencias de npm para detectar vulnerabilidades de severidad alta o superior.

Los errores de la auditoría de npm tampoco detienen obligatoriamente la ejecución.

### Empaquetado y publicación del artefacto

Cuando la etapa de validación finaliza correctamente, comienza la etapa `Package`.

El proyecto se comprime en un archivo ZIP cuyo nombre incluye el identificador de la compilación. El archivo se publica como un artefacto de Azure Pipelines denominado `incident-hub`.

Este artefacto permite que el pipeline de entrega continua acceda al paquete generado durante la integración continua.

### Ejecución y mantenimiento

Para ejecutar el proceso, se debe actualizar el repositorio y consultar la sección Pipelines de Azure DevOps.

En cada ejecución se recomienda revisar:

1. El resultado de las pruebas automatizadas del backend.
2. El resultado del análisis y la compilación del frontend.
3. Los registros de las auditorías de dependencias.
4. La finalización de la etapa de empaquetado.
5. La publicación del artefacto `incident-hub`.

Si una validación falla, se deben revisar los registros de la ejecución, corregir el problema y volver a ejecutar el pipeline.

### Evidencias

Las capturas y los registros de Azure DevOps deben corresponder a ejecuciones reales del proyecto. Se recomienda conservar evidencia de las pruebas aprobadas, las etapas completadas y el artefacto publicado.