export class CheckInUseCase {

    constructor(checkRepository) {
        this.checkRepository = checkRepository;

    }

    async execute() {
        try {

            const message = await this.checkRepository.checkIn();


            const isSuccess = message.includes('registrado');


            return {
                success: isSuccess,
                message: message
            };

        } catch (error) {

            console.error('[CheckInUseCase] Error:', error);

            return {
                success: false,
                message: error.message || 'Error al hacer check-in'
            };
        }
    }

}