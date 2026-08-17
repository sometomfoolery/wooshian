'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteGame({ gameId }) {
    const [error, setError] = useState(null);
    const router = useRouter();

    async function handleDelete(event) {
        event.preventDefault();
        setError('');

        const response = await fetch('/api/database/games/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: gameId }),
        });

        if (response.ok) {
            router.refresh(); // Refresh the page to reflect the deletion
        } else {
            const data = await response.json();
            setError(data.error);
        }
    }

    return (
        <span>
            <button onClick={handleDelete}>Delete</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </span>
    );
}