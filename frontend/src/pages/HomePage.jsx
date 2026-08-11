import { useNavigate } from 'react-router-dom'
import MainMenu from '../component/layout/MainMenu.jsx'

function HomePage() {
    const navigate = useNavigate()

    function handleMenuSelect(menuId) {
        if (menuId === 'memo') {
            navigate('/memo')
        }
    }

    return <MainMenu onSelectMenu={handleMenuSelect} />
}

export default HomePage