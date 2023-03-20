

// ! MENU
const body = document.querySelector("body");
const container = document.querySelector(".container");
const menuDropdown = document.getElementById("menu-dropdown");
const menuDropdownFont = document.getElementById("menu-dropdown__font");
const slider = document.querySelector(".menu-toggle");
const sliderBtn = document.querySelector(".menu-toggle__slider");
const moonSvg = document.querySelector(".menu-toggle-moon__svg");

//!form
const searchInput = document.querySelector("[data-search]");
const searchBtn = document.querySelector("[data-search-btn]");

//!templates
const errorTemplate = document.querySelector("[error-template-data]");
const erorrWrapper = errorTemplate.content.cloneNode(true).children[0];
let source = document.querySelector(".source");
source.style.opacity = "0";

console.log();

//! dictionary
const searchedWord = document.querySelector(".spelling__word .word-holder");
const transcription = document.querySelector(".spelling__word .word-transcription");
console.log(transcription);
const audioBtn = document.querySelector(".spelling__audio");
audioBtn.classList.add("d-non");
const audioTriangle = document.querySelector(".spelling__audio .audio-btn");
let voice = new Audio();
const defenitionsWrapper = document.querySelector(".definitions-wrapper");

// console.log(sourceLinkText);

//? Fetch function
const fetchFunction = (endpoint) => {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${endpoint}`)
        .then((res) => {
            if (!res.ok) {
                showErroor();
                throw new Error("API doesn't have this word");
            }
            hideError();
            return res.json();
        })
}

//? showing error function
const showErroor = () => {
    container.append(erorrWrapper);
    source.style.opacity = "0";
    document.querySelector(".spelling").innerHTML = "";
    document.querySelector(".definitions-wrapper").innerHTML = "";
    document.querySelector(".source").innerHTML = "";
};

//? hide error function
const hideError = () => {
    erorrWrapper.remove();
};

//? audio click function
const handleAudioClick = (audio) => {
    if (
        audioBtn.classList.contains("no-audio") &&
        audioTriangle.classList.contains("no-audio")
    ) {
        voice = null;
    }else{
        audioBtn.classList.add("playing");
        audioTriangle.classList.add("playing");
        voice ? voice.pause() : null;
        voice = new Audio();
        voice.src = audio;
        voice.play();
        voice.addEventListener("ended", () => {
            audioBtn.classList.remove("playing");
            audioTriangle.classList.remove("playing");
        });
    }
    
    if (voice === null) {
        audioBtn.classList.remove("playing");
        audioTriangle.classList.remove("playing");
    }
};

//? toggle class function
const toggleClass = (element, className) => {
    element.classList.toggle(`${className}`);
};

//? change innerHTML function
const changeElement = (element, text) => {
    element.innerHTML = text;
};

//? change theme function
const changeTheme = (theme, element) => {
    theme === "dark"
        ? (body.classList.add("dark"),
            container.classList.add("dark"),
            searchInput.classList.add("dark"),
            audioBtn.classList.add("dark"),
            audioTriangle.classList.add("dark"))
        : (body.classList.remove("dark"),
            container.classList.remove("dark"),
            searchInput.classList.remove("dark"),
            audioBtn.classList.remove("dark"),
            audioTriangle.classList.remove("dark"));
    if(element){
        theme === "dark"
        ? (body.classList.add("dark"),
            element.classList.add("dark"))
        : (body.classList.remove("dark"),
            element.classList.remove("dark"));
    }
};

//? check theme function
const checkTheme = () => {
    if (body.classList.contains("dark")) {
        return "dark";
    }else{
        return "light";
    }
};

//? change font function
const changeFont = (element, font) => {
    menuDropdownFont.innerText = font;

    console.log(element);
    let lowerCasedFont = font.toLowerCase();
    body.style.fontFamily =
        lowerCasedFont === "sans serif"
            ? "sans-serif"
            : lowerCasedFont === "serif"
            ? "serif"
            : `"Inconsolata", monospace`;
};

//*menu dropdown event listener
const newEl = document.createElement("div");
menuDropdown.appendChild(newEl);
newEl.innerHTML = `
        <ul class="font-change d-non">
            <li class="font-change__item">Sans Serif</li>
            <li class="font-change__item">Serif</li>
            <li class="font-change__item">Mono</li>
        </ul>`;
const dNon = document.querySelector(".d-non");
console.log(newEl);
menuDropdown.addEventListener("click", () => {
    toggleClass(newEl, "menu-dropdown-active");
    toggleClass(dNon, "d-non");
    toggleClass(newEl, "dark");
});

//*font change event listener
const fontChangeItems = document.querySelectorAll(".font-change__item");
fontChangeItems.forEach((item) => {
    console.log(item);
    item.addEventListener("click", () => {
        changeFont(item, item.textContent);
    });
});

//*slider event listener
slider.addEventListener("click", () => {
    toggleClass(sliderBtn, "active");
    toggleClass(slider, "active");

    //changing moon svg
    slider.classList.contains("active")
        ? changeElement(
            moonSvg,
            `<svg class="menu-toggle-moon__svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="none" stroke="#A445ED" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"/></svg>`
        )
        : changeElement(
            moonSvg,
            `<svg class="menu-toggle-moon__svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="none" stroke="#838383" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"/></svg>`
        );

    //changing theme
    slider.classList.contains("active")
        ? changeTheme("dark")
        : changeTheme("light");
});

const loadedWords = [];

//* Search input listener
searchBtn.addEventListener("click", () => {
    const value = searchInput.value;
    console.log(value);
    
    fetchFunction(value).then((data) => {
        //! spelling start

        //* audio button listener

        let audio = data[0].phonetics[0].audio;
        if (audio) {
            audioBtn.classList.remove("no-audio");
            audioTriangle.classList.remove("no-audio");
            console.log(audio);
            audioBtn.addEventListener(
                "click",
                handleAudioClick.bind(null, audio)
            );
        } else {
            console.log("No audio");
            audioBtn.classList.add("no-audio");
            audioTriangle.classList.add("no-audio");
        }
        audioBtn.classList.remove("d-non");
        source.style.opacity = "1";

        //* word and transcription
        searchedWord.innerHTML = data[0].word ?? "";
        transcription.innerHTML = data[0].phonetics[0].text ?? "";

        //! spelling finish

        //! defination start
        let word = data[0].word;
        let meanings = data[0].meanings;
        console.log(data[0]);

        // console.log(meanings);
        if (!loadedWords.includes(word)) {
            defenitionsWrapper.innerHTML = "";
            let html = "";
            meanings.forEach((item) => {
                let html = "";
                item.definitions.forEach(item => {
                    
                    // console.log(item);
                    html += `
                    <li class="list__item">
                        <div class="item__dot"></div>
                        <div class="item__text">${item.definition}</div>
                    </li>
                    `;
                });
                console.log(html)

                defenitionsWrapper.innerHTML += `
                            <div class="definition">
                                <div class="divider-wrapper">
                                    <div
                                        id="part-of-speech"
                                        class="part-of-speech"
                                    >${item.partOfSpeech}</div>
                                    <div class="definition-divider divider"></div>
                                </div>
                                <div class="word-data">
                                    <h2
                                        class="word-data__heading"
                                    >Meaning</h2>
                                    <ul class="word-data__list">
                                        ${html}
                                    </ul>
                                </div>
                            </div>
                `;

                //get html for all synonims
                const getAllSynonims = () => {
                    let text = "";
                    item.synonyms.forEach((item) => {
                        text += `
                        <li id="synonyms__item" class="synonyms__item">
                        ${item}
                        </li>
                        `;
                    });
                    return text;
                };
                //get html for all antonyms
                const getAllAntonyms = () => {
                    let text = "";
                    item.antonyms.forEach((item) => {
                        text += `
                        <li id="antonyms__item" class="antonyms__item">
                        ${item}
                        </li>
                        `;
                    });
                    return text;
                };

                if (item.synonyms.length > 0) {
                    console.log(item);
                    defenitionsWrapper.innerHTML += `
                <div class="synonyms-wrapper">
                    <div class="synonyms__heading">
                        Synonyms
                    </div>
                    <ul class="synonyms__list">
                    ${getAllSynonims()}
                    </ul>
                </div>  
                `;
                }
                
                if (item.antonyms.length > 0) {
                    console.log(item);
                    defenitionsWrapper.innerHTML += `
                <div class="antonyms-wrapper">
                    <div class="antonyms__heading">
                        Antonyms
                    </div>
                    <ul class="antonyms__list">
                    ${getAllAntonyms()}
                    </ul>
                </div>  
                    `;
                }
            });
            loadedWords.push(word);

            //*source

            let source = document.querySelector(".source");
            source.innerHTML = `
                        <a href="${data[0].sourceUrls}" class="source-text" target="_blank" rel="noopener noreferrer">Source</a>
                        <a href="${data[0].sourceUrls}" class="source-link" target="_blank" rel="noopener noreferrer">
                            <div
                                class="source-link__text"
                            >${data[0].sourceUrls}</div>
                            <svg
                                class="source-link__icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    fill="none"
                                    stroke="#838383"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"
                                />
                            </svg>
                        </a>
                            
            `;    
        }

        let definationElements = document.querySelectorAll(".definition");
        console.log(definationElements);
        let defenitionDividers = document.querySelectorAll(
            ".defination-divider"
        );

        //*change theme if needed when elements apear
        defenitionDividers.forEach((item) => {
            changeTheme(checkTheme(), item);
        });
        //* change theme onclick
        slider.addEventListener("click", () => {
            defenitionDividers.forEach((item) => {
                changeTheme(checkTheme(), item);
            });
        });

        //! defination end
    });
});

// * listener on pressing enter
searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
    }
});

// console.log("indexJs");