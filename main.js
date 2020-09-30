window.addEventListener('load', () => {
    handleDevsFetch().then(result => {
        mapUsers(result);
    })
});

async function handleDevsFetch() {
    const res = await fetch("http://localhost:3001/devs");
    const json = await res.json();
    const data = json.map(item => {
        treatedName = item.name;
        treatedName = treatedName.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
        treatedName = treatedName.toLowerCase();
        item.devName = treatedName;
        return item;
    })
    return data;
}

let devsFiltered = [];
let selections = []

function mapUsers(data) {
    howManyDevs(data.length)
    for (let x = 0; x < data.length; x++) {
        const languages = data[x].programmingLanguages.map(infos => {
            return {
                language: infos.language
            }
        });
        const users = {
            name: data[x]['name'],
            email: data[x]['email'],
            img: data[x]['picture'],
            languages: languages
        }
        loadUser(users)
    }
}

function howManyDevs(data) {
    const container = document.getElementById('howDevs');
    container.innerHTML = ""
    container.innerHTML += `${data} Dev's searched`
}

function loadUser(user) {
    let lang = ""
    const languages = user.languages;
    for (let x = 0; x < languages.length; x++) {
        if (languages[x]['language'] == 'Java') {
            lang += `<img src='./images/java.png' width='28px' height='28px' alt='java'>`
        } else if (languages[x]['language'] == 'Python') {
            lang += `<img src='./images/python.webp' width='28px' height='28px' alt='java'>`
        } else {
            lang += `<img src='./images/javascript.png' width='28px' height='28px' alt='java'>`
        }
    }
    const container = document.getElementById('peoples');
    const card = document.createElement('div');
    card.classList = 'card-body';
    const content =
        `
    <div class="container col s4">
    <div style="border-radius: 10px;;" class="card-body lighten-3 card-panel green lighten-1 ">
    <div class=''><img style="border-radius: 50%;" src="${user.img}" width='60px' alt='userimg'/></div>
    <div class='' id="langImg">${lang}</div>
    <div class=''><label style='color:white'>${user.name}</label></div>
    <div/>
    `


    container.innerHTML += content
}

function filterDevs(e) {
    let nameToFilter = e.target.value;
    //regex para filtrar o nome tirando espaços,acentos e letras maiusculas
    nameToFilter = nameToFilter.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').toLowerCase();

    const div = document.getElementById('peoples');

    const data = handleDevsFetch().then(result => {
        const filteredNames = result.filter(item => {
            return item.devName.includes(`${nameToFilter}`);
        })
        if (filteredNames != "") {
            div.innerHTML = ""
            mapUsers(filteredNames)
            devsFiltered = filteredNames
        }
    })
}


const inputName = document.getElementById('devName');
const checkBoxes = document.querySelectorAll('input[type=checkbox]');
console.log(checkBoxes)
setTimeout(() => {
    inputName.addEventListener('input', filterDevs);
}, 0);

function filterEorOU(languages, condition) {
    const div = document.getElementById('peoples')
    console.log(languages, condition)
    if (devsFiltered.length > 0) {
        devsFiltered = devsFiltered.filter(dev => {
            if (condition == "OU") {
                return dev.programmingLanguages.some(devlang => languages.includes(devlang.language))
            } else {
                return dev.programmingLanguages.map(devlang => devlang.language).join("") === languages.join("");
            }
        })
        div.innerHTML = ""
        mapUsers(devsFiltered);
    } else {
        const data = handleDevsFetch().then(result => {
            const x = result.filter(dev => {
                if (condition == "OU") {
                    return dev.programmingLanguages.some(devlang => languages.includes(devlang.language))
                } else {
                    return dev.programmingLanguages.map(devlang => devlang.language).join("") === languages.join("");
                }
            })
            div.innerHTML = ""
            mapUsers(x)
        })

    }

}
const radioButtons = document.querySelectorAll('input[type=radio]');
radioButtons.forEach((button) => {
    return button.addEventListener('change', function () {
        const selections = document.querySelectorAll('[type="checkbox"]:checked');
        const values = [...selections].map(x => x.value);
        filterEorOU(values, button.value)
    })
});  
