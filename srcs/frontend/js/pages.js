
import {user_info} from './verify.js';

console.log(`user_info: ${user_info}`);

const pages = {
    'local' : `../local/assets/index-B1SPyu0o.js`,
    'tournament' : `../tournament/assets/index-CA4DSkTv.js`,
    
    'landing': `
        <header class="header">
        <nav class="navbar">
            <a href="home" class="navlink">HOME</a>
            <a href="landing" class="navlink">landing</a>
        </nav>
    </header>
<section class="all" id="all">
        <div class=search-bar id="search-bar">
            <input type="text" class="search" id="search" placeholder="Search">
            <div class="search-div" ><img  id="search-icon" class="search-icon" src="../images/search.png"></div>
        </div>
    <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    <img class="bottoml" src="../images/bottom_left.png">
    <section class="items" >
        <img class="leaf l1" src="../images/file.png">
        <img class="leaf l2" src="../images/file.png">
        <img class="leaf l3" src="../images/file.png">
        <img class="leaf l4" src="../images/file.png">
        <img class="leaf l5" src="../images/file.png">
        <img class="leaf l6" src="../images/file.png">
        <img class="leaf l7" src="../images/file.png">
        <img class="leaf l8" src="../images/file.png">
        <img class="leaf l9" src="../images/file.png">
        <div class="abs-items">
            <img class="image" src="../images/samurai.png">
            <div class="text">
                <div class="our">OUR</div>
                <div   class="ping">PING&nbsp;PONG</div>
            </div>
        </div>
    </section>
    <img class="topr" src="../images/top_right.png">
    <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    <div id="notifid" class="notif-box"><a class="notif"><img class="notif-icon" src="../images/notification.png"></a></div>
</section>
    `,
    'home': `
        <header class="header">
        <nav class="navbar">
        <a href="home" class="navlink">HOME</a>
        <a href="landing" class="navlink">LANDING</a>
        </nav>
        </header>
        <section class="all">
        <div class=search-bar>
            <input type="text" class="search" id="search" placeholder="Search">
            <div class="search-div" ><img  class="search-icon" src="../images/search.png"></div>
        </div>
        <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
            <img class="bottoml" src="../images/bottom_left.png">
            <img class="leaf l1" src="../images/file.png">
            <img class="leaf l2" src="../images/file.png">
            <img class="leaf l3" src="../images/file.png">
            <img class="leaf l4" src="../images/file.png">
            <img class="leaf l5" src="../images/file.png">
            <img class="leaf l6" src="../images/file.png">
            <img class="leaf l7" src="../images/file.png">
            <img class="leaf l8" src="../images/file.png">
            <img class="leaf l9" src="../images/file.png">
            <section class="banner">
               <div class="slider" style="--quantity: 3">
                    <a href="my-profile" class="navlink item p" style="--position: 1"><img  src="../images/profile.png"></a>
                    <a href="local" class="navlink item v" style="--position: 2"><img  src="../images/1vs1.png"></a>
                    <a href="leaderboard" class="navlink item l" style="--position: 3"><img   src="../images/leaderbord.png"></a>
                    <a href="tournament" class="navlink item b" style="--position: 4"><img  src="../images/battel.png"></a>
               </div>
           </section>
           <img class="samurai" src="../images/samurai.png">
           <img class="topr" src="../images/top_right.png">

        <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
        <div id="notifid" class="notif-box"><a class="notif"><img class="notif-icon" src="../images/notification.png"></a></div>
</section>
    `,
    'onevone': `    <canvas id="three-canvas"></canvas>
    <script src="/Users/hamdani/Desktop/ft_trance/srcs/game/frontend/src/js/main.js" type="module"></script>`,
    'signup': `
    <div id="items" class="items">
    <section class="box">
        <img class="bottomlc" src="../images/bottom_left.png">
        <div class="warpper">
            <img class="leaf l1" src="../images/file.png">
            <img class="leaf l2" src="../images/file.png">
            <img class="leaf l3" src="../images/file.png">
            <img class="leaf l4" src="../images/file.png">
            <img class="leaf l5" src="../images/file.png">
            <img class="leaf l6" src="../images/file.png">
            <img class="leaf l7" src="../images/file.png">
            <img class="leaf l8" src="../images/file.png">
            <img class="leaf l9" src="../images/file.png">
            <a class="wlm">WELCOME</a>
            <a  class="gs">Get Started With Us</a>
            <a class="navlink btn" href="signin">SIGNUP or SIGNIN</a>
        </div>
        <img class="toprc" src="../images/top_right.png">
    </section>
    <img class="sideImg" src="../images/japan.jpg">
</div>
    <div id="boxsin" class="signin-box">
            <div class="box-1">
                    <img src="https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        class="" alt="">
            </div>
            <div class="body-box">
                <div class="close"><a class="close-button navlink">✖<a></div>
                <div class=" box-2 d-flex flex-column h-100">
                    <div class="mt-5">
                        <p class="mb-3 h-1 title">Create Account.</p>
                        <div class="d-flex right flex-column ">
                            <input type="text" name="Username" placeholder="Username" id="Username" class="Uname mb-3">
                            <input type="email" name="email" placeholder="Email" id="email" class="email mb-3">
                            <input type="password" name="password" placeholder="Password" id="password" class="passwd mb-3">
                            <input type="password" name="password" placeholder="Repeat Password" id="Rpassword" class="passwd mb-3">
                            <div class="mt-3">
                                <p class="mb-0 text-muted">Already have an account or Intra?</p>
                                <a href="login-box" class="navlink bttn btn-primary signin">Log in</a>
                            </div>
                            <div class="register-box"><a class="navlink register" href="register">Register</a></div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    <div id="boxlogin" class="login-box">
        <div class="box-1">
                <img src="https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    class="" alt="">
        </div>
        <div class="body-box">
            <div class="close"><a class="close-button navlink">✖<a></div>
                <div class=" box-2 d-flex  flex-column h-100">
                    <div class="mt-5">
                        <p class="mb-3 h-1 title">Login.     . . .</p>
                        <div class="d-flex right flex-column ">
                            <input type="text" name="Username" placeholder="Username" id="PUsername" class="Uname mb-3">
                            <input type="password" name="password" placeholder="Password" id="Ppassword" class="passwd mb-3">
                            <div class="navlink textbox" ><p id="error"></p><a href="forgot-password" class="mb-0 navlink text-muted">Forgot&nbsp;password?</a></div>
                            <div class="mt-3 login">
                                <a href="login-in" class="navlink bttn btn-primary login">Login</a>
                        </div>
                        
                        <div class="divider">
                            <span>or login with</span>
                        </div>
                        <div class="mt-3 login">
                            <a href="intra" class="navlink intra-btn">
                                Intra   <img class="logo42" src="../images/42_logo.svg">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>`,
    'my-profile':`
      <img class="leaf l1" src="../images/file.png">
    <img class="leaf l2" src="../images/file.png">
    <img class="leaf l3" src="../images/file.png">
    <img class="leaf l4" src="../images/file.png">
    <img class="leaf l5" src="../images/file.png">
    <img class="leaf l6" src="../images/file.png">
    <img class="leaf l7" src="../images/file.png">
    <img class="leaf l8" src="../images/file.png">
    <img class="leaf l9" src="../images/file.png">
    <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    <section id="items" class="content">
        <section class="setting"><a class="navlink" href="home" ><img class="home" src="../images/Home.png"> </a><a class="navlink" href="settingbox" ><img class="settingicon" href="settingbox" src="../images/Setting_line.png"></a></section>
        <img class="charry" src="../images/cherry.png">
            <section class="pinfo">
                <img class="pimg" id="pffimg" src="">
                <section class="baruser">
                    <a id="userName" class="username"></a>
                    <span class="lvlbar"><span class="reach"></span></span>
                </section>
            </section>
            <section class="tables">
                <li class="matches">
                    <a class="block-line match">YUSEF vs DFF</a>
                    <a class="block-line match">YUSEF vs DFF</a>
                    <a class="block-line match">YUSEF vs DFF</a>
                    <a class="block-line match">YUSEF vs DFF</a>
                    <a class="block-line match">YUSEF vs DFF</a>
                </li>
                <li id="friends" class="friends">
                </li>
            </section>
            <a href="logout" class="navlink logout">LOGOUT</a>
            
    </section>
            <div id="setting-box" class="setting-box">
                <div class="body-box">
                            <div class="close" id="close">✖</div>
                            <div class="imgbox">
                                <img id="pfimg" class="pfimg" src="">
                            <div class="editbox"><input type="file" id="file" accept="image/*"><label for="file" id="uploadButton" class="edite"><img class="edit" src="../images/Group 70.png"></label></div>
                            </div>
                            <p class="title">USERNAME</p>
                            <input type="text" name="Username" placeholder="Username" id="Username" class="Uname mb-3">
                            <p class="title">PASSWEORD</p>
                            <input type="password" name="password" placeholder="Password" id="password" class="passwd mb-3">
                            <p class="title">REPEAT PASSWORD</p>
                            <input type="password" name="password" placeholder="Repeat Password" id="password" class="passwd mb-3">
                            <p class="title">DOWNLOAD DATA</p>
                            <div class="btn download">
                                <a id="download-data" class="bttn btn-primary down"><img src="../images/Icon(2).png"></a>
                            </div>                        
                            <p class="title">ENCRYPT DATA</p> 
                            <div class="btn encrypt">
                                <a id="encrypt-data" class="bttn btn-primary crypt"><img src="../images/Icon(1).png"></a>
                            </div>
                            <p class="title">DELETE DATA</p>
                            <div class="btn delete">
                                <a id="delete-data" class="bttn btn-primary delete"><img src="../images/Icon.png"></a>
                            </div>
                            <p class="title">2FA</p>
                            <div class="qrcode">
                               <a id="2fa-on" class="bttn btn-primary QR on">ON</a><a id="2fa-off" class="bttn btn-primary QR off">OFF</a>
                            </div>
                    <a id="savechange">SAVE</a>
                </div>
                </div>
    <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    <div id="notifid" class="notif-box"><a class="notif"><img class="notif-icon" src="../images/notification.png"></a></div>
    `
    , 'onevone':`
<section class="all">
    <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    <img class="bottoml" src="../images/bottom_left.png">
    <div class="content">
        <a class="you"><img class="youimg" src="../images/profile.png">ynafiss</a>
        <a class="vs" >VS</a>
        <a class="oponent"><img class="opoimg" src="../images/1vs1.png">...</a>
    </div>
    <img class="topr" src="../images/top_right.png">
    <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
</section>`,
    'leaderboard':`<header class="header">
        <nav class="navbar">
            <a class="navlink" href="home">HOME</a>
            <a class="navlink" href="#">ABOUT</a>
        </nav>
    </header>
    <section class="all">
            <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
            <img class="bottoml" src="../images/bottom_left.png">
            <div class="board">
                <div class="topthree">
                    <div class="card c"><img class="third" src="../images/profile.png">
                        <div class="infodiv">
                            <a>YUSEF</a>
                            <div class="twin">
                                <a>LVL ...</a>
                                <a>T WIN ...</a>
                            </div>
                            <div class="nwin">
                                <a>WIN ...</a>
                                <a>LOSE ...</a>
                            </div>
                        </div>
                    </div>
                    <div class="card a"><img class="first" src="../images/profile.png">
                        <div class="infodiv">
                            <a>YUSEF</a>
                            <div class="twin">
                                <a>LVL ...</a>
                                <a>T WIN ...</a>
                            </div>
                            <div class="nwin">
                                <a>WIN ...</a>
                                <a>LOSE ...</a>
                            </div>
                        </div>
                    </div>
                    <div class="card b"><img class="second" src="../images/profile.png">
                        <div class="infodiv">
                            <a>YUSEF</a>
                            <div class="twin">
                                <a>LVL ...</a>
                                <a>T WIN ...</a>
                            </div>
                            <div class="nwin">
                                <a>WIN ...</a>
                                <a>LOSE ...</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="therest">
                    <div class="rest" ><img class="restimg" src="../images/profile.png"> <a>YUSEF ...</a> <a>LVL ...</a><a>WIN ...</a><a>LOSE ...</a><a>T WIN ...</a></div>
                    <div class="rest" ><img class="restimg" src="../images/profile.png"> <a>YUSEF ...</a> <a>LVL ...</a><a>WIN ...</a><a>LOSE ...</a><a>T WIN ...</a></div>
                    <div class="rest" ><img class="restimg" src="../images/profile.png"> <a>YUSEF ...</a> <a>LVL ...</a><a>WIN ...</a><a>LOSE ...</a><a>T WIN ...</a></div>


                </div>
            </div>
            <img class="topr" src="../images/top_right.png">
            <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
            <img class="leaf l1" src="../images/file.png">
            <img class="leaf l2" src="../images/file.png">
            <img class="leaf l3" src="../images/file.png">
            <img class="leaf l4" src="../images/file.png">
            <img class="leaf l5" src="../images/file.png">
            <img class="leaf l6" src="../images/file.png">
            <img class="leaf l7" src="../images/file.png">
            <img class="leaf l8" src="../images/file.png">
            <img class="leaf l9" src="../images/file.png">
        </section>`,
};

export { pages };