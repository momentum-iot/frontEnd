import { User } from "@/domain/entities/User";
import { TokenStorage } from "@/infrastructure/storage/TokenStorage";
import { validateLoginForm } from '../../shared/utils/validators.js';

export class LoginUseCase {

    constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(email, password) {
    try {
      
      const validation = validateLoginForm({ email, password });
      
      if (!validation.isValid) {
        
        const firstError = Object.values(validation.errors)[0];
        return {
          success: false,
          error: firstError
        };
      }
      
      const authResponse = await this.authRepository.login(email, password);
      

      TokenStorage.setAuthData(authResponse);
      

      const user = User.fromBackend(authResponse.user);
 

      return {
        success: true,
        user: user
      };
      
    } catch (error) {

      console.error('[LoginUseCase] Error:', error);
      
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }

}



