import Statistics from '../Statistics/Statistics';
import { Navbar } from 'react-bootstrap';

export default function CustomNavbar() {
    return (
        <Navbar data-bs-theme="dark" className='shadow-md mb-5 bg-navbar !pl-5 !p-0.5 h-16'>
            <Navbar.Brand>
                <img className='w-14' 
                    src='res/logo.svg' 
                    alt='Logo' 
                />
            </Navbar.Brand>
            <Navbar.Brand className='p-0 font-semibold text-txt !text-4xl'>
                Občinko
            </Navbar.Brand>            
            <Navbar.Brand className='ms-auto'>
                <Statistics />
            </Navbar.Brand>
        </Navbar>
    );
}