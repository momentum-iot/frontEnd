export class GetConcurrencyUseCase {

    constructor(checkRepository) {
        this.checkRepository = checkRepository
    }

    async execute() {
    try {
      
      const count = await this.checkRepository.getConcurrency();
      
      return {
        success: true,
        count: count
      };
      
    } catch (error) {
      
      console.error('[GetConcurrencyUseCase] Error:', error);
      
      return {
        success: false,
        count: 0,
        error: error.message || 'Error al obtener aforo'
      };
    }
  }
  
  
  async checkCapacity(maxCapacity) {
    try {
      const result = await this.execute();
      
      if (!result.success) {
        return {
          isFull: false,
          count: 0,
          percentage: 0
        };
      }
      
      const percentage = Math.round((result.count / maxCapacity) * 100);
      
      return {
        isFull: result.count >= maxCapacity,
        count: result.count,
        percentage: percentage
      };
      
    } catch (error) {
      console.error('[GetConcurrencyUseCase] Error checking capacity:', error);
      return {
        isFull: false,
        count: 0,
        percentage: 0
      };
    }
  }
}