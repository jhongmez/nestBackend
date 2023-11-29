
export interface JwtPayload {
   // * El id del usuario
   id: string;
   
   // * La fecha de creacion
   iat?: number;

   // * La fecha de expiracion
   exp?: number;
}