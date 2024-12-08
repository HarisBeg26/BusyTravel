const config = require('../config');
const { createClient } = require('@supabase/supabase-js');
const Expense = require('../models/expenseModel');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

exports.createExpense = async (data) => {
    try {
        const { description, category, amount, trip_id } = data;
        const { data: expense, error } = await supabase
            .from('expenses')
            .insert([{ description, category, amount, trip_id }])
            .single();

        if (error) throw error;

        return expense;
    } catch (err) {
        console.error('Error in createExpense service:', err.message);
        throw err;
    }
};



exports.getExpenses = async () => {
    console.log("Fetching all expenses from Supabase"); // Debugging log

    const { error, data } = await supabase.from('expenses').select('*');

    if (error) {
        console.error("Error fetching expenses from Supabase:", error);
        throw error;
    }

    // Log raw data for debugging
    console.log("Raw expense data from Supabase:", data);

    // Map raw data to the Trip model
    return data.map(expense => new Expense(
        expense.id,
        expense.description,
        expense.category,
        expense.amount,
        expense.trip_id // Ensure this matches your database column
    ));
};


exports.getExpenseById = async (id) => {
    // Ensure id is a number
    if (isNaN(id)) throw new Error("Invalid ID: Must be a number.");

    const { error, data } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id) // Ensure 'id' matches the primary key type
        .single();

    if (error) throw error;

    return new Expense(
        data.id,
        data.description,
        data.category,
        data.amount,
        data.trip_id
    );
};


exports.updateExpense = async (id, data) => {
    const { description, category, amount } = data;

    // Prepare the updated expense object
    const updatedExpense = {
        description,
        category,
        amount
    };

    const { error, data: expense } = await supabase
        .from('expenses')
        .update(updatedExpense)
        .eq('id', id)
        .single();

    if (error) throw error;

    // Return the updated expense as a plain object
    return expense;
};

exports.deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
};
