const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const LOCALSTORAGE_Save = 'hi'

const cd = $('.cd')
const heading = $('header h2')
const cdimg = $('.cd-thumb')
const audio = $('#audio')
const btnPlay = $('.btn-toggle-play')
const playing = $('.player')
const loadPlaying = $('#progress')
const next = $('.btn-next')
const prev = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isTimeUpdate: false,
    arrSong: [],

    songs: [
        {
            name: 'BBIBBI',
            singer: 'IU',
            music: './assets/music/BBIBBI - IU.wav',
            img: './assets/img/BBIBBIIU.jpg',
        },
        {
            name: 'Blueming',
            singer: 'IU',
            music: './assets/music/Blueming - IU.flac',
            img: './assets/img/BluemingIU.jpg'
        },
        {
            name: '23',
            singer: 'IU',
            music: './assets/music/Twenty-Three - IU.flac',
            img: './assets/img/23IU.jpg'
        },
        {
            name: 'Celebrity',
            singer: 'IU',
            music: './assets/music/Celebrity - IU.flac',
            img: './assets/img/CelebrityIU.jpg'
        },
        {
            name: 'Coin',
            singer: 'IU',
            music: './assets/music/Coin - IU.flac',
            img: './assets/img/CoinIU.png'
        },
        {
            name: 'Lilac',
            singer: 'IU',
            music: './assets/music/Lilac - IU.flac',
            img: './assets/img/LilacIU.png'
        },
        {
            name: 'Holiday',
            singer: 'SNSD',
            music: './assets/music/Holiday - Girls_ Generation.flac',
            img: './assets/img/HolidaySNSD.jpg'
        },
        {
            name: 'Lion Heart',
            singer: 'SNSD',
            music: './assets/music/Lion Heart - Girls_ Generation.flac',
            img: './assets/img/LionHeartSNSD.jpg'
        }],

    // Chuyển dữ liệu từ JSON thành JS
    config: JSON.parse(localStorage.getItem(LOCALSTORAGE_Save)) || {},

    // set dữ liệu thành JSON
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(LOCALSTORAGE_Save, JSON.stringify(this.config));
    },

    // load dữ liệu ra màn hình
    loadConfig() {
        this.isRepeat = this.config.isRepeat || this.isRepeat;
        this.isRandom = this.config.isRandom || this.isRandom;
        this.currentIndex = this.config.currentIndex || this.currentIndex;
        this.currentTime = this.config.currentTime || this.currentTime;
        random.classList.toggle('active', this.isRandom)
        repeat.classList.toggle('active', this.isRepeat)
    },
    render: function () {
        const html = this.songs.map((song, index) => { // render ra thông tin từng bài hát
            return (
                `<div class="song" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
            )
        })
        playlist.innerHTML = html.join('')
    },
    handleEvent: function () {
        const _this = this;
        // animate quay ảnh
        const cdAnimate = cdimg.animate([{ transform: 'rotate(360deg)' }], { duration: 10000, iterations: Infinity });
        cdAnimate.pause();

        const cdWidth = cd.offsetWidth // lấy ra width mặc định ban đầu
        document.onscroll = function () {  // xử lý phóng to thu nhỏ img
            const scroll = window.scrollY || document.documentElement.scrollTop // lấy ra px khi scroll
            const newWidth = cdWidth - scroll
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        btnPlay.onclick = function () { // xử lý khi play nhạc
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
            audio.onplay = function () { // khi play
                _this.isPlaying = true;
                playing.classList.add('playing');
                cdAnimate.play();

            }
            audio.onpause = function () { // khi pause
                _this.isPlaying = false;
                playing.classList.remove('playing');
                cdAnimate.pause();
            }
        }
        audio.ontimeupdate = function () { // audio.duration lấy tổng time bài hát, audio.currentTime lấy time hiện tại
            if (audio.duration && !_this.isTimeUpdate) {
                const loadPlayingPercent = Math.floor(((audio.currentTime / audio.duration) * 100));
                loadPlaying.value = loadPlayingPercent
                _this.setConfig("currentTime", audio.currentTime)
            }

        }
        loadPlaying.onpointerdown = function () {
            _this.isTimeUpdate = true;
        }
        loadPlaying.onchange = function (e) { // khi kéo thanh bài hát sẽ tới currentTime
            _this.isTimeUpdate = false;
            const seekTime = (audio.duration / 100 * e.target.value);
            audio.currentTime = seekTime
        }
        next.onclick = function () { //next bài
            if (_this.isRandom) {
                _this.randomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }
        prev.onclick = function () { // prev bài
            if (_this.isRandom) {
                _this.randomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }
        random.onclick = function () { // chế độ random
            _this.isRandom = !_this.isRandom;
            random.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }
        repeat.onclick = function () { // chế độ lặp lại
            _this.isRepeat = !_this.isRepeat;
            repeat.classList.toggle('active', _this.isrepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }
        audio.onended = function () { //khi hết bài thì tự động phát
            if (_this.isRepeat) {
                audio.play();
            }
            else
                next.click();
        }
        playlist.onclick = function (e) { // lắng nghe hành vi click vào playlist
            const songNode = e.target.closest('.song:not(.active)') // closet lấy ra phần tử mình click vào
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.isPlaying = true;
                    playing.classList.add('playing');
                    cdAnimate.play();
                    _this.loadcurrentSong()
                    audio.play()
                }
            }
        }
    },
    currentIndex: 0,
    defineProperties: function () { // get ra bài hát hiện tại
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadcurrentSong: function () { // hiển thị thông tin bài hát hiện tại
        heading.textContent = this.currentSong.name;
        cdimg.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.music;

        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
        }
        const list = $$('.song');
        list.forEach((song) => {
            if (song.getAttribute('data-index') == this.currentIndex) {
                song.classList.add('active');
            }
            console.log(song.getAttribute('data-index'));
        });

        if (this.currentIndex == this.config.currentIndex) {
            audio.currentTime = this.config.currentTime;
        } else {
            audio.currentTime = 0;
        }

        this.setConfig("currentIndex", this.currentIndex)
    },
    nextSong: function () { // next bài
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadcurrentSong();
    },
    prevSong: function () {
        {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadcurrentSong();
        }
    },
    randomSong: function () {
        let newIndex
        this.arrSong.push(this.currentIndex)
        if (this.arrSong.length === this.songs.length) {
            this.arrSong = [];
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (this.arrSong.includes(newIndex))

        this.currentIndex = newIndex;
        this.loadcurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            if (this.currentIndex <= 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }, 300);
    },

    start: function () {
        this.loadConfig()

        // Định nghĩa thuộc tính cho obj
        this.defineProperties();

        // Xử lý sự kiên
        this.handleEvent();

        // Load bài hát vào UI
        this.loadcurrentSong();

        //render 
        this.render();

    }
}

app.start();

