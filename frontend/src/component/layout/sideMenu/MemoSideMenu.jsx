import { MdChevronLeft } from 'react-icons/md'
import { useMemoContext } from '../../../context/MemoContext.js'
import './MemoSideMenu.css'

function MemoSideMenu({ onReturnGlobal }) {
    const {
        folders,
        notes,
        selectedFolderId,
        selectFolder,
    } = useMemoContext()

    return (
        <section
            className="side-menu-pane memo-side-menu"
            aria-label="Memo folders"
        >
            <button
                className="side-menu-local-rail"
                type="button"
                aria-label="Return to global menu"
                onClick={onReturnGlobal}
            >
                <MdChevronLeft aria-hidden="true" />
                <span>GLOBAL</span>
            </button>

            <div className="side-menu-local-content">
                <div className="side-menu-heading">
                    <span>FOLDERS</span>

                    <span>
                        {String(folders.length).padStart(2, '0')}
                    </span>
                </div>

                <div className="memo-side-folder-list">
                    {folders.map((folder) => {
                        const noteCount =
                            folder.id === 'all'
                                ? notes.length
                                : notes.filter(
                                    (note) =>
                                        note.folderId === folder.id,
                                ).length

                        const isSelected =
                            folder.id === selectedFolderId

                        return (
                            <button
                                className={`memo-side-folder-item ${
                                    isSelected
                                        ? 'memo-side-folder-item--active'
                                        : ''
                                }`}
                                key={folder.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() =>
                                    selectFolder(folder.id)
                                }
                            >
                                <span className="memo-side-folder-name">
                                    {folder.name}
                                </span>

                                <span className="memo-side-folder-count">
                                    {String(noteCount).padStart(
                                        2,
                                        '0',
                                    )}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="side-menu-spacer" />

                <div className="side-menu-footer">
                    <span>MEMOS</span>

                    <span>
                        {String(notes.length).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default MemoSideMenu