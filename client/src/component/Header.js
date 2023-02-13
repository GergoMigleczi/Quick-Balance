import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { user as userState} from '../app/userSlice';
import './CSS/Header.css';
import home from '../home.png';
import { Link } from 'react-router-dom';
import { selectUser } from '../app/userSlice';

function Header() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  if(user.userId === undefined || user.loggedIn === false || user.password === undefined){
    document.documentElement.style.setProperty('--headerButtons', 'none')
  }else{
    document.documentElement.style.setProperty('--headerButtons', 'flex')

  }

  const toggleNightMode = () => {
      if(document.body.style.backgroundColor !== 'rgb(255, 255, 255)'){
        document.body.style.color = 'black';
        document.documentElement.style.setProperty('--textColor', 'black')
        document.body.style.backgroundColor = 'rgb(255, 255, 255)';
        document.documentElement.style.setProperty('--bodyColor', 'rgb(255,255,255)')
        document.documentElement.style.setProperty('--elementColor', 'whitesmoke')
        document.documentElement.style.setProperty('--border', '1px solid black')
        document.documentElement.style.setProperty('--colorScheme', 'light')

      }else{
        document.documentElement.style.setProperty('--bodyColor', 'rgb(18,18,18)')
        document.documentElement.style.setProperty('--elementColor', '#262626')
        document.body.style.color = 'whitesmoke';
        document.body.style.backgroundColor = 'rgb(18, 18, 18)';
        document.documentElement.style.setProperty('--border', '1px solid whitesmoke')
        document.documentElement.style.setProperty('--colorScheme', 'dark')
        document.documentElement.style.setProperty('--textColor', 'whitesmoke')
      }

    
    }

  const logOut = () =>{
    dispatch(userState.actions.logout());
  }
  return (
    <div className='nightMode center-h' >
      <div className='flex center-h n-m'>
        <h4 >Night Mode</h4>
        <label className={"switch"}  >
          <input type={"checkbox"} onClick={toggleNightMode} />
          <span className={"slider round"}></span>
        </label>
      </div>
      <div className='log-out center-h'>
          <Link to='/home'><img className='home-link' src={home}></img></Link>
        <button className='button' onClick={logOut}>Log out</button>
      </div>
        
    </div>
  )
}

export default Header