class Expense {
    constructor(id, description, category, amount, trip_id) {
        this.id = id;
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.trip_id = trip_id;
    }
}

module.exports = Expense;