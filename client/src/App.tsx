import { useContext, useEffect } from 'react'
import Search from './components/Search/Search';
import Filter from './components/Filter/Filter';
import Display from './components/Display/Display';
import Footer from './layouts/Footer';
import './index.css'
import { GlobalContext } from './context/GlobalContext';

const apiTodoEndpoint = 'http://localhost:5172/api/todo';

export default function App() {

  const { dispatch } = useContext(GlobalContext)

  async function getTodos() {

    try {
      const response = await fetch(apiTodoEndpoint)

      if (!response.ok) {
        console.error('Response not ok')
      }

      const data = await response.json()
      console.log(data)

      if (Array.isArray(data)) {
        data.forEach(datum => datum.sentAt = new Date(datum.sentAt))
      }

      console.log(data)

      dispatch({ type: 'SET_TODOS', payload: data })
    }
    catch (error) {
      console.error('Error caught fetching data', error)
    }
  }

  useEffect(() => {
    getTodos()
  }, []);

  return (
    <div className="App">
      <Search />
      <Filter />
      <Display />
      <Footer />
    </div>
  )
}
