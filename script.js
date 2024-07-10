document.addEventListener('DOMContentLoaded', () => {
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');
    let count = parseInt(localStorage.getItem('likeCount') || '0');
    likeCount.textContent = count;

    const hasLiked = localStorage.getItem('hasLiked') === 'true';
    if (hasLiked) {
        likeButton.classList.add('liked');
    }

    likeButton.addEventListener('click', async () => {
        if (!hasLiked) {
            likeButton.classList.add('liked');
            count++;
            likeCount.textContent = count;
            localStorage.setItem('likeCount', count.toString());
            localStorage.setItem('hasLiked', 'true');

            try {
                const userInfo = await getUserInfo();
                sendLikeData(userInfo);
            } catch (error) {
                console.error('Error al obtener o enviar datos del usuario:', error);
            }
        }
    });
});

async function getUserInfo() {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();

    const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
    const geoData = await geoResponse.json();

    return {
        ip: ipData.ip,
        country: geoData.country_name,
        city: geoData.city,
        region: geoData.region,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timestamp: new Date().toISOString()
    };
}

function sendLikeData(userInfo) {
    // Enviar datos a Make.com
    fetch('https://hook.us1.make.com/63sr7nqchnyuq5hgkfyawr6jzam4vomi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    })
    .then(response => response.json())
    .then(data => console.log('Éxito:', data))
    .catch((error) => console.error('Error:', error));
}