window.addEventListener('load', () => {
    catchFetch().then(function (result) {
        mapUsers(result);
    });
})

function catchFetch() {
    return fetch('http://localhost:3001/devs').then(function (response) {
        return response.json();
    }).then(function (json) {
        return json;
    });
}



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
    let lang = []
    const languages = user.languages;
    for (let x = 0; x < languages.length; x++) {
        if (languages[x]['language'] == 'Java') {
            lang.push(languages[x]['language'])
        } else if (languages[x]['language'] == 'Python') {
            lang.push(languages[x]['language'])
        } else {
            lang.push(languages[x]['language'])
        }
    }
    const container = document.getElementById('peoples');
    const card = document.createElement('div');
    card.classList = 'card-body';
    const content =
        `
    <div class="container col s4">
    <div style="border-radius: 10px;;" class="card-body lighten-3 card-panel blue darken-1 ">
    <div class=''><img style="border-radius: 50%;" src="${user.img}" width='60px' alt='userimg'/></div>
    <div class='' id="langImg">${lang}</div>
    <div class=''><label style='color:white'>${user.name}</label></div>
    <div/>
    `


    container.innerHTML += content
}

function filterByName(e) {
    let nameToFilter = e.target.value;
    var div = document.getElementById('peoples')
    catchFetch().then(function (result) {
        let data = result;
        data = data.filter(item => {
            return item.name.split(" ")[0].toLowerCase() == nameToFilter.split(" ")[0].toLowerCase();
        })
        div.innerHTML = ""
        mapUsers(data)
        if (data == "") {
            mapUsers(result);
        }
    })

}

function filterByJava(e) {
    const checkOption = e.target.value;
    const div = document.getElementById('peoples');
    const javaInput = document.getElementById('check-java');
    const jsInput = document.getElementById('check-javascript');
    const pyInput = document.getElementById('check-python');



    catchFetch().then(function (result) {
        let data = result;


        if (javaInput.checked == true && jsInput.checked == true) {
            let filtered = data.filter(item => {
                return item.programmingLanguages.includes('Java') ;
            })
            div.innerHTML = "";
            console.log(filtered);
        } else {

            let filteredByJava = data.filter(item => {
                for (let x = 0; x < item.programmingLanguages.length; x++) {
                    return item.programmingLanguages[x].language == checkOption;
                }
            })
            div.innerHTML = ""
            mapUsers(filteredByJava)
            howManyDevs(filteredByJava.length)
        }
    });
}




const inputName = document.getElementById('devName');
setTimeout(() => {
    inputName.addEventListener('keyup', filterByName);
}, 5000)


const checkJava = document.querySelectorAll('input[type=checkbox]');
checkJava.forEach(item => {
    item.addEventListener('change', filterByJava)
})
