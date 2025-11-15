export class CheckOutUseCase {

    constructor(checkRepository) {
        this.checkRepository = checkRepository;

    }

    async execute() {
        try {

            const message = await this.checkRepository.checkOut();


            const isSuccess = message.includes('registrado');

            return {
                success: isSuccess,
                message: message
            };

        } catch (error) {

            console.error('[CheckOutUseCase] Error:', error);


            return {
                success: false,
                message: error.message || 'Error al hacer check-out'
            };
        }
    }

}