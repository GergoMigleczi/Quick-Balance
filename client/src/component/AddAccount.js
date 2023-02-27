import React from 'react'
import { selectAccounts, selectUser, user as userState} from '../app/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CSS/AddAccount.css';

function AddAccount() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user.userId === undefined || user.loggedIn === false || user.password === undefined){
            navigate('/');
        }
    })
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('');
    const [exists, setExists] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const [loading, setLoading] = useState(false);

    const accounts = useSelector(selectAccounts)
    const root = "https://quick-balance-9d1e.onrender.com";

    
    const addAccount = async(e) => {
        e.preventDefault();
        setLoading(true)
        let id = 1;
        let exist = false;
        accounts.forEach(item => {
            if(item.name === name && item.currency === currency){
                exist = true;
                setExists(true);
                setLoading(false)
            }
            if(item.id === id){
                id += 1;
            }
        });

        if(!exist){
            const response = await fetch(`${root}/add-account?id=${user.userId}&password=${user.password}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: id,
                    name: name,
                    currency: currency
                })
            })
            const data = await response.json();
            if(data.err){
                console.log(data.err)
                setFail(true);
                setLoading(false)
            }else{
                //console.log(data)
                dispatch(userState.actions.addAccount(data));
                setLoading(false)
                setName('');
                setCurrency('');
                setSuccess(true);
            }
        }
    }

  return (
    <div>
        <div id='add-account'>
            <h1>Add account</h1>
            <p className='fail'>{exists ? 'Account already exists' : ''}</p>
            <form onSubmit={e => addAccount(e)} className='form'>
                <label htmlFor='name'>Name</label>
                <input className='input-field' type='text' id='name' value={name} onChange={e => {setName(e.target.value); if(success){setSuccess(false)}; if(exists){setExists(false)}; if(fail){setFail(false)}}} required max='19'/>
                <label htmlFor='currency'>Currency</label>
                <input className='input-field' type='text' id='currency' value={currency} onChange={e => {setCurrency(e.target.value); if(success){setSuccess(false)}; if(exists){setExists(false)}; if(fail){setFail(false)}}} required max='9'/>

                <input className='button' type='submit' value='Add' />
            </form>
            <p className='success'>{success ? 'Account added' :''}</p>
            <p className='fail'>{fail ? 'Failed to add account. Avoid using apostrophe' : ''}</p>
            {loading ? <div class="loader"></div> : ''}
        </div>

        <div className='flex home-container center-v wrap top-padding'>
          <div className='flex center-v wrap'>
            <Link to='/transactions'><button className='button'>View transactions</button></Link>
            <Link to='/add-transaction'><button className='button'>Add transactions</button></Link>
          </div>
          <div className='flex center-v wrap'>
            <Link to='/accounts'><button className='button'>View accounts</button></Link>
          </div>
        </div>
    </div>
    
  )
}

export default AddAccount