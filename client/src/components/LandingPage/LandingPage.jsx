import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Registration from './Registration';
import Events from './Events';
import Team from './Team';
import Gallery from './Gallery';
import FAQ from './FAQ';
import Contact from './Contact';
import Footer from './Footer';

const LandingPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = ['home', 'register', 'events', 'team', 'gallery', 'faq', 'contact'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
            />
            <Hero scrollToSection={scrollToSection} />
            <Registration darkMode={darkMode} />
            <Events darkMode={darkMode} />
            <Team darkMode={darkMode} />

            <Gallery darkMode={darkMode} />
            <FAQ darkMode={darkMode} scrollToSection={scrollToSection} />
            <Contact darkMode={darkMode} />
            <Footer darkMode={darkMode} scrollToSection={scrollToSection} />
        </div>
    );
};

export default LandingPage;
