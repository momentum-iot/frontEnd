const STORAGE_KEYS = {

    ACCESS_TOKEN: 'access_token',

    REFRESH_TOKEN: 'refresh_token',

    USER_DATA: 'user_data'

};

export class TokenStorage {

    static setAccessToken(token) {
        if (!token) {
            console.warn('Attempted to set null/undefined access token');
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        } catch (error) {
            console.error('Error saving access token:', error);
        }
    }

    static getAccessToken() {
        try {
            return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    }

    static setRefreshToken(token) {
        if (!token) {
            console.warn('Attempted to set null/undefined refresh token');
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
        } catch (error) {
            console.error('Error saving refresh token:', error);
        }
    }

    static getRefreshToken() {
        try {
            return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    }

    static setUserData(userData) {
        if (!userData) {
            console.warn('Attempted to set null/undefined user data');
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    static getUserData() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    static setAuthData(authResponse) {
        if (!authResponse) {
            console.warn('Attempted to set null/undefined auth data');
            return;
        }

        try {

            if (authResponse.accessToken) {
                this.setAccessToken(authResponse.accessToken);
            }

            if (authResponse.refreshToken) {
                this.setRefreshToken(authResponse.refreshToken);
            }

            if (authResponse.user) {
                this.setUserData(authResponse.user);
            }
        } catch (error) {
            console.error('Error saving auth data:', error);
        }
    }

    static clear() {
        try {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    static hasActiveSession() {
        const accessToken = this.getAccessToken();
        const userData = this.getUserData();
        return !!(accessToken && userData);
    }

    static isTokenExpired() {
        const token = this.getAccessToken();
        if (!token) return true;

        try {

            const payload = JSON.parse(atob(token.split('.')[1]));


            if (!payload.exp) return false;


            const now = Math.floor(Date.now() / 1000);
            return payload.exp < now;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    static getTokenInfo() {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                email: payload.sub,
                exp: payload.exp,
                iat: payload.iat,
                isExpired: this.isTokenExpired()
            };
        } catch (error) {
            console.error('Error getting token info:', error);
            return null;
        }
    }

}