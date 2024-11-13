import React from "react"
import { User } from "../models/user"

export interface ClassifaiContextProps {
   user:User|null
   setUser: (user:User|null) => void
}

export const ClassifaiContext = React.createContext<ClassifaiContextProps>({user: null, setUser:(u) => {}})