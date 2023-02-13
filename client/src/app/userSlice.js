import { createSlice } from "@reduxjs/toolkit";

export const user = createSlice({
    name: 'user',
    initialState: {loggedIn: false,
    accounts: []},
    reducers: {
        login: (state, action) =>{
            state.loggedIn = true;
            state.userId = action.payload.id;
            state.userPassword = action.payload.password;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.userId = undefined;
            state.userPassword = undefined;
            state.transactions = [];
            state.accounts = [];
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload;
        },
        updateTransaction: (state, action) =>{
            state.transactions[action.payload.i] = action.payload.newTransaction;
        },
        setAccounts: (state, action) => {
            state.accounts = action.payload;
        },
        deleteTransaction: (state, action) => {
            state.transactions = state.transactions.filter(item => item.id !== action.payload);
        },
        addAccount: (state, action) => {
            state.accounts.push(action.payload);
        },
        deleteAccount: (state, action) => {
            state.accounts = state.accounts.filter(item => item.id !== action.payload);
        },
    }
});

export const selectUser = (state) =>{
    const userInfo = {
        userId: state.user.userId,
        loggedIn: state.user.loggedIn,
        password: state.user.userPassword
    }

    return userInfo;
};

export const selectTransactions = state =>{
    return state.user.transactions
}

export const selectAccounts = state =>{
    return state.user.accounts
}