export class AppointmentModel {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('appointments');
    }

    async getAll() {
        try {
            const snapshot = await this.collection.orderBy('date', 'desc').get();
            const appointments = [];
            snapshot.forEach(doc => appointments.push({ id: doc.id, ...doc.data() }));
            return appointments;
        } catch (error) {
            console.warn("Ordered query failed, falling back to basic query:", error);
            const snapshot = await this.collection.get();
            const appointments = [];
            snapshot.forEach(doc => appointments.push({ id: doc.id, ...doc.data() }));
            appointments.sort((a, b) => {
                const dateA = a.date ? (a.date.toDate ? a.date.toDate() : new Date(a.date)) : new Date(0);
                const dateB = b.date ? (b.date.toDate ? b.date.toDate() : new Date(b.date)) : new Date(0);
                return dateB - dateA;
            });
            return appointments;
        }
    }

    async getRecent(limit = 25) {
        try {
            const snapshot = await this.collection.orderBy('date', 'desc').limit(limit).get();
            const appointments = [];
            snapshot.forEach(doc => appointments.push({ id: doc.id, ...doc.data() }));
            return appointments;
        } catch (error) {
            console.warn("Ordered query failed (possible SDK/Index bug), falling back to basic query:", error);
            const snapshot = await this.collection.limit(limit).get();
            const appointments = [];
            snapshot.forEach(doc => appointments.push({ id: doc.id, ...doc.data() }));
            
            // Manually sort in memory
            appointments.sort((a, b) => {
                const dateA = a.date ? (a.date.toDate ? a.date.toDate() : new Date(a.date)) : new Date(0);
                const dateB = b.date ? (b.date.toDate ? b.date.toDate() : new Date(b.date)) : new Date(0);
                return dateB - dateA;
            });
            return appointments;
        }
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
