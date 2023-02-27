import React from 'react'
import { useParams, useNavigate, Link  } from 'react-router-dom'
import { selectAccounts, selectTransactions,selectUser, user as userState} from '../app/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import './CSS/AddTransaction.css';
function EditTransaction() {
    
    const user = useSelector(selectUser);
    const transactions = useSelector(selectTransactions);
    const {i} = useParams();
    const navigate = useNavigate();
    //console.log(transactions.length)

    useEffect(()=>{
        if(user.userId === undefined || user.loggedIn === false || user.password === undefined){
            navigate('/');
        }else if(transactions.length === 0){
            navigate('/home');
        }else if(i < 0 || i >= transactions.length){
            navigate('/transactions');
        }
    });

//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//
    
    const dispatch = useDispatch();

    const accounts = useSelector(selectAccounts);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [desc, setDesc] = useState('');
    const [account, setAccount] = useState('');
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const [loading, setLoading] = useState(false);
    const root = "https://quick-balance-9d1e.onrender.com";


    let transactionToEdit = [];
    if(transactions && i >= 0 && i < transactions.length){
        transactionToEdit = transactions[i];
    } 

    if(transactionToEdit){
        const edit = async (e) =>{
            e.preventDefault();
            setLoading(true);
            let acc = '';
            let curr = '';
            let accId = 0;
            console.log('account: ', account)
            accounts.forEach(item => {
                if(account){
                }else if(item.name === transactionToEdit.account && item.currency === transactionToEdit.currency){
                    accId = item.id
                }
                if(item.id == account){
                    acc = item.name;
                    curr = item.currency;
                }
            });

            const response = await fetch(`${root}/edit-transaction?id=${user.userId}&password=${user.password}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: transactionToEdit.id,
                    amount: amount ? amount : transactionToEdit.amount,
                    date: date ? date : transactionToEdit.date,
                    description: desc ? desc : transactionToEdit.desc,
                    accountId: account ? account : accId
                })
            });
            const data = await response.json();
            if(data.err){
                console.log(data.err);
                setFail(true);
                setLoading(false);
            }else{
                const payload = {
                    i: i,
                    newTransaction: {
                        id: transactionToEdit.id,
                        amount: amount ? amount : transactionToEdit.amount,
                        date: date ? date : transactionToEdit.date,
                        desc: desc ? desc : transactionToEdit.desc,
                        account: acc ? acc : transactionToEdit.account,
                        currency: curr ? curr : transactionToEdit.currency
                    }
                }
                dispatch(userState.actions.updateTransaction(payload));
                setAccount('');            
                setAmount('');
                setDesc('');
                setDate('');
                setLoading(false);
                setSuccess(true);
            }
        }
        return (
        <div>
            <div className='edit-transaction'>
                <h1>EditTransaction</h1>
                <form onSubmit={e => {edit(e)}} className='form'>
                    <label htmlFor='amount'>Amount</label>
                    <input className='input-field' type='number' id='amout' defaultValue={transactionToEdit.amount} required onChange={e => {setAmount(e.target.value); if(success){setSuccess(false)}; if(fail){setFail(false)}}}/>

                    <label htmlFor='date'>Date</label>
                    <input className='input-field' type='date' id='date' required defaultValue={transactionToEdit.date} onChange={e => {setDate(e.target.value); if(success){setSuccess(false)}; if(fail){setFail(false)}}}/>

                    <label htmlFor='desc'>Description</label>
                    <input className='input-field' type='text' id='desc' defaultValue={transactionToEdit.desc} onChange={e => {setDesc(e.target.value); if(success){setSuccess(false)}; if(fail){setFail(false)}}}/>

                    <label htmlFor='account'>Account</label>
                    <select className='input-field' name='account' id='account' required onChange={e => {setAccount(e.target.value); if(success){setSuccess(false)}; if(fail){setFail(false)}}}>
                    <option value=''>select</option>
                        {accounts.map((item, i)=> {
                            return <option key={item.id} value={item.id}>{item.name} - {item.currency}</option>
                        })}
                    </select>
                    <input className='button' type='submit' value='Edit'/>
                </form>
                <p className='success'>{success ? 'Edit successful' : ''}</p>
                <p className='fail'>{fail ? 'Avoid using an apostrophe' : ''}</p>
                {loading ? <div class="loader"></div> : ''}
            </div>

            <div className='flex home-container center-v wrap top-padding'>
                <div className='flex center-v wrap'>
                    <Link to='/transactions'><button className='button'>View transactions</button></Link>
                    <Link to='/add-transaction'><button className='button'>Add transactions</button></Link>
                </div>
                <div className='flex center-v wrap'>
                    <Link to='/accounts'><button className='button'>View accounts</button></Link>
                    <Link to='/add-account'><button className='button'>Add account</button></Link>

                </div>
            </div>
        </div>
        )
    }else{
        return (
            <div>No such transaction</div>
        )
    }
    
}

export default EditTransaction