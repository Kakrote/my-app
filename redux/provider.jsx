"use client"
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { store } from './store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'

const ProviderWrapper = ({children}) => {
  return (
   <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
    {children}
    <ToastContainer position="top-right" autoClose={2500} />
    </DndProvider>
    </Provider>
  )
}

export default ProviderWrapper
