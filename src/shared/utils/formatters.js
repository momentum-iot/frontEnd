// 13 nov 24

export const formatDate = (date, includeTime = false) => {
  if (!date) return '—';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '—';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    return d.toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '—';
  }
};

// "Hace 2 dias"

export const formatRelativeDate = (date) => {
  if (!date) return '—';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return formatDate(d);
  } catch (error) {
    return '—';
  }
};

// 10:30

export const formatTime = (time) => {
  if (!time) return '—';
  
  try {
    
    const parts = time.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  } catch (error) {
    return '—';
  }
};

// S/ 150

export const formatCurrency = (amount, includeSymbol = true) => {
  if (amount === null || amount === undefined) return '—';
  
  const formatted = Number(amount).toFixed(2);
  return includeSymbol ? `S/ ${formatted}` : formatted;
};

// JD (Juan Diaz)

export const getInitials = (firstName = '', lastName = '') => {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();
  
  const firstInitial = first.charAt(0).toUpperCase();
  const lastInitial = last.charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

// Juan Diaz (firstName + lastName)

export const formatFullName = (firstName, lastName) => {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();
  
  if (!first && !last) return 'Sin nombre';
  if (!last) return first;
  if (!first) return last;
  
  return `${first} ${last}`;
};

// "activo" -> "Activo"

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// "999 888 777"

export const formatPhone = (phone) => {
  if (!phone) return '—';
  

  const cleaned = phone.replace(/\D/g, '');
  

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3,4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  
  return phone;
};

// "hola ..."

export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// IMC

export const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  if (bmi < 18.5) category = 'Bajo peso';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Sobrepeso';
  else category = 'Obesidad';
  
  return {
    value: bmi.toFixed(1),
    category
  };
};
