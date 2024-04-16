require([

"esri/Map",
"esri/views/MapView",
"esri/symbols/PictureMarkerSymbol",
"esri/Graphic",
"esri/layers/GraphicsLayer",
"esri/layers/GeoJSONLayer",
"esri/renderers/SimpleRenderer",
"esri/symbols/SimpleFillSymbol",
"esri/Color",
"esri/PopupTemplate",
"esri/widgets/Legend",
"esri/renderers/UniqueValueRenderer",
"esri/widgets/Expand"

], function(Map, 
    MapView, 
    PictureMarkerSymbol, 
    Graphic, 
    GraphicsLayer,
    GeoJSONLayer,
    SimpleRenderer, 
    SimpleFillSymbol, 
    Color,
    PopupTemplate,
    Legend,
    UniqueValueRenderer,
    Expand) 
    {

    
    const map = new Map({
        basemap: "osm" // basemap styles service
    });

    const view = new MapView({
        map: map,
        center: [-82.0226, 33.500], //Longitude, latitude
        zoom: 16,
        container: "viewDiv"
      });

    var geojsonUrl = "./augusta3.geojson";

    // Define unique symbols for each category
    var symbol1 = new SimpleFillSymbol({
        color: [38,75,150, 0.5],
        outline: {
            color: [0, 0, 0, 0.5],
            width: 1
        }
    });

    var symbol2 = new SimpleFillSymbol({
        color: [0,111,60, 0.5],
        outline: {
            color: [0, 0, 0, 0.5],
            width: 1
        }
    });

    var symbol3 = new SimpleFillSymbol({
        color: [249,167,62, 0.5],
        outline: {
            color: [0, 0, 0, 0.5],
            width: 1
        }
    });

    // Create unique value renderer
    var parRenderer = new UniqueValueRenderer({
        title: 'Par',
        field: "par",
        legendOptions: {
            title: "Par"
        },
        //defaultSymbol: symbol1, // Default symbol if value does not match any defined below
        uniqueValueInfos: [
            { value: 3, symbol: symbol1 }, // Assign symbol1 for value 3
            { value: 4, symbol: symbol2 }, // Assign symbol2 for value 4
            { value: 5, symbol: symbol3 }  // Assign symbol3 for value 5
        ]
    });


    var avgRenderer = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
            color: [0, 0, 0, 0.5],
            outline: {
                color: [0, 0, 0, 0.5],
                width: 1
            }
        }),
        visualVariables: [{
            legendOptions: {
                title: "Average Score"
            },
            type: "color",
            field: "average",
            stops: [
                { value: 2.9, color: new Color([51, 255, 0, 0.5]) },
                { value: 3.1, color: new Color([102, 255, 0, 0.5]) },
                { value: 3.3, color: new Color([153, 255, 0, 0.5]) },
                { value: 3.5, color: new Color([204, 255, 0, 0.5]) },
                { value: 3.7, color: new Color([255, 255, 0, 0.5]) },
                { value: 3.9, color: new Color([255, 204, 0, 0.5]) },
                { value: 4.1, color: new Color([255, 153, 0, 0.5]) },
                { value: 4.3, color: new Color([255, 102, 0, 0.5]) },
                { value: 4.5, color: new Color([255, 51, 0, 0.5]) },
                { value: 4.7, color: new Color([255, 0, 0, 0.5]) },
                { value: 4.9, color: new Color([204, 0, 0, 0.5]) },
                { value: 5.1, color: new Color([153, 0, 0, 0.5]) },
                { value: 5.3, color: new Color([102, 0, 0, 0.5]) }
            ]
        }]
    });

    var rankRenderer = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
            color: [0, 0, 0, 0.5],
            outline: {
                color: [0, 0, 0, 0.5],
                width: 1
            }
        }),
        visualVariables: [{

            type: "color",
            field: "rank",
            stops: [
                { value: 1, color: new Color([255, 0, 0, 0.5]) }, // Red for value 1
                { value: 4, color: new Color([255, 102, 0, 0.5]) },
                { value: 7, color: new Color([255, 153, 0, 0.5]) },
                { value: 11, color: new Color([255, 204, 0, 0.5]) },
                { value: 15, color: new Color([153, 255, 0, 0.5]) },
                { value: 18, color: new Color([51, 255, 0, 0.5]) } // Green for value 18
            ]
        }]
    });

    
    var diffRenderer = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
            color: [0, 0, 0, 0.5],
            outline: {
                color: [0, 0, 0, 0.5],
                width: 1
            }
        }),
        visualVariables: [{
            legendOptions: {
                title: "Difference in Score"
            },
            type: "color",
            field: "Difference",
            stops: [
                { value: .5, color: new Color([255, 0, 0, 0.5]) }, // Red for value 1
                { value: .3, color: new Color([255, 102, 0, 0.5]) },
                { value: 0, color: new Color([255, 153, 0, 0.5]) },
                { value: -.3, color: new Color([255, 204, 0, 0.5]) },
                { value: -.6, color: new Color([153, 255, 0, 0.5]) },
                { value: -.8, color: new Color([51, 255, 0, 0.5]) } // Green for value 18
            ]
        }]
    });

    var popupTemplate = new PopupTemplate({
        title: "{Number} {Name}",
        content: [{
            type: "text",
            text: "Par: {Par}"
        }, {
            type: "text",
            text: "Avg Score: {Average}"
           
        }, {
            type: "text",
            text: "Difficulty: {rank}"
        }, {
            type: "text",
            text: "Avg - Par Diffience: {Difference}"
        }]
    });


    var geojsonLayer = new GeoJSONLayer({
        url: geojsonUrl,
        renderer: parRenderer,
        popupTemplate: popupTemplate,
    });

    map.add(geojsonLayer);
    
    var legend = new Legend({
        view: view,
        layerInfos: [{
            layer: geojsonLayer,
            title: "Augusta 2024 Statistics"
            }],
        container: "legendContainer"
        });
    view.ui.add(legend, "bottom-right");
    

    let node = document.getElementById("buttonsContainer");
    node.innerHTML = `
    <button class="renderBtn" id="parButton">Par</button>
    <button class="renderBtn" id="avgButton">Avg</button>
    <button class="renderBtn" id="rankButton">Rank</button>
    <button class="renderBtn" id="diffButton">Difference</button>
    `;
    
   

    let expand = new Expand({
    expandIcon: "arrow-left",
    view: view,
    content: node
    });
    view.ui.add(expand, "top-right"); 
    
    function isMobileDevice() {
        return window.innerWidth <= 768; // Adjust the threshold as needed
    }
    
    if (isMobileDevice()) {
        expand.expanded = false;
        console.log("This is a mobile device.");
    } else {
        expand.expanded = true;
        console.log("This is not a mobile device.");
    }

    window.onload = function(){

        document.getElementById("parButton").addEventListener("click", function() {
            geojsonLayer.renderer = parRenderer;
        });
    
        document.getElementById("avgButton").addEventListener("click", function() {
            geojsonLayer.renderer = avgRenderer;
        });

        document.getElementById("rankButton").addEventListener("click", function() {
            geojsonLayer.renderer = rankRenderer;
        });
        
        document.getElementById("diffButton").addEventListener("click", function() {
            geojsonLayer.renderer = diffRenderer;
        });

    };

    view.ui.add(legend, "bottom-right");

});  