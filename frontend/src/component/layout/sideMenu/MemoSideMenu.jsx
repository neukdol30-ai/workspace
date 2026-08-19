import {MdChevronLeft, MdDeleteOutline } from 'react-icons/md'
import { useMemoContext } from '../../../context/MemoContext.js'
import './MemoSideMenu.css'

function MemoSideMenu({ onReturnGlobal }) {
    const {
        folders,
        notes,
        selectedFolderId,
        selectFolder,
        createFolder,
        deleteFolder,
    } = useMemoContext()

    const selectedFolder =
        folders.find(
            (folder) => folder.id === selectedFolderId,
        ) ?? null

    const canDeleteSelectedFolder =
        selectedFolder !== null &&
        !selectedFolder.isVirtual &&
        !selectedFolder.system

    async function handleCreateFolder() {
        const folderName = window.prompt(
            '새 폴더 이름을 입력하세요.',
        )

        if (folderName === null) {
            return
        }

        try {
            await createFolder(folderName)
        } catch (error) {
            console.error(error)
            window.alert('폴더 생성에 실패했습니다.')
        }
    }

    async function handleDeleteSelectedFolder() {
        if (!canDeleteSelectedFolder) {
            return
        }

        const confirmed = window.confirm(
            `"${selectedFolder.name}" 폴더와 내부 메모를 삭제할까요?`,
        )

        if (!confirmed) {
            return
        }

        try {
            await deleteFolder(selectedFolder.id)
        } catch (error) {
            console.error(error)
            window.alert('폴더 삭제에 실패했습니다.')
        }
    }

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

                    <div className="memo-side-heading-actions">
                        <span>
                            {String(folders.length).padStart(2, '0')}
                        </span>

                        <button
                            className="memo-side-delete-button"
                            type="button"
                            aria-label="Delete selected folder"
                            disabled={!canDeleteSelectedFolder}
                            onClick={handleDeleteSelectedFolder}
                        >
                            <MdDeleteOutline aria-hidden="true" />
                        </button>

                        <button
                            className="memo-side-create-button"
                            type="button"
                            aria-label="Create folder"
                            onClick={handleCreateFolder}
                        >
                            +
                        </button>
                    </div>
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