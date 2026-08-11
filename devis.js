// Configuration Supabase
const SUPABASE_URL = 'https://pgmdpgxmmnpyfisiwsjr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbWRwZ3htbW5weWZpc2l3c2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDE5MjcsImV4cCI6MjEwMjAxNzkyN30.udtJT3934uoqZCho1JdhO0o2xJuW7ZvZVdy1N161sg0';

// Initialisation du client Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const formDevis = document.querySelector('.devis-form');
    const chkAutre = document.getElementById('chk-autre');
    const otherWrapper = document.getElementById('other-service-wrapper');
    const autreInput = document.getElementById('autre_service');
    
    // Éléments du Modal
    const modal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Fermeture du modal
    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Gestion de l'affichage du champ "Autre"
    if (chkAutre && otherWrapper) {
        chkAutre.addEventListener('change', function () {
            if (this.checked) {
                otherWrapper.classList.add('active');
            } else {
                otherWrapper.classList.remove('active');
                if (autreInput) autreInput.value = '';
            }
        });
    }

    // Gestion de la soumission du formulaire
    if (formDevis) {
        formDevis.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnSubmit = formDevis.querySelector('.btn-submit-devis');
            const originalBtnText = btnSubmit.textContent;

            // Récupération des services coché(s)
            const checkboxes = document.querySelectorAll('input[name="services[]"]:checked');
            const selectedServices = Array.from(checkboxes).map(cb => cb.value);

            if (selectedServices.length === 0) {
                alert('Veuillez sélectionner au moins un service souhaité.');
                return;
            }

            // Construction de l'objet de données
            const formData = {
                nom: document.getElementById('nom').value.trim(),
                entreprise: document.getElementById('entreprise').value.trim() || null,
                telephone: document.getElementById('telephone').value.trim(),
                email: document.getElementById('email').value.trim(),
                services: selectedServices,
                autre_service: chkAutre && chkAutre.checked ? autreInput.value.trim() : null,
                delai: document.getElementById('delai').value || null,
                description: document.getElementById('description').value.trim()
            };

            try {
                // Désactivation du bouton pendant l'envoi
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Envoi en cours...';

                // Insertion dans Supabase
                const { data, error } = await supabaseClient
                    .from('devis')
                    .insert([formData]);

                if (error) throw error;

                // Affichage du modal au lieu de alert()
                if (modal) {
                    modal.classList.add('active');
                }
                
                formDevis.reset();
                if (otherWrapper) otherWrapper.classList.remove('active');

            } catch (err) {
                console.error('Erreur Supabase:', err);
                alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement par téléphone.');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = originalBtnText;
            }
        });
    }
});