import { LinkedList } from "./LinkedList.mjs";

export default class Graph {
    #matrizAdyacencia = [];
    #map = new Map();

    addV(value) {
        this.#matrizAdyacencia.push(new LinkedList());
        this.#map.set(value, this.#matrizAdyacencia.length - 1);
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
            this.#matrizAdyacencia[this.#map.get(start)].push({ name: end, weight: weight });
            return true;
        }
        return false;
    }

    dfs(callback) {
        const visited = new Set();
        const dfsVisit = (vertex) => {
            if (!visited.has(vertex)) {
                visited.add(vertex);
                callback(vertex);
                const neighbors = this.#matrizAdyacencia[this.#map.get(vertex)];
                let neighborList = neighbors.recorrido();
                neighborList.forEach(neighbor => dfsVisit(neighbor.name));
            }
        };

        for (const key of this.#map.keys()) {
            if (!visited.has(key)) {
                dfsVisit(key);
            }
        }
    }

    dijkstra(start) {
        let distances = {};
        let visited = new Set();
        let previous = {};

        this.#map.forEach((value, key) => {
            distances[key] = Infinity;
            previous[key] = null;
        });
        distances[start] = 0;

        let priorityQueue = new Set([start]);

        while (priorityQueue.size > 0) {
            let minDistanceVertex = this.getMinDistanceVertex(distances, priorityQueue);
            priorityQueue.delete(minDistanceVertex);
            visited.add(minDistanceVertex);

            let neighbors = this.#matrizAdyacencia[this.#map.get(minDistanceVertex)];
            let neighborList = neighbors.recorrido();
            for (let neighbor of neighborList) {
                if (!visited.has(neighbor.name)) {
                    let newDist = distances[minDistanceVertex] + neighbor.weight;
                    if (newDist < distances[neighbor.name]) {
                        distances[neighbor.name] = newDist;
                        previous[neighbor.name] = minDistanceVertex;
                        priorityQueue.add(neighbor.name);
                    }
                }
            }
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
