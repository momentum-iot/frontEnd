export class AuthRepository {
    async register(userData) {
        throw new Error("Method not implemented");
    }

    async login(email, password) {
        throw new Error("Method not implemented");
    }

    async logout(refreshToken) {
        throw new Error("Method not implemented");
    }

    async refresh(refreshToken) {
        throw new Error("Method not implemented");
    }

    async getCurrentUser() {
        return null;
    }

    async getAllUsers() {
        return null;
    }

    async getUserById(id) {
        return null;
    }
}
