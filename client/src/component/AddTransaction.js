import React from 'react';
import { selectAccounts, selectUser, user as userState} from '../app/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CSS/AddTransaction.css';
import { getTransactions } from './functions';

function AddTransaction() {

    const user = useSelector(selectUser);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user.userId === undefined || user.loggedIn === false || user.password === undefined){
            navigate('/');
        }
    })
    const dispatch = useDispatch();
    const accounts = useSelector(selectAccounts);

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [desc, setDesc] = useState('');
    const [account, setAccount] = useState('');
    const [success, setSuccess] = useState(false);

    const addTransaction = async (e) =>{
        e.preventDefault();
        const response = await fetch(`/add-transaction?id=${user.userId}&password=${user.password}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                amount: amount,
                date: date,
                description: desc,
                accountId: account
            })
        });
        const data = await response.json();
        if(data.err){
            console.log(data.err);
        }else{
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
            setAccount('');            
            setAmount('');
            setDesc('');
            setDate('');
            setSuccess(true);
        }
    }

    if(accounts.length === 0){
        return(
        <div>
            <h1>Please add an account first</h1>
            <Link to='/add-account'><button>Add account</button></Link>
        </div>
        )
    }
    return (
        <div className='add-transaction'>
            <h1>Add Transactions</h1>
            <form  onSubmit={e=> addTransaction(e)} className='form'>
                <label htmlFor='amount'>Amount</label>
                <input className='input-field' type='number' id='amout' value={amount} required onChange={e => {setAmount(e.target.value); if(success){setSuccess(false)}}}/>

                <label htmlFor='date'>Date</label>
                <input className='input-field' type='date' id='date' required value={date} onChange={e => {setDate(e.target.value); if(success){setSuccess(false)}}}/>

                <label htmlFor='desc'>Description</label>
                <input className='input-field' type='text' id='desc' value={desc} onChange={e => {setDesc(e.target.value); if(success){setSuccess(false)}}}/>

                <label htmlFor='account'>Account</label>
                <select className='input-field' name='account' id='account' value={account} required onChange={e => {setAccount(e.target.value); if(success){setSuccess(false)}}}>
                <option value=''>select</option>
                    {accounts.map((item, i)=> {
                        return <option key={item.id} value={item.id}>{item.name} - {item.currency}</option>
                    })}
                </select>
                <input className='button' type='submit' value='Add'/>
            </form>
            <p className='success'>{success ? 'Transaction added' :''}</p>
        </div>
    )
}

export default AddTransaction