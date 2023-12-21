createLogInPage()

function createLogInPage() {
    const loginPage = document.createElement("div")
    loginPage.style.width = "100vw"
    loginPage.style.height = "100vw"
    loginPage.innerHTML = `<div id="loginPage">
    <div id="login_signup_card">
      <input type="text" id="username" placeholder="enter username" />
      <input type="text" id="password" placeholder="enter password" />
      <div id="buttons_box">
        <button id="login">Login</button>
        <button id="signup">Sign-up</button>
      </div>
    </div>`
  body_page.appendChild(loginPage)


  login.addEventListener("click", function() {
    const usernametxt = username.value
    const passwordtxt = password.value
    const userIdValue = usernametxt.concat(passwordtxt)
    const userID = {'userID' : userIdValue}
    fetch(`http://localhost:3001/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(userID),
  })
  .then((response) => response.json())
  .then((responsestate) => {if (responsestate.at(0) === "true") {
    setTimeout(1000)
    loginPage.remove()
  } 
  else {
    const invalid = document.createElement("div")
    invalid.innerHTML = `<h1>${responsestate}</h1><button id="loginFail">Try Again</button>`
    login_signup_card.appendChild(invalid)
    loginFail.addEventListener("click", function () {
        invalid.remove()
    })
  }})
  .catch((err) => {console.log(err);})    
  })
}

