export default class Graph {
    constructor() {
        this.vertices = new Map();
        this.edges = new Map();
    }

    addV(port) {
        this.vertices.set(port.codeport, port);
        this.edges.set(port.codeport, []);
    }

    addConexion(v1, v2, weight) {
        this.edges.get(v1).push({ node: v2, weight: weight });
        this.edges.get(v2).push({ node: v1, weight: weight });
    }

    dfs(callback) {
        const visited = new Set();
        const dfsVisit = (vertex) => {
            if (!visited.has(vertex)) {
                visited.add(vertex);
                callback(vertex);
                const neighbors = this.edges.get(vertex);
                neighbors.forEach(neighbor => dfsVisit(neighbor.node));
            }
        };

        for (const key of this.vertices.keys()) {
            if (!visited.has(key)) {
                dfsVisit(key);
            }
        }
    }

    dijkstra(start) {
        let distances = {};
        let visited = new Set();
        let previous = {};

        this.vertices.forEach((value, key) => {
            distances[key] = Infinity;
            previous[key] = null;
        });
        distances[start] = 0;

        let priorityQueue = new Set([start]);

        while (priorityQueue.size > 0) {
            let minDistanceVertex = this.getMinDistanceVertex(distances, priorityQueue);
            priorityQueue.delete(minDistanceVertex);
            visited.add(minDistanceVertex);

            let neighbors = this.edges.get(minDistanceVertex);
            neighbors.forEach(neighbor => {
                if (!visited.has(neighbor.node)) {
                    let newDist = distances[minDistanceVertex] + neighbor.weight;
                    if (newDist < distances[neighbor.node]) {
                        distances[neighbor.node] = newDist;
                        previous[neighbor.node] = minDistanceVertex;
                        priorityQueue.add(neighbor.node);
                    }
                }
            });
        }

        return { distances, previous };
    }

    getMinDistanceVertex(distances, priorityQueue) {
        let minDistance = Infinity;
        let minVertex = null;

        for (let vertex of priorityQueue) {
            if (distances[vertex] < minDistance) {
                minDistance = distances[vertex];
                minVertex = vertex;
            }
        }

        return minVertex;
    }
}
