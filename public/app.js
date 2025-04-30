document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const enFlag = document.getElementById('en-flag');
  const svFlag = document.getElementById('sv-flag');

  const homeLink = document.getElementById('home-link');
  const orderLink = document.getElementById('order-link');
  const customersLink = document.getElementById('customers-link');
  const aboutLink = document.getElementById('about-link');
  const contactLink = document.getElementById('contact-link');

  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const selectedLang = document.getElementById('selected-language');
  const content = document.getElementById('content');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  dropdownBtn.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

  function setSelectedLang(lang) {
    if (lang === 'sv') {
      selectedLang.innerHTML = `
        <div><span>Svenska</span>
        <img src="https://storage.123fakturere.no/public/flags/SE.png" class="flag" alt="Swedish"></div>`;
    } else {
      selectedLang.innerHTML = `
        <div><span>English</span>
        <img src="https://storage.123fakturere.no/public/flags/GB.png" class="flag" alt="English"></div>`;
    }
  }

  async function fetchTexts(lang) {
    try {
      const response = await fetch(`/api/terms?lang=${lang}`);
      const data = await response.json();

      setSelectedLang(lang);
      dropdownContent.classList.remove('show');

      content.innerHTML = `
        <h1 class="terms-title">${data.terms_title}</h1>
        <button class="terms-button" onclick="window.history.back()">${data.button_text}</button>
        <div class="terms-container">${data.terms_content}</div>
        <button class="terms-button" onclick="window.history.back()">${data.button_text}</button>
      `;

      homeLink.innerText = data.home_link;
      orderLink.innerText = data.order_link;
      customersLink.innerText = data.customers_link;
      aboutLink.innerText = data.about_link;
      contactLink.innerText = data.contact_link;

    } catch (error) {
      console.error('Error fetching texts:', error);
    }
  }

 
  enFlag.addEventListener('click', () => fetchTexts('en'));
  svFlag.addEventListener('click', () => fetchTexts('sv'));

  fetchTexts('sv');
});


const Utils = {
  popupWindow: function(url) {
    const currentLang = document.getElementById('selected-language').innerText.includes('Svenska') ? 'sv' : 'en';
    window.open(`${url}?lang=${currentLang}`, "_blank", "width=550,height=750");
  }
};
