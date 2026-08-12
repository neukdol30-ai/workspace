import './SideMenu.css';

function  SideMenu({ isOpen }) {
    return (
        <aside
            className={`side-menu ${isOpen ? 'side-menu--open' : ''}`}
            aria-label="Menu"
        />
    )
}

export default SideMenu