import './UI.css'

import CustomNavbar from '../CustomNavbar/CustomNavbar'
import Game from '../Game/Game'
// import Footer from '../Footer/Footer'

export default function UI() {
    return (
        <>
        {/* <div className="container"> */}
            <CustomNavbar />

            <Game />

            {/* <Footer /> */}
        {/* </div> */}
        </>
    )
}