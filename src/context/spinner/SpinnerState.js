import React, { useReducer } from 'react';
import SpinnerReducer from './SpinnerReducer'
import SpinnerContext from './SpinnerContext'
import {SHOW_SPINNER, HIDE_SPINNER}from '../../types/types'


const SpinnerState = props => {
    const initialState = {
        spinner: null
    }

    const [ state, dispatch ] = useReducer(SpinnerReducer, initialState)
    const showSpinner = () =>{
        dispatch({
            type: SHOW_SPINNER,
            payload: true
        });
        setTimeout(()=>{
            dispatch({
                type: HIDE_SPINNER
            })
        }, 1500)
    }

    return(
        <SpinnerContext.Provider
        value={{
            spinner: state.spinner,
            showSpinner
        }}
        >
            {props.children}
        </SpinnerContext.Provider>
    )
}

export default SpinnerState











