"""Backend FastAPI Server with REST models."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from db_management import NotificationDB, PartieDB, database_management, UserDB
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, text
from typing import Optional
origins = ["http://localhost:3000"]
from fastapi.middleware.cors import CORSMiddleware

import os
import random

def fichier_aleatoire():
    
    dossier = os.path.abspath(os.path.join(__file__, '../..', 'classifai-frontend/public/img'))
    fichiers = os.listdir(dossier)
    fichiers = [f for f in fichiers if os.path.isfile(os.path.join(dossier, f))]
    fichier_choisi = random.choice(fichiers)
    
    return {'source': fichier_choisi,  'isPanier': fichier_choisi.find('panier')!=-1}
def liste_fichier_aleatoire(seed: int):
    
    dossier = os.path.abspath(os.path.join(__file__, '../..', 'classifai-frontend/public/img'))
    fichiers = os.listdir(dossier)
    # fichiers = [f for f in fichiers if os.path.isfile(os.path.join(dossier, f))]
    random.seed(seed)
    random.shuffle(fichiers)
    # for i in range(0, len(liste_fichiers)):
    #     liste_fichiers[i] = {'source': liste_fichiers[i],  'isPanier': liste_fichiers[i].find('panier')!=-1}
    return fichiers

app = FastAPI()

app.add_middleware(
   CORSMiddleware, allow_origins=origins, allow_credentials=True,   allow_methods=["*"], allow_headers=["*"],)

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    motdepasse: str
    scoreMax: Optional[int] = 0
    class Config:
        orm_mode = True

class Partie(BaseModel):
    id: Optional[int] = None
    id_receveur: Optional[int]
    score_emetteur: Optional[int]
    score_receveur: Optional[int]
    seed: Optional[int]
    class Config:
        orm_mode = True

class Notification(BaseModel):   
    id: Optional[int] = None
    id_receveur: Optional[int]
    id_opposant: Optional[int]
    gagnant: Optional[int]

    class Config:
        orm_mode = True

class UserScore(BaseModel):
    id: int
    scoreMax: int = 0

dm = database_management("project_database", recreate=False)
dm.drop_table("notifications")


with dm.engine.connect() as conn:
    result = conn.execute(
        text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'")
    )
    tables = [row[0] for row in result]
    print("Tables existantes :", tables)

def find_user(username: str, session: Session):
    stm = select(UserDB).where(
        UserDB.username == username
    )
    res = session.execute(stm) 
    found_user = res.scalar()

    return found_user


def find_user_by_id(id: int, session: Session):
    stm = select(UserDB).where(
        UserDB.id == id
    )
    res = session.execute(stm) 
    found_user = res.scalar()

    return found_user

def find_partie_by_id(id: int, session: Session):
    stm = select(PartieDB).where(
        PartieDB.id == id
    )
    res = session.execute(stm) 
    found_partie = res.scalar()

    return found_partie

def find_notification_by_id(id: int, session: Session):
    stm = select(NotificationDB).where(
        NotificationDB.id == id
    )
    res = session.execute(stm) 
    found_notification = res.scalar()

    return found_notification

@app.get("/users/{username}")
async def get_user(username: str):
    print(type(username),1234567)
    with Session(dm.engine) as session:
        user = find_user(username=username, session=session)
        if user is None:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")
        return user



@app.get("/users")
def get_users():
    with Session(dm.engine) as session:
        users = session.query(UserDB).all()
        return users
@app.get("/podium")
def get_users():
    with Session(dm.engine) as session:
        users = session.query(UserDB).order_by(desc(UserDB.scoreMax)).all() 
    return users

@app.get("/image")
def get_image():
    image = fichier_aleatoire()
    return image
    
# @app.get("/image/{partieId}")
# def get_images(partieId):
#     seed = qqchose(partieId)
#     imageList = liste_fichier_aleatoire(seed)
#     return imageList
    


                
@app.post("/users")
def add_user(user: User):
    print(user)
    with Session(dm.engine) as session:
        found_user : UserDB|None =   None #find_user(user.username, session)
        if found_user is not None:
            return found_user
        else:

            new_user = UserDB(
                username=user.username,
                motdepasse=user.motdepasse,
                email=user.email,
                scoreMax=user.scoreMax,
                
            )
            
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
        return user

@app.post("/parties")
def add_partie(partie: Partie):
    with Session(dm.engine) as session:
        found_partie : PartieDB|None =   None #find_user(user.username, session)
        if found_partie is not None:
            return found_partie
        else:

            new_partie = PartieDB(
                id_receveur=partie.id_receveur,
                score_emetteur=partie.score_emetteur,
                score_receveur=partie.score_receveur,
                seed=partie.seed,
            )
            
            session.add(new_partie)
            session.commit()
            session.refresh(new_partie)
        return partie

@app.post("/notifications")
def add_notification(notification: Notification):
    with Session(dm.engine) as session:
        found_notification : NotificationDB|None =   None #find_user(user.username, session)
        print ('ici je print', found_notification)
        if found_notification is not None:
            return found_notification
        else:

            new_notification = NotificationDB(
                id_receveur=notification.id_receveur,
                id_opposant=notification.id_opposant,
                gagnant=notification.gagnant,
            )
            
            session.add(new_notification)
            session.commit()
            session.refresh(new_notification)
        return notification
    

@app.put("/users")
def put_user(user: User):
    with Session(dm.engine) as session:
        found_user = find_user_by_id(user.id, session)
        found_user.email = user.email
        found_user.motdepasse = user.motdepasse
        found_user.username = user.username
        session.commit()

@app.put("/userScore")
def put_user(user: UserScore):
    with Session(dm.engine) as session:
        found_user = find_user_by_id(user.id, session)
        found_user.scoreMax = user.scoreMax
        session.commit()


@app.delete("/users/{username}")
def delete_user(username):
    with Session(dm.engine) as session:
        found_user = find_user(username, session)
        if found_user is not None:
            # Suppression de l'utilisateur
            session.delete(found_user)
            session.commit()
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
@app.delete("/partie/{id}")
def delete_partie(id):
    with Session(dm.engine) as session:
        found_partie = find_partie_by_id(id, session)
        if found_partie is None:
            raise HTTPException(status_code=404, detail="Partie not found")
        
        # Suppression de la partie
        session.delete(found_partie)
        session.commit()


####PARTIES
@app.get("/parties")
def get_parties():
    with Session(dm.engine) as session:
        parties = session.query(PartieDB).all()
        print(parties)
        if not parties:  # Vérifie si la liste est vide
            raise HTTPException(status_code=404, detail="Aucune partie trouvée.")
        return parties
    
@app.get("/Notifications")
def get_notifications():
    with Session(dm.engine) as session:
        notifications = session.query(NotificationDB).all()
        print(notifications)
        if not notifications:  # Vérifie si la liste est vide
            raise HTTPException(status_code=404, detail="Aucune partie trouvée.")
        return notifications

#     @app.get("/users")
# def get_users():
#     with Session(dm.engine) as session:
#         users = session.query(UserDB).all()
#         return users


#  notification, id notif, id reception, id opposant, id winner. créer, recuperer, delete.