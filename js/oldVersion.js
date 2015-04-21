/**
 * Created by Janek on 2015-04-21.
 */
function resolve() {

    var v0 = parseFloat(document.getElementById("v0").value);
    var p0 = parseFloat(document.getElementById("p0").value);
    var h = parseFloat(document.getElementById("h").value);
    var tSim = parseFloat(document.getElementById("tSim").value);

    var result = {
        time: [],
        v: [],
        p: []
    };

    var param = {
        a: parseFloat(document.getElementById("a").value),
        r: parseFloat(document.getElementById("r").value),
        b: parseFloat(document.getElementById("b").value),
        s: parseFloat(document.getElementById("s").value)
    };

    var time = 0;

    result.time.push(0);
    result.v.push(v0);
    result.p.push(p0);

    time = time+h;
    while(time<=tSim) {
        if($("input:radio[name='method']:checked").val() == "rungeKutty") {
            nextStepRungKut(h,result,param);
        }
        else {
            nextStepEuler(h, result, param);
        }
        time += h;
    }

    var VchartData = [];
    for (var i=0;i<result.v.length;i++) {
        VchartData.push({x:result.time[i], y:result.v[i]});
    }

    var PchartData = [];
    for (var i=0;i<result.p.length;i++) {
        PchartData.push({x:result.time[i], y:result.p[i]});
    }

    //creating charts
    var chart = new CanvasJS.Chart("realChartDiv",
        {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "v(t), p(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "v, p",
                gridThickness: 1
            },
            data: [
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "v(t)",
                    dataPoints: VchartData
                },
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "p(t)",
                    dataPoints: PchartData
                }
            ],
            legend: {
                horizontalAlign: "right",
                verticalAlign: "top"
            }
        });
    chart.render();

    var PChartDataSimulink = importPDataFromSimulink(result.time, h);

    var chartP = new CanvasJS.Chart("comparePChartDiv",
        {
            title: {
                text: "p(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "p",
                gridThickness: 1
            },
            data: [
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "p(t) calculated",
                    dataPoints: PchartData
                },
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "p(t) from Simulink",
                    dataPoints: PChartDataSimulink
                }
            ],
            legend: {
                horizontalAlign: "right",
                verticalAlign: "top"
            }
        });
    chartP.render();

    var VChartDataSimulink = importVDataFromSimulink(result.time, h);

    var chartV = new CanvasJS.Chart("compareVChartDiv",
        {
            title: {
                text: "v(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "v",
                gridThickness: 1
            },
            data: [
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "v(t) calculated",
                    dataPoints: VchartData
                },
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "v(t) from Simulink",
                    dataPoints: VChartDataSimulink
                }
            ],
            legend: {
                horizontalAlign: "right",
                verticalAlign: "top"
            }
        });
    chartV.render();
}

function nextStepRungKut(h, result, param) {
    var prevTime = result.time[result.time.length-1];
    var prevP = result.p[result.p.length-1];
    var prevV = result.v[result.v.length-1];

    var k1V=h*(param.r*prevV-param.a*prevV*prevP);
    var k1P=h*(param.b*prevV*prevP-param.s*prevP);
    var k2V=h*(param.r*(prevV+1/2*k1V)-param.a*(prevV+1/2*k1V)*(prevP+1/2*k1P));
    var k2P=h*(param.b*(prevV+1/2*k1V)*(prevP+1/2*k1P)-param.s*(prevP+1/2*k1P));
    var k3V=h*(param.r*(prevV+1/2*k2V)-param.a*(prevV+1/2*k2V)*(prevP+1/2*k2P));
    var k3P=h*(param.b*(prevV+1/2*k2V)*(prevP+1/2*k2P)-param.s*(prevP+1/2*k2P));
    var k4V=h*(param.r*(prevV+k3V)-param.a*(prevV+k3V)*(prevP+k3P));
    var k4P=h*(param.b*(prevV+k3V)*(prevP+k3P)-param.s*(prevP+k3P));

    var deltaV = 1/6*(k1V+2*k2V+2*k3V+k4V);
    var deltaP = 1/6*(k1P+2*k2P+2*k3P+k4P);

    result.time.push(prevTime+h);
    result.p.push(prevP+deltaP);
    result.v.push(prevV+deltaV);
}

function nextStepEuler(h, result, param) {
    var prevTime = result.time[result.time.length-1];
    var prevP = result.p[result.p.length-1];
    var prevV = result.v[result.v.length-1];

    var deltaV = h*(param.r*prevV-param.a*prevV*prevP);
    var deltaP = h*(param.b*prevV*prevP-param.s*prevP);

    result.time.push(prevTime+h);
    result.p.push(prevP+deltaP);
    result.v.push(prevV+deltaV);
}

window.onload = function() {
    //    to debug
    document.getElementById("v0").value = 2;
    document.getElementById("p0").value = 3;
    document.getElementById("h").value = 0.1;
    document.getElementById("tSim").value = 20;
    document.getElementById("a").value = 1;
    document.getElementById("r").value = 1;
    document.getElementById("b").value = 1;
    document.getElementById("s").value = 1;

    //creating charts
    var chart = new CanvasJS.Chart("realChartDiv",
        {
            title: {
                text: "v(t) p(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "v, p"
            },
            data: [
                {
                    type: "line",
                    dataPoints: [{x:1, y:null}, {x:20, y:null}]
                }
            ]
        });
    chart.render();

    var chartP = new CanvasJS.Chart("comparePChartDiv",
        {
            title: {
                text: "p(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "p"
            },
            data: [
                {
                    type: "line",
                    dataPoints: [{x:1, y:null}, {x:20, y:null}]
                }
            ]
        });
    chartP.render();

    var chartV = new CanvasJS.Chart("compareVChartDiv",
        {
            title: {
                text: "v(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "v"
            },
            data: [
                {
                    type: "line",
                    dataPoints: [{x:1, y:null}, {x:20, y:null}]
                }
            ]
        });
    chartV.render();
}

function importPDataFromSimulink(time, h) {
    var pTemp = [3,
        3.25126190000000,
        3.39842128233981,
        3.44515398936745,
        3.40778533499002,
        3.30730113154389,
        3.16380363947492,
        2.99392848865580,
        2.81028759417999,
        2.62189858208795,
        2.43492737575901,
        2.25341837858328,
        2.07989653139218,
        1.91582456446061,
        1.76193555798508,
        1.61846914839210,
        1.48533712312951,
        1.36223867189997,
        1.24874023986072,
        1.14433064492641,
        1.04845894050970,
        0.960560235018739,
        0.880073091628053,
        0.806451031497497,
        0.739169903308238,
        0.677732356128705,
        0.621670287700415,
        0.570545885781179,
        0.523951701776253,
        0.481510070072004,
        0.442872097252053,
        0.407716381753333,
        0.375747578955635,
        0.346694893962499,
        0.320310560781406,
        0.296368349697552,
        0.274662132566742,
        0.255004527269707,
        0.237225636790942,
        0.221171894703032,
        0.206705026851052,
        0.193701138501453,
        0.182049937043463,
        0.171654102534418,
        0.162428822124188,
        0.154301509995732,
        0.147211742436356,
        0.141111448794400,
        0.135965414542561,
        0.131752174165574,
        0.128465401605771,
        0.126115948177845,
        0.124734737552582,
        0.124376812487942,
        0.125126950091250,
        0.127107438722962,
        0.130488865537471,
        0.135505136135929,
        0.142474490112133,
        0.151829062472552,
        0.164156667726674,
        0.180260060743600,
        0.201241036610844,
        0.228619293545932,
        0.264498433428056,
        0.311791987022996,
        0.374516185853882,
        0.458132622503052,
        0.569861809599154,
        0.718754735938701,
        0.915076078397292,
        1.16827496694918,
        1.48281220141288,
        1.85208241237693,
        2.25313170662688,
        2.64727891051385,
        2.98987980996601,
        3.24510598383168,
        3.39631737052187,
        3.44657113752190,
        3.41190386720877,
        3.31328073479659,
        3.17092647724011,
        3.00164282690684,
        2.81819778836537,
        2.62973529837627,
        2.44251576485055,
        2.26065109545585,
        2.08671307165324,
        1.92219624869376,
        1.76785493048812,
        1.62394261260279,
        1.49037987318224,
        1.36687122559929,
        1.25298607956807,
        1.14821462264420,
        1.05200620994315,
        0.963795547369517,
        0.883020342691495,
        0.809132982407813,
        0.741608021078147,
        0.679946736471803,
        0.623679633895677,
        0.572367525154816,
        0.525601626826889,
        0.483002995087648,
        0.444221523961555,
        0.408934669461776,
        0.376846015966107,
        0.347683768047098,
        0.321199227143815,
        0.297165295345766,
        0.275375036341633,
        0.255640314990474,
        0.237790531107544,
        0.221671459305008,
        0.207144204681268,
        0.194084283565972,
        0.182380839293262,
        0.171936005113571,
        0.162664430018418,
        0.154492988752467,
        0.147360705128998,
        0.141218928720247,
        0.136031820204258,
        0.131777221786807,
        0.128448018622945,
        0.126054138612020,
        0.124625396580306,
        0.124215472426765,
        0.124907432707330,
        0.126821378245047,
        0.130125051553699,
        0.135048603544459,
        0.141905251536683,
        0.151120333105185,
        0.163272368713555,
        0.179151300731482,
        0.199841162066283,
        0.226836981976872,
        0.262208234829385,
        0.308821848768422,
        0.370632182898798,
        0.453023108523889,
        0.563127839680713,
        0.709922580849702,
        0.903661025477984,
        1.15393562866217,
        1.46561559847913,
        1.83281291964706,
        2.23343162265729,
        2.62936564352859,
        2.97584909347488,
        3.23623387561170,
        3.39280530466443,
        3.44777664164218,
        3.41677175022002,
        3.32070547699468,
        3.17995180669146,
        3.01152706322657,
        2.82840490320339,
        2.63989746467832,
        2.45239188625649,
        2.27009113558134,
        2.09563050660080,
        1.93054793536098,
        1.77562683081190,
        1.63113983874847,
        1.49701981177556,
        1.37297881691204,
        1.25859059199829,
        1.15334746140383,
        1.05669944082345,
        0.968080915440786,
        0.886928633993880,
        0.812693623466945,
        0.744848843164271,
        0.682893853589406,
        0.626357398737669,
        0.574798537845973,
        0.527806778679771,
        0.485001534792054,
        0.446031137299390,
        0.410571566242967,
        0.378325019733759,
        0.349018405419444,
        0.322401814598143,
        0.298247021910840,
        0.276346041123828,
        0.256509758766074,
        0.238566661404429,
        0.222361668494392,
        0.207755080618073,
        0.194621652261061,
        0.182849798971100,
        0.172340950796942,
        0.163009067471176,
        0.154780336175173,
        0.147593080400334,
        0.141397919149647];
    var PData = [];
    if (h == 0.1) {
        for (var i = 0; i < pTemp.length; i++) {
            PData.push({x: time[i], y: pTemp[i]});
        }
    }
    else {
        var j=0;
        for (var i = 0; i < pTemp.length; i++) {
            PData.push({x: time[j], y: pTemp[i]});
            j += (0.1/h);
        }
    }
    return PData;

}

function importVDataFromSimulink(time, h) {
    var vTemp = [2,
        1.61577143333333,
        1.27957790762270,
        1.00363216397575,
        0.786923474647552,
        0.621361391838830,
        0.496720246117426,
        0.403398516454823,
        0.333482786444404,
        0.280880436342567,
        0.241069510823394,
        0.210755796705677,
        0.187558140455530,
        0.169757500414341,
        0.156109610846235,
        0.145709745732289,
        0.137896693369217,
        0.132185033817826,
        0.128217423487332,
        0.125730892476872,
        0.124532934261190,
        0.124484453451257,
        0.125487541356754,
        0.127476674682199,
        0.130412362745803,
        0.134276563856031,
        0.139069394602920,
        0.144806796170334,
        0.151518919311645,
        0.159249057868082,
        0.168053008789759,
        0.177998770742483,
        0.189166517764342,
        0.201648801951081,
        0.215550951766440,
        0.230991641638783,
        0.248103614933351,
        0.267034546790070,
        0.287948036077428,
        0.311024717050033,
        0.336463481286750,
        0.364482799074272,
        0.395322126402612,
        0.429243378818458,
        0.466532446018155,
        0.507500710487724,
        0.552486518613400,
        0.601856531927371,
        0.656006857294222,
        0.715363814710061,
        0.780384145430990,
        0.851554384819063,
        0.929389014100091,
        1.01442684934344,
        1.10722490417593,
        1.20834864536760,
        1.31835710396271,
        1.43778064549642,
        1.56708824909932,
        1.70663976683911,
        1.85661665485835,
        2.01692186642207,
        2.18703574987810,
        2.36580981530519,
        2.55117456265619,
        2.73973311630811,
        2.92621466089640,
        3.10278370726232,
        3.25827001448504,
        3.37754502642978,
        3.44157250732079,
        3.42907146494239,
        3.32092472896145,
        3.10762255377067,
        2.79734281091071,
        2.41902522281689,
        2.01559080731388,
        1.62969708425355,
        1.29113651863968,
        1.01272811626092,
        0.793831084078082,
        0.626495728952072,
        0.500494153764549,
        0.406160304088914,
        0.335502650757891,
        0.282358652461111,
        0.242151000660437,
        0.211544254703338,
        0.188127500067308,
        0.170160525514413,
        0.156384078026581,
        0.145882803576727,
        0.137987908737051,
        0.132208515677508,
        0.128183306060546,
        0.125646374951832,
        0.124403013146401,
        0.124312440866018,
        0.125275433176259,
        0.127225412436172,
        0.130122019555354,
        0.133946475418587,
        0.138698249890229,
        0.144392698139263,
        0.151059422904192,
        0.158741190468220,
        0.167493276823291,
        0.177383155058770,
        0.188490459694631,
        0.200907181408840,
        0.214738058380445,
        0.230101139649477,
        0.247128502410541,
        0.265967109628855,
        0.286779797190287,
        0.309746381193568,
        0.335064876044484,
        0.362952812670993,
        0.393648643266027,
        0.427413214153888,
        0.464531281155217,
        0.505313031442581,
        0.550095561253734,
        0.599244238425348,
        0.653153850340179,
        0.712249398428336,
        0.776986345363100,
        0.847850044112124,
        0.925353969728708,
        1.01003622162705,
        1.10245354623303,
        1.20317181822597,
        1.31275147036948,
        1.43172571471875,
        1.56056846138964,
        1.69964748690635,
        1.84915645782155,
        2.00901665751049,
        2.17873546756863,
        2.35720371826543,
        2.54240833945054,
        2.73103211331306,
        2.91791396915455,
        3.09536374268179,
        3.25239080735669,
        3.37406120596353,
        3.44149269388763,
        3.43340754125311,
        3.33038644214303,
        3.12220059529225,
        2.81599562408378,
        2.43978237567955,
        2.03616016189312,
        1.64822157160329,
        1.30661858579353,
        1.02498394160739,
        0.803187993903275,
        0.633486064998278,
        0.505659150889937,
        0.409961766255131,
        0.338301355103355,
        0.284423347732722,
        0.243676904474093,
        0.212671498042955,
        0.188956286324213,
        0.170762570265998,
        0.156810880326770,
        0.146171498616713,
        0.138165369018110,
        0.132294216993239,
        0.128191333145702,
        0.125586830356718,
        0.124283011712753,
        0.124136815155429,
        0.125047235903245,
        0.126946275109792,
        0.129792408236934,
        0.133565872016991,
        0.138265278861808,
        0.143905212566315,
        0.150514559839147,
        0.158135402576730,
        0.166822345351956,
        0.176642187731693,
        0.187673876131163,
        0.200008687932770,
        0.213750613577365,
        0.229016911669055,
        0.245938818767619,
        0.264662400108462,
        0.285349530393800,
        0.308178995271469,
        0.333347704247846,
        0.361072004528619,
        0.391589082475030,
        0.425158434686032,
        0.462063383670305,
        0.502612602921442,
        0.547141601898987,
        0.596014101443757];

    var VData = [];
    if (h == 0.1) {
        for (var i = 0; i < vTemp.length; i++) {
            VData.push({x: time[i], y: vTemp[i]});
        }
    }
    else {
        var j=0;
        for (var i = 0; i < vTemp.length; i++) {
            VData.push({x: time[j], y: vTemp[i]});
            j += (0.1/h);
        }
    }
    return VData;
}
function saveImg() {
    alert("Saving");
    var realchart = document.getElementById("realChartDiv");
    var realchartCan = realchart.toDataURL("image/png");
    var w=window.open('about:blank','image from canvas');
    w.document.write("<img src='"+realchartCan+"' alt='from canvas'/>");
}