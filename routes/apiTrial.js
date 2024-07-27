// const express = require('express')

// const Expense = require('../models/expenses')
// const multer = require('multer');
// const csvParse = require('csv-parser');
// const stripBom = require('strip-bom-stream');   
// const fs = require('fs');
import dotenv from 'dotenv'
import express from 'express'
const router = express.Router()
import Expense from '../models/expenses.js'
import multer from 'multer'
import csvParse from 'csv-parser'
import stripBom from 'strip-bom-stream'
import fs from 'fs'


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

// Create One
router.post('/', async (req, res) => {
    const expense = new Expense({
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
        currency: req.body.currency
    })

    try {
        const newExpense = await expense.save()
        res.status(201).json({message: `${newExpense.description}: ${newExpense.amount} ${newExpense.currency}`})
    } catch (err) {
        res.status(400).json({ message: "posting one failed! HaHaHa" })
    }
})


// Creating Many
router.post('/bulk', async (req, res) => {
    let expenseList=[]
    for(i=0;i<req.body.length;i++){
        const expense = new Expense({
            description: req.body[i].description,
            amount: req.body[i].amount,
            date: req.body[i].date,
            currency: req.body[i].currency
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

// Uploading many via CSV

// Set up file upload using Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (!fs.existsSync('public')){
            fs.mkdirSync('public');
        }
        if (!fs.existsSync('public/uploads')){
            fs.mkdirSync('public/uploads');
        }
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ file.originalname) 
    }
});
const upload = multer({ 
    storage: storage, 
    
});

function validateDate(dateString){
    // const dateString = "23-10-2015"
const dateParts = dateString.split("-")
// Note: Month is 0-based, so we subtract 1 from the month value
const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
return dateObject
}
//handle upload 

router.post('/csv', upload.single('csvFile'), async (req, res) => {
    
    try {
        
        const fileBuffer = req.file.buffer;
        // const csvData = fileBuffer.toString();
        // Parse CSV data
        const results = [];
        const csvParser = csvParse({
            columns: true, 
            skip_empty_lines: true,
            bom: true
          });
    fs.createReadStream(req.file.path)
  .pipe(stripBom())
  .pipe(csvParser)
.on('data', (data) => {
    // console.log('data',data);
    // data = data.map((spend)=>{
    //     console.log(`spends`,spend)
    //     return spend;
    // })
//   console.log(Object.keys(data));
   
    results.push(data);
    
  })
  .on('end', async() => {
    let expenseList=[]
    for(let i=0;i<results.length;i++){
        const expense = new Expense({
            description: results[i].description,
            amount: results[i].amount,
            date: validateDate(results[i].date),
            currency: results[i].currency
        })
    
        try{
            const newExpense = await expense.save()
                // res.status(201).json(newExpense)
                expenseList[i] = newExpense
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    }

    res.status(201).json({results: results, message:"Successful"})
  });
    

      } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

      ;

})

// Updating one
router.patch('/:id', getExpense, async (req, res) => {
    if (req.body.description != null){
        res.expense.description = req.body.description
    }
    if (req.body.amount != null){
        res.expense.amount = req.body.amount
    }
    if (req.body.date != null){
        res.expense.date = req.body.date
    }
    if (req.body.currency != null){
        res.expense.currency = req.body.currency
    }
    try{
        const updatedExpense = await res.expense.save()
        // res.json(updatedExpense)
        res.status(201).json({message: `${updatedExpense.description}: ${updatedExpense.amount} ${updatedExpense.currency}`})
    }catch(err){
        // res.status(400).json({message: err.message})    
        res.status(400).json({message: "update failed hehehe"})    
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

// Deleting Many
router.delete('/', async (req, res) => {
    try{
        const idsToDelete = req.body.map(item => item._id); // Extract _id values
        await Expense.deleteMany({ _id: { $in: idsToDelete } });
        // await Expense.deleteMany(...req.body)
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

export default router