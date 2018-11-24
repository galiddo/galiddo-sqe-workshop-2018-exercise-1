import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });
    it('def and dec', () => {
        assert.equal(
            JSON.stringify(parseCode('function m (r) {let x,y = 0;z=2;}')),
            '[{"Line":1,"Type":"function declaration","Name":"m","Condition":"","Value":""},'+
            '{"Line":1,"Type":"Variable Declaration","Name":"r","Condition":"","Value":""},'+
            '{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":""},'+
            '{"Line":1,"Type":"variable declaration","Name":"y","Condition":"","Value":"0"},'+
            '{"Line":1,"Type":"Assignment Expression","Name":"z","Condition":"","Value":"2"}]');
    });
    it('if else for while', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x){while(1){}}else if (!x){for(let x=1;x<2;x++){}}')),
            '[{"Line":1,"Type":"If Statement","Name":"","Condition":"x","Value":""},'+
            '{"Line":1,"Type":"While Statement","Name":"","Condition":"1","Value":""},'+
            '{"Line":1,"Type":"Else If Statement","Name":"","Condition":"!x","Value":""},'+
            '{"Line":1,"Type":"For Statement","Name":"","Condition":"x < 2","Value":""},'+
            '{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":"1"},'+
            '{"Line":1,"Type":"Assigmant Expression","Name":"x","Condition":"","Value":"x+1"}]');
    });
    it('fun ret', () => {
        assert.equal(
            JSON.stringify(parseCode('function id (x) {return x;} let r = id(4);')),
            '[{"Line":1,"Type":"function declaration","Name":"id","Condition":"","Value":""},'+
            '{"Line":1,"Type":"Variable Declaration","Name":"x","Condition":"","Value":""},'+
            '{"Line":1,"Type":"Return Statement","Name":"","Condition":"","Value":"x"},'+
            '{"Line":1,"Type":"variable declaration","Name":"r","Condition":"","Value":"id(4)"}]'
        );
    });

    it('simple if', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x){}')),
            '[{"Line":1,"Type":"If Statement","Name":"","Condition":"x","Value":""}]'
        );
    });

    it('adv if', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x){}else if(y){} else if(z){} else{}')),
            '[{"Line":1,"Type":"If Statement","Name":"","Condition":"x","Value":""},'+
            '{"Line":1,"Type":"Else If Statement","Name":"","Condition":"y","Value":""},'+
            '{"Line":1,"Type":"Else If Statement","Name":"","Condition":"z","Value":""}]'
        );
    });
    it('seq', () => {
        assert.equal(
            JSON.stringify(parseCode('x+=4, y+=1;')),
            '[{"Line":1,"Type":"Assignment Expression","Name":"x","Condition":"","Value":"4"},'+
            '{"Line":1,"Type":"Assignment Expression","Name":"y","Condition":"","Value":"1"}]'
        );
    });

    it('if let else while', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x>2){ let y=1;} else{ while(1) y++;}')),
            '[{"Line":1,"Type":"Assignment Expression","Name":"x","Condition":"","Value":"4"},'+
            '{"Line":1,"Type":"Assignment Expression","Name":"y","Condition":"","Value":"1"}]'
        );
    });

});
