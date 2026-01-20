import React, { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import PersonaSection from '@/components/landing/PersonaSection';
import FeatureGrid from '@/components/landing/FeatureGrid';
import Differentiators from '@/components/landing/Differentiators';
import ProductPreview from '@/components/landing/ProductPreview';
import SecuritySection from '@/components/landing/SecuritySection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
    useEffect(() => {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Navbar />
            <main>
                <Hero />
                <PersonaSection />
                <FeatureGrid />
                <Differentiators />
                <ProductPreview />
                <SecuritySection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
