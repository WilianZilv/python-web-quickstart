"use client"

export function getCurrentUser() {

}
export function signOut() {
    fetch("/api/users/sign_out").then(() => {
        window.location.href = "/"
    })

}

export function getUserData(){
    const cookies = document.cookie

    const user_data_raw = cookies.split(";").find((cookie) => cookie.includes("user_data"))

    if (!user_data_raw) {
        return {}
    }

    let base64 = user_data_raw.trim().replace("user_data=", "")
    if (base64.startsWith('"')) base64 = base64.slice(1, -1)

    return JSON.parse(atob(base64))
}