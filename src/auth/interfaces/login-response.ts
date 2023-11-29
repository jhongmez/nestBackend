import { User } from "../entities/user.entity";


export interface LoginResponse {
   
   // * Se exporta de la entidad
   user: User;
   token: string;

}