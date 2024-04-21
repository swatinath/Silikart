const mongoose = require('mongoose');

const studentInfo = require('../model/studentInfo.model');
const studentAcademic = require('../model/studentAcademic.model');

async function allStudentsInfo(req, res){
    try {
        let students = await studentInfo.find()
        res.status(200).json(students)
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": error.message})
    }
}

async function addStudent(req,res){
    try {
        let newStudent = await studentInfo.create(req.body)
        res.status(201).json(newStudent)
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": error.message})
    }
}

async function getStudentById(req, res){
    try {
        let { roll } = req.params
        console.log(req.params);
        let student = await studentInfo.find({rollno: roll})
        if(student.length >0){
            res.status(200).json(student)
        } else {
            res.status(404).json({"message": "Data not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": error.message})
    }
}

async function updateStudent(req, res){
    try {
        let { roll } = req.params
        let data = req.body
        let student = await studentInfo.findOneAndUpdate({rollno: roll}, data, {new: true})
        res.status(200).json(student)
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": error.message})
    }
}

async function deleteStudent(req, res){
    try {
        let { roll } = req.params
        let student = await studentInfo.findOneAndDelete({rollno: roll})
        res.status(200).json(student)
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": error.message})
    }
}

async function allDetails(req, res){
    try {
        let data = await studentInfo.aggregate([
            {
                $lookup: {
                    from: "studentacademics",
                    localField: "rollno",
                    foreignField: "rollno",
                    as: "studentacademics"
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": error.message})
    }
}

async function insertBoth(req,res){
    try {
        const {
            name,rollno,mobile,email,address,program,branch,cgpa
        } = req.body
        let newStudent = await studentInfo.create({
            name: name,
            rollno: rollno,
            mobile: mobile,
            email: email,
            address: address
        })
        let newStudentAcademic = await studentAcademic.create({
            rollno: rollno,
            program: program,
            branch: branch,
            cgpa: cgpa
        })
        res.status(201).json(newStudent)
        res.status(201).json(newStudentAcademic)
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": error.message})
    }
}


module.exports = {
    addStudent,
    allStudentsInfo,
    getStudentById,
    updateStudent,
    deleteStudent,
    allDetails,
    insertBoth
}