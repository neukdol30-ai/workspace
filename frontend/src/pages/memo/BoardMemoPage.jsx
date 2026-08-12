import { useOutletContext } from 'react-router-dom'
import './BoardMemoPage.css'

function BoardMemoPage() {
    const {
        notes,
        selectedFolderId,
    } = useOutletContext()

    return (
        <div className="memo-board">
            <span>BOARD MODE</span>
            <span>FOLDER: {selectedFolderId}</span>
            <span>NOTES: {notes.length}</span>
        </div>
    )
}

export default BoardMemoPage