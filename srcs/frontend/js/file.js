import { loadStylesheet } from './utils.js';
import { Router } from './router.js';
import { setCookie , getCookie , deleteCookie , checkCookie } from './cookies_utils.js';


export function    checkpagetype(url){
    let tab = ['home', 'landing', 'my-profile', 'onevone', 'leaderboard', 'signup', 'local', 'tournament'];
    return tab.includes(url);
}


function checkerefresh(){
    if (!checkCookie('refresh_token'))
        return false;
    fetch('auth/login/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh: getCookie('refresh_token')
        })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the new access token
        //console.log('New access token:', data);
        setCookie('access_token', data, 1);
        return true;
    })
    .catch(error => {
        console.error('Error refreshing token:', error);
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        Router.go('signup');
        return false;
    });
}

export async function checkAccess(endpoint){
    if (getCookie('access_token') === '')
        return false;
    //console.log(`Access token: ${getCookie('access_token')}`);
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
             'Authorization': `JWT ${getCookie('access_token')}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Access token is valid');
            return  response.json();
        } else {
                checkerefresh()
                return false;
        }
    })
    .then(data => {
        console.log('Success:', data);
        return data;
    })
    .catch(error => {
        return false;
    });
    return response;
}

document.addEventListener("DOMContentLoaded", () => {
    Router.init();
});
if(document.getElementById('.friends'))
{document.getElementById('.friends').addEventListener('wheel', function(event) {
    event.preventDefault();
    const scrollSpeed = 2; // Adjust this value to control the scroll speed
    this.scrollTop += event.deltaY * scrollSpeed;
});
}


// Initialize the router
Router.init();
