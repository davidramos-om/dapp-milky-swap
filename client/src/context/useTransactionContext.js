import React from 'react';
import { TransactionContext } from "./TransactionContext";

export function useTransactionContext() {

    const context = React.useContext(TransactionContext);

    if (context === undefined) {
        throw new Error('useTransactionContext must be used within a TransactionProvider');
    }

    return context;
}
