const express = require('express')
const router = express.Router()
const Expense = require('../models/expenses')


// Getting All
router.get('/', async (req, res) => {

    try{
        const expensesList = await Expense.find()
        res.json(expensesList)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    

})


// Getting One
router.get('/:id', getExpense, (req, res) => {
    res.send(res.expense)
})

// Create Many
router.post


// Creating 
router.post('/', async (req, res) => {
    let expenseList=[]
    for(i=0;i<req.body.length;i++){
        const expense = new Expense({
            description: req.body[i].description,
            amount: req.body[i].amount
        })
    
        try{
            const newExpense = await expense.save()
                // res.status(201).json(newExpense)
                expenseList[i] = newExpense
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    }
    res.status(201).json(expenseList)


})


// Updating one
router.patch('/:id', getExpense, async (req, res) => {
    if (req.body.description != null){
        res.expense.description = req.body.description
    }
    if (req.body.amount != null){
        res.expense.amount = req.body.amount
    }
    try{
        const updatedExpense = await res.expense.save()
        res.json(updatedExpense)
    }catch(err){
        res.status(400).json({message: err.message})    
    }
})

// Deleting one
router.delete('/:id', getExpense, async (req, res) => {
    try{
        await res.expense.deleteOne()
        res.json({message: "Deleted!!"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})



async function getExpense(req, res, next) {
    let expense
    try{
        expense = await Expense.findById(req.params.id)
        if (expense == null){
            return res.status(404).json({message: "Cannot Find this expense"})
        }
    }catch(err){
        return  res.status(500).json({message: "Cannot Find this expense"})
    }

    res.expense = expense
    next()
}


module.exports = router