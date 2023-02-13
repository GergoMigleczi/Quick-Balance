
export async function getTransactionsAndAccounts(id, password){
    const response = await fetch(`/transactions-and-accounts?id=${id}&password=${password}`);
    const data = await response.json();
    return data;
}

export async function getTransactions(id, password){
    const response = await fetch(`/transactions?id=${id}&password=${password}`);
    const data = await response.json();
    return data;
};

export async function getAccounts(id, password){
    const response = await fetch(`/accounts?id=${id}&password=${password}`);
    const data = await response.json();
    return data;
};