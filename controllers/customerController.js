const Customer = require('../models/Customer')
const customerCtrl = {}

customerCtrl.create = async(req,res)=>{
    try{
        const body = req.body
        const customer = new Customer(body)
        await customer.save()
        res.status(201).json(customer)
    }
    catch(err){
        res.status(500).json('something went wrong')
    }
}

customerCtrl.getAll = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({ customers });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers', details: err.message });
    }
};


customerCtrl.getById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ customer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customer', details: err.message });
    }
};


customerCtrl.update = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update customer', details: err.message });
    }
};


customerCtrl.delete = async (req, res) => {
    try {
        const customerId = req.params.id;
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer', details: err.message });
    }
};

customerCtrl.filter = async (req, res) => {
    try{
        const query = {}
        const { name, email, city, state, country } = req.query;
        if(name){
            query.name = { $regex: new RegExp(name, 'i') };
        }
        if (email) {
            query.email = { $regex: new RegExp(email, 'i') };
        }
        if (city) {
            query['address.city'] = { $regex: new RegExp(city, 'i') }; 
        }
        if (state) {
            query['address.state'] = { $regex: new RegExp(state, 'i') };
        }
        if (country) {
            query['address.country'] = { $regex: new RegExp(country, 'i') };
        }
        const customers = await Customer.find(query);
        res.status(200).json({ customers });
    } catch (err) {
        res.status(500).json({ error: 'Failed to filter customers', details: err.message });
    }
}
    


module.exports = customerCtrl;