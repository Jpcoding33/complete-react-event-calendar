import { useState } from 'react';
import "./addEventModal.css";

export const EventModal = () => {
    const [modal, setModal] = useState(true);

    const toggelModal = () => {
        setModal(!modal);
    }

    return (
        <>
            <div className="modal">
                <div onClick={toggelModal} className="overlay">
                    <div className="modal-content">
                        <h2>Hello Modal</h2>
                        <p>lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumv</p>
                        <button type="button" onClick={toggelModal}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}