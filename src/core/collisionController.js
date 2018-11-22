export class CollisionController{
    constructor(params){
        this.scene = params.scene;
    }

    setCollisionBetween(sprite_one, sprite_two, callback){
        this.scene.physics.add.overlap(sprite_one, sprite_two, callback);
    }

    setCollisionBetweenWorldSprites(sprite){
        CollisionController.registeredWorldCollisionSprites.push(sprite);
    }

    static registerAsWorldCollisionSprite(sprite, scene){
        CollisionController.worldCollisionSprites.push(sprite);
        for(let i=0;i<CollisionController.registeredWorldCollisionSprites.length;i++){
            let sprite_two = CollisionController.registeredWorldCollisionSprites[i];
            scene.physics.add.overlap(sprite, sprite_two, sprite_two.onWorldSpriteCollision);
        }
    }
}

CollisionController.worldCollisionSprites = [];
CollisionController.registeredWorldCollisionSprites = [];
