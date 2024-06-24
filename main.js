var $video = document.getElementById('video');
var $videoTitle = document.getElementById('video-title');
var $videoDescription = document.getElementById('video-description');
var $episodesList = document.getElementById('episodes-list');
var $arcsList = document.getElementById('arcs-list');

var arcs = [];
var episodes = [];
var currentVideoIndex = 0; 

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
                    <img src="${video?.imgUrl}" alt="episode-img" />
                    <p>${video.title}</p>
                </article>
                </a>
            </li>`
            )
        })

        $video.src = episodes[currentVideoIndex]?.videoUrl;
        $videoTitle.innerHTML = episodes[currentVideoIndex].title;
        $videoDescription.innerHTML = episodes[currentVideoIndex].description;
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


    episodes = await fetchEpisodes(0)
    renderData(episodes);
});

$arcsList.addEventListener('click', async function (e) {
    const { id } = e.target.closest('article');
    currentVideoIndex = 0;
    episodes = await fetchEpisodes(id);
    renderData(episodes);
})

$episodesList.addEventListener('click', function (e) {
    const { id } = e.target.closest('article');

    console.log(id)

    if (id !== currentVideoIndex){
        currentVideoIndex = id;
        $video.src = episodes[currentVideoIndex].videoUrl;
        $videoTitle.innerHTML = episodes[currentVideoIndex].title;
        $videoDescription.innerHTML = episodes[currentVideoIndex].description;
    }
})
