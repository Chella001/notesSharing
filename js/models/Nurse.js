export class NurseModel {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('nurses');
    }

    async getAll() {
        const snapshot = await this.collection.get();
        const nurses = [];
        snapshot.forEach(doc => nurses.push({ id: doc.id, ...doc.data() }));
        return nurses;
    }

    async getCount() {
        const snapshot = await this.collection.get();
        return snapshot.size;
    }

    async add(nurseData) {
        return await this.collection.add(nurseData);
    }

    async update(id, nurseData) {
        return await this.collection.doc(id).update(nurseData);
    }

    async delete(id) {
        return await this.collection.doc(id).delete();
    }
}
