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

## Pipeline de entrega continua (CD)

El proyecto IT Incident Hub dispone de un pipeline de entrega continua configurado en el archivo `azure-pipelines-cd.yml`, ubicado en la raíz del repositorio.

Su objetivo es recuperar el artefacto generado por el pipeline de integración continua (CI) y verificar que el paquete ZIP publicado se encuentre disponible y no presente errores de integridad.

### Activación del pipeline

El pipeline CD utiliza la siguiente configuración:

 `trigger: none`: deshabilita la ejecución automática por cambios directos en el repositorio.
 `pr: none`: deshabilita los activadores de solicitudes de integración para este pipeline.
 `resources.pipelines`: establece una dependencia con el pipeline CI denominado `IT_Incident_Hub`.
 Activación por la rama `main`: permite iniciar el pipeline CD cuando se publica una ejecución del pipeline CI asociada a dicha rama.

### Agente de ejecución

El proceso utiliza un agente hospedado por Azure DevOps con la imagen `ubuntu-latest`.

Este agente permite ejecutar los pasos de descarga y verificación del artefacto sin necesidad de configurar manualmente un equipo como agente de compilación.

### Descarga del artefacto

El pipeline descarga el artefacto denominado `incident-hub`, publicado previamente por el pipeline CI.

El archivo ZIP contiene una copia empaquetada del proyecto, incluyendo los componentes y archivos necesarios para su distribución.

### Verificación del paquete

Después de descargar el artefacto, el pipeline ejecuta un script de Bash que realiza las siguientes operaciones:

1. Busca los archivos disponibles dentro del directorio del artefacto descargado.
2. Localiza el archivo ZIP cuyo nombre comienza con `incident-hub-`.
3. Comprueba que el archivo exista.
4. Ejecuta `unzip -t` para verificar la integridad del archivo comprimido.
5. Finaliza con un error si no encuentra el paquete o si la verificación falla.

### Resultado esperado

Cuando el proceso finaliza correctamente, Azure DevOps muestra las tareas de descarga y verificación como completadas.

Esto permite comprobar que el artefacto publicado por CI puede recuperarse y que el archivo ZIP supera la verificación de integridad.

Esta implementación verifica el paquete generado, pero no incluye por sí misma la instalación de la aplicación en un servidor ni su despliegue en un entorno de producción.

### Ejecución y mantenimiento

Para revisar el funcionamiento del pipeline:

1. Acceder al proyecto IT_Incident_Hub en Azure DevOps.
2. Entrar en Pipelines.
3. Seleccionar el pipeline de entrega continua.
4. Abrir una ejecución reciente.
5. Comprobar el resultado de la etapa `Continuous Delivery`.
6. Revisar el paso `Download and verify CI artifact`.
7. Confirmar que la descarga y la verificación del archivo ZIP finalicen correctamente.

Si ocurre un error, se deben revisar los registros de ejecución para identificar si el problema corresponde a la descarga, a la ubicación del artefacto o a la integridad del archivo.

### Evidencias

Se deben conservar capturas de las ejecuciones reales que demuestren:

La finalización correcta del pipeline CD.
La descarga del artefacto `incident-hub`.
La ejecución del script de verificación.
El mensaje de finalización sin errores de integridad.
La publicación del artefacto en el pipeline CI.

Estas evidencias permiten documentar el funcionamiento del proceso de integración y entrega continua del proyecto IT Incident Hub.