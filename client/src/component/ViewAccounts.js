import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { selectAccounts, selectUser, user as userState } from '../app/userSlice'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    const root = "https://quick-balance-9d1e.onrender.com";

    if(accounts){

        const deleteAccount = async (id) =>{
            const response = await fetch(`${root}/delete-account?id=${user.userId}&password=${user.password}`, {
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
                <div className='flex home-container center-v wrap top-pad-50'>
                <div className='flex center-v wrap'>
                    <Link to='/transactions'><button className='button'>View transactions</button></Link>
                    <Link to='/add-transaction'><button className='button'>Add transactions</button></Link>
                </div>
                <div className='flex center-v wrap'>
                    <Link to='/add-account'><button className='button'>Add account</button></Link>
                </div>
                </div>
            </div>
          )
    }else{
        return;
    }
  
}

export default ViewAccounts