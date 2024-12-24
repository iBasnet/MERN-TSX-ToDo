import { FaTrashCan } from "react-icons/fa6";
import { BiSolidEdit } from "react-icons/bi";
import './Display.css';
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

type Priority = "Low" | "Medium" | "High";
const apiTodoEndpoint = 'http://localhost:5172/api/todo';


export default function Display() {

    const { state, dispatch } = useContext(GlobalContext);

    const handleEdit = (id: number) => {

        try {
            // editMode: { status: false, id: undefined }
            state.editMode.status = true
            state.editMode.id = id

            const taskToEdit = state.tasks.find((task) => task.id === id);

            if (!taskToEdit) throw new Error("Failed to find tasks to edit");

            const editText = taskToEdit.text;
            const editPriority = taskToEdit.priority;

            dispatch({ type: 'SET_TEXT', payload: editText })
            dispatch({ type: 'SET_PRIORITY', payload: editPriority as Priority })
        }

        catch (error) {
            console.error("Error finding tasks to edit")
        }
    }

    const handleTrash = async (id: number) => {

        try {
            const response = await fetch(`${apiTodoEndpoint}/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                console.error('Response not ok')
                throw new Error('Failed to delete task')
            }

            dispatch({ type: 'DELETE_TASK', payload: { id: id } })
        }
        catch (error) {
            console.error('Error caught deleting task', error)
        }
    }

    return (
        <div className="display-section">
            {
                !state.isLoading ?
                    (
                        state.globalTasks.length > 0 ? (
                            state.globalTasks
                                .sort((a, b) => b.id - a.id)
                                .map((task) => (
                                    <div className='task-container' key={task.id}>
                                        <div className='left'>
                                            <p className='text'>{task.text}</p>
                                            <p className='time'>{task.sentAt.toLocaleTimeString().toUpperCase()} • {task.sentAt.toLocaleDateString()}</p>
                                            <p>Priority: {task.priority} ¬ Status: {task.isComplete ? 'Completed' : 'Pending'}</p>
                                            <p>{task.id}</p>
                                        </div>
                                        <div className="right">
                                            <BiSolidEdit className='icon__edit'
                                                onClick={() => handleEdit(task.id)}
                                            />
                                            <label className='checkbox__complete'>
                                                <input type="checkbox" name="valid" aria-invalid="false" checked={task.isComplete}
                                                    onChange={() => (dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: task.id } }))}
                                                />
                                            </label>
                                            <FaTrashCan className='icon__trash'
                                                onClick={() => handleTrash(task.id)}
                                            />
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className='no-tasks'>No Tasks Available</p>
                        )
                    ) : (
                        <p>Loading...</p>
                    )
            }
        </div>
    )
}