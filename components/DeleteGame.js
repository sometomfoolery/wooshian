'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteGame({ gameId }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    async function askForConfirmation(event) {
        event.preventDefault();
        setConfirmDelete(true);
    }

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
            <button onClick={askForConfirmation}>Delete</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {confirmDelete && (
                <div className="popover-container">
                    <div className="popover-content">
                        <h2>Are you sure you want to delete this game?</h2>
                        <p>This action cannot be undone.</p>
                        <button onClick={handleDelete}>Yes, delete</button>
                        <button onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </span>
    );
}