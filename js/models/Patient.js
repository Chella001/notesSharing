export class PatientModel {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('patients');
    }

    async getAll() {
        const snapshot = await this.collection.get();
        const patients = [];
        snapshot.forEach(doc => patients.push({ id: doc.id, ...doc.data() }));
        return patients;
    }

    async getCount() {
        const snapshot = await this.collection.get();
        return snapshot.size;
    }

    async add(patientData) {
        return await this.collection.add(patientData);
    }
}
