const sharp = require("sharp");
const path = require('path');
const jsonfile = require('jsonfile');

function ImagePlugin(options) {
    // Setup the plugin instance with options...
}


ImagePlugin.prototype.apply = function(compiler) {
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("optimize", function () {

            // let tileTemplateImage = path.resolve(__dirname, '../assets/build/tilesetTemplate.png');
            // let outPath = path.resolve(__dirname, '../build/assets');

            // let templateImage = sharp(tileTemplateImage);
            // templateImage.metadata().then((metadata) => {
            //     return templateImage.png().toBuffer();
            // }).then((data)=>{
            //     let fill = sharp(data).clone().extract({ left: 0, top: 0, width: 12, height: 12 });
            //     let edge = sharp(data).clone().extract({ left: 0, top: 12, width: 12, height: 12 });
            //     let outer = sharp(data).clone().extract({ left: 12, top: 0, width: 12, height: 12 });
            //     let inner = sharp(data).clone().extract({ left: 12, top: 12, width: 12, height: 12 });
            //
            //     const width = 24;
            //     const height = 24;
            //     const channels = 4;
            //     const rgbaPixel = 0x00000000;
            //     const canvas = Buffer.alloc(width * height * channels, rgbaPixel);
            //
            //     let out = sharp(canvas,{ raw : { width, height, channels } }).png();
            //
            //     let outArr = {};
            //
            //     fill.png().toBuffer().then((fillBfr) => {
            //         outArr["fill"] = fillBfr;
            //         return fillBfr;
            //     })
            //         .then(edge.png().toBuffer().then(edgeBfr => { outArr["edge"] = edgeBfr; return edgeBfr } ) )
            //         .then(outer.png().toBuffer().then(outerBfr => { outArr["outer"] = outerBfr; return outerBfr } ) )
            //         .then(inner.png().toBuffer().then(innerBfr => { outArr["inner"] = innerBfr; return innerBfr } ) )
            //         .then((img) => {
            //             return out.overlayWith(outArr["fill"], {gravity: sharp.gravity.northwest}).toBuffer().then((data)=>{
            //                 return sharp(data);
            //             });
            //         }).then((img) => {
            //             return img.overlayWith(outArr["edge"], {gravity: sharp.gravity.northeast}).toBuffer().then((data)=>{
            //                 return sharp(data);
            //             })
            //         }).then((img) => {
            //             return img.overlayWith(outArr["outer"], {gravity: sharp.gravity.southeast}).toBuffer().then((data)=>{
            //                 return sharp(data);
            //             })
            //         }).then((img) => {
            //             return img.overlayWith(outArr["inner"], {gravity: sharp.gravity.southwest}).toBuffer().then((data)=>{
            //                 return sharp(data);
            //             })
            //         })
            //         .then((img) =>{
            //             img.toFile(outPath+"/test1.png").catch((err)=>{console.log(err)});
            //         });
            // }).catch(err => {
            //     console.log(err);
            // });


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
                        for (var i = 0; i < json.tiles.length; i++) {
                            let tile = json.tiles[i];
                            console.log(tile);
                            atlasJson["frames"][tile.name] = {"frame":{"x": tileSize*i, "y": 0, "w": tileSize, "h": tileSize}};
                        }

                        jsonfile.writeFile(tilemapAtlasJSONPath, atlasJson, function (err) {
                            if (err) console.error(err)
                        })
                    });
            }).catch(err => {
                console.error(err)
            });
        }, this);
    }, this);
};



module.exports = ImagePlugin;