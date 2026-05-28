export class AppointmentModel {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('appointments');
    }

    async getAll() {
        const snapshot = await this.collection.orderBy('date', 'desc').get();
        const appointments = [];
        snapshot.forEach(doc => appointments.push({ id: doc.id, ...doc.data() }));
        return appointments;
    }

    async getRecent(limit = 25) {
        const snapshot = await this.collection.orderBy('date', 'desc').limit(limit).get();
        const appointments = [];
        snapshot.forEach(doc => appointments.push({ id: doc.id, ...doc.data() }));
        return appointments;
    }

    async getCount() {
        const snapshot = await this.collection.get();
        return snapshot.size;
    }

    async getRevenue() {
        const snapshot = await this.collection.get();
        let totalRevenue = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'Completed' && data.fee) {
                totalRevenue += data.fee;
            }
        });
        return totalRevenue;
    }

    async add(appointmentData) {
        return await this.collection.add(appointmentData);
    }
}
