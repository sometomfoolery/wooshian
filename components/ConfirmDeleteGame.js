'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmDeleteGame() {
    return (
        <div popover>
                <div className="popover-content">
                <h2>Are you sure you want to delete this game?</h2>
                <p>This action cannot be undone.</p>
                <button onClick={() => handleDelete()}>Yes, delete</button>
                <button onClick={() => handleCancel()}>Cancel</button>
            </div>
        </div>
    );
}