import { NavLink } from 'react-router-dom'
import { MdDescription, MdHome } from 'react-icons/md'
import './GlobalSideMenu.css'

const globalMenuItems = [
    {
        id: 'home',
        label: 'HOME',
        path: '/',
        icon: MdHome,
        end: true,
    },
    {
        id: 'memo',
        label: 'MEMO',
        path: '/memo/list',
        icon: MdDescription,
    },
]

function GlobalSideMenu({ supportsLocalMenu, onOpenLocalMenu }) {
    return (
        <section className="side-menu-pane" aria-label="Global shortcuts">
            <div className="side-menu-heading">
                <span>WORKSPACE</span>
                <span>00</span>
            </div>

            <nav className="side-menu-list">
                {globalMenuItems.map((menu) => {
                    const Icon = menu.icon

                    return (
                        <NavLink
                            className={({ isActive }) =>
                                `side-menu-item ${
                                    isActive ? 'side-menu-item--active' : ''
                                }`
                            }
                            end={menu.end}
                            key={menu.id}
                            to={menu.path}
                        >
                            <Icon className="side-menu-item-icon" aria-hidden="true" />
                            <span className="side-menu-item-label">{menu.label}</span>
                            <span className="side-menu-item-marker" aria-hidden="true">
                &gt;
              </span>
                        </NavLink>
                    )
                })}
            </nav>

            <div className="side-menu-spacer" />

            {supportsLocalMenu ? (
                <button
                    className="side-menu-footer side-menu-footer--button"
                    type="button"
                    onClick={onOpenLocalMenu}
                >
                    <span>LOCAL MENU</span>
                    <span>&gt;</span>
                </button>
            ) : (
                <div className="side-menu-footer">
                    <span>GLOBAL</span>
                    <span>{String(globalMenuItems.length).padStart(2, '0')}</span>
                </div>
            )}
        </section>
    )
}

export default GlobalSideMenu