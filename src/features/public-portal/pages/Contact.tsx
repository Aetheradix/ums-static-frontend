import { useEffect } from 'react';
import ContactHero from '../components/sections/contact/ContactHero';
import ContactForm from '../components/sections/contact/ContactForm';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us — Get in Touch | OCTAGON ERP';
  }, []);

  return (
    <main>
      <ContactHero />
      <ContactForm />
    </main>
  );
}
