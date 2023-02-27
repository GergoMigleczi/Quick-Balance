
export async function getTransactionsAndAccounts(id, password){
    const root = "https://quick-balance-9d1e.onrender.com";

    const response = await fetch(`${root}/transactions-and-accounts?id=${id}&password=${password}`);
    const data = await response.json();
    return data;
}

export async function getTransactions(id, password){
    const root = "https://quick-balance-9d1e.onrender.com";

    const response = await fetch(`${root}/transactions?id=${id}&password=${password}`);
    const data = await response.json();
    return data;
};

export async function getAccounts(id, password){
    const root = "https://quick-balance-9d1e.onrender.com";

    const response = await fetch(`${root}/accounts?id=${id}&password=${password}`);
    const data = await response.json();
    return data;
};