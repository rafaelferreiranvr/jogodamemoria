var icones = [];
var iconesTemp = [];
var dificuldade;
var penultimaEscolha = [];
var ultimaEscolha = [];
var cartasrestantes;
var comparando = false;


function iniciarJogo() {
    document.getElementById("comecar").disabled = true;
    ajustarJanela();
    escolherIcones(dificuldade);
    criarCartas(dificuldade);
    cartasrestantes = dificuldade*2;
}


function ajustarJanela() {
    var widthconteudo = $("#conteudo").css("width");
    var heightconteudo = $("#conteudo").css("height");
    dificuldade = $("#dificuldade option:selected").val();
    function closeSetup() {
        $("#conteudo").css(
            {   
                "width": widthconteudo,
                "height": heightconteudo,
            }
        )
        $("#setup").css("display", "none");
    }

    function openconteudo() {
        function showDeck() {
            $("body").css({"background-color": "rgb(46, 51, 61)"})
            $("#restart").css({"opacity": "100%"});
            $("#cartas").css("display", "inline-block");
            $("#conteudo").css({"height": "100%",})
        }

        $("#conteudo").css(
            {
                "width": "100%",
                "height": "100%",
                "margin-top": "0",
            }
        )
        $("#restart").css("display", "inline-block");
        setTimeout(showDeck, 800);
    }

    $("#restartIcon").css({"width": "30px", "height": "30px"})
    $("#setup").css("opacity", "0%");
    setTimeout(closeSetup, 500);
    setTimeout(openconteudo, 600);
}


function escolherIcones(dificuldade) {
    var i;
    var g;
    for (i = 0; i < dificuldade; g = 0) {
        g = Math.floor((Math.random() * 86) + 1);
        if (!icones.includes(g)) {
            icones.push(g)
            iconesTemp.push(g)
            i++;
        }
    }

    for (i = 0; i < dificuldade; i++) {
        icones.push(iconesTemp[i])
    }

    icones.sort(() => Math.random() - 0.5);
}


function criarCartas(dificuldade) {
    for (i = 0; i < dificuldade*2; i++) {
        var carta = document.createElement("div");
        carta.className = "carta";
        carta.id = `c${i+1}i${icones[i]}`;
        document.getElementById("cartas").appendChild(carta);
        $(`#c${i+1}i${icones[i]}`).attr({
            "onclick": `virarCarta(${i+1}, ${icones[i]}, false)`,
            "escolhida": "false",});
        $(`#c${i+1}i${icones[i]}`).css("opacity", "0");
    }

    function predefinicao() {
        $(".carta, #conteinerCartas").css({
            "display": "inline-block",
        })
        $("#conteinerCartas").css({
            "width": "100%",
            "height": "calc(100vh - 90px)"
        })
    }

    
    setTimeout(function() {
        predefinicao();
        responsivoCartas();
        $(window).resize(function() {
            responsivoCartas();
        }) 
        icones.splice(0, icones.length);
        iconesTemp.splice(0, iconesTemp.length);
    }, 900)

    setTimeout(function() {$(".carta").css("opacity", "1")},1600);
}


function responsivoCartas() {
    var tamanhoTeste = 40;
    var tamanhoBody;
    var tamanhoCartas;
    var margem;

    function teste() {
        $(".carta").css({
            "width": `${tamanhoTeste}%`,
            "height": `calc(100vw * ${tamanhoTeste}/100)`,
            "display": "inline-block",
        })
        tamanhoCartas = parseFloat($("#cartas").css("height"));
        tamanhoConteiner = parseFloat($("#conteinerCartas").css("height"));
    }

    teste();
    while (tamanhoCartas > tamanhoConteiner) {
        teste();
        tamanhoTeste -= 0.5;
        if (tamanhoTeste <= 0) {
            tamanhoTeste = 30;
            break;
        }
    }
}


function virarCarta(nCarta, nIcone, virado) {
    function mostrarCarta() {
        $(`#c${nCarta}i${nIcone}`).css({
            "background-image": `url(icones/i${nIcone}.png)`,
            "background-size": "50%",
            "transition": "transform 0.5s, opacity 1s"})
        $(`#c${nCarta}i${nIcone}`).attr({
            "onclick": `virarCarta(${nCarta}, ${nIcone}, true)`,
            "escolhida": "true"});
    }

    function giro(graus) {
        $(`#c${nCarta}i${nIcone}`).css("transform", `rotate3d(0, 1, 0, ${graus}deg)`)
    }

    if (!comparando) {
        if (!virado) {
            giro(0);
            setTimeout(mostrarCarta, 150);
        } 
    
        if (penultimaEscolha.length == 0) {
            penultimaEscolha.push(nCarta, nIcone);
        } else if ((ultimaEscolha.length == 0)) {
            ultimaEscolha.push(nCarta, nIcone)
        }
    
        if (penultimaEscolha[0] == ultimaEscolha[0] || ultimaEscolha.length == 0) {
            ultimaEscolha.splice(0, 2);
        } else {
            setTimeout(comparacao(penultimaEscolha[0], penultimaEscolha[1], ultimaEscolha[0], ultimaEscolha[1]), 500)
            comparando = true
        }
    }
}


function comparacao(nCarta1, nIcone1, nCarta2, nIcone2) {
    function limparSelecao() {
        penultimaEscolha.splice(0, 2);
        ultimaEscolha.splice(0, 2);
    }

    function dissolverCartas() {
        $("[escolhida=true]").css({"opacity": "0", "cursor": "inherit"});
        $("[escolhida=true]").attr({"onclick": "", "escolhida": "false"});
        cartasrestantes -= 2;
        if (cartasrestantes == 0) {
            setTimeout(vitoria, 1000)
        }
    }

    function esconderCartas() {
        $("[escolhida=true]").css({
            "background-image": `url(icones/interrogacao.png)`,
            "background-size": "45%",
        })
        $(`#c${nCarta1}i${nIcone1}`).attr("onclick", `virarCarta(${nCarta1}, ${nIcone1}, false)`);
        $(`#c${nCarta2}i${nIcone2}`).attr("onclick", `virarCarta(${nCarta2}, ${nIcone2}, false)`);
        $("[escolhida=true]").attr("escolhida", "false");
    }

    function giro() {
        $("[escolhida=true]").css("transform", `rotate3d(0, 1, 0, 180deg)`);
    }

    function acerto() {
        setTimeout(function() {
            $("[escolhida=true]").css("background-color", "rgb(42 106 31)");
        }, 500)
        setTimeout(dissolverCartas, 800);
        setTimeout(function(){comparando = false}, 800);
    }

    function erro() {
        setTimeout(function() {
            $("[escolhida=true]").css({
                "background-color": "rgb(128 0 0)",
            });
        }, 600)

        setTimeout( function() {
            $("[escolhida=true]").css("transition", "transform 0.5s, opacity 0.25s, background-color 0.8s");
            $("[escolhida=true]").css({
                "background-color": "rgb(39,44,53)"
            });
            setTimeout(function(){
                $("[escolhida=true]").css("transition", "transform 0.5s, opacity 0.25s, background-color 0s");
            }, 20)         
        }, 800)
        setTimeout(giro, 1100);
        setTimeout(esconderCartas, 1150);
        setTimeout(function(){comparando = false}, 1200);
    }

    if (nIcone1 == nIcone2) {
        acerto();
        limparSelecao();
    } else {
        erro();
        limparSelecao();
    }
}


function vitoria() {
    $("body").css("background-color", "rgb(39,44,53)")
    $("#cartas, #restart").css("display", "none");
    $(".carta").remove();
    $("#vitoria").css("display", "inline-block")
    $("#conteudo").css({
        "display": "inline-block",
        "width": "340px",
        "height": "316px",
    })
    setTimeout(function(){
        $("#vitoria").css("opacity", "1")
    }, 500)
}


function restart() {
    $("body").css("background-color", "rgb(39,44,53)")
    $(".carta").css("transition", "transform 0.5s, opacity 0.25s");
    $(".carta").css("opacity", "0");
    $(".carta").remove();
    $("#vitoria").css("opacity", "0");
    $("#restart").css("opacity", "0");
    setTimeout(function() {
        $("#cartas, #restart, #vitoria").css("display", "none");
        $("#setup").css("display", "inline-block");
        $("#setup").css("opacity", "1");
        document.getElementById("comecar").disabled = false;
    }, 500)

    $("#conteudo").css({
        "width": "320px",
        "height": "260px",
    })
}

