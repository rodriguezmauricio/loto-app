// components/BilheteTable.jsx

const BilheteTable = ({ bilhetes }: any) => {
    if (bilhetes.length === 0) {
        return <p>Nenhum bilhete encontrado para este apostador.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Números</th>
                    <th>Data</th>
                    {/* Add other headers as necessary */}
                </tr>
            </thead>
            <tbody>
                {bilhetes.map((bilhete: any) => (
                    <tr key={bilhete.id}>
                        <td>{bilhete.id}</td>
                        <td>{bilhete.numbers}</td>
                        <td>{new Date(bilhete.created_at).toLocaleDateString()}</td>
                        {/* Add other bilhete fields */}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BilheteTable;
