
        // Definição do grafo
        var nodes = new vis.DataSet([
    { id: 1, label: 'Taquarana' },
    { id: 2, label: 'Girau do Ponciano' },
    { id: 3, label: 'Lagoa da Canoa' },
    { id: 4, label: 'Arapiraca' },
    { id: 5, label: 'Maceió' },
    { id: 7, label: 'Palmeira dos Índios' },
    { id: 8, label: 'Coruripe' },
    { id: 9, label: 'São Miguel dos Campos' },
    { id: 10, label: 'Limoeiro de Anadia'},
    { id: 11, label: 'Campo Alegre'},
    { id: 12, label: 'Barra de São Miguel'}
]);


var edges = new vis.DataSet([
    { from: 2, to: 3, label: '15 km' },
    { from: 4, to: 1, label: '24 km'},
    { from: 10, to: 4, label: '21 km'},
    { from: 1, to: 10, label: '16 km'},
    { from: 11, to: 10, label: '20 km'},
    { from: 11, to: 9, label: '33 km'},
    { from: 3, to: 4, label: '12 km' },
    { from: 5, to: 12, label: '27 km'},
    {from: 12, to: 9, label: '29 km'},
    { from: 1, to: 7, label: '31 km'}, 
    { from: 8, to: 9, label: '72 km' },
    { from: 9, to: 10, label: '93 km' },
    { from: 8, to: 5, label: '87 km'}

]);


// Criação do grafo
var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    physics: {
                enabled: false,
              },
    nodes: {
    shape: "dot",
    size: 30,
    font: {
      size: 12,
      color: "#000",
    },
    borderWidth: 2,
  },
  edges: {
    width: 3,
  },
};
var network = new vis.Network(container, data, options);

// Algoritmo de Dijkstra
function dijkstra(graph, start, end) {
    var distances = {};
    var previous = {};
    var pq = new PriorityQueue();

    nodes.forEach(function (node) {
        distances[node.id] = Infinity;
    });

    distances[start] = 0;
    pq.enqueue(0, start);

    while (!pq.isEmpty()) {
        var current = pq.dequeue();

        if (current === end) {
            var path = [];
            while (previous[current]) {
                path.push(current);
                current = previous[current];
            }
            path.push(start);
            return path.reverse();
        }

        var neighbors = network.getConnectedNodes(current);
        neighbors.forEach(function (neighbor) {
            var distance = distances[current] + parseInt(edges.get({
                filter: function (item) {
                    return (item.from === current && item.to === neighbor) || (item.to === current && item.from === neighbor);
                }
            })[0].label);

            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previous[neighbor] = current;
                pq.enqueue(distance, neighbor);
            }
        });
    }

    return null;
}

// Implementação da fila de prioridade
function PriorityQueue() {
    this._nodes = [];

    this.enqueue = function (priority, key) {
        this._nodes.push({ key: key, priority: priority });
        this.sort();
    };

    this.dequeue = function () {
        return this._nodes.shift().key;
    };

    this.sort = function () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };

    this.isEmpty = function () {
        return !this._nodes.length;
    };
}

// Função para encontrar o menor caminho
function findShortestPath() {
    var cityNamesToIds = {
        'Taquarana': 1,
        'Girau do Ponciano': 2,
        'Lagoa da Canoa': 3,
        'Arapiraca': 4,
        'Maceió': 5,
        'Penedo': 6,
        'Palmeira dos Índios': 7,
        'Coruripe': 8,
        'São Miguel dos Campos': 9,
        'Limoeiro de Anadia': 10, 
        'Campo Alegre': 11,
        'Barra de São Miguel': 12
    };

    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;

    var startId = cityNamesToIds[start];
    var endId = cityNamesToIds[end];
    console.log(startId);
    console.log(endId);
    var shortestPath = dijkstra(edges, startId, endId);
    console.log(shortestPath);

    if (shortestPath === null) {
        alert('Não existe um caminho entre as cidades de partida e chegada.');
    } else {
        var shortestPathLabels = shortestPath.map(function(id) {
            var matchingNode = nodes.get(id);
            return matchingNode.label;
        });

        alert('O menor caminho é: ' + shortestPathLabels.join(' -> '));
    }
}


