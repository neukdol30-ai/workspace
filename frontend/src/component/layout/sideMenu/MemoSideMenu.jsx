import { MdChevronLeft } from 'react-icons/md'
import './MemoSideMenu.css'

function MemoSideMenu({ onReturnGlobal }) {
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
                    <span>00</span>
                </div>

                <div className="side-menu-local-empty">
                    FOLDER MENU
                </div>

                <div className="side-menu-spacer" />

                <div className="side-menu-footer">
                    <span>LOCAL</span>
                    <span>00</span>
                </div>
            </div>
        </section>
    )
}

export default MemoSideMenu