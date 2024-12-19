// import React from 'react'
import Search from './components/Search/Search';
import Filter from './components/Filter/Filter';
import Display from './components/Display/Display';
import './index.css'
import { useState } from 'react';

export default function App() {

  const data = ["pratik", "basnet", "chhetri", "nepal"]
  const [array, setArray] = useState(data)

  setArray((prevState) => ([
    ...prevState, // spreading the previous array to add some new info
    // spread operater spreads the array into indiviudal items
    "earth"
  ]))

  // The template function (() => ()) is used for concise transformations without explicitly using a block or return.
  setArray((prevState) => ( // using parentheses
    // returns an new array which which is received by anonymous function and sets it inside the setter function
    prevState.map((item) => item.toUpperCase())
  )) // doesn't look like it's returning anything because we are using a template function

  // The block function (() => { }) explicitly defines a block of code and uses return to return the new array.
  setArray((prevState) => { // using braces
    // returns a new array which is received by anonymous function and sets it insider the setter function
    return prevState.map((item) => item.toUpperCase())
  }) // explicitly using return keyword

  return (
    <div className="App">
      <Search />
      <Filter />
      <Display />
    </div>
  )
}
