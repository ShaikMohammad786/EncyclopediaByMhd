const button = document.getElementById("set");
const resultDiv = document.querySelector(".result");
const form = document.querySelector("form");

button.addEventListener("click", (e) => {
    e.preventDefault();
    getinfo(form.elements[0].value);
});

const getinfo = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const info = await response.json();
        console.log(info);

        if (!info || !info[0]) {
            resultDiv.innerHTML = "No definition found.";
            return;
        }

        let output = `<strong>Word:</strong> ${info[0].word}`;

        if (info[0].phonetics.length > 0) {
            output += ` ${info[0].phonetics[0].text || ""}`;
            if (info[0].phonetics.length > 2) {
                output += ` ${info[0].phonetics[2].text || ""}`;
            }

            info[0].phonetics.forEach((phonetic) => {
                if (phonetic.audio) {
                    output += ` <span class="playbtn" data-audio="${phonetic.audio}" style="cursor:pointer;">🎵</span>`;
                }
            });
        }

        output += "<br>";

        if (info[0].meanings[0].definitions.length > 0) {
            output += `<strong>Definition:</strong> ${info[0].meanings[0].definitions[0].definition}`;
        }

        info[0].meanings.forEach((meaning) => {
            if (meaning.partOfSpeech) {
                output += `<br><strong>Part of Speech as</strong> ${meaning.partOfSpeech}`;
            }
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                output += ` :- <strong>Synonyms:</strong> ${meaning.synonyms.slice(0, 2).join(", ")}`;
            }
        });

        output += "<br>";

        if (info[0].meanings[0].antonyms && info[0].meanings[0].antonyms.length > 0) {
            output += `<strong>Antonyms:</strong> ${info[0].meanings[0].antonyms.join(", ")}`;
        }

        output += "<br>";

        resultDiv.innerHTML = output;

      
        document.querySelectorAll(".playbtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                let audio = new Audio(btn.dataset.audio);
                audio.play();
            });
        });

    
        if (info[0].sourceUrls.length > 0) {
            if (!document.querySelector("#readmorebtn")) {
                let btn = document.createElement("button");
                btn.textContent = "Read More";
                btn.id = "readmorebtn";
                btn.addEventListener("click", () => {
                    window.open(info[0].sourceUrls[0], "_blank");
                });
                btn.style.border = "none";
                btn.style.borderRadius = "2px";
                btn.style.backgroundColor = "rgba(255, 106, 0, 0.748)";
                btn.style.height = "50px";
                btn.style.width = "100px";
                btn.style.fontSize = "20px";
                btn.style.marginBottom="2%";

                resultDiv.appendChild(btn);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultDiv.innerHTML = "Error fetching definition. Please try again.";
    }
};
