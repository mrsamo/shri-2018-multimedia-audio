/******************************************************
 * Copyright 2014 by Abaddon <abaddongit@gmail.com>
 * @author Abaddon <abaddongit@gmail.com>
 * @version 0.0.1
 * ***************************************************/
var w = window,
    d = document,
    MP3_PATH = 'test3.ogg',
    MAX_PARTICLES = 50,
    MAX_BIRDS = 10,
    TWO_PI = Math.PI * 2,
    SMOOTHING = 0.3,
    FURIE = 512,
    RADIUS = {
        MAX: 80.0,
        MIN: 10.0
    },
    SIZE = {
        MIN: 0.5,
        MAX: 1.25
    },
    OPACITY = {
        MIN: 0.4,
        MAX: 0.8
    },
    SPEED = {
        MIN: 0.2,
        MAX: 1
    },
    BIRD_SPEED = {
        MIN: 3.5,
        MAX: 4.2
    },
    BIRD_JUMP = {
        MIN: 20,
        MAX: 30
    },
    IMAGES = ['http://angular.demosite.pro/visualizer/img/red.png','http://angular.demosite.pro/visualizer/img/ell.png','http://angular.demosite.pro/visualizer/img/blue.png','http://angular.demosite.pro/visualizer/img/black.png','http://angular.demosite.pro/visualizer/img/white.png'],
    COLORS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']; //Ñ†Ð²ÐµÑ‚Ð° Ñ‡Ð°ÑÑ‚Ð¸Ñ†


var WoolAnalaser = function () {
    "use strict";
    var ctx = null,
        canva = null,
        config = null,
        particles = [],
        rope = null,
        birds = [],
        audio = null,
        freeSpace = w.innerWidth,
        input = d.querySelector('#song'),
        that = this;

    AudioContext = w.AudioContext || w.webkitAudioContext;
    var audioContext = new AudioContext();

    d.querySelector('body').addEventListener('click', function(){
        console.log(111);
        audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
        });
    });
    config = this.config = {
        fullscreen: true,
        interval: 10,
        type: "canvas"
    };
    /*
    * ÐšÐ¾Ð½ÑÑ‚Ñ€ÑƒÐºÑ‚Ð¾Ñ€ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ð°
    */
    var Analyse = function () {
        var _that = this;

        this.audio = new Audio();
        this.audio.src = MP3_PATH;
        this.audio.controls = true;

        this.context = audioContext;
        this.node = this.context.createScriptProcessor(2048, 1, 1);
        //ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = FURIE;

        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
        console.log(this.bands);

        this.audio.addEventListener('canplay', function () {
            if (!_that.source) {
                _that.source = _that.context.createMediaElementSource(_that.audio);

                _that.source.connect(_that.analyser);
                _that.analyser.connect(_that.node);
                _that.node.connect(_that.context.destination);
                _that.source.connect(_that.context.destination);

                _that.node.onaudioprocess = function () {
                    _that.analyser.getByteFrequencyData(_that.bands);
                    if (!_that.audio.paused) {
                        return typeof _that.update === "function" ? _that.update(_that.bands) : 0;
                    }
                };
            }
        });

        return this;
    };

    /*
    * ÐšÐºÐ¾Ð½ÑÑ‚Ñ€ÑƒÐºÑ‚Ð¾Ñ€ Ñ‡Ð°ÑÑ‚Ð¸Ñ†
    */
    var Particle = function () {
        this.init();
    };

    Particle.prototype = {
        /*
        * Ð¡Ð¾Ð·Ð´Ð°ÐµÑ‚ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñƒ
        */
        init: function () {
            this.x = that.random(canva.width);
            this.y = that.random(canva.height);
            this.level = 1 * that.random(4);
            this.speed = that.random(SPEED.MIN, SPEED.MAX);
            this.radius = that.random(RADIUS.MIN, RADIUS.MAX); //Ñ€Ð°Ð´Ð¸ÑƒÑ Ñ‡Ð°ÑÑ‚Ð¸Ñ†
            this.color = that.random(COLORS); //Ñ†Ð²ÐµÑ‚ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñ‹
            this.opacity = that.random(OPACITY.MIN, OPACITY.MAX);
            this.band = Math.floor(that.random(128));
        },
        /*
        * Ð Ð¸ÑÑƒÐµÑ‚ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñƒ Ð² ÐºÐ¾Ð½Ð²Ðµ
        */
        draw: function () {
            var pulsar, scale;
            pulsar = Math.exp(this.pulse);
            scale = pulsar * this.radius || this.radius;
            ctx.save();
            ctx.beginPath(); //ÐÐ°Ñ‡Ð¸Ð½Ð°ÐµÑ‚ Ð¾Ñ‚Ñ€Ð¸ÑÐ¾Ð²ÐºÑƒ Ñ„Ð¸Ð³ÑƒÑ€Ñ‹
            ctx.arc(this.x, this.y, scale, 0, TWO_PI);
            ctx.fillStyle = this.color; //Ñ†Ð²ÐµÑ‚
            ctx.globalAlpha = this.opacity / this.level; //Ð¿Ñ€Ð¾Ð·Ñ€Ð°Ñ‡Ð½Ð¾ÑÑ‚ÑŒ
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = this.color; //Ñ†Ð²ÐµÑ‚ Ñ€Ð°Ð¼ÐºÐ¸
            ctx.stroke();
            ctx.restore();

            this.move();
        },
        /*
        * Ð”Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñ‹
        */
        move: function () {
            this.y -= this.speed * this.level;
            //this.x += this.speed * this.level;
            //Ð’Ð¾Ð·Ð²Ñ€Ð°ÑˆÐ°Ð¼ Ð² Ð½Ð°Ñ‡Ð°Ð»Ð¾ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñ‹ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ ÑƒÑˆÐ»Ð¸ Ð·Ð° Ð¿Ñ€ÐµÐ´ÐµÐ»Ñ‹ Ñ…Ð¾ÑÐ»ÑÑ‚Ð°
            if (this.y < -100) {
                this.y = canva.height;
            }
        }
    };


    /*
    * Ð’ÐµÑ€ÐµÐ²ÐºÐ°
    */

    var Rope = function () {
        this.init();
    };

    Rope.prototype = {
        init: function () {
            this.x = 0;
            this.y = canva.height / 2;
            this.deflection = 0.0;
            this.color = "#000";
        },
        draw: function () {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.quadraticCurveTo(canva.width / 2, this.y + this.deflection, canva.width, this.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        },
        move: function () {

        }
    };

    /*
    * ÐŸÑ‚Ð¸Ñ‡ÐºÐ¸
    */
    var Bird = function () {
        this.init();
    };

    Bird.prototype = {
        init: function () {
            var img = new Image();
            img.src = that.random(IMAGES);
            img.width = 100;
            img.height = 100;
            this.up = true;
            this.down = false;
            this.stop = false;
            this.band = Math.floor(that.random(128));
            this.direction = that.random(["right", "left"]);
            this.finish = false;
            this.level = that.random(0.2, 0.6);
            this.x = canva.width - img.width;
            this.y = canva.height / 2 - img.height;
            this.speed = that.random(BIRD_SPEED.MIN, BIRD_SPEED.MAX);
            this.jump = that.random(BIRD_JUMP.MIN, BIRD_JUMP.MAX);
            if (this.direction === "right") {
                this.bord = canva.width - (freeSpace - 260);
            } else {
                this.bord = canva.width - (freeSpace - 130);
            }

            freeSpace -= 130;
            this.img = img;
        },
        draw: function () {
            var pulse = Math.exp(this.pulse) || 1;

            ctx.save();
            ctx.beginPath();

            if (this.direction === "right" && this.stop) {
                ctx.scale(-1, 1);
                ctx.drawImage(this.img, -this.x, this.y, this.img.width * pulse, this.img.height * pulse);
            } else {
                ctx.drawImage(this.img, this.x, this.y, this.img.width * pulse, this.img.height * pulse);
            }
            ctx.closePath();
            ctx.restore();
        },
        move: function () {

            if (this.x > this.bord && !this.stop) {
                this.run();
            } else {
                this.stop = true;
                var pulse = Math.exp(this.pulse) || 1;
                this.y = (canva.height / 2 - this.img.height * pulse);
            }
        },
        run: function () {
            this.x -= this.speed;
            if (this.y > canva.height / 2 - this.img.height - this.jump && !this.down) {
                this.y--;
            } else {
                this.up = false;
                this.down = true;
            }

            if (this.y < canva.height / 2 - this.img.height && !this.up) {
                this.y += this.speed;
            } else {
                this.up = true;
                this.down = false;
            }
        }
    };

    /*
    * Ð¡Ð¾Ð·Ð´Ð°ÐµÑ‚ ÐºÐ¾Ð½Ð²Ñƒ
    */
    this.init = function (contener) {
        ctx = this.createCanvas(contener);
        canva = ctx.canvas;
        this.createParticles();
    };
    /*
    * Ð¡Ð¾Ð·Ð´Ð°ÐµÑ‚ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñ‹
    */
    this.createParticles = function () {
        var particle = null, audio = null;
        //ÐºÑ€ÑƒÐ³Ð¸
        for (var i = 0; i < MAX_PARTICLES; i++) {
            particle = new Particle();
            particles.push(particle);
        }
        //Ð²ÐµÑ€ÐµÐ²ÐºÐ°
        rope = new Rope();
        //ÐŸÑ‚Ð¸Ñ‡ÐºÐ¸
        for (var i = 0; i < MAX_BIRDS; i++) {
            birds.push(new Bird());
        }
        try {
            audio = new Analyse();
            d.body.appendChild(audio.audio);

            input.addEventListener('change', function () {
                var song = this.value,
                    fReader = new FileReader();

                fReader.readAsDataURL(this.files[0]);
                fReader.onloadend = function (event) {
                    var e = event || w.event;
                    audio.audio.src = e.target.result;
                    audio.audio.load();
                };
            }, false);

            audio.update = function (bands) {
                var ln = MAX_PARTICLES,
                    bLn = MAX_BIRDS;

                while (ln--) {
                    var loc = particles[ln];
                    loc.pulse = bands[loc.band] / 256;
                }

                for (var i = 0; i < bLn; i++) {
                    var bird = birds[i];
                    bird.pulse = bands[bird.band] / 256;
                }
            };
        } catch (e) {
            throw ('Ð’Ð°Ñˆ Ð±Ð°Ñ€ÑƒÐ·ÐµÑ€ Ð½Ðµ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ñ‹Ð²Ð°ÐµÑ‚ audio Api');
        }
        setInterval(that.action, this.config.interval);
    }
    /*
    * Ð”Ð¾Ð±Ð°Ð²Ð»ÑÐµÑ‚ Ñ‡Ð°ÑÑ‚Ð¸Ñ†Ñ‹ Ð² ÐºÐ¾Ð½Ð²Ñƒ Ð¸ Ð°Ð½Ð¸Ð¼Ð¸Ñ€ÑƒÐµÑ‚ Ð¸Ñ…
    */
    this.action = function () {
        var ln = MAX_PARTICLES;
        that.clear();
        for (var i = 0; i < ln; i++) {
            var loc = particles[i];
            loc.draw();
        }
        //Ð Ð¸ÑÑƒÐµÐ¼ Ð²ÐµÑ€ÐµÐ²ÐºÑƒ
        rope.draw();
        for (var i = 0; i < MAX_BIRDS; i++) {
            var loc = birds[i];
            loc.draw();
            loc.move();
        }

    }
    /*
    * Ð§Ð¸ÑÑ‚Ð¸Ñ‚ ÐºÐ¾Ð½Ð²Ñƒ Ð¿ÐµÑ€ÐµÐ´ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¹ Ð°Ð½Ð¸Ð¼Ð°Ñ†Ð¸ÐµÐ¹
    */
    this.clear = function () {
        ctx.clearRect(0, 0, canva.width, canva.height);
    };
};

WoolAnalaser.prototype = {
    /*
    * Ð¡Ð¾Ð·Ð´Ð°ÐµÑ‚ ÐºÐ¾Ð½Ð²Ñƒ Ð½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ðµ
    * @param {Object} contener - dom Ð¾Ð±ÑŠÐµÐºÑ‚ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð° Ð´Ð»Ñ Ð²ÑÑ‚Ð°Ð²ÐºÐ¸ ÐºÐ¾Ð½Ð²Ñ‹
    * @return {Object} context - ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚ ÑÐ¾Ð·Ð´Ð°Ð½Ð½Ð¾Ð¹ ÐºÐ¾Ð½Ð²Ñ‹
    */
    createCanvas: function (contener) {
        var config = this.config,
            canvas = null,
            context = null;

        canvas = d.createElement('canvas'),
            context = canvas.getContext('2d');

        if (config.fullscreen) {
            canvas.width = w.innerWidth;
            canvas.height = w.innerHeight;
        }
        (contener || d.body).appendChild(canvas);
        return context;
    },
    /*
    * Ð’Ñ‹Ð±Ð¾Ñ€ Ñ€Ð°Ð½Ð´Ð¾Ð¼Ð½Ð¾Ð³Ð¾ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ
    */
    random: function( min, max ) {
        if (this.isArray( min )) {
            return min[ ~~( Math.random() * min.length ) ];
        }
        if (!this.isNumber(max)) {
            max = min || 1, min = 0;
        }
        return min + Math.random() * ( max - min );
    },
    /*
    * ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð° Ð¼Ð°ÑÑÐ¸Ð²
    */
    isArray: function(object) {
        return Object.prototype.toString.call( object ) == '[object Array]';
    },
    /*
    * ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð° Ñ‡Ð¸ÑÐ»Ð¾
    */
    isNumber: function(object) {
        return typeof object == 'number';
    }
};

w.onload = function () {
    var analyser = new WoolAnalaser();
    analyser.init(d.querySelector('#target'));
};
