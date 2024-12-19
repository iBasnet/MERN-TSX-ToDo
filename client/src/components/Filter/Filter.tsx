import { useContext } from 'react'
import './Filter.css'
import { GlobalContext } from '../../context/GlobalContext'

export default function Filter() {

    const { dispatch } = useContext(GlobalContext);

    return (
        <div className="filter-section">
            <div role="group">
                <button
                    onClick={() => (dispatch({ type: 'SHOW_ALL' }))}
                >All</button>
                <button className="secondary"
                    onClick={() => (dispatch({ type: 'FILTER_PENDING' }))}
                >Pending</button>
                <button className="contrast"
                    onClick={() => (dispatch({ type: 'FILTER_COMPLETED' }))}
                >Completed</button>
            </div>
        </div>
    )
}
