import { User } from "@/domain/entities/User";
import { TokenStorage } from "@/infrastructure/storage/TokenStorage";
import { MEMBERSHIP_TYPES } from "@/shared/constants/membership";
import { ROLES } from "@/shared/constants/roles";
import { USER_STATUS } from "@/shared/constants/status";
import { validateRegistrationForm } from "@/shared/utils/validators";

export class RegisterUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(userData) {
        try {

            const validation = validateRegistrationForm(userData);

            if (!validation.isValid) {

                const firstError = Object.values(validation.errors)[0];
                return {
                    success: false,
                    error: firstError
                };
            }


            const userPayload = {

                name: userData.name.trim(),
                email: userData.email.trim(),
                password: userData.password,
                lastName: userData.lastName?.trim() || null,
                phone: userData.phone?.trim() || null,
                gender: userData.gender || null,
                age: userData.age ? Number(userData.age) : 0,
                role: userData.role || ROLES.USER,
                status: userData.status || USER_STATUS.ACTIVO,
                membership: userData.membership || MEMBERSHIP_TYPES.BASICO,
                birthday: userData.birthday || null,
                emergencyContact: userData.emergencyContact?.trim() || null,
                height: userData.height ? Number(userData.height) : null,
                weight: userData.weight ? Number(userData.weight) : null
            };

            const authResponse = await this.authRepository.register(userPayload);


            TokenStorage.setAuthData(authResponse);

            const user = User.fromBackend(authResponse.user);


            return {
                success: true,
                user: user
            };

        } catch (error) {
            console.error('[RegisterUseCase] Error:', error);

            return {
                success: false,
                error: error.message || 'Error al registrar usuario'
            };
        }
    }
}