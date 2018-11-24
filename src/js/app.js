import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        CreateTable(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});
const CreateTable = (list) => {
    let Titles = [
        ['Line', 'Type', 'Name', 'Condition', 'Value']
    ];
    let idx = 1;
    list.forEach(function (map) {
        Titles[idx] = [map['Line'], map['Type'], map['Name'], map['Condition'], map['Value']];
        idx++;
    });

    let res = '<table border=1>';
    for (let i = 0; i < Titles.length; i++) {
        res+='<tr>';
        for (let j = 0; j < Titles[i].length; j++) {
            res += '<td>'+Titles[i][j]+'</td>';
        }
        res+='</tr>';
    }
    res+='</table>';
    document.getElementById('e').innerHTML = res;};
