import React from 'react'

export default function Confirm({ message, onConfirm, onCancel }) {
    const handleConfirm = () => {
        onConfirm()
        onCancel()
    }

    const handleCancel = () => {
        onCancel()
    }

    return (
        <div className='confirm-container'>
            <div className='confirm'>
                <h4>{message}</h4>
                <div className='confirm-btns'>
                    <button onClick={handleCancel}>Hủy</button>
                    <button onClick={handleConfirm}>Ok</button>
                </div>
            </div>
        </div>
    )
}
