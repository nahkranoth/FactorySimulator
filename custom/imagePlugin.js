const sharp = require("sharp");
const path = require('path');
const jsonfile = require('jsonfile');

function ImagePlugin(options) {
    // Setup the plugin instance with options...
}

ImagePlugin.prototype.apply = function(compiler) {
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("optimize", function () {
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Assets are being optimized-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            let tileImage = path.resolve(__dirname, '../assets/build/worldTiles.png');
            console.log("Making tilemaps from: ", tileImage);
            let tilemapDataJSONPath = path.resolve(__dirname, '../build/assets/worldTiles.json');
            let tilemapAtlasJSONPath = path.resolve(__dirname, '../build/assets/worldTiles_atlas.json');

            let inputImage = sharp(tileImage);

            jsonfile.readFile(tilemapDataJSONPath).then(json => {
                let inputImageMetaData = inputImage.metadata().then(
                    (metadata) => {
                        console.log("input image width: ", metadata.width);
                        let tileSize = 24;
                        let tileAmount = metadata.width / tileSize;

                        //WRITE JSONFILE
                        let atlasJson = {"frames":{}};
                        for (var i = 0; i < tileAmount; i++) {
                            let tile = json.tiles[i];
                            atlasJson["frames"][tile.name] = {"frame":{"x": tileSize*i, "y": tileSize*i, "w": tileSize, "h": tileSize}};
                        }
                        jsonfile.writeFile(tilemapAtlasJSONPath, atlasJson, function (err) {
                            if (err) console.error(err)
                        })
                    });
            }).catch(err => {
                console.error(err)
            });
        });
    });
};

module.exports = ImagePlugin;