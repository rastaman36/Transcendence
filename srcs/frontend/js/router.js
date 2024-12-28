import { GetPageName, GetContentPage, fadeOutPage, fadeInPage , closebox} from './utils.js';
import { getCookie } from './cookies_utils.js';





let notif = false;

async function notificationList(){
    let response = await fetch('profile/friend/request/list/', {
        method: 'GET',
        headers: {
            'Authorization': `JWT ${getCookie('access_token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
            return data;

    })
    .catch(error => {
        return ['No friend requests'];
    });
    return response;
}


async function notification(event, notifBox){         
    const link = event.target.closest('div.notif-box');
    //console.log('Hovering over:', link); // For debugging
    if (link) {
        notifBox.style.width = '30vw';
        notifBox.style.height = 'auto';
        notifBox.style.borderRadius = '5%';
        notifBox.style.display = 'flex';
        notifBox.style.flexDirection = 'column';
        const iconLink = notifBox.querySelector('.notif-icon');
        iconLink.style.display = 'none';
        let notifications = await notificationList();
        console.log('Notifications:', notifications);
        if (notifications.length == 0){
            const newA = document.createElement('a');
            newA.style.color = '#d8163d';
            newA.style.textDecoration = 'none';
            newA.style.backgroundColor = '#FFDEB8';
            newA.style.marginBottom = '15px';
            newA.style.marginTop = '15px';
            newA.style.width = '90%';
            newA.style.textAlign = 'center';
            newA.style.height = '50px';
            newA.style.display = 'flex';
            newA.style.justifyContent = 'center';
            newA.textContent = 'No friend requests';
            newA.href = '#';  // You can modify the href as needed
            newA.classList.add('notif');
            notifBox.appendChild(newA);  // Append the new <a> to the .notif-box
        }
        notifications.forEach(content => {
            const newA = document.createElement('a');
            newA.style.color = 'black';
            newA.style.textDecoration = 'none';
            newA.style.backgroundColor = '#FFDEB8';
            newA.style.marginBottom = '15px';
            newA.style.marginTop = '15px';
            newA.style.width = '90%';
            newA.textContent = content.sender;
            newA.href = '#';  // You can modify the href as needed
            newA.classList.add('notif');
            const greenButton = document.createElement('button');
            greenButton.textContent = '✔️';
            greenButton.classList.add('btn', 'green-btn');
            greenButton.style.border = "none" ;
            greenButton.style.cursor = 'pointer';
            greenButton.dataset.userId = content.id;
            greenButton.style.backgroundColor = "transparent"  // Add classes for styling
            
            // 4. Create the Red Button
            const redButton = document.createElement('button');
            redButton.classList.add('btn', 'red-btn');
            redButton.textContent = '❌';
            redButton.style.cursor = 'pointer';
            redButton.style.border = "none" ;
            redButton.dataset.userId = content.id;
            redButton.style.backgroundColor = "transparent" // Set text content from the array
            const secoundA = document.createElement('a');
            redButton.style.marginLeft = '15px';
            secoundA.appendChild(greenButton);  // Add the green button to the <a>
            secoundA.appendChild(redButton); // Set text content from the array
            secoundA.style.display = 'flex';
            secoundA.style.marginRight = '5px';
             // Add the 'notif' class for styling
            const newImg = document.createElement('img');
            newImg.src = content.avatar; 
            newImg.setAttribute('id' , 'user-img');
            newImg.style.width = '50px';
            newImg.style.height= '50px';
            newImg.style.objectFit = 'cover';
            newA.appendChild(secoundA);
            newA.insertBefore(newImg, newA.firstChild);
            newA.style.display = 'flex';
            newA.style.justifyContent = 'space-between';
            notifBox.appendChild(newA);  // Append the new <a> to the .notif-box
        });
        notif = true;
    }
}

function notificationRemove(notifBox){
    const iconLink = notifBox.querySelector('.notif-icon');
    iconLink.style.display = '';
    const allLinks = notifBox.querySelectorAll('.notif');
    allLinks.forEach(link => {
        link.remove();
    });
    notifBox.style.display= '';
    notifBox.style.justifyContent = '';
    notifBox.style.alignItems = '';
    notifBox.style.backgroundColor= '';
    notifBox.style.position= '';
    notifBox.style.left = '';
    notifBox.style.bottom= '';
    notifBox.style.width= '';
    notifBox.style.height= '';
    notifBox.style.borderRadius = '';
    notifBox.style.transition= '';
    notifBox.style.cursor= '';
    notifBox.appendChild(iconLink);

    notif = false;
    
}
async function  fetchResults(query) {
    const apiUrl = `profile/search/${query}`;
    
    // Fetch data from the server
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `JWT ${getCookie('access_token')}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Access token is valid');
            return  response.json();
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

function showresault(resultes){
    console.log("i am here");
        let searchBox = document.createElement('div');

        searchBox.style.width = '23vw';
        searchBox.style.height = 'auto';
        searchBox.style.borderRadius = '5%';
        searchBox.style.display = 'flex';
        searchBox.style.justifyContent = 'center';
        searchBox.style.alignItems = 'center';
        searchBox.style.flexDirection = 'column';
        searchBox.style.backgroundColor = '#E9BF8D';
        searchBox.style.position = 'absolute';
        searchBox.style.zIndex = '100';
        searchBox.style.right = '5%';
        searchBox.id = 'search-box';
        resultes.forEach(content => {
            const newA = document.createElement('a');
            newA.style.color = 'black';
            newA.style.textDecoration = 'none';
            newA.style.backgroundColor = '#FFDEB8';
            newA.style.marginBottom = '5px';
            newA.style.marginTop = '5px';
            newA.style.width = '90%';
            newA.textContent = content.nickname;
            newA.href = '#';  // You can modify the href as needed
            newA.classList.add('notif');
            const addButton = document.createElement('img');
            addButton.src = '../images/add-user.png';
            addButton.style.border = "none" ;
            addButton.style.marginRight = '15px';
            addButton.style.cursor = 'pointer';
            addButton.style.width = '15px';
            addButton.style.height = '15px';
            addButton.textContent = `${content.id}`;
            addButton.classList.add('add-friend');
            const newImg = document.createElement('img');
            newImg.src = content.avatar; 
            newImg.style.width = '50px';
            newImg.style.height = '50px';
            newImg.style.objectFit = 'cover';
            newImg.classList.add('user-icon');
            newA.appendChild(addButton);
            newA.insertBefore(newImg, newA.firstChild);
            newA.style.display = 'flex';
            newA.style.justifyContent = 'space-between';
            newA.style.border = '1px solid #d8163d';
            searchBox.appendChild(newA);  // Append the new <a> to the .notif-box
        });

    document.getElementById('all').appendChild(searchBox);
}


const Router = {
    isInitialized: false, // Flag to prevent duplicate initialization
    
    init: () => {
        if (Router.isInitialized) return; // Exit if already initialized
        Router.isInitialized = true;
        const currentPage = GetPageName(window.location.pathname);
        console.log('Current page:', window.location.pathname);
        Router.go(currentPage);
        
        document.getElementById('app').classList.add('show');
        
        // Set up navigation click handling
        document.addEventListener('click', event => {
            const link = event.target.closest('a.navlink');
            if (link) {
                event.preventDefault(); // Prevent default anchor behavior
                const route = link.getAttribute('href'); // Get the href value
                //console.log('Navigating to:', route);
                Router.go(route); // Navigate using your Router logic
            }
        });




        document.addEventListener('input', async event => {
         event.preventDefault();
        const searchBar = document.getElementById('search-icon');
        const searchBox = document.getElementById('search-box');
        if (searchBox)
            searchBox.remove();
        if (searchBar){
            console.log('Searching for:');
                    const query = document.getElementById('search').value;
                    let resultes = await fetchResults(query);
                    console.log("results == ", resultes);
                    if (Array.isArray(resultes))
                        showresault(resultes);
            }
        });
        document.addEventListener('click', async event => {
            const addButton = event.target.closest('img.add-friend');
            if (addButton){
                const user = addButton.parentElement.textContent;

                console.log('Adding user:', `profile/friend/request/${addButton.textContent}`);
                const response = await fetch(`profile/friend/request/${addButton.textContent}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `JWT ${getCookie('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => {
                    if (response.status === 201) {
                        console.log('Friend request sent');
                        return response.json();
                    }
                    if (response.status === 200) {
                        console.log('not found');
                        return response.json();
                    }
                })
                .then(data => {
                    console.log('Success:', data);
                    return data;
                })
                .catch(error => {
                    console.error('Error:', error);
                    return false;
                });
                if (response){
                    console.log('Friend request sent');
                    const searchBox = document.getElementById('search-box');
                    searchBox.remove();
                }
            }
        });



        document.addEventListener('click', event => {
            const closeBox  = event.target.closest('div.close');
            console.log('Close box:', closeBox);
            if (closeBox){
                closebox();
            }
        });

        document.addEventListener('click', event => {
            event.preventDefault();
            const rejectButton = event.target.closest('button.red-btn');
            if (rejectButton){
                const response = fetch(`profile/friend/reject/${rejectButton.dataset.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `JWT ${getCookie('access_token')}`
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        console.log('Friend request rejected');
                        return true;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return false;
                });
                if (response){
                    console.log('Friend request rejected');
                    const notifBox = document.getElementById('notifid');
                    notificationRemove(notifBox);
                }
            }
    });
    document.addEventListener('click', event => {
        event.preventDefault();
        const acceptButton = event.target.closest('button.green-btn');
        if (acceptButton){
            const response = fetch(`profile/friend/accept/${acceptButton.dataset.userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `JWT ${getCookie('access_token')}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                    console.log('Friend request accepted');
                    return true;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return false;
            });
            if (response){
                console.log('Friend request accepted');
                const notifBox = document.getElementById('notifid');
                notificationRemove(notifBox);
            }
        }
    });

        document.addEventListener('click', event => {
            const notifBox = document.getElementById('notifid');
            const searchBox = document.getElementById('search-box');

            if (notif == false)
                notification(event, notifBox);
            if (notif == true && !notifBox.contains(event.target)) {
                notificationRemove(notifBox);
            }
            if (searchBox && !searchBox.contains(event.target)) {
                searchBox.remove();
            }
        });
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.route) {
                Router.go(event.state.route, false);
            }
        });
    },

    go: (route, pushState = true) => {
        const currentPage = GetPageName(route);
        console.log('Navigating to:', route);
        // Fade out current content, then load new page
        fadeOutPage(() => {
            // Load the new content
            GetContentPage(currentPage);
            fadeInPage(); // Fade in new content
            
            if (pushState) {
                // Push to history so we can handle back/forward navigation
                history.pushState({ route: currentPage }, '', currentPage);
            }
        });
    }
};


export  { Router } ;