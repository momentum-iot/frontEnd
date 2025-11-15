import React, { useState } from 'react';
import { Modal } from '../../common/Modal/Modal.jsx';
import { Input } from '../../common/Input/Input.jsx';
import { Button } from '../../common/Button/Button.jsx';
import { authRepository } from '../../../../infrastructure/api/repositories/AuthRepositoryImpl.js';
import { RegisterUseCase } from '../../../../application/auth/RegisterUseCase.js';
import { ROLES } from '../../../../shared/constants/roles.js';
import { MEMBERSHIP_TYPES } from '../../../../shared/constants/membership.js';
import { USER_STATUS } from '../../../../shared/constants/status.js';
import "./CreateUserModal.css"

export const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const registerUseCase = new RegisterUseCase(authRepository);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    role: ROLES.USER,
    membership: MEMBERSHIP_TYPES.BASICO,
    status: USER_STATUS.ACTIVO
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {

      const userData = {
        ...formData,
        age: formData.age ? Number(formData.age) : null
      };

      const result = await registerUseCase.execute(userData);

      if (result.success) {

        alert(`Usuario ${formData.name} creado exitosamente`);


        setFormData({
          name: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          age: '',
          gender: '',
          weight: '',
          height: '',
          role: ROLES.USER,
          membership: MEMBERSHIP_TYPES.BASICO,
          status: USER_STATUS.ACTIVO
        });


        if (onSuccess) onSuccess();


        onClose();
      } else {
        setErrorMessage(result.error || 'Error al crear usuario');
      }
    } catch (error) {
      setErrorMessage('Error inesperado al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Usuario"
      maxWidth="700px"
    >

      {errorMessage && (
        <div style={{
          padding: 12,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          color: 'var(--danger)',
          marginBottom: 16,
          fontSize: 14
        }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>

        <div className="form-grid">
          <Input
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan"
            required
          />

          <Input
            label="Apellido"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Pérez"
          />
        </div>


        <div className="form-grid">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@email.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>


        <div className="form-grid">
          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="999888777"
          />

          <Input
            label="Edad"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="25"
            min="14"
            max="100"
          />
        </div>

        <div className="form-grid">
          <Input
            label="Altura"
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="170 cm"
          />

          <Input
            label="Peso"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="80 kg"
            min="10"
            max="200"
          />
        </div>

        <div>
          <label htmlFor="gender" className="input-label">
            Género
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Seleccionar...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>


        <div style={{
          padding: 16,
          background: 'rgba(132, 194, 22, 0.1)',
          border: '1px solid rgba(132, 194, 22, 0.3)',
          borderRadius: 12,
          marginTop: 8
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14 }}>
            Configuración de Cuenta
          </h4>

          <div className="form-grid">

            <div>
              <label htmlFor="role" className="input-label">
                Rol *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value={ROLES.USER}>Miembro (USER)</option>
                <option value={ROLES.ADMIN}>Administrador (ADMIN)</option>
              </select>
            </div>

            <div>
              <label htmlFor="membership" className="input-label">
                Membresía *
              </label>
              <select
                id="membership"
                name="membership"
                value={formData.membership}
                onChange={handleChange}
                required
              >
                <option value={MEMBERSHIP_TYPES.BASICO}>
                  Básico - S/ 80/mes
                </option>
                <option value={MEMBERSHIP_TYPES.PREMIUM}>
                  Premium - S/ 150/mes
                </option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="input-label">
                Estado *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value={USER_STATUS.ACTIVO}>Activo</option>
                <option value={USER_STATUS.SIN_PAGAR}>Sin Pagar</option>
                <option value={USER_STATUS.RETIRADO}>Retirado</option>
              </select>
            </div>
          </div>
        </div>


        <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
