import { useRef, useState} from "react";
import './MainMenu.css'

const menuItems = [
    {
        id: 'memo',
        number: '01',
        title: 'MEMO',
        status: 'ACTIVE',
        available: true,
    },
    {
        id: 'calendar',
        number: '02',
        title: 'CALENDAR',
        status: 'PLANNED',
        available: false,
    },
    {
        id: 'md-image',
        number: '03',
        title: 'MD IMAGE',
        status: 'PLANNED',
        available: false,
    },
    {
        id: 'mail',
        number: '04',
        title: 'MAIL',
        status: 'PLANNED',
        available: false,
    },
    {
        id: 'archive',
        number: '05',
        title: 'ARCHIVE',
        status: 'PLANNED',
        available: false,
    },
]

function MainMenu({ onSelectMenu }) {
    const [menuOffset, setMenuOffset] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    const viewportRef = useRef(null)
    const trackRef = useRef(null)

    const dragRef = useRef({
        active: false,
        startX: 0,
        startOffset: 0,
        lastOffset: 0,
        didMove: false,
        menuId: null,
    })

    function getMinimumOffset() {
        const viewport = viewportRef.current
        const track = trackRef.current

        if (!viewport || !track) {
            return 0
        }

        return Math.min(0, viewport.clientWidth - track.scrollWidth)
    }

    function limitOffset(offset) {
        return Math.max(getMinimumOffset(), Math.min(0, offset))
    }

    function handlePointerDown(event) {
        if (event.pointerType === 'mouse' && event.button !== 0){
            return
        }

        event.currentTarget.setPointerCapture(event.pointerId)

        const menuButton = event.target.closest('.main-menu-button')

        dragRef.current = {
            active: true,
            startX: event.clientX,
            startOffset: menuOffset,
            lastOffset: menuOffset,
            didMove: false,
            menuId: menuButton?.dataset.menuId ?? null,
        }
        setIsDragging(true)
    }

    function handlePointerMove(event) {
        if (!dragRef.current.active) {
            return
        }

        const distance = event.clientX - dragRef.current.startX

        if (Math.abs(distance) > 5) {
            dragRef.current.didMove = true
        }


        const nextOffset = limitOffset(dragRef.current.startOffset + distance)

        dragRef.current.lastOffset = nextOffset
        setMenuOffset(nextOffset)
    }

    function handlePointerEnd(event) {
        if (!dragRef.current.active) {
            return
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        const { didMove, menuId } = dragRef.current

        dragRef.current.active = false
        setIsDragging(false)

        if (!didMove && menuId) {
            onSelectMenu(menuId)
        }
    }

    return (
        <section className="desktop" aria-label="Workspace">
            <div
                className={`main-menu-viewport ${
                    isDragging ? 'main-menu-viewport--dragging' : ''
                }`}
                ref={viewportRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                >
                    <div
                        className="main-menu-track"
                        ref={trackRef}
                        style={{ transform: `translate(${menuOffset}px)`}}
                    >
                        {menuItems.map((menu) => (
                            <button
                                className={`main-menu-button ${
                                    menu.available
                                        ? ''
                                        : 'main-menu-button--disabled'
                                }`}
                                key={menu.id}
                                type="button"
                                data-menu-id={
                                    menu.available
                                        ? menu.id
                                        : undefined
                                }
                                tabIndex={menu.available ? 0 : -1}
                                aria-disabled={!menu.available}
                            >
                                <span className="main-menu-button-number">
                                    {menu.number}
                                </span>

                                <span className="main-menu-button-title">
                                    {menu.title}
                                </span>

                                <span className="main-menu-button-status">
                                    {menu.status}
                                </span>

                                <span
                                    className="main-menu-button-footer"
                                    aria-hidden="true"
                                />
                            </button>
                        ))}
                    </div>
            </div>
        </section>
    )
}

export default MainMenu