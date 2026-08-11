import './sideMenu.css';

function  SdieMenu({ isOpen}) {
    return (
        <aside
            className={`side-menu ${isMenuOpen ? 'side-menu--open' : ''}`}
            aria-label="Menu"
        />
    )
}

export default Sdiemenu