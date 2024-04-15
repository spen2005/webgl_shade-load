function handle_loaded_obj(Data,i){
    VertexPositionBuffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Data.vertexPositions), gl.STATIC_DRAW);
    VertexPositionBuffer[i].itemSize = 3;
    VertexPositionBuffer[i].numItems = Data.vertexPositions.length / 3;

    VertexNormalBuffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexNormalBuffer[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Data.vertexNormals), gl.STATIC_DRAW);
    VertexNormalBuffer[i].itemSize = 3;
    VertexNormalBuffer[i].numItems = Data.vertexNormals.length / 3;

    VertexFrontColorBuffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexFrontColorBuffer[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Data.vertexFrontcolors), gl.STATIC_DRAW);
    VertexFrontColorBuffer[i].itemSize = 3;
    VertexFrontColorBuffer[i].numItems = Data.vertexFrontcolors.length / 3;

}

function parse_obj(responseText, color) {
    var lines = responseText.split("\n");
    var positions = [];
    var normals = [];
    var colors = [];
    var vertexIndices = [];
    var normalIndices = [];
    var ct = 0;
    lines.forEach(function (line) {
        var parts = line.trim().split(/\s+/);
        if (parts[0] === "v") {
            positions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        } else if (parts[0] === "vn") {
            normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        } else if (parts[0] === "f") {
            //2 triangles 0 1 2 0 2 3
            parts.shift(); // Remove "f"
            var vertexIndex = [];
            var normalIndex = [];

            //2 triangles 0 1 2 0 2 3
            parts.forEach(function (part) {
                var indices = part.split("/");
                vertexIndex.push(parseInt(indices[0]) - 1);
                normalIndex.push(parseInt(indices[2]) - 1);
            }
            );
            //alert("vertexIndex: " + vertexIndex[0] + " " + vertexIndex[1] + " " + vertexIndex[2] + " " + vertexIndex[3]);
            vertexIndices.push(positions[vertexIndex[0] * 3], positions[vertexIndex[0] * 3 + 1], positions[vertexIndex[0] * 3 + 2]);
            vertexIndices.push(positions[vertexIndex[1] * 3], positions[vertexIndex[1] * 3 + 1], positions[vertexIndex[1] * 3 + 2]);
            vertexIndices.push(positions[vertexIndex[2] * 3], positions[vertexIndex[2] * 3 + 1], positions[vertexIndex[2] * 3 + 2]);

            normalIndices.push(normals[normalIndex[0] * 3], normals[normalIndex[0] * 3 + 1], normals[normalIndex[0] * 3 + 2]);
            normalIndices.push(normals[normalIndex[1] * 3], normals[normalIndex[1] * 3 + 1], normals[normalIndex[1] * 3 + 2]);
            normalIndices.push(normals[normalIndex[2] * 3], normals[normalIndex[2] * 3 + 1], normals[normalIndex[2] * 3 + 2]);

            ct++;

            if (vertexIndex.length > 3) {
                //alert("extra");
                vertexIndices.push(positions[vertexIndex[0] * 3], positions[vertexIndex[0] * 3 + 1], positions[vertexIndex[0] * 3 + 2]);
                vertexIndices.push(positions[vertexIndex[2] * 3], positions[vertexIndex[2] * 3 + 1], positions[vertexIndex[2] * 3 + 2]);
                vertexIndices.push(positions[vertexIndex[3] * 3], positions[vertexIndex[3] * 3 + 1], positions[vertexIndex[3] * 3 + 2]);

                normalIndices.push(normals[normalIndex[0] * 3], normals[normalIndex[0] * 3 + 1], normals[normalIndex[0] * 3 + 2]);
                normalIndices.push(normals[normalIndex[2] * 3], normals[normalIndex[2] * 3 + 1], normals[normalIndex[2] * 3 + 2]);
                normalIndices.push(normals[normalIndex[3] * 3], normals[normalIndex[3] * 3 + 1], normals[normalIndex[3] * 3 + 2]);

                ct++;
            }
        }        
    });

    //alert("ct: " + ct);
    for (var i = 0; i < 9*ct; i += 3) {
        colors.push(color[0], color[1], color[2]);
    }
    //alert("colorsize: " + colors.length + " vertexIndices: " + vertexIndices.length + " normalIndices: " + normalIndices.length);

    var Data = {
        vertexPositions: new Float32Array(vertexIndices),
        vertexNormals: new Float32Array(normalIndices),
        vertexFrontcolors: new Float32Array(colors)
    };

    return Data;
}


function load_obj(filename, i, obj_type) {
    var request = new XMLHttpRequest();
    request.open("GET", "./model/" + filename);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if(obj_type == 0 )handle_loaded_obj(JSON.parse(request.responseText), i);
            else if(obj_type == 1){
                handle_loaded_obj(parse_obj(request.responseText,[objects[i].color[0],objects[i].color[1],objects[i].color[2]]), i);
                
            }
        }
    }
    request.send();
    num_obj++;
}