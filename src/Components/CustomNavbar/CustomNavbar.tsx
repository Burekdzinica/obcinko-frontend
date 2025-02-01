import './customNavbar.css';
// import logo from '../../../res/logo.svg';  // Adjust according to actual path

import { Navbar } from 'react-bootstrap';

export default function CustomNavbar() {

    return (
        <Navbar data-bs-theme="dark" className='custom-navbar'>
            <Navbar.Brand>
                <img id="logo" src='slo.svg' alt='Logo' />
            </Navbar.Brand>

            <Navbar.Brand id='title'>Občinko</Navbar.Brand>
        </Navbar>
    );
}