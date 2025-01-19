"""Backend FastAPI Server with REST models."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from db_management import NotifDB, Partie_a_deuxDB, database_management, UserDB
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, text
from typing import Optional
origins = ["http://localhost:3000"]
from fastapi.middleware.cors import CORSMiddleware
     
from sqlalchemy import and_
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
        from_attributes = True

class Partie_a_deux(BaseModel):
    id: Optional[int] = None
    id_emetteur: Optional[int]
    id_receveur: Optional[int]
    score_emetteur: Optional[int]
    score_receveur: Optional[int]
    seed: Optional[int]
    class Config:
        from_attributes = True


# class DuoUser():
#     id_emetteur: int
#     id_receveur: int
#     class Config:
#         from_attributes = True


class Notif(BaseModel):   
    id: Optional[int] = None
    id_receveur: int
    id_opposant: int
    gagnant: Optional[bool]
    class Config:
        from_attributes = True

class UserScore(BaseModel):
    id: int
    scoreMax: int = 0
    
class MultiplayerScore(BaseModel):
    user_id: Optional[int] = None
    score: int

dm = database_management("base_de_donnee", recreate=False)



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

def find_notif(id: int, session: Session):
    stm = select(NotifDB).where(
        NotifDB.id == id
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
    stm = select(Partie_a_deuxDB).where(
        Partie_a_deuxDB.id == id
    )
    res = session.execute(stm) 
    found_partie = res.scalar()

    return found_partie
@app.put("/partie_a_deux_Score/{partie_id}")
def put_partieScore(partie_id : int, multiScore: MultiplayerScore):
    with Session(dm.engine) as session:
        partie = find_partie_by_id(partie_id, session)
        if(partie.score_receveur == -1 and partie.score_emetteur == -1):# si aucun des deux jiueurs n'a joué
            if (partie.id_emetteur == multiScore.user_id):
                partie.score_emetteur= multiScore.score  
                session.commit()
            elif(partie.id_receveur == multiScore.user_id):
                partie.score_receveur =multiScore.score 
                session.commit()
            else:
                raise HTTPException(status_code=404, detail="il y a un probleme sur gestiondes id receveur_emeteur .")

        else:
            if (partie.id_emetteur == multiScore.user_id and partie.score_emetteur == -1):
                print("ici")
            #createNotif(user_id,win (booleen), adversaire_id)id_receveur:int,id_opposant:int, gagnant:str 
                create_notif(multiScore.user_id,
                        partie.id_receveur,
                        partie.score_receveur<multiScore.score, 
                        session)
                print("ici")
                create_notif(partie.id_receveur,
                        multiScore.user_id,
                        partie.score_receveur>multiScore.score,
                        session)
                print("ici")
                delete_partie(partie.id, session)
                print("ici")
            elif (partie.id_receveur == multiScore.user_id and partie.score_receveur == -1):
                print("la")
            #createNotif(user_id,win (booleen), adversaire_id)
                create_notif(multiScore.user_id,
                        partie.id_emetteur, 
                        partie.score_emetteur<multiScore.score,
                        session)
                print("la")
                create_notif(partie.id_emetteur,
                        multiScore.user_id,
                        partie.score_emetteur>multiScore.score,
                        session)
                print("la")
                delete_partie(partie.id, session)
                print('fini')

        
            else:
                raise HTTPException(status_code=404, detail="il y a un probleme sur gestion notification .")
def find_notification_by_id(id: int, session: Session):
    stm = select(NotifDB).where(
        NotifDB.id == id
    )
    res = session.execute(stm) 
    found_notification = res.scalar()

    return found_notification

def delete_partie(id: int, session: Session ):
    found_partie = find_partie_by_id(id, session)
    if found_partie is None:
        raise HTTPException(status_code=404, detail="Partie not found")
    session.delete(found_partie)
    session.commit()


def create_notif(id_receveur:int,id_opposant:int, gagnant:Optional[bool], session: Session   ):
    print(id_receveur,id_opposant, gagnant )
    

    new_notification = NotifDB(
        id_receveur=id_receveur,
        id_opposant=id_opposant,
        gagnant=gagnant,
    )
    
    session.add(new_notification)
    session.commit()
    session.refresh(new_notification)
    return new_notification


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

@app.post("/parties_a_deux")
def add_partie(id_emetteur: int, id_receveur: int):
    with Session(dm.engine) as session:


        new_partie = Partie_a_deuxDB(
            id_emetteur =id_emetteur,
            id_receveur=id_receveur,
            score_emetteur=-1,
            score_receveur=-1,
            seed=random.randint(0,99999),
        )
        
        session.add(new_partie)
        session.commit()
        session.refresh(new_partie)
    return new_partie

@app.post("/notifs")
def add_notification(notification: Notif):
    with Session(dm.engine) as session:
        new_notification = NotifDB(
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
@app.delete("/Notifs/{id}")
def delete_notif(id: int):
    with Session(dm.engine) as session:
        foundNotif = find_notification_by_id(id, session)
        if foundNotif is not None:
            # Suppression de l'utilisateur
            session.delete(foundNotif)
            session.commit()
            return {"message": "foundNotif deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Notif not found")
           

# @app.delete("/Notifs/{id}")
# def delete_notif(id):
#     with Session(dm.engine) as session:
#         found_partie = find_partie_by_id(id, session)
#         if found_partie is None:
#             raise HTTPException(status_code=404, detail="Partie not found")
#         session.delete(found_partie)
#         session.commit()

####PARTIES
@app.get("/parties_a_deux")
def get_parties():
    with Session(dm.engine) as session:
        parties= session.query(Partie_a_deuxDB).all()
        print(parties)
        if not parties:  # Vérifie si la liste est vide
            raise HTTPException(status_code=404, detail="AucunePartie_a_deuxtrouvée.")
        return parties
    
@app.get("/Notifs/{id}")
def get_notifications(id: int):
    with Session(dm.engine) as session:
        # Query pour les notifications où id_opposant est égal à id
        notifications_opposant = (session.query(NotifDB, UserDB)
        .join(UserDB, NotifDB.id_receveur == UserDB.id)
        .filter(NotifDB.id_opposant == id)

        .all() )
    resultA = []
    for notif, user in notifications_opposant:
        resultA.append({
            'id': notif.id,
            'username': user.username ,
            'gagnant' : notif.gagnant # Adapte selon les attributs réels de UserDB
        })
        
   

        challengeur = (
        session.query(Partie_a_deuxDB, UserDB)
        .join(UserDB, Partie_a_deuxDB.id_receveur == UserDB.id)
        .filter(Partie_a_deuxDB.score_emetteur == -1)
        .filter(UserDB.id == id)

        .all()
    )
    result1 = []
    for partie, user in challengeur:
        result1.append({
            'partie_id': partie.id,
            'username': user.username  # Adapte selon les attributs réels de UserDB
        })

    challenger = (
        session.query(Partie_a_deuxDB, UserDB)
        .join(UserDB, Partie_a_deuxDB.id_emetteur == UserDB.id)
        .filter(Partie_a_deuxDB.score_receveur == -1)        
        .filter(UserDB.id == id)

        .all()
    )
    result2 = []
    for partie, user in challenger:
        result2.append({
            'partie_id': partie.id,
            'username': user.username  # Adapte selon les attributs réels de UserDB
        })


        challenge =  result1 + result2
        return [resultA,challenge]
@app.get("/Notifs")
def get_notifications():
    with Session(dm.engine) as session:
        notifications = session.query(NotifDB).all()
        print(notifications)
        return notifications



