import { formatDate } from '../../shared/utils/formatters.js';
import { CHECK_STATUS } from '../../shared/constants/status.js';

export class Check {
    constructor(data = {}) {

        this.id = data.id ?? "";
        this.user = data.user ?? null;
        this.checkInTime = data.checkInTime ?? null;
        this.checkOutTime = data.checkOutTime ?? null;
        this.status = data.status ?? CHECK_STATUS.ENDED;

    }

    get isActive() {
        return this.status === CHECK_STATUS.ACTIVE;
    }

    get isEnded() {
        return this.status === CHECK_STATUS.ENDED;
    }

    get durationInMinutes() {
        if (!this.checkInTime) return null;

        const checkIn = new Date(this.checkInTime);
        const checkOut = this.checkOutTime ? new Date(this.checkOutTime) : new Date();

        const diffMs = checkOut.getTime() - checkIn.getTime();
        return Math.floor(diffMs / 60000);
    }

    get formattedDuration() {
        const minutes = this.durationInMinutes;
        if (minutes === null) return '—';

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    get formattedCheckIn() {
        return formatDate(this.checkInTime, true);
    }

    get formattedCheckOut() {
        if (!this.checkOutTime) return 'En el gimnasio';
        return formatDate(this.checkOutTime, true);
    }

    get userName() {
        if (!this.user) return 'Desconocido';
        return `${this.user.name || ''} ${this.user.lastName || ''}`.trim();
    }

    get userId() {
        return this.user?.id || null;
    }

    get isLongVisit() {
        const minutes = this.durationInMinutes;
        return minutes !== null && minutes > 180;
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user,
            checkInTime: this.checkInTime,
            checkOutTime: this.checkOutTime,
            status: this.status
        };
    }

    static fromBackend(data) {
        return new Check(data);
    }

    static fromBackendArray(dataArray) {
        if (!Array.isArray(dataArray)) return [];
        return dataArray.map(data => Check.fromBackend(data));
    }

    static getActiveChecks(checks) {
        return checks.filter(check => check.isActive);
    }

    static getEndedChecks(checks) {
        return checks.filter(check => check.isEnded);
    }

    static getAverageDuration(checks) {
        const endedChecks = Check.getEndedChecks(checks);
        if (endedChecks.length === 0) return 0;

        const total = endedChecks.reduce((sum, check) => {
            return sum + (check.durationInMinutes || 0);
        }, 0);

        return Math.round(total / endedChecks.length);
    }

}