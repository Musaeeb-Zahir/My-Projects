
let currentsong = new Audio();
let songs;
let currfolder;
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    //Show all the songs in playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=" ";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
      <img class="invert" src="music.svg" alt="">
      <div class="info">
          <div class="songname"> ${song.replaceAll("%20", " ")}</div>
          <div class="artistname">M_Zee</div>
      </div>
      <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
      </div> </li>`;

    }
    //Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

}
//functiion for play music 
const PlayMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg";

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00/00";
}
//function for time uodate
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds <= 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
// async function displayalbums(){
//     let a = await fetch(`http://127.0.0.1:5500/songs/}`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;  
//     console.log(div);
    
// }

async function main() {
    //get the list of song
    await getSongs("song/ncs");
    PlayMusic(songs[0], true)
    
   //display all album
    // displayalbums();

    //Atach an event listener to play,next and previous btn
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "play.svg"
        }
    })
    //listen for time updated event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = currentsong.currentTime / currentsong.duration * 100 + "%";

    })

    //add an eventlistener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;

    })

    //add Event listener for hambarger
    document.querySelector(".hambarger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px";
    })

    //add Event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add event listener for next btn
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice("-1")[0])

        if (index + 1 < songs.length)
            PlayMusic(songs[index + 1])
    })
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice("-1")[0])
        if (index - 1 >= 0)
            PlayMusic(songs[index - 1])
    })

    //add event listener to volume
    document.querySelector(".range").addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100

    })

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async (item) => {
            songs = await getSongs(`song/${item.currentTarget.dataset.folder}`);

        })

    })
}
main()