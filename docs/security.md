# Seguridad

## Controles iniciales
- No se versiona `.env`; `.env.example` contiene solo valores de ejemplo.
- No colocar contraseñas, tokens ni PAT en código, commits, capturas o documentación.
- Configurar secretos protegidos en Azure DevOps y GitHub cuando sean necesarios.
- Revisar permisos de tokens con mínimo privilegio y rotarlos si se exponen.
- Analizar dependencias con `pip-audit` y `npm audit`.

## Limitaciones
El starter no implementa autenticación ni autorización. No debe desplegarse públicamente ni almacenar información sensible hasta implementar controles adecuados. Los reportes de auditoría deben registrar severidad, versión afectada, mitigación y decisión justificada.
