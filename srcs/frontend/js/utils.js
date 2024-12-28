import { pages } from './pages.js';
import { loginProcess, registerProcess, intraAuth} from './auth.js';
import { checkAccess, checkpagetype} from './file.js';
import { user_info } from './verify.js';
import { setCookie , getCookie , deleteCookie , checkCookie } from './cookies_utils.js';
import { Router } from './router.js';


const boxes = {
    'signin' : `boxsin`,
    'login-box' : `boxlogin`,
    'settingbox' : `setting-box`,
    'forgot-password' : 'fpassbox'
    
};

const boxpages = {
    'signin' : `signup`,
    'login-box' : `signup`,
    'forgot-password' : 'signup',
    'settingbox' : `my-profile`
}

const check = ['boxsin', 'boxlogin', 'setting-box', 'fpassbox'];


function resetPageLayout() {
    const appDiv = document.getElementById('app');
    appDiv.style.display = 'none';
    appDiv.offsetHeight; // Force reflow
    appDiv.style.display = ''; // Restore layout
}

export function loadStylesheet(href) {
    const stylesheets = document.querySelectorAll('style, link[rel="stylesheet"]');
    stylesheets.forEach(sheet => sheet.remove());
    
    resetPageLayout();
    // Create and append the new stylesheet link
    const link = document.createElement('link');
    const link1 = document.createElement('link');
    const link2 = document.createElement('link');
    link.rel = 'stylesheet';
    link1.rel = 'stylesheet';
    link2.rel = 'stylesheet';
    link.href = href;
    link1.href = "https://fonts.googleapis.com/css2?family=Koulen&display=swap";
    link2.href = "https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap";
    document.head.appendChild(link);
    document.head.appendChild(link1);
    document.head.appendChild(link2);
}


function    addprofileinfo(data){
    if (data) {
        user_info.avatar = data.avatar || '';
        user_info.username = data.nickname || '';
        user_info.friends = data.friendships || [];
        user_info.id = data.id || '';
    } else {
        console.error('Data is undefined');
    }
    
}

function logoutprocess(){
    fetch('auth/logout/', {
        method: 'POST',
        headers: {
            'Authorization': `JWT ${getCookie('access_token')}`
        }
    })
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    user_info.avatar = '';
    user_info.username = '';
    user_info.friends = undefined;
    user_info.id = undefined;
    Router.go('signup');
}



export function closebox(){
    check.forEach(box => {
        const signinbox = document.getElementById(box);
        if (signinbox)
            signinbox.style.display = 'none';
    });
    document.getElementById('items').style.filter = 'none';
}



async function setting(){
    let avatar = document.getElementById('pfimg');
    avatar.src = `${user_info.avatar}`;
    document.getElementById('savechange').addEventListener('click', function() {
        const fileInput = document.getElementById('file');
        const name = document.getElementById('Username').value;
        const file = fileInput.files[0];
        if (file || name || password) {
            const formData = new FormData();
            if (name)
                formData.append('nickname', name);
            // if (password)
            //     formData.append('password', password);
            if (file)
                formData.append('avatar', file);
            fetch('profile/update/', {
                method: 'PUT',
                headers: {
                    'Authorization': `JWT ${getCookie('access_token')}`
               },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the profile image on the page
                    const avatar = document.getElementById('pffimg');
                    user_info.avatar = data.filename;
                    avatar.src = `/uploads/${data.filename}`;
                } else {
                    console.error('Upload failed:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.error('No file selected');
        }
        Router.go('my-profile');
    });
    document.getElementById('2fa-on').addEventListener('click', async function() {
        console.log(getCookie('access_token'));
        await fetch('auth/2fa/enable/', {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${getCookie('access_token')}`
           }
        })
        let qr = document.createElement('div');
        qr.id = 'qr';
        qr.style.display = 'flex';
        qr.style.justifyContent = 'center';
        qr.style.alignItems = 'center';
        qr.style.position = 'absolute';
        qr.style.top = '50%';
        qr.style.left = '50%';
        qr.style.transform = 'translate(-50%, -50%)';
        qr.style.backgroundColor = '#dfd3b3';
        qr.style.width = '20vw';
        qr.style.height = '20vw';
        qr.style.border = '1px solid black';
        let img = document.createElement('img');
        img.src = `/qrcodes/qr_code_${user_info.username}.png`;
        img.style.width = '15vw';
        img.style.height = '15vw';
        img.style.objectFit = 'cover';
        qr.appendChild(img);
        qr.style.zIndex = '1000';
        document.body.appendChild(qr);
        document.addEventListener('click', function(event) {  
            if (event.target.id != 'qr' && event.target.id != '2fa-on'){
               let QR =  document.getElementById('qr');
               if (QR)
                QR.remove();
            }
        });
    })
    document.getElementById('2fa-off').addEventListener('click', function() {
        console.log(getCookie('access_token'));
        fetch('auth/2fa/disable/', {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${getCookie('access_token')}`
           }
        })
    })
    document.getElementById("download-data").addEventListener('click', async function() {
        await fetch('auth/download/', {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${getCookie('access_token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            a.click();
            URL.revokeObjectURL(url);
        })  
    })
    console.log(getCookie('access_token'));
    document.getElementById("delete-data").addEventListener('click', function() {
        fetch('auth/delete/', {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${getCookie('access_token')}`
            }
        })
        Router.go('signup');
        })
    document.getElementById('encrypt-data').addEventListener('click', function() {
        fetch('auth/anonymize/', {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${getCookie('access_token')}`
            }
        })
        document.getElementById('encrypt-data').style.backgroundColor = 'rgba(171, 224, 169, 1)';

    })
}


function checkQueryString(){
    const queryString = window.location.search;

    // Example: Get a specific query parameter (e.g., "name")
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    console.log(code);
    if (code){
        fetch(`auth/intra/redirect/?code=${code}`, {
            method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setCookie('access_token', data.access, 1);
        setCookie('refresh_token', data.refresh, 3);
        document.getElementById('items').style.filter = 'blur(0px)';
        if (data.twofa === true){
            // document.getElementById('items').style.filter = 'blur(5px)';
            let twofabox = document.createElement('div');
            let header = document.createElement('h1');
            header.innerHTML = 'Enter 2FA code';
            twofabox.appendChild(header);
            twofabox.id = 'twofa';
            twofabox.style.width = '50vw';
            twofabox.style.height = '20vh';
            twofabox.style.position = 'absolute';
            twofabox.style.display = 'flex';
            twofabox.style.flexDirection = 'column';
            // twofabox.style.justifyContent = 'center';
            twofabox.style.alignItems = 'center';
            twofabox.style.top = '50%';
            twofabox.style.left = '50%';
            twofabox.style.transform = 'translate(-50%, -50%)';
            twofabox.style.backgroundColor = 'white';
            let twofaboxcontent = document.createElement('input');
            twofaboxcontent.id = 'twofa_code';
            twofaboxcontent.style.width = '50%';
            twofaboxcontent.style.height = '10%';
            twofaboxcontent.style.position = 'absolute';
            twofaboxcontent.style.top = '50%';
            twofaboxcontent.style.left = '50%';
            twofaboxcontent.style.transform = 'translate(-50%, -50%)';
            twofabox.appendChild(twofaboxcontent);
            let twofaboxbutton = document.createElement('button', 'submit-code', 'submit', 'submit', 'submit');
            twofaboxbutton.style.width = '50%';
            twofaboxbutton.id = 'submit-code';
            twofaboxbutton.style.height = '10%';    
            twofaboxbutton.style.position = 'absolute'; 
            twofaboxbutton.style.top = '60%';   
            twofaboxbutton.style.left = '50%';
            twofaboxbutton.style.transform = 'translate(-50%, -50%)';
            twofabox.appendChild(twofaboxbutton);
            twofabox.style.zIndex = '100';
            
            console.log('ess: ', data);
            document.body.appendChild(twofabox);
            document.getElementById('submit-code').addEventListener('click', async() => {
                const code = document.getElementById('twofa_code').value;
                console.log(code);
                await fetch('auth/2fa/verify/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${getCookie('access_token')}`
                    },
                    body: JSON.stringify({ code: code })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error){
                        document.getElementById('error').innerHTML = data.error;
                        deleteCookie('access_token');
                        deleteCookie('refresh_token');
                        Router.go('signup');
                        return;
                    }
                    console.log('Success: ', data);
                    document.getElementById('twofa').style.display = 'none';
                    document.getElementById('items').style.filter = 'blur(0px)';
                    Router.go('landing');
                })
                .catch((error) => {
                    console.error('Error:',error);
                });
                
            });
        }
        else
         Router.go('landing');
    });
    }
}


function loadExternalScript(src) {
    // Remove the old script if it exists
    const existingScript = document.getElementById('js_script');
    if (existingScript) {
        existingScript.remove();
    }

    // Create a new script element
    const script = document.createElement('script');
    script.id = 'js_script';
    script.src = src;

    // Append the script to the document
    document.body.appendChild(script);

    script.onload = () => {
        console.log(`${src} loaded successfully`);
    };
}

export async function GetContentPage(page) {
    const appDiv = document.getElementById('app');
    let data;
    // Dynamically load stylesheets based on the page
    checkQueryString();
    if (checkpagetype(page) == true){
        console.log(page, "page");
        switch (page) {
        case 'home':
            data = await checkAccess( 'profile/me/');
            if (data == false){
                Router.go('signup');
                return;
            }
            loadStylesheet('../css/Hpage.css');
            break;
        case 'landing': 
            data = await checkAccess( 'profile/me/');
            if (data == false){
                Router.go('signup');
                return;
            }
            loadStylesheet('../css/Lpage.css');
            break;
        case 'signup':
            loadStylesheet('../css/Login.css');
            break;
        case 'my-profile':
            data = await checkAccess('profile/me/');
            if (data != false){
                addprofileinfo(data);
                loadStylesheet("../css/profile.css");
            }
            else if (data == false){
                Router.go('signup');
                return;
            }
            break;    
        case 'onevone':
            data = await checkAccess( 'profile/me/');
            if (data == false){
                Router.go('signup');
                return;
            }
            loadStylesheet('../css/1v1.css');
            break;
        case 'leaderboard':
            data = await checkAccess( 'profile/me/');
            if (data == false){
                Router.go('signup');
                return;
            }
            loadStylesheet('../css/lb.css');
            break;
        case '/':
            loadStylesheet('../css/landing.css');
            break;
        default:
            break;
        }
        appDiv.innerHTML = ``;
        if (page != 'local' && page != 'tournament')
            appDiv.innerHTML = pages[page] || pages['landing'];
        else
            loadExternalScript(pages[page]);
        if (page == 'my-profile'){
            let username = document.getElementById('userName');
            username.innerHTML = user_info.username; 
            let avatar = document.getElementById('pffimg');
            avatar.src = `${user_info.avatar}`;
            let friendlist = document.getElementById('friends');
            user_info.friends.forEach(friend => {
                let frienddiv = document.createElement('a');
                frienddiv.href = `/profile/${friend.id}/`;
                frienddiv.className = 'block-line friend';
                frienddiv.innerHTML = friend.nickname;
                frienddiv.style.textDecoration = 'none';
                frienddiv.style.display = 'flex';
                frienddiv.style.justifyContent = 'space-between';
                frienddiv.style.color = 'black';
                let image = document.createElement('img');
                image.src = friend.avatar;
                image.className = 'fimg';
                image.style.width = '3vw';
                image.style.height = '3vw';
                image.style.objectFit = 'cover';
                image.style.border = '1px solid black';
                image.style.marginLeft = '.5vw';
                const redButton = document.createElement('button');
                redButton.classList.add('btn', 'delete-firend');
                redButton.textContent = '🔴🟢';
                redButton.style.cursor = 'pointer';
                redButton.style.border = "none" ;
                redButton.dataset.userId = friend.id;
                redButton.style.marginRight = '.5vw';
                redButton.style.backgroundColor = "transparent" //
                // redButton.addEventListener('click', fevent => {
                //     fetch(`profile/friendship/${friend.id}/`, {
                //         method: 'DELETE',
                //         headers: {

                // })
                frienddiv.insertBefore(image, frienddiv.firstChild);
                frienddiv.appendChild(redButton);
                friendlist.appendChild(frienddiv);

            });
        }
    }
    else if (page in boxes){
        check.forEach(box => {
            const signinbox = document.getElementById(box);
            if (signinbox)
                signinbox.style.display = 'none';
        });
        const signinbox = document.getElementById(boxes[page]);
        if (!signinbox){
            Router.go(boxpages[page]);
            Router.go(page);
            return;
        }
        signinbox.style.display = 'flex';
        signinbox.style.zIndex = '1000';
        document.getElementById('items').style.filter = 'blur(5px)';
        if (page == 'settingbox'){
            setting();
        }
    }
    
    switch(page){
        case 'register':
            registerProcess();
            break;
        case 'login-in':
            loginProcess();
            break;
        case 'logout':
            logoutprocess();
            break;
        case 'intra':
            intraAuth();
        default:
            break;
    }
}


export function GetPageName(url) {
    if (url == '/' && checkAccess('profile/me/') === false){
        return 'signup';
    }
    else if (url == '/'){
        return 'landing'; // Default to 'home' if URL part is empty
    }
    const lastPart = url.split('/').pop();
    return lastPart || 'landing';
}

export function fadeOutPage(callback) {
    const appDiv = document.getElementById('app');
    appDiv.classList.remove('show'); // Trigger fade-out
    setTimeout(() => {
        callback(); // Call the callback function to load the next page
    }, 500); // Wait for the fade-out animation to complete (500ms as per CSS)
}

export function fadeInPage() {
    const appDiv = document.getElementById('app');
    appDiv.classList.add('show'); // Trigger fade-in
}
