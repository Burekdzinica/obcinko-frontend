import Stats from '../Stats/Stats';
import './customNavbar.css';

import { Navbar } from 'react-bootstrap';

export default function CustomNavbar() {

    return (
        <Navbar data-bs-theme="dark" className='custom-navbar'>
            <Navbar.Brand>
                <img id="logo" src='res/logo.svg' alt='Logo' />
            </Navbar.Brand>
            <Navbar.Brand id='title'>Občinko</Navbar.Brand>
            
            <Navbar.Brand className='ms-auto'>
                <Stats />
            </Navbar.Brand>
        </Navbar>
    );
}