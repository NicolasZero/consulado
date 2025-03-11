if (localStorage.getItem('theme') === 'dark') {
    document.querySelector('html').setAttribute('data-bs-theme', 'dark')
}

// cambiar el tema
const changeTheme = (x) => {
    const html = document.querySelector('html')
    if (x) {
        html.setAttribute('data-bs-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    }else{
        html.removeAttribute('data-bs-theme', 'dark')
        localStorage.setItem('theme', 'light')
    }
}