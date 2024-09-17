
export function getCurrentUser() {

}
export function signOut() {
    fetch("/api/users/sign_out").then(() => {
        window.location.href = "/"
    })

}

function getUserDataClientSide(){

        const cookies = document.cookie
        
        const user_data_raw = cookies.split(";").find((cookie) => cookie.includes("user_data"))
        
        if (!user_data_raw) {
            return {}
    }
    
    let base64 = user_data_raw.trim().replace("user_data=", "")
    if (base64.startsWith('"')) base64 = base64.slice(1, -1)
        
        return JSON.parse(atob(base64))
        

}

function getUserDataServerSide() {

    const cookies = require("next/headers").cookies

    let userDataBase64 = cookies().get("user_data")?.value

    if (userDataBase64 !== undefined){
      
      
      if (userDataBase64.startsWith('"')) userDataBase64 = userDataBase64.slice(1, -1)
        
        const user = userDataBase64 ? JSON.parse(atob(userDataBase64)) : null
        
        return user
      }
}


export function getUserData(){

    if (typeof window !== "undefined") {
        return getUserDataClientSide()
    } else {
        return getUserDataServerSide()
    }
}