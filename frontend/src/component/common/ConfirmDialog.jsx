import { useEffect, useId, useRef } from 'react'
import './ConfirmDialog.css'

function ConfirmDialog({
                           isOpen,
                           title = 'CONFIRM',
                           message,
                           confirmLabel = 'CONFIRM',
                           cancelLabel = 'CANCEL',
                           onConfirm,
                           onCancel,
                       }) {
    const cancelButtonRef = useRef(null)

    const titleId = useId()
    const messageId = useId()

    useEffect(() => {
        if (!isOpen) {
            return
        }

        cancelButtonRef.current?.focus()

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                onCancel()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [isOpen, onCancel])

    if (!isOpen) {
        return null
    }

    function handleOverlayClick(event) {
        if (event.target === event.currentTarget) {
            onCancel()
        }
    }

    return (
        <div
            className="confirm-dialog-overlay"
            onMouseDown={handleOverlayClick}
        >
            <section
                className="confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
            >
                <header className="confirm-dialog-header">
                    <span id={titleId}>{title}</span>
                    <span aria-hidden="true">!</span>
                </header>

                <div
                    className="confirm-dialog-message"
                    id={messageId}
                >
                    {message}
                </div>

                <footer className="confirm-dialog-actions">
                    <button
                        ref={cancelButtonRef}
                        className="confirm-dialog-button"
                        type="button"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        className="
                            confirm-dialog-button
                            confirm-dialog-button--danger
                        "
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </footer>
            </section>
        </div>
    )
}

export default ConfirmDialog