export const USER_STATUS = {
  
  ACTIVO: 'ACTIVO',
  RETIRADO: 'RETIRADO',
  SIN_PAGAR: 'SIN_PAGAR'

};

export const CHECK_STATUS = {
  
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED'

};

export const getStatusClass = (status) => {
  switch (status) {
    case USER_STATUS.ACTIVO:
      return 'success';  // verde
    case USER_STATUS.SIN_PAGAR:
      return 'warn';     // amarillo
    case USER_STATUS.RETIRADO:
      return 'danger';   // rojo
    default:
      return '';
  }
};

export const getStatusLabel = (status) => {
  const labels = {
    ACTIVO: 'Activo',
    RETIRADO: 'Retirado',
    SIN_PAGAR: 'Sin Pagar'
  };
  return labels[status] || status || 'Desconocido';
};

export const canCheckIn = (status) => {
  return status === USER_STATUS.ACTIVO;
};

export const isActive = (status) => {
  return status === USER_STATUS.ACTIVO;
};

export const needsPayment = (status) => {
  return status === USER_STATUS.SIN_PAGAR;
};