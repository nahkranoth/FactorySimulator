export class StepCounter{
    constructor(params){
        this.step = params.step;
        this.callback = _.bind(params.callback, params.scope);
        this.count = 0;
    }

    tick(){
        this.count++;
        if(this.count !== this.step) return;

        this.callback();
        this.count = 0;
    }
}