import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { selectAccounts, selectUser, user as userState } from '../app/userSlice'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CSS/ViewTransactions.css'
import './CSS/ViewAccount.css'
import { getTransactions } from './functions';

function ViewAccounts() {

    const user = useSelector(selectUser);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user.userId === undefined || user.loggedIn === false || user.password === undefined){
            navigate('/');
        }
    })

    const dispatch = useDispatch();
    const accounts = useSelector(selectAccounts);

    if(accounts){

        const deleteAccount = async (id) =>{
            const response = await fetch(`/delete-account?id=${user.userId}&password=${user.password}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    acId: id
                })
            });
            const data = await response.json();
            if(data.err){
                console.log(data.err)
            }else{
                dispatch(userState.actions.deleteAccount(id));
                getTransactions(user.userId, user.password)
                .then(res => {
                    if(res.err){
                        console.log(res.err);
                    }else{
                        dispatch(userState.actions.setTransactions(res));
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }

        return (
            <div id='accounts'>
                <h1>Accounts</h1>
                <div className='table'>
                    <div className='ac-row'>
                        <div className='ac-cell bold'>Name</div>
                        <div className='ac-cell bold'>Currency</div>
                        <div className='ac-cell bold'>Options</div>
                    </div>
                    {accounts.map(item => {
                        return <div className='ac-row' key={item.id}>
                            <div className='ac-cell flex center-h center-v'>{item.name}</div>
                            <div className='ac-cell flex center-h center-v'>{item.currency}</div>
                            <div className='ac-cell flex center-h center-v'>
                                <button className='button' onClick={e=>{deleteAccount(item.id)}} >Delete</button>
                            </div>

                        </div>
                    })}
                </div>
                
            </div>
          )
    }else{
        return;
    }
  
}

export default ViewAccounts