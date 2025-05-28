// Funcție de utilitate pentru afișarea produselor în carduri
function afiseazaProduse(produse, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    if (produse.length === 0) {
        container.innerHTML = "<p>Nu există rezultate.</p>";
        return;
    }
    const grid = document.createElement("div");
    grid.className = "product-grid";
    produse.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="images/${p.imagine}" alt="${p.nume}" style="max-width:100%; height:auto; border-radius:5px;">
            <h4>${p.nume}</h4>
            <p><strong>Preț:</strong> ${p.pret.toFixed(2)} lei</p>
            <p><strong>Fructe folosite:</strong> ${p.fructeFolosite}</p>
            <p><strong>Cod:</strong> ${p.cod}</p>
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

// Funcție de utilitate pentru afișarea unui mesaj simplu
function afiseazaRezultat(text, containerId) {
    document.getElementById(containerId).innerHTML = text;
}

// 3) Cel mai ieftin produs - suc natural
function showCheapestNatural() {
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const naturale = produse.filter(p => p.tip.toLowerCase().includes("natural"));
    if (naturale.length === 0) {
        afiseazaRezultat("Nu există sucuri naturale.", "result-cheapest-natural");
        return;
    }
    const celMaiIeftin = naturale.reduce((min, p) => p.pret < min.pret ? p : min, naturale[0]);
    // Afișează și cardul produsului cel mai ieftin
    afiseazaProduse([celMaiIeftin], "result-cheapest-natural");
    // Opțional: poți adăuga și textul explicativ
    // document.getElementById("result-cheapest-natural").innerHTML += `<p>Cel mai ieftin suc natural: ${celMaiIeftin.nume} (${celMaiIeftin.pret.toFixed(2)} lei)</p>`;
}

// 4) Sucuri cu zahăr mai mic de X%, ordonate descrescător după preț
function showLowSugarOrdered() {
    const x = parseFloat(document.getElementById("x-value").value);
    if (isNaN(x)) {
        alert("Introduceți valoarea X!");
        return;
    }
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const filtrate = produse.filter(p => p.procentZahar < x);
    const ordonate = filtrate.sort((a, b) => b.pret - a.pret);
    afiseazaProduse(ordonate, "result-low-sugar");
}

// 5) Sucuri naturale cu peste Z% fructe și peste Y% zahăr
function showNaturalFruitSugar() {
    const z = parseFloat(document.getElementById("z-value").value);
    const y = parseFloat(document.getElementById("y-value").value);
    if (isNaN(z) || isNaN(y)) {
        alert("Introduceți valorile Z și Y!");
        return;
    }
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const filtrate = produse.filter(p => 
        p.tip.toLowerCase().includes("natural") && 
        p.procentFructe > z && 
        p.procentZahar > y
    );
    afiseazaProduse(filtrate, "result-natural-fruit-sugar");
}

// 6) Tipul de fructe cel mai des folosit
function showMostUsedFruit() {
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const fructe = {};
    produse.forEach(p => {
        const lista = p.fructeFolosite.split(',').map(f => f.trim());
        lista.forEach(f => {
            if (f) fructe[f] = (fructe[f] || 0) + 1;
        });
    });
    let max = 0;
    let celMaiFolosit = "";
    for (const f in fructe) {
        if (fructe[f] > max) {
            max = fructe[f];
            celMaiFolosit = f;
        }
    }
    afiseazaRezultat(`Cel mai des folosit fruct: ${celMaiFolosit} (${max} apariții)`, "result-most-used-fruit");
}

// 7) Tabelă cu sucuri pentru copii
function showKidsJuices() {
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const pentruCopii = produse.filter(p => p.pentruCopii);
    afiseazaProduse(pentruCopii, "result-kids-juices");
}

// 8) Media prețurilor sucurilor naturale
function showAverageNaturalPrice() {
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const naturale = produse.filter(p => p.tip.toLowerCase().includes("natural"));
    if (naturale.length === 0) {
        afiseazaRezultat("Nu există sucuri naturale.", "result-average-natural");
        return;
    }
    const suma = naturale.reduce((sum, p) => sum + p.pret, 0);
    const media = suma / naturale.length;
    afiseazaRezultat(`Media prețurilor sucurilor naturale: ${media.toFixed(2)} lei`, "result-average-natural");
}

// 9) Cele mai populare produse (ordine descrescătoare)
function showMostPopular() {
    const produseVandute = JSON.parse(localStorage.getItem("produseVandute")) || [];
    const contor = {};
    produseVandute.forEach(p => {
        contor[p.cod] = (contor[p.cod] || 0) + 1;
    });
    const produse = JSON.parse(localStorage.getItem("produse")) || [];
    const populare = produse
        .filter(p => contor[p.cod])
        .sort((a, b) => contor[b.cod] - contor[a.cod])
        .map(p => ({ ...p, vandute: contor[p.cod] }));
    // Afișează produsele în carduri
    afiseazaProduse(populare, "result-most-popular");
    // Opțional: poți adăuga și numărul de vânzări în carduri
    // (dar asta necesită modificarea funcției afiseazaProduse)
}

// 10) Numărul produselor vândute într-o zi
function showSoldToday() {
    const produseVandute = JSON.parse(localStorage.getItem("produseVandute")) || [];
    afiseazaRezultat(`Produse vândute astăzi: ${produseVandute.length}`, "result-sold-today");
}
