const sharp = require("sharp");
const path = require('path');

function ImagePlugin(options) {
    // Setup the plugin instance with options...
}

ImagePlugin.prototype.apply = function(compiler) {
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("optimize", function() {
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Assets are being optimized-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            let tileImage = path.resolve(__dirname, '../assets/build/worldTiles.png');
            console.log("Making tilemaps from: ",tileImage);
            let tileImageOutput = path.resolve(__dirname, '../build/assets/tiles/');

            let inputImage = sharp(tileImage);
            let imageWidth = 0;
            let inputImageMetaData = inputImage.metadata().then(
                (metadata) => {
                    console.log("input image width: ",metadata.width);
                    let tileSize = 24;
                    let tileAmount = metadata.width/tileSize;
                    console.log("make ",tileAmount," tile image(s)");
                    for(var i=0;i<metadata.width/tileSize;i++){

                        console.log("OUTPUTTING TILE: ", tileImageOutput+"/worldTile_"+i+".png");
                        inputImage.extract({left:tileSize*i, top:0, width:tileSize, height:tileSize}).toFile(tileImageOutput+"/worldTile_"+i+".png");
                    }
                });
        });
    });
};

module.exports = ImagePlugin;