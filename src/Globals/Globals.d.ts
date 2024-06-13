export {};

declare global {
    type ObjectX = { [key: string ]: any }

    class AnyObject implements ObjectX{
        [key:string]: any;

        constructor (initObj: ObjectX){
            Object.assign(this, initObj);
        }
        [Symbol.iterator](){
            const entries = Object.entries(this)
            let index = 0;
    
            return {
            next: () => {
                if (index < entries.length) {
                const result = { value: entries[index], done: false };
                index++;
                return result;
                } else {
                return { value: null, done: true };
                }
            }
            };
        }
    }

    
}

var a = {
    name: 'string',
    hello: 'text',
    [Symbol.iterator]: () => {
        let props = Object.keys(this)
    }
}