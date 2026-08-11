import { useRef, useState} from "react";
import './MainMenu.css'

const menuItems = [
    {id: 'memo', number: '01', title: 'MEMO'},
    {id: 'dummy', number: '02', title: 'dummy'},
    {id: 'dummy2', number: '03', title: 'dummy2'},
    {id: 'dummy3', number: '04', title: 'dummy3'},
    {id: 'dummy4', number: '05', title: 'dummy4'},
    {id: 'dummy5', number: '06', title: 'dummy5'},
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

        dragRef.current = {
            active: true,
            startX: event.clientX,
            startOffset: menuOffset,
            lastOffset: menuOffset,
        }

        setIsDragging(true)
    }

    function handlePointerMove(event) {
        if (!dragRef.current.active) {
            return
        }

        const distance = event.clientX - dragRef.current.startX
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

        dragRef.current.active = false
        setIsDragging(false)
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
                                className="main-menu-button"
                                key={menu.id}
                                type="button"
                                onClick={() => onSelectMenu(menu.id)}
                            >
                                <span className="main-menu-button-number">{menu.number}</span>
                                <span className="main-menu-button-title">{menu.title}</span>
                                <span className="main-menu-button-footer" aria-hidden="true" />
                            </button>
                        ))}
                    </div>
            </div>
        </section>
    )
}

export default MainMenu