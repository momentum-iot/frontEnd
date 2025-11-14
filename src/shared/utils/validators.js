// validar email

export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'El email es requerido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Email inválido' };
    }

    return { isValid: true, error: null };
};

// validar contraseña 

export const validatePassword = (password) => {
    if (!password || password.trim() === '') {
        return { isValid: false, error: 'La contraseña es requerida' };
    }

    if (password.length < 6) {
        return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    return { isValid: true, error: null };
};

// validar nombre 

export const validateName = (name) => {
    if (!name || name.trim() === '') {
        return { isValid: false, error: 'El nombre es requerido' };
    }

    const trimmed = name.trim();

    if (trimmed.length < 2) {
        return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
    }

    if (trimmed.length > 50) {
        return { isValid: false, error: 'El nombre debe tener máximo 50 caracteres' };
    }

    return { isValid: true, error: null };
};

// validar numero de telefono peruano 

export const validatePhone = (phone) => {

    if (!phone || phone.trim() === '') {
        return { isValid: false, error: "Debe ingresar un numero de telefono" };
    }


    const cleaned = phone.replace(/\D/g, '');


    if (cleaned.length !== 9) {
        return { isValid: false, error: 'El teléfono debe tener 9 dígitos' };
    }


    if (!cleaned.startsWith('9') && !cleaned.startsWith('01')) {
        return { isValid: false, error: 'Teléfono inválido' };
    }

    return { isValid: true, error: null };
};

// validar edad 

export const validateAge = (age) => {

    if (age === null || age === undefined || age === '') {
        return { isValid: false, error: 'Debe ingresar edad' };
    }

    const ageNum = Number(age);

    if (isNaN(ageNum)) {
        return { isValid: false, error: 'La edad debe ser un número' };
    }

    if (ageNum < 14) {
        return { isValid: false, error: 'Edad mínima: 14 años' };
    }

    if (ageNum > 100) {
        return { isValid: false, error: 'Edad máxima: 100 años' };
    }

    return { isValid: true, error: null };
};

// validar altura 

export const validateHeight = (height) => {

    if (height === null || height === undefined || height === '') {
        return { isValid: false, error: "Debe ingresar altura" };
    }

    const h = Number(height);

    if (isNaN(h)) {
        return { isValid: false, error: 'La altura debe ser un número' };
    }

    if (h < 100 || h > 250) {
        return { isValid: false, error: 'Altura debe estar entre 100 y 250 cm' };
    }

    return { isValid: true, error: null };
};

// validar peso 

export const validateWeight = (weight) => {

    if (weight === null || weight === undefined || weight === '') {
        return { isValid: false, error: "Debe ingresar peso" };
    }

    const w = Number(weight);

    if (isNaN(w)) {
        return { isValid: false, error: 'El peso debe ser un número' };
    }

    if (w < 30 || w > 300) {
        return { isValid: false, error: 'Peso debe estar entre 30 y 300 kg' };
    }

    return { isValid: true, error: null };
};



export const validateRegistrationForm = (formData) => {
    const errors = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error;
    }


    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
    }


    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
    }



    const ageValidation = validateAge(formData.age);
    if (!ageValidation.isValid) {
        errors.age = ageValidation.error;
    }




    const heightValidation = validateHeight(formData.height);
    if (!heightValidation.isValid) {
        errors.height = heightValidation.error;
    }


    const weightValidation = validateWeight(formData.weight);
    if (!weightValidation.isValid) {
        errors.weight = weightValidation.error;
    }


    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


