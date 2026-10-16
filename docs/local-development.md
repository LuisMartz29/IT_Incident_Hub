# Ejecución local sin Docker

## Backend
Desde la raíz del proyecto:
```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Sin `DATABASE_URL`, la API usa SQLite local para facilitar la primera prueba.

## Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
Abre `http://localhost:5173`. La API se espera en `http://localhost:8000`.

## Pruebas backend
```bash
cd backend
pytest -q
```
Si el puerto 8000 ya está ocupado, detén el proceso anterior o cambia el puerto. Para usar PostgreSQL en local, define `DATABASE_URL` antes de arrancar la API.
