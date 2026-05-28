export class DoctorModel {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('doctors');
    }

    async getAll() {
        const snapshot = await this.collection.get();
        const doctors = [];
        snapshot.forEach(doc => doctors.push({ id: doc.id, ...doc.data() }));
        return doctors;
    }

    async getCount() {
        const snapshot = await this.collection.get();
        return snapshot.size;
    }

    async add(doctorData) {
        return await this.collection.add(doctorData);
    }
}
