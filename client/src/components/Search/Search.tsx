import { useContext } from 'react';
import './Search.css';
import { GlobalContext } from '../../context/GlobalContext';

type Priority = "Low" | "Medium" | "High";
const apiTodoEndpoint = 'http://localhost:5172/api/todo';

export default function Search() {

    const { state, dispatch } = useContext(GlobalContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!state.editMode.status) {
            const newTask = {
                id: new Date().getTime(),
                sentAt: new Date(),
                text: state.text,
                priority: state.priority,
                isComplete: false,
            }
            console.log('JavaScript Object')
            console.log(newTask)

            try {
                const response = await fetch(apiTodoEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTask)
                })

                console.log('JS Object Notation')
                console.log(JSON.stringify(newTask))

                if (!response.ok) {
                    console.error('Response not ok')
                    throw new Error('Failed to add new task')
                }

                const data = await response.json() // json is parsed by middleware

                if (data) {
                    data.sentAt = new Date(data.sentAt);
                } else {
                    console.error('sentAt is not available or not in a valid format');
                }

                console.log('Requested JavaScript Object')
                console.log(data)

                dispatch({ type: 'ADD_TASK', payload: data })
                dispatch({ type: 'SET_TEXT', payload: '' })
            }
            catch (error) {
                console.error('Error caught adding new task', error)
            }
        }

        if (state.editMode.status) {

            try {
                const response = await fetch(`${apiTodoEndpoint}/${state.editMode.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: state.text.trim(), // remove white spaces
                        priority: state.priority
                    })
                })

                if (!response.ok) {
                    throw new Error('Failed to update task on the server');
                }

                const updatedTask = await response.json();

                if (updatedTask) {
                    updatedTask.sentAt = new Date(updatedTask.sentAt);
                }

                dispatch({
                    type: 'UPDATE_TASK',
                    payload: { id: state.editMode.id, updates: updatedTask }
                })
                state.editMode.status = false
                state.text = ''

            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    }

    // useEffect(() => {
    //     console.log(state.tasks)
    // }, [state.tasks]);

    return (
        <div className="search-section">
            <form onSubmit={handleSubmit} autoComplete='off'>
                <fieldset role="group">
                    <input
                        name="text"
                        type="text"
                        placeholder="What's on your mind?"
                        value={state.text}
                        onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
                        spellCheck="false"
                        required
                    />
                    <select
                        value={state.priority}
                        onChange={(e) => dispatch({ type: 'SET_PRIORITY', payload: e.target.value as Priority })}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <input type="submit" value={state.editMode.status ? 'Update' : 'Deploy'} />
                </fieldset>
            </form>
        </div>
    )
}
