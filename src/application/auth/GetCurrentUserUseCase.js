import { User } from "@/domain/entities/User";
import { TokenStorage } from "@/infrastructure/storage/TokenStorage";

export class GetCurrentUserUserCase {

    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute() {
        try {

            if (!TokenStorage.hasActiveSession()) {
                return {
                    success: false,
                    error: 'No hay sesión activa'
                };
            }


            const userData = await this.authRepository.getCurrentUser();


            TokenStorage.setUserData(userData.toJSON());


            return {
                success: true,
                user: userData
            };

        } catch (error) {

            console.error('[GetCurrentUserUseCase] Error:', error);


            if (error.status === 401) {
                TokenStorage.clear();
                return {
                    success: false,
                    error: 'Sesión expirada'
                };
            }

            return {
                success: false,
                error: error.message || 'Error al obtener usuario'
            };
        }
    }

    getLocalUser() {
        try {
            const userData = TokenStorage.getUserData();
            if (!userData) return null;

            return User.fromBackend(userData);
        } catch (error) {
            console.error('[GetCurrentUserUseCase] Error getting local user:', error);
            return null;
        }
    }
}