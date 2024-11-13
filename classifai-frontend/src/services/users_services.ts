import axios from "axios"
import { User } from "../models/user"
export const createUser = async (baseAPIURL: string, userData: User) => {
   const client = axios.create({ baseURL: baseAPIURL });
   const res = await client.post('/users', userData); // Ajout des données utilisateur
   return res.data;
};

export const getUser = async (baseAPIURL: string, userId: number): Promise<User> => {
   const client = axios.create({ baseURL: baseAPIURL });
   const res = await client.get<User>(`/users/${userId}`); 
   return res.data;
};

export const delUser = async (baseAPIURL: string, userId: number) => {
   const client = axios.create({ baseURL: baseAPIURL });
   const res = await client.delete(`/users?id=${userId}`);
   return res.data;
};

export const getUsers = async (baseAPIURL: string, ): Promise<User[]> => {
   const client = axios.create({ baseURL: baseAPIURL });
   const res = await client.get<User[]>(`/users/`); 
   return res.data;
};