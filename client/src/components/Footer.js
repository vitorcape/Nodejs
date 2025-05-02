import React from 'react';

function Footer() {
    return (
        <footer className="bg-dark text-white text-center p-3 mt-5">
            <small>&copy; {new Date().getFullYear()} - CRUD com Node.js e React</small>
        </footer>
    );
}

export default Footer;