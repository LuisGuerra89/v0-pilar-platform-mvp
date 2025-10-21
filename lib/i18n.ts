export type Locale = "en" | "es"

export const translations = {
  en: {
    nav: {
      home: "Home",
      search: "Search",
      myBookings: "My Bookings",
      profile: "Profile",
      admin: "Admin",
      login: "Login",
      register: "Register",
      logout: "Logout",
    },
    home: {
      hero: {
        title: "Find the Perfect Stay for You and Your Pet",
        subtitle: "Book trusted hotels and canine residences with confidence",
        searchPlaceholder: "Where are you going?",
        searchButton: "Search",
      },
      features: {
        title: "Why Choose Pilar Platform",
        verified: {
          title: "Verified Facilities",
          description: "All locations are verified and reviewed by our team",
        },
        secure: {
          title: "Secure Payments",
          description: "Safe and encrypted payment processing",
        },
        support: {
          title: "24/7 Support",
          description: "We're here to help you anytime",
        },
      },
    },
    footer: {
      about: "About Us",
      contact: "Contact",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      rights: "All rights reserved",
    },
    profile: {
      title: "My Profile",
      personalInfo: "Personal Information",
      myPets: "My Pets",
      addPet: "Add Pet",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      search: "Buscar",
      myBookings: "Mis Reservas",
      profile: "Perfil",
      admin: "Admin",
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
    },
    home: {
      hero: {
        title: "Encuentra la Estancia Perfecta para Ti y Tu Mascota",
        subtitle: "Reserva hoteles y residencias caninas de confianza",
        searchPlaceholder: "¿A dónde vas?",
        searchButton: "Buscar",
      },
      features: {
        title: "Por Qué Elegir Pilar Platform",
        verified: {
          title: "Instalaciones Verificadas",
          description: "Todas las ubicaciones están verificadas y revisadas por nuestro equipo",
        },
        secure: {
          title: "Pagos Seguros",
          description: "Procesamiento de pagos seguro y encriptado",
        },
        support: {
          title: "Soporte 24/7",
          description: "Estamos aquí para ayudarte en cualquier momento",
        },
      },
    },
    footer: {
      about: "Sobre Nosotros",
      contact: "Contacto",
      terms: "Términos de Servicio",
      privacy: "Política de Privacidad",
      rights: "Todos los derechos reservados",
    },
    profile: {
      title: "Mi Perfil",
      personalInfo: "Información Personal",
      myPets: "Mis Mascotas",
      addPet: "Agregar Mascota",
    },
  },
}

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en
}
