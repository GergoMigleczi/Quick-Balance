import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './component/login';
import Home from './component/Home';
import AddTransaction from './component/AddTransaction';
import ViewTransactions from './component/ViewTransactions';
import AddAccount from './component/AddAccount';
import ViewAccounts from './component/ViewAccounts';
import EditTransaction from './component/EditTransaction';
import Header from './component/Header';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route exact path='/' element={<Login loginORregister='Log In'/>}></Route>
          <Route exact path='/register' element={<Login loginORregister='Register'/>}></Route>
          <Route exact path='/home' element={<Home />}></Route>
          <Route exact path='/add-transaction' element={<AddTransaction />}></Route>
          <Route exact path='/transactions' element={<ViewTransactions />}></Route>
          <Route exact path='/add-account' element={<AddAccount />} ></Route>
          <Route exact path='/accounts' element={<ViewAccounts />} ></Route>
          <Route path='/edit-transaction/:i' element={<EditTransaction />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App