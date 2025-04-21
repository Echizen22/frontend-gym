export interface LoginResponse {
  dni:       string;
  nombre:    string;
  apellidos: string;
  email:     string;
  isAdmin:   boolean;
  token:     string;
}
