import Task from '../model/Task.js'
import {createError} from '../utils//createError.js'

export const createTask = async(req, res, next) => {
    try {
        //get data from input and also user id..
        const newTask = new Task({
            title: req.body.title,
            user: req.user.id,
            completed: req.body.completed
        })

        const savedTask = await newTask.save();

        return res.status(200).json(savedTask)
    }catch(err){
        console.log(err);
        return next(err);
    };
};


export const getAllTasks = async(req, res, next) => {
    try {
        const allTasks = await Task.find({});
        return res.status(200).json(allTasks)
    }catch(error){
        console.log(err);
        return next(err);
    };
};


export const getMyTask = async(req, res, next) => {
    try {
        const myTasks = await Task.find({user: req.user.id});
        return res.status(200).json(myTasks);
    }catch(error){
        console.log(err);
        return next(err);
    };
};

export const updateTask = async(req, res, next) => {
    try {
        const task = await Task.findById(req.params.taskId).exec();
        if(!task){
            return next(createError({status: 404, message: "No task found."}))
        };
        if(task.user.toString() !== req.user.id){
            return next(createError({status: 404, message: "It's not your task."}))
        };

        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, {
            title: req.body.title,
            completed: req.body.completed
        },{
            new: true,
        })

        return res.status(200).json(updatedTask);
    }catch(err){
        console.log(err);
        return next(err);
    }
}


export const deleteTask = async(req, res, next) => {
    try {
        // it is not req.params.id its taskId coz of the route we said: "/:taskId" from it should be the same
        const task = await Task.findById(req.params.taskId).exec();
        if(!task){
            return next(createError({status: 404, message: "No task found."}));
        };
        if(task.user.toString() !== req.user.id){
            return next(createError({status: 404, message: "It's not your task."}));
        };

        await Task.findByIdAndDelete(req.params.taskId);

        return res.status(200).json("Task deleted sucessfully.");
    }catch(err){
        console.log(err);
        return next(err);
    }
}