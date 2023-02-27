import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectTransactions, selectAccounts, selectUser, user as userState } from '../app/userSlice'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './CSS/ViewTransactions.css'

function ViewTransactions() {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(user.userId === undefined || user.loggedIn === false || user.password === undefined){
            navigate('/');
        }
    })

    const tr = useSelector(selectTransactions);
    const accounts = useSelector(selectAccounts);
    
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [selectedCurrency, setSelectedCurrency] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [filteredList, setFilteredList] = useState([]);
    const [filteredListSet, setFilteredListSet] = useState(false);
    const root = "https://quick-balance-9d1e.onrender.com";

    

    if(tr){
        let sum = 0;
    const months = ['01', '02','03','04','05','06','07','08','09','10','11','12'];
    const mnth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = [];
    tr.forEach(item => {
        if(!years.includes(item.date.substring(0,4))){
            years.push(item.date.substring(0,4));
        };
    });

    const accountsFilterList = [];
    let currencies = [];
    accounts.forEach(item => {
        if(!accountsFilterList.includes(item.name)){
            accountsFilterList.push(item.name);
        };
        if(!currencies.includes(item.currency)){
            currencies.push(item.currency);
        };
    });

    if(filteredListSet === false){
        setFilteredListSet(true);
        setFilteredList(tr);
    }
    

    const onFilter = (e, area) => {
        //console.log()
        //console.log('---------------------------------------------------')
        //console.log(e.target.value);
        let transactions = tr.map(item => item);
        if(area === 'account'){
            setSelectedAccount(e.target.value);
            if(selectedCurrency !== 'all'){
                transactions = transactions.filter(item => item.currency === selectedCurrency);
            }
            if(selectedYear !== 'all'){
                transactions = transactions.filter(item => item.date.substring(0,4) === selectedYear);
            }
            if(selectedMonth !== 'all'){
                transactions = transactions.filter(item => item.date.substring(5,7) === selectedMonth);
            }
            if(e.target.value === 'all'){
                //console.log('account unfiltered')    
            }else{
                transactions = transactions.filter(item => item.account === e.target.value)
                //console.log('account filtered')
            }
        }

        if(area === 'currency'){
            setSelectedCurrency(e.target.value);
            if(selectedAccount !== 'all'){
                transactions = transactions.filter(item => item.account === selectedAccount)
            }
            if(selectedYear !== 'all'){
                transactions = transactions.filter(item => item.date.substring(0,4) === selectedYear);
            }
            if(selectedMonth !== 'all'){
                transactions = transactions.filter(item => item.date.substring(5,7) === selectedMonth);
            }
            if(e.target.value === 'all'){
                //console.log('account unfiltered')    
            }else{
                transactions = transactions.filter(item => item.currency === e.target.value)
                //console.log('account filtered')
            }
        }

        if(area === 'year'){
            setSelectedYear(e.target.value);
            if(selectedAccount !== 'all'){
                transactions = transactions.filter(item => item.account === selectedAccount)
            }
            if(selectedCurrency !== 'all'){
                transactions = transactions.filter(item => item.currency === selectedCurrency);
            }
            if(selectedMonth !== 'all'){
                transactions = transactions.filter(item => item.date.substring(5,7) === selectedMonth);
            }
            if(e.target.value === 'all'){
                //console.log('year unfiltered')
            }else{
                transactions = transactions.filter(item => item.date.substring(0,4) === e.target.value);
                //console.log('year filtered')
            }
        }

        if(area === 'month'){
            setSelectedMonth(e.target.value);
            if(selectedAccount !== 'all'){
                transactions = transactions.filter(item => item.account === selectedAccount)
            }
            if(selectedCurrency !== 'all'){
                transactions = transactions.filter(item => item.currency === selectedCurrency);
            }
            if(selectedYear !== 'all'){
                transactions = transactions.filter(item => item.date.substring(0,4) === selectedYear);
            }
            if(e.target.value === 'all'){
                //console.log('month unfiltered')
            }else{
                transactions = transactions.filter(item => item.date.substring(5,7) === e.target.value);
                //console.log('month filtered')
            }
        }

        if(area === 'delete'){
            if(selectedAccount !== 'all'){
                transactions = transactions.filter(item => item.account === selectedAccount)
            }
            if(selectedCurrency !== 'all'){
                transactions = transactions.filter(item => item.currency === selectedCurrency);
            }
            if(selectedYear !== 'all'){
                transactions = transactions.filter(item => item.date.substring(0,4) === selectedYear);
            }
            if(selectedMonth !== 'all'){
                transactions = transactions.filter(item => item.date.substring(5,7) === selectedMonth);
            }
            transactions = transactions.filter(item => item.id !== e);
            //console.log('Delete gets called')
        }
        setFilteredList(transactions);

    }

    const deleteTransaction = async (id) => {
        const response = await fetch(`${root}/delete-transaction?id=${user.userId}&password=${user.password}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                trId: id
            })
        });
        const data = await response.json();
        if(data.err){
            console.log(data.err);
        }else{
            dispatch(userState.actions.deleteTransaction(id))
            onFilter(id, 'delete');
        }
    }
        return (
            <div id='transactions'>
                <h1>Transactions</h1>
                <form className='flex filter center-h' >
                    <div className='flex center-h'>
                        <label className='pad-left' htmlFor='acc'>Account</label>
                        <select className='input-field smaller' id='acc' onChange={e => {onFilter(e, 'account')}}>
                            <option value='all'>All</option>
                            {accountsFilterList.map((item, index) => {
                                return <option key={index} value={item}>{item}</option>
                            })}
                        </select>

                        <label className='pad-left' htmlFor='currency'>Currency</label>
                        <select className='input-field smaller' id='currency' onChange={e => {onFilter(e, 'currency')}}>
                            <option value='all'>All</option>
                            {currencies.map((item, index) => {
                                return <option key={index} value={item}>{item}</option>
                            })}
                        </select>
                    </div>
                    <div className='flex center-h margin-top'>
                        <label className='pad-left' htmlFor='year'>Year</label>
                        <select className='input-field smaller' id='year' onChange={e => {onFilter(e, 'year')}} >
                            <option>all</option>
                            {years.map((item, index) => {
                                return <option key={index} value={item}>{item}</option>
                            })}
                        </select>
                        <label className='pad-left' htmlFor='month'>Month</label>
                        <select className='input-field smaller' id='month' onChange={e => {onFilter(e, 'month')}}>
                            <option>all</option>
                            {months.map((item, index) => {
                                return <option key={index} value={item}>{mnth[index]}</option>
                            })}
                        </select>
                    </div>
                    

                    
                </form>
                <div className='table min-width'>
                    <div className='tr-row'>
                        <div className='tr-cell bold'>Date</div>
                        <div className='tr-cell bold'>Amount</div>
                        <div className='tr-cell bold '>Description</div>
                        <div className='tr-cell bold'>Account</div>
                        <div className='tr-cell bold'>Options</div>
                    </div>
                    {filteredList.map((item, index) => {
                        sum += item.amount;
                        return <div className='tr-row' key={item.id}>
                            <div className='tr-cell flex center-h center-v'>{item.date}</div>
                            <div className='tr-cell flex space-around center-h center-v'><p className='width40 text-right'>{item.currency}</p> <p className='width40'>{item.amount}</p></div>
                            <div className='tr-cell flex center-h center-v'>{item.desc}</div>
                            <div className='tr-cell flex center-h center-v'>{item.account}</div>
                            <div className='tr-cell flex space-around'>
                                <Link to={`/edit-transaction/${index}`}><button className='button'>Edit</button></Link>
                                <button onClick={e => {deleteTransaction(item.id)}} className='button'>Delete</button>
                            </div>

                        </div>
                    })}
                    <div className='tr-row'>
                        <div className='tr-cell bold'>Total</div>
                        <div className='tr-cell bold flex space-around center-h center-v'>
                            <p className='width40 text-right'>{selectedCurrency === 'all' ? 'select ' : selectedCurrency}</p>
                            <p className='width40 text-left'>{selectedCurrency === 'all' ? ' currency' : sum}</p>
                        </div>

                    </div>
                </div>
            
                <div className='flex home-container center-v wrap top-pad-50'>
                <div className='flex center-v wrap'>
                    <Link to='/add-transaction'><button className='button'>Add transactions</button></Link>
                    <Link to='/accounts'><button className='button'>View accounts</button></Link>
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

export default ViewTransactions