juego = new Phaser.Game(
  1280,
  760,
  Phaser.CANVAS,
  'bloque_juego'
);


// =========================
// VARIABLES
// =========================

// teclas
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaSaltoArriba;
var teclaAbajo;
var teclaDisparo;

// jugador
var persona;
var suelo;

// fondo
var fondo;

// mundo
var mundoX = 0;
var anchoNivel = 10000;

// balas
var balas = [];

var direccionPersona = 1;

var velocidadMundo = 4;

// vida
var vidaPersona = 100;
var vidaArania = 200;

var barrasVida;

var tiempoUltimaMordida = 0;

// bala
var anchoBala = 12;
var altoBala = 5;

// juego
var juegoTerminado = false;

var textoJuegoTerminado;
var botonReiniciar;

// salto
var velocidadSalto = -750;
var gravedad = 1200;

// araña
var arania;

var velocidadArania = 3;

var araniaActiva = false;

var tiempoAparicionArania = 800;

var direccionArania = -1;

var araniaDesdeDerecha = true;

var araniasMuertas = 0;

var textoAraniasMuertas;

// sonidos
var musica;
var sonidoDisparo;

var volumenMusica = 0.4;
var volumenDisparo = 1;

// menu
var botonJugar;
var pantallaInicio;

// gameover
var sonidoGameOver;
var imagenGameOver;

// =========================
// MENU
// =========================

var estadoMenu = {

  preload: function () {

    juego.load.image(
      'pantallaInicio',
      'img/menu.jpeg'
    );

    juego.load.image(
      'btnJugar',
      'img/jugar.png'
    );

    // fondo largo
    juego.load.image(
      'fondo',
      'img/fondov1.png'
    );

    // astronauta
    juego.load.spritesheet(
      'persona',
      'img/astronauta_caminando.png',
      100,
      100
    );

    // araña
    juego.load.spritesheet(
      'arania',
      'img/aranini.png',
      250,
      250
    );

    juego.load.audio(
      'musica',
      'sounds/fondo.mp3'
    );

    juego.load.audio(
      'disparo',
      'sounds/shooter.mp3'
    );

    juego.load.image(
      'gameoverimg',
      'img/gameover.jpeg'
    );

    juego.load.audio(
      'gameoverSound',
      'sounds/gameover.mp3'
    );

  },

  create: function () {

    pantallaInicio = juego.add.image(
      0,
      0,
      'pantallaInicio'
    );

    pantallaInicio.width = 1280;
    pantallaInicio.height = 760;

    botonJugar = juego.add.button(

      juego.world.centerX,
      580,

      'btnJugar',

      function () {

        juego.state.start(
          'principal'
        );

      },

      this
    );

    botonJugar.anchor.setTo(0.5);

    botonJugar.scale.setTo(0.35);

  }

};


// =========================
// JUEGO
// =========================

var estadoPrincipal = {

  create: function () {

    juego.physics.startSystem(
      Phaser.Physics.ARCADE
    );

    // =====================
    // RESET
    // =====================

    vidaPersona = 100;
    vidaArania = 200;

    balas = [];

    direccionPersona = 1;

    direccionArania = -1;

    araniaDesdeDerecha = true;

    araniasMuertas = 0;

    juegoTerminado = false;

    tiempoUltimaMordida = 0;

    mundoX = 0;

    // =====================
    // FONDO
    // =====================

    fondo = juego.add.image(
      0,
      0,
      'fondo'
    );

    fondo.width = anchoNivel;
    fondo.height = 760;

    // =====================
    // SUELO
    // =====================

    suelo = juego.add.sprite(
      0,
      650
    );

    juego.physics.arcade.enable(
      suelo
    );

    suelo.body.immovable = true;

    suelo.body.allowGravity = false;

    suelo.width = 1280;
    suelo.height = 120;

    // =====================
    // PERSONAJE
    // =====================

    persona = juego.add.sprite(
      500,
      500,
      'persona'
    );

    // tamaño astronauta
    persona.scale.setTo(1.35);

    juego.physics.arcade.enable(
      persona
    );

    persona.body.gravity.y =
      gravedad;

    persona.body.collideWorldBounds =
      true;

    // hitbox
    persona.body.setSize(
      55,
      80,
      20,
      15
    );

    // =====================
    // ARAÑA
    // =====================

    arania = juego.add.sprite(
      1400,
      420,
      'arania'
    );

    arania.anchor.setTo(0.5, 0);

    // conservar tamaño original de la araña
    arania.scale.setTo(0.85);

    arania.visible = false;

    juego.physics.arcade.enable(
      arania
    );

    arania.body.allowGravity = false;
    arania.body.immovable = true;

    // conservar hitbox original de la araña
    arania.body.setSize(
      170,
      120,
      40,
      80
    );

    // animacion 4 frames
    arania.animations.add(
      'avanzar',
      [0, 1, 2, 3],
      7,
      true
    );

    // =====================
    // HUD
    // =====================

    barrasVida =
      juego.add.graphics(0, 0);

    textoAraniasMuertas =
      juego.add.text(

        980,
        20,

        'Arañas muertas: 0',

        {
          font: '28px Arial',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4
        }
      );

    textoAraniasMuertas.fixedToCamera =
      true;

    // =====================
    // TECLADO
    // =====================

    teclaArriba =
      juego.input.keyboard.addKey(
        Phaser.Keyboard.X
      );

    teclaSaltoArriba =
      juego.input.keyboard.addKey(
        Phaser.Keyboard.UP
      );

    teclaAbajo =
      juego.input.keyboard.addKey(
        Phaser.Keyboard.DOWN
      );

    teclaDerecha =
      juego.input.keyboard.addKey(
        Phaser.Keyboard.RIGHT
      );

    teclaIzquierda =
      juego.input.keyboard.addKey(
        Phaser.Keyboard.LEFT
      );

    teclaDisparo =
      juego.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR
      );

    teclaDisparo.onDown.add(
      this.disparar,
      this
    );

    // =====================
    // SONIDOS
    // =====================

    musica = juego.add.audio(
      'musica'
    );

    musica.loop = true;

    musica.volume =
      volumenMusica;

    sonidoDisparo =
      juego.add.audio(
        'disparo'
      );

    sonidoDisparo.volume =
      volumenDisparo;

    sonidoGameOver =
      juego.add.audio(
        'gameoverSound'
      );

    sonidoGameOver.volume = 3;

    musica.play();

    // =====================
    // ANIMACIONES
    // =====================

    persona.animations.add(
      'derecha',
      [0, 1, 2, 3],
      8,
      true
    );

    persona.animations.add(
      'izquierda',
      [4, 5, 6, 7],
      8,
      true
    );

    persona.animations.add(
      'arriba',
      [8, 9, 10, 11],
      8,
      true
    );

    persona.animations.add(
      'abajo',
      [12, 13, 14, 15],
      8,
      true
    );

    // primera aparición

    this.programarArania();

    this.actualizarBarras();

  },


  // =====================
  // UPDATE
  // =====================

  update: function () {

    if (juegoTerminado) {
      return;
    }

    // colision suelo
    juego.physics.arcade.collide(
      persona,
      suelo
    );

    // =====================
    // MOVIMIENTO MUNDO
    // =====================

    var quiereSaltar =
      teclaArriba.isDown ||
      teclaSaltoArriba.isDown;

    if (
      quiereSaltar &&
      (
        persona.body.touching.down ||
        persona.body.blocked.down
      )
    ) {

      persona.body.velocity.y =
        velocidadSalto;

    }

    if (teclaDerecha.isDown) {

      if (mundoX > -(anchoNivel - 1280)) {

        mundoX -= velocidadMundo;

        fondo.x = mundoX;

        // mover araña
        if (araniaActiva) {
          arania.x -= velocidadMundo;
        }

        // mover balas
        for (var i = 0; i < balas.length; i++) {

          balas[i].x -= velocidadMundo;

        }

      }

      direccionPersona = 1;

      persona.animations.play(
        'derecha'
      );

    }

    else if (teclaIzquierda.isDown) {

      if (mundoX < 0) {

        mundoX += velocidadMundo;

        fondo.x = mundoX;

        if (araniaActiva) {
          arania.x += velocidadMundo;
        }

        for (var i = 0; i < balas.length; i++) {

          balas[i].x += velocidadMundo;

        }

      }

      direccionPersona = -1;

      persona.animations.play(
        'izquierda'
      );

    }

    else if (teclaAbajo.isDown) {

      persona.animations.play(
        'abajo'
      );

    }

    else {

      persona.animations.stop();

    }

    // =====================
    // IA ARAÑA
    // =====================

    if (araniaActiva) {

      // movimiento
      arania.x +=
        velocidadArania *
        direccionArania;

      // mirar hacia donde avanza
      if (direccionArania == -1) {

        arania.scale.x = 0.85;

      } else {

        arania.scale.x = -0.85;

      }

      // colision jugador
      var araniaTocaPersona =
        this.detenerAraniaContraPersona();

      if (araniaTocaPersona) {

        if (
          juego.time.now >
          tiempoUltimaMordida + 1000
        ) {

          vidaPersona -= 14;

          tiempoUltimaMordida =
            juego.time.now;

          if (vidaPersona < 0) {

            vidaPersona = 0;

          }

          if (vidaPersona <= 0) {

            this.terminarJuego();

          }

        }

      }

      // salir pantalla
      if (
        arania.x < -400 ||
        arania.x > 1700
      ) {

        this.ocultarArania();

      }

    }

    // =====================
    // BALAS
    // =====================

    for (
      var i = balas.length - 1;
      i >= 0;
      i--
    ) {

      balas[i].x +=
        balas[i].velocidadX;

      // impacto bala
      var hitboxBalaArania =
        this.obtenerHitboxArania();

      if (

        araniaActiva &&

        this.tocan(

          balas[i].x,
          balas[i].y,
          anchoBala,
          altoBala,

          hitboxBalaArania.x,
          hitboxBalaArania.y,
          hitboxBalaArania.ancho,
          hitboxBalaArania.alto
        )
      ) {

        vidaArania -= 28;

        balas[i].destroy();

        balas.splice(i, 1);

        if (vidaArania <= 0) {

          araniasMuertas++;

          textoAraniasMuertas.text =
            'Arañas muertas: ' +
            araniasMuertas;

          this.muerteArania();

        }

      }

      else if (
        balas[i].x > 1400 ||
        balas[i].x < -100
      ) {

        balas[i].destroy();

        balas.splice(i, 1);

      }

    }

    this.actualizarBarras();

  },


  // =====================
  // DISPARAR
  // =====================

  disparar: function () {

    if (juegoTerminado) {
      return;
    }

    var posicionBalaX =
      persona.x + 110;

    if (direccionPersona == -1) {

      posicionBalaX =
        persona.x - anchoBala;

    }

    var bala =
      juego.add.graphics(

        posicionBalaX,

        persona.y + 70
      );

    bala.beginFill(0xffff00);

    bala.drawRect(
      0,
      0,
      anchoBala,
      altoBala
    );

    bala.endFill();

    bala.velocidadX =
      14 * direccionPersona;

    balas.push(bala);

    sonidoDisparo.play();

  },


  // =====================
  // COLISIONES
  // =====================

  tocan: function (
    x1, y1, ancho1, alto1,
    x2, y2, ancho2, alto2
  ) {

    return (

      x1 < x2 + ancho2 &&
      x1 + ancho1 > x2 &&
      y1 < y2 + alto2 &&
      y1 + alto1 > y2

    );

  },

  obtenerHitboxArania: function () {

    return {
      x: arania.x - 90,
      y: arania.y + 40,
      ancho: 180,
      alto: 140
    };

  },

  detenerAraniaContraPersona: function () {

    var hitboxPersona = {
      x: persona.x + 15,
      y: persona.y + 10,
      ancho: 70,
      alto: 85
    };

    var hitboxArania =
      this.obtenerHitboxArania();

    var estaTocando =
      this.tocan(

        hitboxPersona.x,
        hitboxPersona.y,
        hitboxPersona.ancho,
        hitboxPersona.alto,

        hitboxArania.x,
        hitboxArania.y,
        hitboxArania.ancho,
        hitboxArania.alto
      );

    if (!estaTocando) {
      return false;
    }

    if (direccionArania == -1) {

      arania.x =
        hitboxPersona.x +
        hitboxPersona.ancho +
        hitboxArania.ancho / 2;

    } else {

      arania.x =
        hitboxPersona.x -
        hitboxArania.ancho / 2;

    }

    return true;

  },


  // =====================
  // BARRAS
  // =====================

  actualizarBarras: function () {

    barrasVida.clear();

    // vida jugador
    this.dibujarBarra(
      persona.x,
      persona.y - 25,
      vidaPersona
    );

    // vida araña
    if (araniaActiva) {

      this.dibujarBarra(
        arania.x - 50,
        arania.y - 20,
        vidaArania
      );

    }

  },

  dibujarBarra: function (
    x,
    y,
    vida
  ) {

    barrasVida.beginFill(
      0x990000
    );

    barrasVida.drawRect(
      x,
      y,
      100,
      10
    );

    barrasVida.endFill();

    barrasVida.beginFill(
      0x00cc00
    );

    barrasVida.drawRect(
      x,
      y,
      vida / 2,
      10
    );

    barrasVida.endFill();

  },


  // =====================
  // ARAÑA
  // =====================

  aparecerArania: function () {

    if (juegoTerminado) {
      return;
    }

    vidaArania = 200;

    araniaDesdeDerecha =
      juego.rnd.integerInRange(
        0,
        1
      ) == 0;

    velocidadArania =
      juego.rnd.integerInRange(
        3,
        5
      );

    // derecha
    if (araniaDesdeDerecha) {

      arania.x = 1400;

      direccionArania = -1;

      arania.scale.setTo(
        0.85,
        0.85
      );

      araniaDesdeDerecha = false;

    }

    // izquierda
    else {

      arania.x = -250;

      direccionArania = 1;

      arania.scale.setTo(
        -0.85,
        0.85
      );

      araniaDesdeDerecha = true;

    }

    arania.y =
      juego.rnd.integerInRange(
        440,
        500
      );

    arania.visible = true;

    araniaActiva = true;

    arania.animations.play(
      'avanzar'
    );

  },

  programarArania: function () {

    var espera =
      juego.rnd.integerInRange(
        tiempoAparicionArania,
        tiempoAparicionArania + 900
      );

    juego.time.events.add(

      espera,

      this.aparecerArania,

      this
    );

  },

  muerteArania: function () {

    araniaActiva = false;

    arania.animations.stop();

    arania.visible = false;

    this.programarArania();

  },

  ocultarArania: function () {

    araniaActiva = false;

    arania.visible = false;

    arania.animations.stop();

    this.programarArania();

  },


  // =====================
  // GAME OVER
  // =====================

  terminarJuego: function () {

    juegoTerminado = true;

    musica.stop();
    sonidoGameOver.play();

    persona.animations.stop();

    arania.animations.stop();


    imagenGameOver = juego.add.image(
      juego.world.centerX,
      juego.world.centerY,
      'gameoverimg'
    );

    imagenGameOver.anchor.setTo(0.5);

    imagenGameOver.fixedToCamera = true;

    imagenGameOver.width = 1280;
    imagenGameOver.height = 760;

    imagenGameOver.inputEnabled =
      true;

    imagenGameOver.events.onInputDown.add(

      this.volverMenuPrincipal,

      this
    );

  },

  volverMenuPrincipal: function () {

    musica.stop();
    juego.state.start(
      'menu'
    );

  },

  reiniciarJuego: function () {

    musica.stop();
    sonidoGameOver.play();
    juego.state.start(
      'principal'
    );

  }

};


// =========================
// ESTADOS
// =========================

juego.state.add(
  'menu',
  estadoMenu
);

juego.state.add(
  'principal',
  estadoPrincipal
);

juego.state.start('menu');
