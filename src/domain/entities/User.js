export class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.lastName = data.lastName || "";
        this.phone = data.phone || null;
        this.gender = data.gender || "";
        this.age = data.age || 0;
        this.email = data.email || "";
        this.role = data.role || 'USER';
        this.membership = data.membership || "BASICO";
        this.status = data.status || "ACTIVO";
        this.joinDate = data.joinDate || null;
        this.joinHour = data.joinHour || null;
        this.birthday = data.birthday || null;
        this.emergencyContact = data.emergencyContact || null;
        this.height = data.height || null;
        this.weight = data.weight || null;
        this.avatar = data.avatar || "";
        this.refreshToken = data.refreshToken || "";
    }

    get fullName() {
        return formatFullName(this.name, this.lastName);
    }

    get initials() {
        return getInitials(this.name, this.lastName);
    }

    get isAdmin() {
        return checkIsAdmin(this);
    }

    get isActive() {
        return isActive(this.status);
    }

    get canCheckIn() {
        return this.status === 'ACTIVO';
    }

    get hasCompleteProfile() {
        return !!(
            this.name &&
            this.lastName &&
            this.email &&
            this.phone &&
            this.birthday &&
            this.emergencyContact
        );
    }

    get profileCompleteness() {
        const fields = [
            this.name,
            this.lastName,
            this.email,
            this.phone,
            this.birthday,
            this.emergencyContact,
            this.height > 0 ? this.height : null,
            this.weight > 0 ? this.weight : null,
            this.gender,
            this.age > 0 ? this.age : null
        ];

        const completed = fields.filter(f => f !== null && f !== '').length;
        return Math.round((completed / fields.length) * 100);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            lastName: this.lastName,
            phone: this.phone,
            gender: this.gender,
            age: this.age,
            email: this.email,
            role: this.role,
            membership: this.membership,
            status: this.status,
            joinDate: this.joinDate,
            joinHour: this.joinHour,
            birthday: this.birthday,
            emergencyContact: this.emergencyContact,
            height: this.height,
            weight: this.weight,
            avatar: this.avatar,
            refreshToken: this.refreshToken
        };
    }

    static fromBackend(data) {
        return new User(data);
    }

    static fromBackendArray(dataArray) {
        if (!Array.isArray(dataArray)) return [];
        return dataArray.map(data => User.fromBackend(data));
    }
}