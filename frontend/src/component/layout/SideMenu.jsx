import { NavLink } from 'react-router-dom'
import { MdHome, MdDescription } from 'react-icons/md'
import './SideMenu.css';

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
    }
]

function  SideMenu({ isOpen }) {
    return (
        <aside
            className={`side-menu ${isOpen ? 'side-menu--open' : ''}`}
            aria-label="Global menu"
        >
            <div className="side-menu-heading">
                <span>WORKSPACE</span>
                <span>00</span>
            </div>

            <nav className="side-menu-list" aria-label="Workspace shortcuts">
                {globalMenuItems.map((menu) =>{
                    const Icon = menu.icon

                    return(
                        <NavLink
                            className={({ isActive }) =>
                                `side-menu-item${isActive ? ' active' : ''}`
                        }
                            end={menu.end}
                            key={menu.id}
                            to={menu.path}
                            >
                            <Icon className="side-menu-item-icon" aria-hidden="true" />
                            <span className="side-menu-item-label">
                                {menu.label}
                            </span>
                            <span className="side-menu-item-marker" aria-hidden="true">
                                &gt;
                            </span>
                        </NavLink>
                    )
                })}
            </nav>

            <div className="side-menu-spacer" />

            <div className="side-menu-footer">
                <span>GLOBAL</span>
                <span>{String(globalMenuItems).padStart(2, '0')}</span>
            </div>
        </aside>

    )
}

export default SideMenu