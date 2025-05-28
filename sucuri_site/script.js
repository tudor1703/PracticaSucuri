document.addEventListener("DOMContentLoaded", () => {
  // --- Header slider ---
  const slides = document.querySelectorAll(".hero-slide");
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 6000);

  // Selectori
  const bodyTabel = document.getElementById("bodyTabel");
  const addForm = document.getElementById("addProductForm");
  const codStergereInput = document.getElementById("codStergere");
  const btnStergere = document.getElementById("btnStergere");
  const cartCount = document.getElementById("cartCount");
  const searchBar = document.querySelector(".search-bar");

  let produse = JSON.parse(localStorage.getItem("produse")) || [];
  let cos = JSON.parse(localStorage.getItem("cos")) || [];

  function actualizeazaContorCos() {
    cartCount.textContent = cos.length;
  }

  function afiseazaProduse(lista = produse) {
    bodyTabel.innerHTML = "";

    if (lista.length === 0) {
      bodyTabel.innerHTML = "<p>Nu există produse în listă.</p>";
      return;
    }

    lista.forEach(produs => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="images/${produs.imagine}" alt="${produs.nume}" style="max-width:100%; height:auto;">
        <h3>${produs.nume}</h3>
        <p><strong>Preț:</strong> ${produs.pret.toFixed(2)} lei</p>
        <p><strong>Fructe folosite:</strong> ${produs.fructeFolosite}</p>
        <p><strong>Cod:</strong> ${produs.cod}</p>
        <button class="btn-cart" data-cod="${produs.cod}">Adaugă în coș</button>
      `;

      bodyTabel.appendChild(card);
    });

    // Eveniment click pe toate butoanele "Adaugă în coș"
    const butoaneCos = document.querySelectorAll(".btn-cart");
    butoaneCos.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const cod = e.target.getAttribute("data-cod");
        const produsAdaugat = produse.find(p => p.cod === cod);

        if (produsAdaugat) {
          cos.push(produsAdaugat);
          localStorage.setItem("cos", JSON.stringify(cos));
          actualizeazaContorCos();
        }
      });
    });
  }

  // Eveniment pentru search bar
  searchBar.addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase();
    const produseFiltrate = produse.filter(p =>
      p.nume.toLowerCase().includes(text) ||
      p.cod.toLowerCase().includes(text) ||
      p.fructeFolosite.toLowerCase().includes(text)
    );
    afiseazaProduse(produseFiltrate);
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const produsNou = {
      cod: document.getElementById("codProdus").value.trim(),
      nume: document.getElementById("numeProdus").value.trim(),
      tip: document.getElementById("tipProdus").value.trim(),
      pret: parseFloat(document.getElementById("pretProdus").value),
      procentZahar: parseFloat(document.getElementById("procentZahar").value),
      procentFructe: parseFloat(document.getElementById("procentFructe").value),
      fructeFolosite: document.getElementById("fructeFolosite").value.trim(),
      imagine: document.getElementById("imagineProdus").value.trim(),
      pentruCopii: document.getElementById("pentruCopii").checked
    };

    if (produse.some(p => p.cod === produsNou.cod)) {
      alert("Există deja un produs cu acest cod!");
      return;
    }

    produse.push(produsNou);
    localStorage.setItem("produse", JSON.stringify(produse));

    afiseazaProduse();
    addForm.reset();
  });

  btnStergere.addEventListener("click", () => {
    const codCautat = codStergereInput.value.trim();

    if (!codCautat) {
      alert("Introduceți codul produsului pentru ștergere.");
      return;
    }

    const index = produse.findIndex(p => p.cod === codCautat);

    if (index === -1) {
      alert("Nu s-a găsit produs cu acest cod.");
      return;
    }

    produse.splice(index, 1);
    localStorage.setItem("produse", JSON.stringify(produse));
    afiseazaProduse();
    codStergereInput.value = "";
  });

  afiseazaProduse();
  actualizeazaContorCos();
});
