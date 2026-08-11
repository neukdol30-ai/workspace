import './MainMenu.css'

function MainMenu() {
    return (
        <section className="desktop" aria-label="Workspace">
            <div className="main-menu-rail">
                <button className="main-menu-button" type="button">
                    <span className="main-menu-button-number">01</span>
                    <span className="main-menu-button-title">MEMO</span>
                    <span className="main-menu-button-footer" aria-hidden="true" />
                </button>
            </div>
        </section>
    )
}

export default MainMenu