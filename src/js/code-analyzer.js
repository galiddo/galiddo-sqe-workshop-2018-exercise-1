import * as esprima from 'esprima';
import * as escodegen from 'escodegen';


const parseCode = (codeToParse) => {
    return runExtractor(esprima.parseScript(codeToParse,{loc:true}));
};

const Pars = (toParse) => {return (toParse!=null)?escodegen.generate(toParse):'';};



const getExtractor = (parsedCode) =>
{    let map = [];
    let func;
    map['Program'] = exProgram;
    map['FunctionDeclaration'] = exFunDec;
    map['BlockStatement'] = exProgram;
    //map['Identifier'] = function (body) {return createObject(body.loc.start.line,'Identifier',parsedCode.name,'','');};
    map['ForStatement'] = exFor;
    map['ExpressionStatement'] = function (body) {return runExtractor(body.expression);};
    map['SequenceExpression'] = exSeq;
    map['AssignmentExpression'] = exAss;
    map['ReturnStatement'] = exRet;
    map['WhileStatement'] = exWhile;
    map['IfStatement'] = exIf;
    map['VariableDeclarator'] = exTor;//
    map['VariableDeclaration'] = exTion;
    map['UpdateExpression'] = exUp;
    func = map[parsedCode];
    return func;
};

const runExtractor = (parsedcode) =>{
    return getExtractor(parsedcode.type)(parsedcode);
};
const exProgram = (parsedcode) => {
    let data = [];
    parsedcode.body.forEach(function (body) {
        data = data.concat(runExtractor(body));
    });
    return data;
};

const createObject= (line, type, name, cond, val) => {
    return  {
        'Line': line,
        'Type': type,
        'Name': name,
        'Condition': cond,
        'Value': val
    };
};
const exTor = (body) => {

    return createObject(body.loc.start.line,  'variable declaration',  body.id.name, '', Pars(body.init));
};
const exTion = (declaration) => {
    let Data = [];
    declaration.declarations.forEach(function (body) {
        Data.push(exTor(body));
    });
    return Data;
};


const exFunDec = (parsedcode) => {
    //function decl
    let Data=[];
    let readyObj = createObject(parsedcode.loc.start.line,'function declaration', parsedcode.id.name,'','');
    Data.push(readyObj);
    //params
    parsedcode.params.forEach(function (params) {
        let obj1 = createObject(params.loc.start.line,'Variable Declaration',params.name,'','');
        Data.push(obj1);
    });
    //body
    Data = Data.concat(runExtractor(parsedcode.body));
    return Data;

};


const exFor = (parsedcode) => {
    let Data = [];
    let obj = createObject(parsedcode.loc.start.line,'For Statement', '',Pars(parsedcode.test),'');
    Data.push(obj);
    Data = Data.concat(runExtractor(parsedcode.init));
    Data = Data.concat(runExtractor(parsedcode.update));
    Data = Data.concat(runExtractor(parsedcode.body));
    return Data;
};

const exSeq = (parsedcode) => {
    let Data = [];
    parsedcode.expressions.forEach(function (exp) {
        Data = Data.concat(runExtractor(exp));

    });
    return Data;
};

const exAss = (parsedcode) => {
    return [createObject(parsedcode.loc.start.line, 'Assignment Expression',parsedcode.left.name,'',Pars(parsedcode.right))];
};

const exRet = (parsedcode) => {
    return [createObject(parsedcode.loc.start.line, 'Return Statement','','',Pars(parsedcode.argument))];
};
const exWhile = (parsedcode) => {
    let Data = [];
    let obj = createObject(parsedcode.loc.start.line,'While Statement', '', Pars(parsedcode.test), '');
    Data.push(obj);
    Data = Data.concat(runExtractor(parsedcode.body));
    return Data;
};
const exIf = (parsedcode) => {
    let Data = [];
    let obj = createObject(parsedcode.loc.start.line, 'If Statement', '', Pars(parsedcode.test), '');
    Data.push(obj);
    Data = Data.concat(runExtractor(parsedcode.consequent));

    if(parsedcode.alternate == null) return Data;
    else
        Data = Data.concat(exElse(parsedcode.alternate));

    return Data;
};
const exElse = (parsedcode) => {
    let Data = [];
    let obj = createObject(parsedcode.loc.start.line, 'Else If Statement', '', Pars(parsedcode.test), '');
    Data.push(obj);
    Data = Data.concat(runExtractor(parsedcode.consequent));

    if(parsedcode.alternate == null) return Data;
    else if (parsedcode.alternate.type === 'IfStatement')
        Data = Data.concat(exElse(parsedcode.alternate));
    else Data = Data.concat(runExtractor(parsedcode.alternate));

    return Data;
};





const exUp = (parsedcode) => {
    return createObject(parsedcode.loc.start.line, 'Assigmant Expression', parsedcode.argument.name,'',parsedcode.argument.name + parsedcode.operator.substring(1) + '1');
};
export {parseCode};








