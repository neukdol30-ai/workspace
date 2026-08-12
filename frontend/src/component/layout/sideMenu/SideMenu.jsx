import { useLocation } from 'react-router-dom'
import GlobalSideMenu from './GlobalSideMenu'
import MemoSideMenu from './MemoSideMenu'
import './SideMenu.css'

function SideMenu({
                      isOpen,
                      sideMenuMode,
                      onSideMenuModeChange,
                  }) {
    const location = useLocation()

    const supportsLocalMenu = location.pathname.startsWith('/memo')

    const activeMode =
        supportsLocalMenu ? sideMenuMode : 'global'

    return (
        <aside
            className={`side-menu ${isOpen ? 'side-menu--open' : ''}`}
            aria-label="Menu"
        >
            <div className="side-menu-mode-viewport">
                <div
                    className={`side-menu-mode-track ${
                        activeMode === 'local'
                            ? 'side-menu-mode-track--local'
                            : ''
                    }`}
                >
                    <GlobalSideMenu
                        supportsLocalMenu={supportsLocalMenu}
                        onOpenLocalMenu={() => onSideMenuModeChange('local')}
                    />

                    <MemoSideMenu
                        onReturnGlobal={() => onSideMenuModeChange('global')}
                    />
                </div>
            </div>
        </aside>
    )
}

export default SideMenu