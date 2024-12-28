import { Router } from './router.js'; 
import { setCookie , getCookie , deleteCookie , checkCookie } from './cookies_utils.js';

export function loginProcess(){
    const loginbox = document.getElementById('boxlogin');

    const uname = document.getElementById('PUsername').value;
    const passwd = document.getElementById('Ppassword').value;
    const formatData = {
        username: uname,
        password: passwd
    };

    fetch('auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formatData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error){
            loginbox.style.display = 'flex';
            document.getElementById('items').style.filter = 'blur(5px)';
            document.getElementById('error').innerHTML = data.error;
            return;
        }
        setCookie('access_token', data.access, 1);
        setCookie('refresh_token', data.refresh, 3);
        loginbox.style.display = 'none';
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
})
    .catch((error) => {
        console.error('Error:',error);
    });
}



export function registerProcess(){
    const signinbox = document.getElementById('boxsin');

    const uname = document.getElementById('Username').value;
    const mail = document.getElementById('email').value;
    const passwd = document.getElementById('password').value;
    const rpasswd = document.getElementById('Rpassword').value;
    signinbox.style.display = 'none';
    document.getElementById('items').style.filter = 'blur(0px)';
    const formatData = {
        username: uname,
        email: mail,
        password: passwd,
        password2 : rpasswd
        
    };
    //console.log(formatData);
    fetch('auth/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formatData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success: ', data);
        Router.go('login-box');
    })
    .catch((error) => {
        console.error('Error:',error);
    });
}





export function intraAuth() {
    const authUrl = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5c46e24dcfb7f0d8a56c2f9fb6b7700409c61f6626445e1a365f4fb8ab8824fe&redirect_uri=https%3A%2F%2Fwww.transc-net.com%2F&response_type=code"
    // Redirect the user to the 42 OAuth authorization URL
    window.location.href = authUrl;

}

// export function handleExternalLoginRedirect() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
    
//     if (code) {
//         // Send the authorization code to the backend for token exchange
//         fetch('auth/intra/register/', {
//             method: 'GET',
//             // headers: {
//             //     'Content-Type': 'application/json',
//             // },
//             // body: JSON.stringify({ code: code })  // Pass the code to the backend
//         })
//         .then(response => response.json())
//         .then(data => {
//             // Handle the response, which contains the access token and refresh token
//             const accessToken = data.access_token;
//             const refreshToken = data.refresh_token;

//             // Store the tokens in cookies or localStorage
//             setCookie('access_token', accessToken, 1);  // Store access token in cookie for 1 day
//             setCookie('refresh_token', refreshToken, 1);  // Store refresh token in cookie for 1 day

//             // Now that the tokens are obtained and stored, redirect to the landing page
//             window.location.href = 'https://www.transc-net.com/landing';  // Redirect to your desired landing page
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     }
// }
// // Optional: Function to fetch user data with access token (if you need it)
// function fetchJsonFile(accessToken) {
//     const apiUrl = 'https://api.intra.42.fr/v2/me'; // Fetch user data (or any other API call)

//     fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${accessToken}`
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the fetched data (e.g., display user data)
//         console.log('User Data:', data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// // Call handleExternalLoginRedirect when the page loads
// window.onload = handleExternalLoginRedirect;
// // export function intraAuth() {
// //     const clientId = 'u-s4t2ud-0dd4f7670577b98323a90a12463127923e807b51d4357d2523fc6201a3ca834a'; // Replace with your actual client ID
// //     const redirectUri = encodeURIComponent('https://www.transc-net.com/'); // Ensure this matches your app's redirect URI
// //     const responseType = 'code';
// //     const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;

// //     // Redirect the user to the 42 OAuth authorization URL
// //     window.location.href = authUrl;
// // }

// // export function handleExternalLoginRedirect() {
// //     console.log("handleExternalLoginRedirect");
// //     const urlParams = new URLSearchParams(window.location.search);
// //     const code = urlParams.get('code');
// //     if (code) {
// //         // Send the authorization code to the backend for token exchange
// //         fetch(`auth/intra/register/`, {
// //             method: 'GET',
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             },
// //             // body: JSON.stringify({ code: code })
// //         })
// //         .then(response => {
// //             if (!response.ok) {

// //                 throw new Error('Network response was not ok');
// //             }
// //             return response.json();
// //         })
// //         .then(data => {
// //             // Handle the response, which contains the access and refresh tokens
// //             if (data.access_token && data.refresh_token) {
// //                 const accessToken = data.access_token;
// //                 const refreshToken = data.refresh_token;

// //                 // Store the tokens in cookies
// //                 setCookie('access_token', accessToken, 1); // Store for 1 day
// //                 setCookie('refresh_token', refreshToken, 3); // Store for 3 days

// //                 // Redirect to the landing page
// //                 window.location.href = '/landing'; // Ensure this is the correct path to your landing page
// //             } else {
// //                 console.error('Tokens not received:', data);
// //             }
// //             Router.go('landing');
// //         })
// //         .catch(error => {
// //             console.error('Error during token exchange:', error);
// //         });
// //     } else {
// //         console.error('No authorization code found in the URL');
// //     }
// // }

// // // Call handleExternalLoginRedirect when the page loads
// // window.onload = handleExternalLoginRedirect;