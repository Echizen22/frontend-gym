
enum EstadoPago {
  PENDIENTE = 'pendiente',
  APROBADO  = 'aprobado',
  RECHAZADO = 'rechazado'
}

export interface Pago {
  idUsuarioMembresia: string;
  monto: number;
  fechaPago: Date;
  metodoPago: string;
  estado: EstadoPago;
}
