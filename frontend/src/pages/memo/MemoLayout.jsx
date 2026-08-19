import { NavLink, Outlet } from 'react-router-dom'
import { useMemoContext } from '../../context/MemoContext.js'
import './MemoLayout.css'

function MemoLayout({ hideFolderList }) {
    const memoContext = useMemoContext()

    return (
        <section className="memo-page" aria-label="Memo">
            <div className="memo-window">
                <div className="memo-command-bar">
                    <nav
                        className="memo-mode-switch"
                        aria-label="Memo view mode"
                    >
                        <NavLink
                            className={({ isActive }) =>
                                `memo-mode-button ${
                                    isActive
                                        ? 'memo-mode-button--active'
                                        : ''
                                }`
                            }
                            to="/memo/list"
                        >
                            LIST
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `memo-mode-button ${
                                    isActive
                                        ? 'memo-mode-button--active'
                                        : ''
                                }`
                            }
                            to="/memo/board"
                        >
                            BOARD
                        </NavLink>
                    </nav>
                </div>

                <Outlet
                    key={memoContext.selectedFolderId}
                    context={{
                        ...memoContext,
                        hideFolderList,
                    }}
                />
            </div>
        </section>
    )
}

export default MemoLayout