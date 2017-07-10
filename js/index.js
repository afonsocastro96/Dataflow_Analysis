const DEF_ARRAY_POS = 0;
const USE_ARRAY_POS = 1;
const PRED_ARRAY_POS = 2;
const SUCC_ARRAY_POS = 3;
const IN_ARRAY_POS = 4;
const OUT_ARRAY_POS = 5;


$(document).ready(function(){
    var nRows=1;
    $("td input").focusout(function() {
        var re = new RegExp($(this).attr("pattern"));
        if(!re.test($(this).val()))
            $(this).css('border-color', 'red');
        else
            $(this).css('border-color', '');
    });
    $("#add_row").click(function(){
        $('#addr'+nRows).html("<td>"+ (nRows+1) +"</td><td><input name='def"+nRows+"' type='text' placeholder='ex.: var1, var2, var3, var4' class='form-control input-md' pattern='^([A-Z|a-z][A-Z|a-z|0-9|_]*)( *, *[A-Z|a-z][A-Z|a-z|0-9|_]*)*$'/> </td><td><input  name='use"+nRows+"' type='text' placeholder='ex.: var1, var2, var3, var4'  class='form-control input-md' pattern='^/([A-Z|a-z][A-Z|a-z|0-9|_]*)( *, *[A-Z|a-z][A-Z|a-z|0-9|_]*)*/$'></td><td><input  name='pred"+nRows+"' type='text' placeholder='ex.: 1, 2, 3, 4'  class='form-control input-md' pattern='^/[0-9]+( *, *[0-9]+)*/$'></td><td><input  name='succ"+nRows+"' type='text' placeholder='ex.: 1, 2, 3, 4'  class='form-control input-md' pattern='^/[0-9]+( *, *[0-9]+)*/$'></td>");
        $('#input_table').append('<tr id="addr'+(nRows+1)+'"></tr>');
        nRows++;
    });
    $("#delete_row").click(function(){
        if(nRows>1){
            $("#addr"+(nRows-1)).html('');
            nRows--;
            console.log(nRows);
        }
    });
    $("#submit").click(function() {
        var table = document.getElementById("input_table");
        var nodes = [];
        for(var row = 1; row <= nRows; ++row) {
            var line = [];
            for (var j = 1; j < table.rows[row].cells.length; ++j)
                line.push(table.rows[row].cells[j].getElementsByTagName("input")[0].value);
            nodes.push(line)
        }
        var iterations = generate_table(nodes);

        var output_table = $('#output_table');
        output_table.html('');
        output_table.append('<thead><tr><th colspan="3"></th></tr></thead><tbody><tr></tr></tbody>');
        var first_row = output_table.find('thead').find('tr');
        var table_body = output_table.find('tbody');
        var second_row = table_body.find('tr');
        second_row.append('<td>Node</td>');
        second_row.append('<td>use</td>');
        second_row.append('<td>def</td>');

        for(let i = 0; i < nodes.length; ++i) {
            table_body.append("<tr> <td>" + (i+1) + "</td><td>" + nodes[i][USE_ARRAY_POS] +
                "</td><td>" + nodes[i][DEF_ARRAY_POS] + "</td> </tr>");
        }

        for(let i = 0; i < iterations.length; ++i) {
            first_row.append("<th colspan='2'>Iteration " + (i+1) + "</th>");
            second_row.append("<td>in</td>");
            second_row.append("<td>out</td>");
            for (let j = 0; j < nodes.length; ++j) {
                table_body.find('tr').eq(j+1).append("<td>" + iterations[i][j][0] + "</td>");
                table_body.find('tr').eq(j+1).append("<td>" + iterations[i][j][1] + "</td>");
            }
        }
        $('#output').show();
        generate_interference_graph(iterations[iterations.length-1]);
    })

});