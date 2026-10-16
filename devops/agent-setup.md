# Guía: Azure Pipelines self-hosted agent

1. Entra a Azure DevOps y abre tu organización y proyecto.
2. Ve a **Project settings → Agent pools** (la navegación puede variar).
3. Crea o selecciona un pool privado, por ejemplo `IncidentHubPool`.
4. Selecciona **New agent**, el sistema operativo de tu equipo y descarga el paquete indicado por Azure.
5. Descomprime el paquete en una carpeta de trabajo. Sigue exactamente las instrucciones oficiales que Azure muestra para tu sistema operativo.
6. Ejecuta `config` con la URL de la organización y un PAT con el permiso mínimo necesario para registrar/administrar el agente. No guardes el PAT en el repositorio ni en capturas.
7. Registra el agente en el pool y ejecútalo. Verifica que Azure DevOps lo muestre como **Online**.
8. En `azure-pipelines.yml`, cambia `pool.name` a `IncidentHubPool` y guarda el cambio en Git.
9. Ejecuta el pipeline y comprueba que el job realmente se ejecutó en el agente autohospedado.
10. Guarda evidencia de la configuración y una ejecución real exitosa, ocultando tokens y datos sensibles.

No compartas el PAT ni lo pegues en `azure-pipelines.yml`. Para instrucciones actuales del sistema operativo, usa la documentación oficial de Microsoft Learn.
