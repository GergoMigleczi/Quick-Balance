import React from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getTransactionsAndAccounts } from './functions';
import { user } from '../app/userSlice';
import { useDispatch} from 'react-redux';

function Login({loginORregister}) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState(false);
    const [exists, setExists] = useState(false);
    const [fail, setFail] = useState(false);
    const [loading, setLoading] = useState(false);

    const root = "https://quick-balance-9d1e.onrender.com";
    //const root = "http://localhost:3001";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    let link;
    let linkTo;
    let login;

    // LOGIN ------------------------------
    if(loginORregister === 'Log In'){
        link ='create account';
        linkTo = '/register';

        login = async(e) =>{
            e.preventDefault();
            setLoading(true);
            const response = await fetch(`${root}/login?username=${username}&password=${password}`);
            const data = await response.json();
            if(data.err){
                //console.log(data.err)
                setIncorrect(true);
                setLoading(false);
            }else{
                setIncorrect(false);
                dispatch(user.actions.login({id: data.id, password: data.password}));

                //get transactions
                getTransactionsAndAccounts(data.id, data.password)
                .then(res => {
                    if(res.err){
                        console.log(res.err);
                    }else{
                        dispatch(user.actions.setTransactions(res.transactions));
                        dispatch(user.actions.setAccounts(res.accounts));    
                    }
                }).catch(err => {
                    console.log(err);
                })
                setLoading(false);
                navigate('/home')
            }
        }
    }
    // REGISTER ------------------------------
    else if(loginORregister === 'Register'){
        linkTo = '/';
        link = 'login';
        login = async(e) =>{
            e.preventDefault();
            setLoading(true);
            const users = await fetch(`${root}/get-users`);
            const usersJson = await users.json();
            let exist = false;
            let id = 1;
            usersJson.forEach(item => {
                if(item.username === username){
                    setExists(true);
                    setLoading(false);
                    exist = true;
                }
                if(item.id === id){
                    id += 1;
                }
            });
            if(!exist){
                setExists(false);
                const response = await fetch(`${root}/register-user`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        id: id
                    })
                });
                const data = await response.json();
                if(data.err){
                    console.log(data.err);
                    setFail(true);
                }else{
                    setFail(false);
                    setLoading(false);
                    navigate('/');

                }
            }
        }
    }

    const togglePassword = () =>{
        const password = document.querySelector('#password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
    }
  return (
    <div id='login'>
        <h2>{loginORregister}</h2>
            <p id='err'>{incorrect ? 'Username or password is incorrect!' : ''}
            {exists ? 'Username already exists!' : ''}</p>
            <form onSubmit={e => login(e)}>
                <label htmlFor='username'>Username</label>
                <input className='input-field' id='username' type='text' placeholder='username' required onChange={e => {setUsername(e.target.value); if(fail){setFail(false)}; if(incorrect){setIncorrect(false)}}}/>

                <label htmlFor='password'>Password</label>
                <div className='flex center-h'>
                    <input className='input-field' id='password' type='password' required onChange={e => {setPassword(e.target.value); if(fail){setFail(false)}; if(incorrect){setIncorrect(false)}}}/>
                    <i className="far fa-eye" id="togglePassword" onClick={togglePassword}></i>
                </div>

                <div className='flex bottom-h space-between button-container'>
                <input className='button' type='submit' value={loginORregister}/>
                <Link className='link' to={linkTo} id='link' onClick={()=>{setExists(false); setIncorrect(false)}}>{link}</Link>
                </div>
            </form>
            <p className='fail'>{fail ? 'Failed to register an account. Avoid apostrophes' : ''}</p>
            {loading ? <div class="loader"></div> : ''}
    </div>
  )
}

export default Login