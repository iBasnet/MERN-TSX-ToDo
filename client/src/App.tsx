// import React from 'react'
import Search from './components/Search/Search';
import Filter from './components/Filter/Filter';
import Display from './components/Display/Display';
import './index.css'

export default function App() {

  return (
    <div className="App">
      <Search />
      <Filter />
      <Display />
    </div>
  )
}
