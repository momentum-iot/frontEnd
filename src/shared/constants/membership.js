export const MEMBERSHIP_TYPES = {

    BASICO: 'BASICO',
    PREMIUM: 'PREMIUM'

};

export const MEMBERSHIP_PLANS = {
  BASICO: {
    name: 'Básico',
    price: 80,          
    duration: 'Mensual',
    color: '#6B7280',   
    benefits: [
      'Acceso al gimnasio',
      'Uso de máquinas básicas',
      'Casillero incluido',
      'Acceso a vestuarios'
    ]
  },
  
  PREMIUM: {
    name: 'Premium',
    price: 150,
    duration: 'Mensual',
    color: '#3B82F6', 
    benefits: [
      'Todo lo de Básico',
      'Clases grupales ilimitadas',
      'Zona de pesas completa',
      'Acceso a sauna',
      '1 sesión de entrenamiento personal/mes',
      'Bebidas energéticas incluidas'
    ]
  }
};

export const getMembershipInfo = (type) => {
  return MEMBERSHIP_PLANS[type] || {
    name: 'Desconocido',
    price: 0,
    duration: '-',
    color: '#6B7280',
    benefits: []
  };
};

export const getMembershipName = (type) => {
  return getMembershipInfo(type).name;
};

export const getMembershipPrice = (type) => {
  return getMembershipInfo(type).price;
};

export const getFormattedPrice = (type) => {
  const price = getMembershipPrice(type);
  return `S/ ${price.toFixed(2)}`;
};

export const getAllMemberships = () => {
  return Object.entries(MEMBERSHIP_PLANS).map(([key, info]) => ({
    value: key,
    label: info.name,
    price: info.price,
    color: info.color
  }));
};

export const isValidMembership = (type) => {
  return type === MEMBERSHIP_TYPES.BASICO || type === MEMBERSHIP_TYPES.PREMIUM;
};
