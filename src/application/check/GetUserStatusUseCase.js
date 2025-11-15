export class GetUserStatusUseCase {

    constructor(checkRepository) {
        this.checkRepository = checkRepository;
    }


    async execute() {
    try {
      
      const isInside = await this.checkRepository.isUserInside();
      
      return {
        success: true,
        isInside: isInside
      };
      
    } catch (error) {
      
      console.error('[GetUserStatusUseCase] Error:', error);
      
    
      if (error.status === 401) {
        return {
          success: false,
          isInside: false,
          error: 'Usuario no autenticado'
        };
      }
      
      return {
        success: false,
        isInside: false,
        error: error.message || 'Error al verificar estado'
      };
    }
  }


}