import { useContext, useEffect } from 'react'
import Footer from './layouts/Footer';
import './index.css'
import { GlobalContext } from './context/GlobalContext';
import Header from './layouts/Header';
import Main from './layouts/Main';

export default function App() {

  const { dispatch } = useContext(GlobalContext)

  async function getTodos() {

    try {
      const response = await fetch(import.meta.env.VITE_TODO_API_ENDPOINT)

      if (!response.ok) {
        console.error('Response not ok')
      }

      const data = await response.json()
      // console.log(data)

      if (Array.isArray(data)) {
        data.forEach(datum => datum.sentAt = new Date(datum.sentAt))
      }

      // console.log(data)

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
      <Header />
      <Main />
      <Footer />
    </div>
  )
}
