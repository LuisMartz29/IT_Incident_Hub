import os
from collections import Counter
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from .database import Base, engine, get_db
from .models import Incident, IncidentComment
from .schemas import CommentCreate, CommentOut, IncidentCreate, IncidentDetail, IncidentOut, IncidentUpdate

Base.metadata.create_all(bind=engine)
app = FastAPI(title="IT Incident Hub API", version="0.1.0", description="API inicial para gestión y seguimiento de incidentes de TI.")
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in origins], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/incidents", response_model=IncidentOut, status_code=201)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    incident = Incident(**payload.model_dump())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@app.get("/incidents", response_model=list[IncidentOut])
def list_incidents(
    status: str | None = None,
    priority: str | None = None,
    category: str | None = None,
    technician: str | None = Query(default=None, description="Filtra por técnico asignado"),
    db: Session = Depends(get_db)
):
    stmt = select(Incident).order_by(Incident.created_at.desc())
    if status: stmt = stmt.where(Incident.status == status)
    if priority: stmt = stmt.where(Incident.priority == priority)
    if category: stmt = stmt.where(Incident.category.ilike(f"%{category}%"))
    if technician: stmt = stmt.where(Incident.assigned_to.ilike(f"%{technician}%"))
    return list(db.scalars(stmt).all())

@app.get("/incidents/{incident_id}", response_model=IncidentDetail)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.scalar(select(Incident).options(selectinload(Incident.comments)).where(Incident.id == incident_id))
    if not incident: raise HTTPException(status_code=404, detail="Incidente no encontrado")
    return incident

@app.patch("/incidents/{incident_id}", response_model=IncidentOut)
def update_incident(incident_id: int, payload: IncidentUpdate, db: Session = Depends(get_db)):
    incident = db.get(Incident, incident_id)
    if not incident: raise HTTPException(status_code=404, detail="Incidente no encontrado")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(incident, key, value)
    db.commit()
    db.refresh(incident)
    return incident

@app.post("/incidents/{incident_id}/comments", response_model=CommentOut, status_code=201)
def add_comment(incident_id: int, payload: CommentCreate, db: Session = Depends(get_db)):
    if not db.get(Incident, incident_id): raise HTTPException(status_code=404, detail="Incidente no encontrado")
    comment = IncidentComment(incident_id=incident_id, **payload.model_dump())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@app.get("/metrics")
def metrics(db: Session = Depends(get_db)):
    incidents = list(db.scalars(select(Incident)).all())
    return {
        "total": len(incidents),
        "abiertos": sum(i.status not in ("RESUELTO", "CERRADO") for i in incidents),
        "cerrados": sum(i.status == "CERRADO" for i in incidents),
        "criticos": sum(i.priority == "CRITICA" and i.status != "CERRADO" for i in incidents),
        "por_categoria": dict(Counter(i.category for i in incidents)),
        "por_tecnico": dict(Counter(i.assigned_to or "Sin asignar" for i in incidents))
    }
