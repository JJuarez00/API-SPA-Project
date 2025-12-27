/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: Footer.jsx
 * Description: This creates a common page footer.
 */

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer>
            <div className="container">
                <span>&copy;Videogame Corporation. 2024-{year}</span>
            </div>
        </footer>
    );
};

export default Footer;