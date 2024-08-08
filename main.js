var $video = document.getElementById('video');
var $videoTitle = document.getElementById('video-title');
var $videoOverlay = document.getElementById('video-overlay');
var $videoDescription = document.getElementById('video-description');
var $videoSpinning = document.getElementById('video-spinning');
var $episodesList = document.getElementById('episodes-list');
var $arcsList = document.getElementById('arcs-list');
var $sliderArrowRigth = document.getElementById('slider-arrow-rigth');
var $sliderArrowLeft = document.getElementById('slider-arrow-left');


var arcs = [];
var episodes = [];
var currentVideoIndex = 0; 
var currentArcIndex = 0;

const API_URL = 'https://one-pace-one.vercel.app'

async function fetchArcs() {
    try {
        let response = await fetch(`${API_URL}/arcs`);
        let parseData = await response.json();

        return parseData;
    } catch (error) {
        console.error('Error fetching video data:', error);
        return null;
    }
}

async function fetchEpisodes(arc) {
    try {
        let response = await fetch(`${API_URL}/arcs/${arc}`);
        let parseData = await response.json();

        return parseData.episodes;
    } catch (error) {
        console.error('Error fetching video data:', error);
        return null;
    }
}

function renderData(episodes){
    $episodesList.innerHTML = '';

    if (Array.isArray(episodes) && episodes.length > 0) {
        episodes.map((video, index) => {
            $episodesList.innerHTML += (`
            <li>
                <a href="#video-container">
                <article id="${index}">
                    <img src="${arcs[currentArcIndex]?.imgUrl}" alt="episode-img" />
                    <p>${video.title}</p>
                </article>
                </a>
            </li>`
            )
        })

        $video.src = episodes[currentVideoIndex]?.videoUrl;
        $videoTitle.innerHTML = episodes[currentVideoIndex].title;
        $videoDescription.innerHTML = episodes[currentVideoIndex].description ?? 'La descripción de los capítulos no están disponibles.';
    } else {
        console.error('No video data found.');
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    arcs = await fetchArcs();

    arcs.map((arc, index) => {
        $arcsList.innerHTML += (`
            <li>
                <a href="#episodes-list">
                    <article id=${index}>
                        <img src="${arc.imgUrl}" alt="arc-img">
                        <p>${arc.title}</p>
                    </article>
                </a>
            </li>`
        )
    })

    const arcIndex = localStorage.getItem('currentArcIndex') ?? 0;

    episodes = await fetchEpisodes(arcIndex)

    currentVideoIndex = localStorage.getItem('currentEpisodeIndex') ?? 0;

    renderData(episodes);
});

$arcsList.addEventListener('click', async function (e) {
    const { id } = e.target.closest('article');

    currentArcIndex = id;

    saveCurrentView(currentArcIndex, currentVideoIndex);
    episodes = await fetchEpisodes(currentArcIndex);
    renderData(episodes);
})

$episodesList.addEventListener('click', function (e) {
    const { id } = e.target.closest('article');

    if (id !== currentVideoIndex){
        currentVideoIndex = id;
        $video.src = episodes[currentVideoIndex].videoUrl;
        $videoTitle.innerHTML = episodes[currentVideoIndex].title;
        $videoDescription.innerHTML = episodes[currentVideoIndex].description;
    }

    saveCurrentView(currentArcIndex, currentVideoIndex);
})

$video.onended = async function () {
    if (currentVideoIndex < episodes.length - 1) {
        currentVideoIndex++;

        $video.src = episodes[currentVideoIndex].videoUrl;
        $videoTitle.innerHTML = episodes[currentVideoIndex].title;
        $videoDescription.innerHTML = episodes[currentVideoIndex].description;
    } else {
        currentArcIndex++;
        currentVideoIndex = 0;
        episodes = await fetchEpisodes(currentArcIndex);
        renderData(episodes);
    }
};

$video.addEventListener('loadstart', function(){
    $videoSpinning.style.display = 'block'
})

$video.addEventListener('loadedmetadata', function() {
    if (currentVideoIndex !== 0){
        this.currentTime = 110
    }
    $videoSpinning.style.display = 'none'

}, false);

$video.addEventListener('seeked', function() {

    if ($video.onloadeddata){
        $videoSpinning.style.display = 'block'
    }

    if ($video.paused) {
        $video.play();
    }
});

$video.onplay = function () {
    $videoOverlay.style.display = 'none';
    $video.setAttribute('controls', true);
}

$video.onpause = function () {
    $videoOverlay.style.display = 'block';
    
    $video.removeAttribute('controls');
}

$videoOverlay.addEventListener('click', function () {
    $video.play()
})

$sliderArrowRigth.addEventListener('click', function() {
    $sliderArrowLeft.style.display = 'flex'
    const scrollAmount = 850;
    

    $arcsList.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
})

$sliderArrowLeft.addEventListener('click', function() {
    const scrollAmount = -1000;
    $sliderArrowRigth.style.display = 'flex'
    
    $arcsList.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
})

$arcsList.addEventListener('scroll', function() {
    const maxScrollLeft = this.scrollWidth - this.clientWidth;

    if (this.scrollLeft === 0) {
        $sliderArrowLeft.style.display = 'none'
    } else if (this.scrollLeft >= maxScrollLeft) {
        $sliderArrowRigth.style.display = 'none'
    }
});

function saveCurrentView(currentArcIndex, currentEpisodeIndex) {
    localStorage.setItem('currentArcIndex', currentArcIndex);
    localStorage.setItem('currentEpisodeIndex', currentEpisodeIndex);
} 