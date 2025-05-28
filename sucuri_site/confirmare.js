document.addEventListener("DOMContentLoaded", () => {
    const cosProduse = document.getElementById("cosProduse");
    const totalComanda = document.getElementById("totalComanda");
    const confirmComanda = document.getElementById("confirmComanda");
    const confirmareSucces = document.getElementById("confirmareSucces");

    let cos = JSON.parse(localStorage.getItem("cos")) || [];
    let produseVandute = JSON.parse(localStorage.getItem("produseVandute")) || [];

    function afiseazaCos() {
        cosProduse.innerHTML = "";
        if (cos.length === 0) {
            cosProduse.innerHTML = "<p>Coșul este gol.</p>";
            totalComanda.textContent = "Total: 0 lei";
            return;
        }

        let total = 0;
        cos.forEach((produs, index) => {
            const item = document.createElement("div");
            item.classList.add("product-item");
            item.innerHTML = `
                <img src="images/${produs.imagine}" alt="${produs.nume}" style="max-width: 60px; height: auto; border-radius: 5px; margin-right: 1rem;">
                <span class="product-name">${produs.nume}</span>
                <span class="product-price">${produs.pret.toFixed(2)} lei</span>
                <button class="remove-btn" data-index="${index}">Șterge</button>
            `;
            cosProduse.appendChild(item);
            total += produs.pret;
        });
        totalComanda.textContent = `Total: ${total.toFixed(2)} lei`;
    }

    cosProduse.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.getAttribute("data-index");
            cos.splice(index, 1);
            localStorage.setItem("cos", JSON.stringify(cos));
            afiseazaCos();
        }
    });

    confirmComanda.addEventListener("click", () => {
        if (cos.length === 0) {
            alert("Coșul este gol!");
            return;
        }
        produseVandute = produseVandute.concat(cos);
        localStorage.setItem("produseVandute", JSON.stringify(produseVandute));
        cos = [];
        localStorage.setItem("cos", JSON.stringify(cos));

        // Ascunde coșul și afișează imaginea de confirmare + butonul "Înapoi la cumpărături"
        cosProduse.style.display = "none";
        totalComanda.style.display = "none";
        confirmComanda.style.display = "none";
        confirmareSucces.style.display = "block";
    });

    afiseazaCos();
});
