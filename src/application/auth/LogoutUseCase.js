import { TokenStorage } from "@/infrastructure/storage/TokenStorage";

export class LogoutUseCase {

    constructor(authRepository) {
        this.authRepository = authRepository;
    }


    async execute() {
        try {

            const refreshToken = TokenStorage.getRefreshToken();

            if (!refreshToken) {
                console.warn('[LogoutUseCase] No refresh token found, clearing local storage');
                TokenStorage.clear();
                return {
                    success: true,
                    message: 'Sesión cerrada localmente'
                };
            }

            try {
                await this.authRepository.logout(refreshToken);
            } catch (error) {

                console.warn('[LogoutUseCase] Backend logout failed, clearing local storage anyway:', error);
            }


            TokenStorage.clear();


            return {
                success: true,
                message: 'Sesión cerrada exitosamente'
            };

        } catch (error) {

            console.error('[LogoutUseCase] Unexpected error:', error);


            TokenStorage.clear();

            return {
                success: true,
                message: 'Sesión cerrada'
            };
        }
    }
}