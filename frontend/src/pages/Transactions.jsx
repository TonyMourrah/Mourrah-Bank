import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/transactions')
      .then((res) => setTransactions(res.data))
      .catch(() => setError("Impossible de charger l'historique."));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3">Historique des transactions</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <table className="table table-hover bg-white shadow-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>De</th>
              <th>Vers</th>
              <th>Montant</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.dateTransaction).toLocaleString('fr-CA')}</td>
                <td>{t.compteSourceId}</td>
                <td>{t.compteDestinationId}</td>
                <td>{t.montant.toFixed(2)} $</td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}