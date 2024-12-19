import { useContext } from 'react';
import './Search.css';
import { GlobalContext } from '../../context/GlobalContext';

type Priority = "Low" | "Medium" | "High";

export default function Search() {

    const { state, dispatch } = useContext(GlobalContext);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!state.editMode.status) {
            const newTask = {
                id: new Date().getTime(),
                sentAt: new Date(),
                text: state.text,
                priority: state.priority,
                isComplete: false,
            }

            dispatch({ type: 'ADD_TASK', payload: newTask })
            dispatch({ type: 'SET_TEXT', payload: '' })
        }

        if (state.editMode.status) {

            dispatch({ type: 'UPDATE_TASK', payload: { id: state.editMode.id, updates: { text: state.text, priority: state.priority } } })
            state.editMode.status = false
            state.text = ''
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
