function generate_table(parsed_nodes, backwards) {
    var nodes = separate_sets(parsed_nodes, backwards);
    var iterations = [];
    var last_iteration = [];
    while (!compare_arrays(last_iteration, nodes)) {
        last_iteration = JSON.parse(JSON.stringify(nodes));
        iterations.push([]);
        for (var i = 0; i < nodes.length; ++i) {
            nodes = compute_node_in_out(nodes, i);
            iterations[iterations.length-1].push([nodes[i][IN_ARRAY_POS], nodes[i][OUT_ARRAY_POS]]);
        }
    }
    return iterations;
}

function separate_sets(nodes, backwards) {
    var separated_nodes = [];
    for (var i = 0; i < nodes.length; ++i) {
        var node = [];
        for (var j = 0; j < nodes[i].length; ++j) {
            if (nodes[i][j] === "") {
                node.push([]);
                continue;
            }
            node.push(nodes[i][j].split(",").map((item) => item.trim()));
        }
        node.push([], []);
        separated_nodes.push(node);
    }
    for (var node = 0; node < separated_nodes.length; ++node) {
        separated_nodes[node][SUCC_ARRAY_POS] = separated_nodes[node][SUCC_ARRAY_POS].map((succ) => (parseInt(succ)-1));
    }
    return separated_nodes;
}

function compute_node_in_out(nodes, node_id) {
    var in_array = add_arrays(nodes[node_id][USE_ARRAY_POS], subtract_arrays(nodes[node_id][OUT_ARRAY_POS], nodes[node_id][DEF_ARRAY_POS]));
    var out_array = [];
    for (var i = 0; i < nodes[node_id][SUCC_ARRAY_POS].length; ++i) {
        var succ = nodes[node_id][SUCC_ARRAY_POS][i];
        out_array = add_arrays(out_array, nodes[succ][IN_ARRAY_POS]);
    }
    nodes[node_id][IN_ARRAY_POS] = in_array;
    nodes[node_id][OUT_ARRAY_POS] = out_array;
    return nodes;
}

function subtract_arrays(array1, array2) {
    return array1.filter( function (el) {
        return !array2.includes(el);
    })
}

function add_arrays(array1, array2) {
    var ret = array1.concat(array2);
    for (var i = 0; i < ret.length; ++i) {
        for(var j=i+1; j< ret.length; ++j) {
            if(ret[i] === ret[j])
                ret.splice(j--, 1);
        }
    }
    return ret;
}

// Note: Thanks to SamyBencherif for this implementation.
// https://jsfiddle.net/SamyBencherif/8352y6yw/
function compare_arrays(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1 || !array2)
        return false;

    // compare lengths - can save a lot of time
    if (array1.length !== array2.length)
        return false;

    for (var i = 0, l=array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!compare_arrays(array1[i],array2[i]))
                return false;
        }
        else if (array1[i] !== array2[i])
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
    }
    return true;
}