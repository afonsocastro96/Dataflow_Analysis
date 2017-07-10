function print_graph(variables, connections) {
    const nodes_array = variables.map(function(variable){
        return {id: variable, label: variable};
    });

    console.log(nodes_array);
    console.log(connections);

    // create an array with nodes
    const nodes = new vis.DataSet(nodes_array);

    // create an array with edges
    const edges = new vis.DataSet(connections);

    // create a network
    var container = document.getElementById('graph');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
}

function generate_interference_graph(last_iteration) {
    let variables = [];
    let connections = [];
    for (let i = 0; i < last_iteration.length; ++i) {
        let out_vars = last_iteration[1];
        for (let j = 0; j < out_vars.length; ++j)
            if (variables.indexOf(out_vars[j]) < 0)
                variables.push(out_vars[j]);

        for (let j = 0; j < out_vars.length; ++j) {
            for (let k = j + 1; k < out_vars.length; ++k) {
                let connection = {from: out_vars[j], to: out_vars[k]};
                if (!is_array_in_array(connection, connections))
                    connections.push(connection);
            }
        }
    }

    print_graph(variables, connections);
}

function is_array_in_array(inner_array, outer_array) {
    if (!inner_array || !outer_array)
        return false;
    for(let i = 0; i < outer_array.length; ++i)
        if(compare_arrays(outer_array[i], inner_array))
            return true;
    return false;
}