const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="amazon-header border-t border-gray-700 text-gray-300 py-6 mt-10">
            <div className="container mx-auto text-center">
                <p>AmazonClone &copy; {currentYear}. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
