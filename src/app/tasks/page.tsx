"use client"
import { useMutation, useQuery } from "convex/react";

import{api} from "../../../convex/_generated/api";
import { deleteTask } from "../../../convex/tasks";



const TasksPage=()=>{
 const tasks=   useQuery(api.tasks.getTasks);
 const deleteTask=useMutation(api.tasks.deleteTask);
   return <div>
    <h1>All tasks are in realtime</h1>
    {tasks?.map((task)=>(
        <div key={task._id}  className="flex gap-2">
            <span>{task.text}</span>
           <button onClick={async ()=>{
                await deleteTask({id:task._id});
            }}>Delete Task
            </button>  
</div>))}





   </div> 
};
export default TasksPage;