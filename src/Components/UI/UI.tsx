import './UI.css'

// import Footer from '../Footer/Footer'
import Game from '../Game/Game'

export default function UI() {
    return (
        <div className="container">
            { /* Game name */ }
            <div className="navbar justify-content-center">
                <h1 className="text-center"> Obcinko </h1>
            </div>

            {/* <div className="row mt-4 w-100"> */}
                <Game />
            {/* </div> */}

            {/* <Footer /> */}
        </div>
    )
}