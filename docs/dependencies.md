# Análisis de dependencias

## Comandos
Backend:
```bash
python -m pip install pip-audit
pip-audit -r backend/requirements.txt
```

Frontend:
```bash
cd frontend
npm audit
npm audit --audit-level=high
```

## Registro obligatorio
Por cada hallazgo registra fecha, paquete, versión, identificador/CVE si existe, severidad, entorno afectado, acción tomada, evidencia y justificación de riesgos aceptados. No afirmes que no existen vulnerabilidades sin ejecutar y conservar el resultado real.
